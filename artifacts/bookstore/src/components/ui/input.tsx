import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <input
        className={`flex h-12 w-full rounded-xl border-2 ${error ? 'border-destructive focus-visible:ring-destructive/20' : 'border-border focus-visible:ring-primary/20 focus-visible:border-primary'} bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
