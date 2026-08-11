require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'a4nrapma',
  api_key: process.env.CLOUDINARY_API_KEY || '758312182918587',
  api_secret: process.env.CLOUDINARY_API_SECRET || '0gGT8aep84WtiU1QKzYg0XzQu4g',
});

async function uploadImages() {
  const menuFilePath = path.join(__dirname, 'src/data/menu.ts');
  const menuFileContent = fs.readFileSync(menuFilePath, 'utf8');

  const match = menuFileContent.match(/export const menuItems: MenuItem\[\] = (\[[\s\S]*\]);/);
  if (!match) {
    console.error("Could not parse menuItems from menu.ts");
    return;
  }
  let menuItems = eval(match[1]);

  console.log(`Starting upload of ${menuItems.length} items to Cloudinary...`);
  
  let successCount = 0;
  
  for (let i = 0; i < menuItems.length; i++) {
    const item = menuItems[i];
    const imagePath = item.image;
    
    // If it's already a URL, skip
    if (imagePath.startsWith('http')) {
      console.log(`[${i+1}/${menuItems.length}] ${item.name} already has a URL, skipping.`);
      continue;
    }
    
    const localFilePath = path.join(__dirname, 'public', imagePath);
    if (!fs.existsSync(localFilePath)) {
      console.warn(`[${i+1}/${menuItems.length}] WARNING: Local file not found for ${item.name}: ${localFilePath}`);
      continue;
    }
    
    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(localFilePath, {
        folder: 'aroma_dishes',
        use_filename: true,
        unique_filename: false,
        overwrite: true
      });
      
      menuItems[i].image = result.secure_url;
      successCount++;
      console.log(`[${i+1}/${menuItems.length}] Uploaded ${item.name} -> ${result.secure_url}`);
    } catch (err) {
      console.error(`[${i+1}/${menuItems.length}] Error uploading ${item.name}:`, err.message);
    }
    
    // Add a tiny delay to avoid rate limits
    await new Promise(r => setTimeout(r, 100));
  }
  
  const newContent = `import { MenuItem } from '@/types';\n\nexport const menuItems: MenuItem[] = ${JSON.stringify(menuItems, null, 2)};\n`;
  fs.writeFileSync(menuFilePath, newContent);
  console.log(`\nFinished uploading. Successfully uploaded ${successCount} items.`);
  console.log('Saved updated URLs to src/data/menu.ts');
}

uploadImages();
