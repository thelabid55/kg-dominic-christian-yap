const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const map = {
  '1550009158': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_Store_Fifth_Avenue_New_York.jpg',
  '1585399000684': 'https://upload.wikimedia.org/wikipedia/commons/2/23/Apple_Studio_Display_%282022%29_with_Mac_Studio.jpg',
  '1504274066651': 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Mechanical_keyboard_with_blank_keys.jpg',
  '1610945415295': 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Samsung_Galaxy_S24_Ultra.jpg',
  '1593642632823': 'https://upload.wikimedia.org/wikipedia/commons/1/1a/ASUS_ROG_Zephyrus_G14_%282022%29.jpg',
  '1606813907291': 'https://upload.wikimedia.org/wikipedia/commons/7/73/PlayStation_5_and_DualSense_with_transparent_background.png',
  '1598327105666': 'https://upload.wikimedia.org/wikipedia/commons/a/af/Pixel_8_Pro_Porcelain.jpg'
};

for (const key of Object.keys(map)) {
  const url = map[key];
  const regex = new RegExp('https://images\\.unsplash\\.com/photo-' + key + '[^\\\'\\"\\s]*', 'g');
  content = content.replace(regex, url);
}

fs.writeFileSync('index.html', content);
console.log('Fixed remaining images!');
