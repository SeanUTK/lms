import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // TMS Module-specific variants
        dispatch: "border-transparent bg-dispatch text-dispatch-foreground hover:bg-dispatch/80",
        accounting: "border-transparent bg-accounting text-accounting-foreground hover:bg-accounting/80",
        fleet: "border-transparent bg-fleet text-fleet-foreground hover:bg-fleet/80",
        safety: "border-transparent bg-safety text-safety-foreground hover:bg-safety/80",
        resources: "border-transparent bg-resources text-resources-foreground hover:bg-resources/80",
        // Status-specific variants
        success: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        warning: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        info: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        pending: "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200",
        active: "border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
        inactive: "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-0.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  clickable?: boolean;
  withDot?: boolean;
  dotColor?: string;
}

function Badge({
  className,
  variant,
  size,
  clickable = false,
  withDot = false,
  dotColor,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant, size }),
        clickable && "cursor-pointer hover:opacity-80",
        className
      )}
      {...props}
    >
      {withDot && (
        <span 
          className="mr-1 h-1.5 w-1.5 rounded-full" 
          style={dotColor ? { backgroundColor: dotColor } : {}}
        />
      )}
      {props.children}
    </div>
  )
}

export { Badge, badgeVariants }
