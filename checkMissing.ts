import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { menuItems } from './src/data/menu';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkMissing() {
  const missing = [];
  
  for (const item of menuItems) {
    if (item.image) {
      // Remove leading slash to join correctly, or path.join handles it if it's not absolute.
      // Actually path.join(__dirname, 'public', item.image) works.
      const localImagePath = path.join(__dirname, 'public', item.image);
      try {
        await fs.access(localImagePath);
      } catch {
        missing.push({ name: item.name, image: item.image });
      }
    }
  }
  
  if (missing.length > 0) {
    console.log("Missing images:");
    missing.forEach(m => console.log(`- ${m.name} (${m.image})`));
  } else {
    console.log("No missing images found.");
  }
}

checkMissing().catch(console.error);
