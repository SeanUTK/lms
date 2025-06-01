import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "dispatch" | "accounting" | "fleet" | "safety" | "resources";
    hoverable?: boolean;
  }
>(({ className, variant = "default", hoverable = false, ...props }, ref) => {
  const variantClasses = {
    default: "",
    dispatch: "border-l-4 border-l-dispatch",
    accounting: "border-l-4 border-l-accounting",
    fleet: "border-l-4 border-l-fleet",
    safety: "border-l-4 border-l-safety",
    resources: "border-l-4 border-l-resources",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        hoverable && "transition-all duration-200 hover:shadow-md hover:-translate-y-1",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { 
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    withIcon?: boolean;
  }
>(({ className, as: Component = "h3", withIcon = false, ...props }, ref) => (
  <Component
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      withIcon && "flex items-center gap-2",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
