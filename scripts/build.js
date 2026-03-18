/**
 * build.js — Creates a production-ready /build folder
 * Run with: npm run build
 */

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'public');
const BUILD = path.join(__dirname, '..', 'build');

// Recursively copy a directory
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`  ✔ Copied: ${entry.name}`);
    }
  }
}

// Minify HTML (basic — strips comments and excess whitespace)
function minifyHTML(content) {
  return content
    .replace(/<!--[\s\S]*?-->/g, '')       // remove HTML comments
    .replace(/\s{2,}/g, ' ')               // collapse whitespace
    .replace(/>\s+</g, '><')               // remove space between tags
    .trim();
}

// Process HTML files with basic minification
function processHTML(buildDir) {
  const files = fs.readdirSync(buildDir).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const filePath = path.join(buildDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const minified = minifyHTML(content);
    fs.writeFileSync(filePath, minified, 'utf-8');
    console.log(`  ⚡ Minified: ${file}`);
  }
}

// --- RUN BUILD ---
console.log('\n🔨 Building project...\n');

// Clean old build
if (fs.existsSync(BUILD)) {
  fs.rmSync(BUILD, { recursive: true, force: true });
  console.log('  🗑  Cleaned old /build folder\n');
}

// Copy public files
console.log('📁 Copying files:');
copyDir(SRC, BUILD);

// Minify HTML
console.log('\n⚡ Minifying HTML:');
processHTML(BUILD);

// Copy server.js into build
const serverSrc = path.join(__dirname, '..', 'server.js');
const serverDest = path.join(BUILD, '..', 'build', 'server.js');
// We keep server.js at the root; build only contains static assets.

console.log('\n✅ Build complete! Output → /build\n');
