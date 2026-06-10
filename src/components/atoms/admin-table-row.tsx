import * as React from "react"
export const AdminTableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={`border-b border-border transition-colors hover:bg-surface/50 data-[state=selected]:bg-surface ${className || ""}`.trim()}
      {...props}
    />
  )
)
AdminTableRow.displayName = "AdminTableRow"
