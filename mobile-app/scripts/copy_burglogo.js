const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '..', 'assets', 'images', 'burglogo.jpg');
const targets = [
  path.resolve(__dirname, '..', 'assets', 'images', 'icon.png'),
  path.resolve(__dirname, '..', 'assets', 'images', 'splash-icon.png'),
  path.resolve(__dirname, '..', 'assets', 'images', 'android-icon-foreground.png'),
  path.resolve(__dirname, '..', 'assets', 'images', 'android-icon-monochrome.png'),
];

if (!fs.existsSync(src)) {
  console.error('Source file not found:', src);
  process.exit(2);
}

let failed = false;
for (const t of targets) {
  try {
    fs.copyFileSync(src, t);
    console.log('Copied', src, '->', t);
  } catch (err) {
    console.error('Failed to copy to', t, err.message || err);
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
