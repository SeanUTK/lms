import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import Sidebar from "./sidebar";
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  HelpCircle, 
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AppLayoutProps {
  children?: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset mobile sidebar when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [location.pathname, isMobile]);

  // Get current module from path
  const getCurrentModule = () => {
    const path = location.pathname;
    if (path.startsWith("/dispatch")) return "dispatch";
    if (path.startsWith("/accounting")) return "accounting";
    if (path.startsWith("/fleet")) return "fleet";
    if (path.startsWith("/safety")) return "safety";
    if (path.startsWith("/resources")) return "resources";
    return "default";
  };

  const moduleColor = `var(--${getCurrentModule() === "default" ? "primary" : getCurrentModule()})`;

  // Get page title from path
  const getPageTitle = () => {
    const path = location.pathname;
    
    // Root path
    if (path === "/") return "Dashboard";
    
    // Split the path and capitalize each segment
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";
    
    // If it's a module index page
    if (segments.length === 1) {
      return segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
    }
    
    // For subpages, use the last segment
    const lastSegment = segments[segments.length - 1];
    return lastSegment
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:block")}>
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden absolute left-4 top-3 z-20"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[250px]">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className={cn(
            "flex-1 flex items-center",
            isMobile ? "ml-12" : sidebarCollapsed ? "ml-2" : "ml-0"
          )}>
            <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
          </div>

          {/* Search */}
          <div className="relative hidden md:block max-w-md flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search anything..."
              className="w-full rounded-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px]">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-auto">
                  <DropdownMenuItem className="p-3 cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">New load assigned</div>
                      <div className="text-xs text-muted-foreground">
                        Load #TMS-123456 has been assigned to driver John Doe
                      </div>
                      <div className="text-xs text-muted-foreground">
                        2 minutes ago
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">Vehicle maintenance due</div>
                      <div className="text-xs text-muted-foreground">
                        Truck #T-789 is due for maintenance in 3 days
                      </div>
                      <div className="text-xs text-muted-foreground">
                        1 hour ago
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">Invoice payment received</div>
                      <div className="text-xs text-muted-foreground">
                        Payment of $2,450.00 received for Invoice #INV-7890
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Yesterday at 4:30 PM
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center cursor-pointer">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://ui.shadcn.com/avatars/01.png" alt="User" />
                    <AvatarFallback>SW</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">Sean Wilson</p>
                    <p className="text-xs text-muted-foreground">
                      sean.wilson@example.com
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Module Indicator */}
        <div 
          className="h-1" 
          style={{ backgroundColor: `hsl(${moduleColor})` }}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
