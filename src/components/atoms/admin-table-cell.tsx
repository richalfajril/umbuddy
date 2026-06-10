import * as React from "react"
export const AdminTableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={`p-6 align-middle [&:has([role=checkbox])]:pr-0 ${className || ""}`.trim()}
      {...props}
    />
  )
)
AdminTableCell.displayName = "AdminTableCell"
