const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/components/atoms/admin-table-row.tsx',
  'src/components/atoms/admin-table-head.tsx',
  'src/components/atoms/admin-table-cell.tsx',
  'src/components/atoms/admin-table-caption.tsx',
  'src/components/molecules/admin-table.tsx',
  'src/components/molecules/admin-table-header.tsx',
  'src/components/molecules/admin-table-body.tsx'
];

filesToFix.forEach(relPath => {
  const file = path.join(__dirname, '../', relPath);
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf-8');
  
  // Remove import { cn }
  content = content.replace(/import\s+\{\s*cn\s*\}\s+from\s+["']@\/lib\/utils["'][\r\n]*/g, '');
  
  // Replace cn("foo", className) with `foo ${className || ""}`.trim()
  content = content.replace(/cn\("([^"]+)"\s*,\s*className\)/g, '`$1 ${className || ""}`.trim()');
  
  fs.writeFileSync(file, content);
  console.log('Fixed cn in', file);
});
