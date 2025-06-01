import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    variant?: "default" | "outline" | "pills" | "underline";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-muted p-1 rounded-md",
    outline: "border rounded-md p-1",
    pills: "flex space-x-1",
    underline: "border-b flex"
  };

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: "default" | "outline" | "pills" | "underline";
    moduleColor?: string;
  }
>(({ className, variant = "default", moduleColor, ...props }, ref) => {
  const variantClasses = {
    default: "data-[state=active]:bg-background data-[state=active]:shadow-sm",
    outline: "data-[state=active]:bg-background border-b-0 data-[state=active]:border-b-background",
    pills: "data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-full",
    underline: "border-b-2 border-transparent data-[state=active]:border-primary -mb-px data-[state=active]:text-foreground"
  };

  const style = moduleColor && props["data-state"] === "active" 
    ? { borderColor: `hsl(${moduleColor})`, color: `hsl(${moduleColor})` } 
    : {};

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground",
        variantClasses[variant],
        className
      )}
      style={style}
      {...props}
    />
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
