import * as React from "react"
export const AdminTable = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table
        ref={ref}
        className={`w-full text-left text-sm text-body ${className || ""}`.trim()}
        {...props}
      />
    </div>
  )
)
AdminTable.displayName = "AdminTable"
