import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import * as fs from 'fs/promises';

async function run() {
  const env = await fs.readFile('.env.local', 'utf8');
  const envMap = Object.fromEntries(env.split('\n').filter(Boolean).map(l => l.split('=').map(s=>s.trim())));
  
  const app = initializeApp({
    apiKey: envMap.NEXT_PUBLIC_FIREBASE_API_KEY,
    projectId: envMap.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: envMap.NEXT_PUBLIC_FIREBASE_APP_ID
  });
  
  const db = getFirestore(app);
  const q = collection(db, 'menuItems');
  const docs = await getDocs(q);
  
  let count = 0;
  for (const d of docs.docs) {
    const data = d.data();
    if (data.image && !data.image_url) {
      await updateDoc(doc(db, 'menuItems', d.id), {
        image_url: data.image
      });
      console.log(`Updated ${d.id}`);
      count++;
    }
  }
  console.log(`Migrated ${count} documents.`);
}

run().catch(console.error);
