import * as React from "react"

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

// Wrapper tabel admin menjaga overflow horizontal tetap rapi pada layar kecil.
const AdminTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="overflow-x-auto rounded-xl border border-border">
    <table
      ref={ref}
      className={cn("w-full text-left text-sm text-body", className)}
      {...props}
    />
  </div>
))
AdminTable.displayName = "AdminTable"

// Header tabel memakai tone netral agar konsisten di semua halaman admin.
const AdminTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-surface text-sm font-bold text-headline", className)} {...props} />
))
AdminTableHeader.displayName = "AdminTableHeader"

// Body tabel memusatkan warna dasar dan garis antar baris.
const AdminTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-border bg-background", className)}
    {...props}
  />
))
AdminTableBody.displayName = "AdminTableBody"

// Row tabel memberi hover ringan tanpa mengubah struktur layout.
const AdminTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "transition hover:bg-surface/50 group",
      className
    )}
    {...props}
  />
))
AdminTableRow.displayName = "AdminTableRow"

// Cell heading dibuat lapang agar tabel admin mudah dipindai.
const AdminTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "px-4 py-5 whitespace-nowrap",
      className
    )}
    {...props}
  />
))
AdminTableHead.displayName = "AdminTableHead"

// Cell data memakai padding vertikal standar untuk semua tabel admin.
const AdminTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-4 py-4 whitespace-nowrap", className)}
    {...props}
  />
))
AdminTableCell.displayName = "AdminTableCell"

// Skeleton teks dipakai hanya pada data/list yang sedang refetch.
function AdminTableTextSkeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block h-4 animate-pulse rounded-full bg-surface-hover", className)}
    />
  )
}

export {
  AdminTable,
  AdminTableHeader,
  AdminTableBody,
  AdminTableRow,
  AdminTableHead,
  AdminTableCell,
  AdminTableTextSkeleton,
}
