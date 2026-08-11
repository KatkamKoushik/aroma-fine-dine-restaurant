import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
  authDomain: "aroma-acf9b.firebaseapp.com",
  projectId: "aroma-acf9b",
  storageBucket: "aroma-acf9b.firebasestorage.app",
  messagingSenderId: "1062740129132",
  appId: "1:1062740129132:web:3a81910ea05b855bbe2f49",
  measurementId: "G-1KMS4ZWY64"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrate() {
  try {
    const menuContent = fs.readFileSync(path.join(__dirname, "src/data/menu.ts"), "utf-8");
    const jsonStr = menuContent
      .replace(/export const menuItems: MenuItem\[\] = /, "global.menuItems = ")
      .replace(/export interface[\s\S]*?}\n\n/g, "")
      .replace(/import .*?\n/g, "");
    
    eval(jsonStr);
    const items = global.menuItems;

    const dishesCol = collection(db, "dishes");
    
    // First delete all existing docs to avoid duplicates
    const snapshot = await getDocs(dishesCol);
    let deletedCount = 0;
    for (const document of snapshot.docs) {
      await deleteDoc(doc(db, "dishes", document.id));
      deletedCount++;
    }
    console.log(`Deleted ${deletedCount} old documents.`);

    let count = 0;
    for (const item of items) {
      await addDoc(dishesCol, {
        name: item.name,
        description: item.description || "",
        prices: item.prices || { Regular: 0 },
        category: item.category,
        image_url: item.image || "",
        is_popular: item.isPopular || false,
        is_veg: item.isVeg || false,
      });
      count++;
    }
    console.log(`Successfully migrated ${count} dishes to Firestore with correct prices object.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
