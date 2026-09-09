const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const ignoreDirs = new Set(['node_modules', '.git', '.next']);
const ignoreExts = new Set(['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.eot', '.pdf', '.zip']);

const replacements = [
  { from: /AutoGram AI/g, to: 'INSTASK' },
  { from: /AutoGram/g, to: 'INSTASK' },
  { from: /autogram/g, to: 'instask' },
  { from: /Autogram/g, to: 'INSTASK' },
  { from: /Askus Studio/g, to: 'INSTASK' },
  { from: /Askus/g, to: 'INSTASK' },
  { from: /askus/g, to: 'instask' },
];

let totalReplacements = 0;
let modifiedFiles = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (ignoreDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (ignoreExts.has(ext)) continue;
      // Skip this script itself
      if (entry.name === 'rename_to_instask.js') continue;

      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      let fileCount = 0;

      for (const { from, to } of replacements) {
        const matches = content.match(from);
        if (matches) {
          fileCount += matches.length;
          content = content.replace(from, to);
        }
      }

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        modifiedFiles++;
        totalReplacements += fileCount;
        console.log(`Updated (${fileCount} replacements): ${path.relative(rootDir, fullPath)}`);
      }
    }
  }
}

console.log(`Starting global rename to INSTASK from root: ${rootDir}`);
walk(rootDir);
console.log(`\nCompleted global rename! Modified ${modifiedFiles} files with ${totalReplacements} total replacements.`);
