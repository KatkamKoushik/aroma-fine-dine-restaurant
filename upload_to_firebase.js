require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, writeBatch } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadToFirebase() {
  const menuFilePath = path.join(__dirname, 'src/data/menu.ts');
  const menuFileContent = fs.readFileSync(menuFilePath, 'utf8');

  const match = menuFileContent.match(/export const menuItems: MenuItem\[\] = (\[[\s\S]*\]);/);
  if (!match) {
    console.error("Could not parse menuItems from menu.ts");
    return;
  }
  let menuItems = eval(match[1]);

  console.log(`Starting upload of ${menuItems.length} items to Firebase Firestore...`);
  
  try {
    // We can use a batch to write multiple documents at once (limit is 500 per batch)
    const batch = writeBatch(db);
    
    for (let i = 0; i < menuItems.length; i++) {
      const item = menuItems[i];
      // Use the item id as the document ID
      const docRef = doc(db, 'menuItems', item.id);
      
      const firebaseItem = {
        name: item.name,
        description: item.description || '',
        prices: item.prices || null,
        category: item.category || '',
        image_url: item.image || '',
      };
      
      batch.set(docRef, firebaseItem);
    }
    
    await batch.commit();
    console.log(`Successfully uploaded ${menuItems.length} items to Firebase Firestore collection 'menuItems'.`);
  } catch (err) {
    console.error("Error uploading to Firebase. Your Firestore rules might be blocking unauthenticated writes.", err.message);
  }
  
  process.exit(0);
}

uploadToFirebase();
