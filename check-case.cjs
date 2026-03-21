const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  const files = execSync('find src -type f -name "*.ts" -o -name "*.tsx"').toString().trim().split('\n');
  let hasMismatch = false;

  for (const file of files) {
    if (!file) continue;
    const content = fs.readFileSync(file, 'utf8');
    const importLines = content.match(/from\s+['"]([^'"]+)['"]/g) || [];
    const dynamicImports = content.match(/import\(['"]([^'"]+)['"]\)/g) || [];
    const allImports = [...importLines.map(l => l.match(/['"]([^'"]+)['"]/)[1]), ...dynamicImports.map(l => l.match(/['"]([^'"]+)['"]/)[1])];
    
    for (const importPath of allImports) {
      if (importPath.startsWith('.') || importPath.startsWith('@/')) {
        let resolvedDir;
        let requestedName;
        
        if (importPath.startsWith('@/')) {
          const parts = importPath.replace('@/', 'src/').split('/');
          requestedName = parts.pop();
          resolvedDir = parts.join('/');
        } else {
          const parts = path.join(path.dirname(file), importPath).split('/');
          requestedName = parts.pop();
          resolvedDir = parts.join('/');
        }
        
        if (!fs.existsSync(resolvedDir)) continue;
        
        const actualFiles = fs.readdirSync(resolvedDir);
        // check exact name or name with extensions
        const exts = ['.ts', '.tsx', '.js', '.jsx', '.css', ''];
        let matched = false;
        
        for (const actualFile of actualFiles) {
          for (const ext of exts) {
            if (actualFile === requestedName + ext) {
              matched = true;
              break;
            }
          }
          if (matched) break;
        }
        
        if (!matched) {
          // See if it matches case-insensitively
          const lowerName = requestedName.toLowerCase();
          for (const actualFile of actualFiles) {
            for (const ext of exts) {
              if (actualFile.toLowerCase() === lowerName + ext) {
                console.log(`MISMATCH IN ${file}: imported '${importPath}' -> actual file on disk is '${actualFile}'`);
                hasMismatch = true;
              }
            }
          }
        }
      }
    }
  }

  if(!hasMismatch) console.log("NO MISMATCH FOUND");
} catch(e) {
  console.error("SCRIPT ERROR:", e);
}
