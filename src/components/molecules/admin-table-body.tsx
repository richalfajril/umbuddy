import * as React from "react"
export const AdminTableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className || ""}`.trim()} {...props} />
  )
)
AdminTableBody.displayName = "AdminTableBody"
