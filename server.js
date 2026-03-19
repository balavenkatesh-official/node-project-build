const fs = require('fs');
const path = require('path');

const ROOT  = path.join(__dirname, '..');
const SRC   = path.join(ROOT, 'public');
const BUILD = path.join(ROOT, 'build');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath  = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`  ✔ Copied: ${entry.name}`);
    }
  }
}

function minifyHTML(content) {
  return content
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}

console.log('\n🔨 Building project...\n');

if (fs.existsSync(BUILD)) {
  fs.rmSync(BUILD, { recursive: true, force: true });
  console.log('  🗑  Cleaned old /build\n');
}

// Copy public/ → build/public/  ← keeps server.js paths intact
console.log('📁 Copying public files:');
copyDir(SRC, path.join(BUILD, 'public'));

// Minify HTML inside build/public/
console.log('\n⚡ Minifying HTML:');
fs.readdirSync(path.join(BUILD, 'public'))
  .filter(f => f.endsWith('.html'))
  .forEach(file => {
    const fp = path.join(BUILD, 'public', file);
    fs.writeFileSync(fp, minifyHTML(fs.readFileSync(fp, 'utf-8')));
    console.log(`  ⚡ Minified: ${file}`);
  });

// Copy server.js + package.json → build root  ← THIS WAS MISSING
console.log('\n📦 Copying server files:');
['server.js', 'package.json'].forEach(file => {
  fs.copyFileSync(path.join(ROOT, file), path.join(BUILD, file));
  console.log(`  ✔ Copied: ${file}`);
});

console.log('\n✅ Build complete! Output → /build\n');
