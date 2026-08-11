import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';
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
  const q = query(collection(db, 'menuItems'), limit(5));
  const docs = await getDocs(q);
  docs.forEach(d => console.log(d.id, d.data().image_url || d.data().image));
}

run().catch(console.error);
