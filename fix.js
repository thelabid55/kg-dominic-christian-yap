const fs = require('fs');

const realImages = {
  'Samsung Galaxy S24': 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Samsung_Galaxy_S24_Ultra.jpg',
  'MacBook Pro 14\"': 'https://upload.wikimedia.org/wikipedia/commons/e/e7/A_2021_14-inch_Silver_MacBook_Pro.jpg',
  'iPad Pro M2': 'https://upload.wikimedia.org/wikipedia/commons/3/36/IPad_Pro_2020.jpg',
  'PlayStation 5': 'https://upload.wikimedia.org/wikipedia/commons/7/73/PlayStation_5_and_DualSense_with_transparent_background.png',
  'Google Pixel 8 Pro': 'https://upload.wikimedia.org/wikipedia/commons/a/af/Pixel_8_Pro_Porcelain.jpg',
  'PlayStation 5 Slim': 'https://upload.wikimedia.org/wikipedia/commons/7/73/PlayStation_5_and_DualSense_with_transparent_background.png',
  'MacBook Air M3': 'https://upload.wikimedia.org/wikipedia/commons/c/c3/MacBook_Air_M2_Starlight_2022.jpg',
  'iPad Air (M2)': 'https://upload.wikimedia.org/wikipedia/commons/3/36/IPad_Pro_2020.jpg',
  'Asus ROG Zephyrus G14': 'https://upload.wikimedia.org/wikipedia/commons/3/33/Asus_ROG_Zephyrus_G14_%282020%29.jpg',
  'Samsung Galaxy Z Fold 5': 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Samsung_Galaxy_Z_Fold_3.jpg',
  'Steam Deck OLED': 'https://upload.wikimedia.org/wikipedia/commons/8/87/Steam_Deck_with_a_game_running.jpg'
};

let content = fs.readFileSync('index.html', 'utf8');

const regex = /name:\s*'([^']+)'[\s\S]*?image:\s*'https:\/\/images\.unsplash\.com[^']+'/g;
content = content.replace(regex, (match, p1) => {
    if (realImages[p1]) {
        return match.replace(/https:\/\/images\.unsplash\.com[^']+/, realImages[p1]);
    }
    return match;
});

const galleryImages = [
  { old: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5', newUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Mechanical_keyboard_with_blank_keys.jpg' },
  { old: 'https://images.unsplash.com/photo-1542751371-adc38448a05e', newUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Nintendo_Entertainment_System_Console_and_Controller.jpg' },
  { old: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9', newUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Mechanical_keyboard_with_blank_keys.jpg' },
  { old: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2', newUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/MacBook_Air_M2_Starlight_2022.jpg' },
  { old: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', newUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/IPad_Pro_2020.jpg' }
];

galleryImages.forEach(img => {
    const r = new RegExp(img.old + '[^\\\'\\"]*', 'g');
    content = content.replace(r, img.newUrl);
});

// Also fix any remaining hero images using unsplash
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1517336714731-489689fd1ca8\?[^"']+/g, 'https://upload.wikimedia.org/wikipedia/commons/e/e7/A_2021_14-inch_Silver_MacBook_Pro.jpg');
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1606144042614-b2417e99c4e3\?[^"']+/g, 'https://upload.wikimedia.org/wikipedia/commons/7/73/PlayStation_5_and_DualSense_with_transparent_background.png');

fs.writeFileSync('index.html', content);
console.log('Images fixed!');
