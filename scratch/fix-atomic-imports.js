const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '../src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  // 1. Fix AdminTableLayout import from organisms -> templates
  if (content.includes('AdminTableLayout') && content.includes('@/components/organisms')) {
    // If it imports AdminPageHeader AND AdminTableLayout from organisms:
    // import { AdminPageHeader, AdminTableLayout } from '@/components/organisms'
    // Should split them.
    const re = /import\s+\{([^}]+)\}\s+from\s+['"]@\/components\/organisms['"]/g;
    content = content.replace(re, (match, importsStr) => {
      const imports = importsStr.split(',').map(s => s.trim()).filter(Boolean);
      if (imports.includes('AdminTableLayout')) {
        const remaining = imports.filter(i => i !== 'AdminTableLayout');
        let newImports = `import { AdminTableLayout } from '@/components/templates'`;
        if (remaining.length > 0) {
          newImports += `\nimport { ${remaining.join(', ')} } from '@/components/organisms'`;
        }
        return newImports;
      }
      return match;
    });
    changed = true;
  }

  // 2. Fix atoms vs molecules for AdminTable parts
  const tableRe = /import\s+\{([^}]+)\}\s+from\s+['"]@\/components\/molecules['"]/g;
  content = content.replace(tableRe, (match, importsStr) => {
    const imports = importsStr.split(',').map(s => s.trim()).filter(Boolean);
    const atomsList = ['AdminTableRow', 'AdminTableHead', 'AdminTableCell', 'AdminTableCaption'];
    const molList = ['AdminTable', 'AdminTableHeader', 'AdminTableBody', 'SmartPagination']; // plus other molecules
    
    const atoms = imports.filter(i => atomsList.includes(i));
    const mols = imports.filter(i => !atomsList.includes(i));
    
    if (atoms.length > 0) {
      let replacement = `import { ${atoms.join(', ')} } from '@/components/atoms'`;
      if (mols.length > 0) {
        replacement += `\nimport { ${mols.join(', ')} } from '@/components/molecules'`;
      }
      return replacement;
    }
    return match;
  });

  if (content !== fs.readFileSync(file, 'utf-8')) {
    fs.writeFileSync(file, content);
    console.log("Updated", file);
  }
});
console.log("Imports fixed!");
