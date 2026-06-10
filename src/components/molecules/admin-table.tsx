import * as React from "react"
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

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

const AdminTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-surface text-sm font-bold text-headline", className)} {...props} />
))
AdminTableHeader.displayName = "AdminTableHeader"

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

const AdminTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-4 py-2.5", className)}
    {...props}
  />
))
AdminTableCell.displayName = "AdminTableCell"

export {
  AdminTable,
  AdminTableHeader,
  AdminTableBody,
  AdminTableRow,
  AdminTableHead,
  AdminTableCell,
}
