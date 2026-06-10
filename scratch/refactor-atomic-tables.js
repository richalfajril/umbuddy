const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const atomsDir = path.join(srcDir, 'components/atoms');
const moleculesDir = path.join(srcDir, 'components/molecules');
const organismsDir = path.join(srcDir, 'components/organisms');
const templatesDir = path.join(srcDir, 'components/templates');

// Ensure dirs exist
[atomsDir, moleculesDir, organismsDir, templatesDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const atomsCode = {
  'admin-table-row.tsx': `import * as React from "react"
import { cn } from "@/lib/utils"

export const AdminTableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("border-b border-border transition-colors hover:bg-surface/50 data-[state=selected]:bg-surface", className)}
      {...props}
    />
  )
)
AdminTableRow.displayName = "AdminTableRow"
`,
  'admin-table-head.tsx': `import * as React from "react"
import { cn } from "@/lib/utils"

export const AdminTableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn("h-14 px-6 text-left align-middle font-bold text-headline [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  )
)
AdminTableHead.displayName = "AdminTableHead"
`,
  'admin-table-cell.tsx': `import * as React from "react"
import { cn } from "@/lib/utils"

export const AdminTableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn("p-6 align-middle [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  )
)
AdminTableCell.displayName = "AdminTableCell"
`,
  'admin-table-caption.tsx': `import * as React from "react"
import { cn } from "@/lib/utils"

export const AdminTableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-4 text-sm text-muted", className)} {...props} />
  )
)
AdminTableCaption.displayName = "AdminTableCaption"
`
};

const moleculesCode = {
  'admin-table.tsx': `import * as React from "react"
import { cn } from "@/lib/utils"

export const AdminTable = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table
        ref={ref}
        className={cn("w-full text-left text-sm text-body", className)}
        {...props}
      />
    </div>
  )
)
AdminTable.displayName = "AdminTable"
`,
  'admin-table-header.tsx': `import * as React from "react"
import { cn } from "@/lib/utils"

export const AdminTableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("bg-surface text-sm font-bold text-headline", className)} {...props} />
  )
)
AdminTableHeader.displayName = "AdminTableHeader"
`,
  'admin-table-body.tsx': `import * as React from "react"
import { cn } from "@/lib/utils"

export const AdminTableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  )
)
AdminTableBody.displayName = "AdminTableBody"
`
};

// 1. Write Atoms
Object.entries(atomsCode).forEach(([file, content]) => {
  fs.writeFileSync(path.join(atomsDir, file), content);
});
fs.writeFileSync(path.join(atomsDir, 'index.ts'), 
  ['admin-table-row', 'admin-table-head', 'admin-table-cell', 'admin-table-caption'].map(f => `export * from './${f}';`).join('\n') + '\n' +
  (fs.existsSync(path.join(atomsDir, 'theme-toggle.tsx')) ? `export * from './theme-toggle';\n` : '')
);

// 2. Write Molecules
Object.entries(moleculesCode).forEach(([file, content]) => {
  fs.writeFileSync(path.join(moleculesDir, file), content);
});

// Update molecules index.ts
let molIndex = fs.readFileSync(path.join(moleculesDir, 'index.ts'), 'utf-8');
molIndex = molIndex.replace("export * from './admin-table'", "export * from './admin-table'\nexport * from './admin-table-header'\nexport * from './admin-table-body'");
fs.writeFileSync(path.join(moleculesDir, 'index.ts'), molIndex);

// 3. Move AdminTableLayout to Templates
const oldLayoutPath = path.join(organismsDir, 'admin-table-layout.tsx');
const newLayoutPath = path.join(templatesDir, 'admin-table-layout.tsx');
if (fs.existsSync(oldLayoutPath)) {
  fs.renameSync(oldLayoutPath, newLayoutPath);
  
  // Update organisms index
  let orgIndex = fs.readFileSync(path.join(organismsDir, 'index.ts'), 'utf-8');
  orgIndex = orgIndex.replace("export * from './admin-table-layout'\n", "");
  fs.writeFileSync(path.join(organismsDir, 'index.ts'), orgIndex);

  // Update templates index
  const tplIndexFile = path.join(templatesDir, 'index.ts');
  let tplIndex = fs.existsSync(tplIndexFile) ? fs.readFileSync(tplIndexFile, 'utf-8') : '';
  if (!tplIndex.includes('admin-table-layout')) {
    fs.writeFileSync(tplIndexFile, tplIndex + "\nexport * from './admin-table-layout'\n");
  }
}

console.log("Files generated and moved!");
