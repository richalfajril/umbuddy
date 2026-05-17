import * as React from 'react'

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={[
        "text-sm font-black leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-headline mb-2 block",
        className
      ].filter(Boolean).join(' ')}
      {...props}
    />
  )
)
Label.displayName = "Label"

export { Label }
