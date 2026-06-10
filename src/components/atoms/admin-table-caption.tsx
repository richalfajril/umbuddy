import * as React from "react"
export const AdminTableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={`mt-4 text-sm text-muted ${className || ""}`.trim()} {...props} />
  )
)
AdminTableCaption.displayName = "AdminTableCaption"
