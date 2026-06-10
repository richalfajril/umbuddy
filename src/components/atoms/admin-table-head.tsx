import * as React from "react"
export const AdminTableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={`h-14 px-6 text-left align-middle font-bold text-headline [&:has([role=checkbox])]:pr-0 ${className || ""}`.trim()}
      {...props}
    />
  )
)
AdminTableHead.displayName = "AdminTableHead"
