import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function extractEnv() {
  const envContent = await fs.readFile(path.join(__dirname, '.env.local'), 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      env[match[1].trim()] = match[2].trim();
    }
  });
  return env;
}

// Need to dynamically import menu to get data, or just parse it.
// Parsing is safer to avoid TS/alias issues in vanilla Node.
async function parseMenuItems() {
  const menuContent = await fs.readFile(path.join(__dirname, 'src/data/menu.ts'), 'utf8');
  
  // A bit hacky, but works for standard arrays of objects:
  const jsonStr = menuContent
    .substring(menuContent.indexOf('['), menuContent.lastIndexOf(']') + 1)
    // Basic fix for unquoted keys (id:, name:, category:, prices:, image:)
    .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
    // Remove trailing commas
    .replace(/,(?=\s*[}\]])/g, '');

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse menu items from menu.ts", e);
    process.exit(1);
  }
}

async function uploadToCloudinary(filePath, cloudName, apiKey, apiSecret) {
  const fileName = path.basename(filePath, path.extname(filePath));
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  
  const timestamp = Math.floor(Date.now() / 1000);
  
  // We need SHA-1 for Cloudinary signature if not using preset.
  // Wait, let's just use the Unauthenticated upload if the user has an upload preset!
  // The user provided NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=gp3kqnvs
  const env = await extractEnv();
  const preset = env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'gp3kqnvs';
  
  const formData = new FormData();
  
  const fileData = await fs.readFile(filePath);
  const blob = new Blob([fileData]);
  formData.append('file', blob, path.basename(filePath));
  formData.append('upload_preset', preset);
  formData.append('public_id', fileName);
  formData.append('folder', 'dishes'); // Optional

  const res = await fetch(url, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${text}`);
  }

  const data = await res.json();
  return data.secure_url;
}

async function main() {
  console.log("Loading env...");
  const env = await extractEnv();

  console.log("Parsing menu items...");
  const menuItems = await parseMenuItems();

  const firebaseConfig = {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  for (const item of menuItems) {
    console.log(`Processing: ${item.name}`);
    
    // Find local image path
    // item.image looks like "/dishes/three_person_mandi.png"
    const localImagePath = path.join(__dirname, 'public', item.image);
    
    try {
      const secureUrl = await uploadToCloudinary(
        localImagePath, 
        env.CLOUDINARY_CLOUD_NAME || env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        env.CLOUDINARY_API_KEY,
        env.CLOUDINARY_API_SECRET
      );
      
      console.log(` - Uploaded to Cloudinary: ${secureUrl}`);
      
      item.image = secureUrl; // Update image URL to cloudinary URL
      
      // Save to Firebase
      const docRef = doc(db, "menuItems", item.id);
      await setDoc(docRef, item);
      console.log(` - Saved to Firestore menuItems/${item.id}`);
      
    } catch (e) {
      console.error(` - Error processing ${item.name}:`, e.message);
    }
  }
  
  console.log("Migration complete!");
}

main().catch(console.error);
