import * as React from "react"
export const AdminTableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={`bg-surface text-sm font-bold text-headline ${className || ""}`.trim()} {...props} />
  )
)
AdminTableHeader.displayName = "AdminTableHeader"
