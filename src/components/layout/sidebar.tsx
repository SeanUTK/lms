import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  TruckIcon,
  Calculator,
  ShieldCheck,
  Building2,
  PlusCircle,
  BarChart3,
  Bell,
  ClipboardList,
  PackageOpen,
  Route,
  Receipt,
  CreditCard,
  Wallet,
  FileText,
  Gauge,
  FileCheck,
  Wrench,
  FileWarning,
  FileSearch,
  Handshake,
  Users,
  Settings,
  ShoppingCart,
  Warehouse,
  Map,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  moduleColor?: string;
  onClick?: () => void;
};

type NavGroupProps = {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  collapsed?: boolean;
  moduleColor?: string;
  active?: boolean;
};

const NavItem = ({ 
  href, 
  icon, 
  label, 
  active = false, 
  collapsed = false,
  moduleColor = "var(--primary)",
  onClick 
}: NavItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        active 
          ? "bg-primary/10 text-primary font-medium" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        collapsed && "justify-center px-2"
      )}
      onClick={onClick}
      style={active ? { 
        backgroundColor: `hsl(${moduleColor}/10%)`,
        color: `hsl(${moduleColor})` 
      } : {}}
    >
      {collapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="h-5 w-5">{icon}</span>
            </TooltipTrigger>
            <TooltipContent side="right" align="start" className="z-50">
              {label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <>
          <span className="h-5 w-5">{icon}</span>
          <span className={cn("flex-1", collapsed && "hidden")}>{label}</span>
        </>
      )}
    </Link>
  );
};

const NavGroup = ({ 
  icon, 
  label, 
  children, 
  defaultOpen = false, 
  collapsed = false,
  moduleColor = "var(--primary)",
  active = false
}: NavGroupProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="space-y-1">
      {collapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => !collapsed && setIsOpen(!isOpen)}
                className={cn(
                  "flex w-full items-center justify-center rounded-md p-2 text-sm transition-colors",
                  active 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                style={active ? { 
                  backgroundColor: `hsl(${moduleColor}/10%)`,
                  color: `hsl(${moduleColor})` 
                } : {}}
              >
                <span className="h-5 w-5">{icon}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" align="start" className="z-50">
              {label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <button
          onClick={() => !collapsed && setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
            active 
              ? "bg-primary/10 text-primary font-medium" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
          style={active ? { 
            backgroundColor: `hsl(${moduleColor}/10%)`,
            color: `hsl(${moduleColor})` 
          } : {}}
        >
          <div className="flex items-center gap-3">
            <span className="h-5 w-5">{icon}</span>
            <span className="flex-1">{label}</span>
          </div>
          <span className="h-4 w-4">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        </button>
      )}
      {!collapsed && isOpen && (
        <div className="ml-6 mt-1 space-y-1 pl-2 border-l border-border">
          {children}
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function Sidebar({ collapsed = false, onToggle, className }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const isDashboardActive = isActive("/");
  const isDispatchActive = isActive("/dispatch");
  const isAccountingActive = isActive("/accounting");
  const isFleetActive = isActive("/fleet");
  const isSafetyActive = isActive("/safety");
  const isResourcesActive = isActive("/resources");

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-background",
        collapsed ? "w-[70px]" : "w-[250px]",
        "transition-all duration-300 ease-in-out",
        className
      )}
    >
      {/* Logo and collapse button */}
      <div className={cn(
        "flex h-16 items-center border-b px-4",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <TruckIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TMS Pro</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/">
            <TruckIcon className="h-6 w-6 text-primary" />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn("h-8 w-8", collapsed && "absolute right-2 top-4")}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Quick Add Button */}
      <div className={cn(
        "p-4",
        collapsed ? "flex justify-center" : ""
      )}>
        {collapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" className="w-10 h-10 rounded-full">
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Quick Add
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button className="w-full gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Quick Add</span>
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {/* Dashboard */}
          <NavItem
            href="/"
            icon={<LayoutDashboard />}
            label="Dashboard"
            active={isDashboardActive}
            collapsed={collapsed}
          />
          
          {/* Reporting */}
          <NavItem
            href="/reports"
            icon={<BarChart3 />}
            label="Reporting"
            active={isActive("/reports")}
            collapsed={collapsed}
          />
          
          {/* Notifications */}
          <NavItem
            href="/notifications"
            icon={<Bell />}
            label="Notifications"
            active={isActive("/notifications")}
            collapsed={collapsed}
          />
          
          {/* Dispatching Module */}
          <NavGroup
            icon={<TruckIcon />}
            label="Dispatching"
            defaultOpen={isDispatchActive}
            collapsed={collapsed}
            moduleColor="var(--dispatch)"
            active={isDispatchActive}
          >
            <NavItem
              href="/dispatch/board"
              icon={<ClipboardList />}
              label="Dispatch Board"
              active={isActive("/dispatch/board")}
              collapsed={collapsed}
              moduleColor="var(--dispatch)"
            />
            <NavItem
              href="/dispatch/tenders"
              icon={<PackageOpen />}
              label="EDI Tenders"
              active={isActive("/dispatch/tenders")}
              collapsed={collapsed}
              moduleColor="var(--dispatch)"
            />
            <NavItem
              href="/dispatch/trips"
              icon={<Route />}
              label="Trips"
              active={isActive("/dispatch/trips")}
              collapsed={collapsed}
              moduleColor="var(--dispatch)"
            />
          </NavGroup>
          
          {/* Accounting Module */}
          <NavGroup
            icon={<Calculator />}
            label="Accounting"
            defaultOpen={isAccountingActive}
            collapsed={collapsed}
            moduleColor="var(--accounting)"
            active={isAccountingActive}
          >
            <NavItem
              href="/accounting/receivables"
              icon={<Receipt />}
              label="Receivables"
              active={isActive("/accounting/receivables")}
              collapsed={collapsed}
              moduleColor="var(--accounting)"
            />
            <NavItem
              href="/accounting/freight-bills"
              icon={<FileText />}
              label="Freight Bills"
              active={isActive("/accounting/freight-bills")}
              collapsed={collapsed}
              moduleColor="var(--accounting)"
            />
            <NavItem
              href="/accounting/prepayments"
              icon={<CreditCard />}
              label="Prepayments"
              active={isActive("/accounting/prepayments")}
              collapsed={collapsed}
              moduleColor="var(--accounting)"
            />
            <NavItem
              href="/accounting/fuel-tolls"
              icon={<Gauge />}
              label="Fuel & Tolls"
              active={isActive("/accounting/fuel-tolls")}
              collapsed={collapsed}
              moduleColor="var(--accounting)"
            />
            <NavItem
              href="/accounting/payroll"
              icon={<Wallet />}
              label="Payroll"
              active={isActive("/accounting/payroll")}
              collapsed={collapsed}
              moduleColor="var(--accounting)"
            />
            <NavItem
              href="/accounting/transactions"
              icon={<FileText />}
              label="Transactions"
              active={isActive("/accounting/transactions")}
              collapsed={collapsed}
              moduleColor="var(--accounting)"
            />
          </NavGroup>
          
          {/* Fleet Module */}
          <NavGroup
            icon={<TruckIcon />}
            label="Fleet"
            defaultOpen={isFleetActive}
            collapsed={collapsed}
            moduleColor="var(--fleet)"
            active={isFleetActive}
          >
            <NavItem
              href="/fleet/compliance"
              icon={<FileCheck />}
              label="Fleet Compliance"
              active={isActive("/fleet/compliance")}
              collapsed={collapsed}
              moduleColor="var(--fleet)"
            />
            <NavItem
              href="/fleet/overview"
              icon={<TruckIcon />}
              label="Fleet Overview"
              active={isActive("/fleet/overview")}
              collapsed={collapsed}
              moduleColor="var(--fleet)"
            />
            <NavItem
              href="/fleet/maintenance"
              icon={<Wrench />}
              label="Maintenance & Repairs"
              active={isActive("/fleet/maintenance")}
              collapsed={collapsed}
              moduleColor="var(--fleet)"
            />
          </NavGroup>
          
          {/* Safety Module */}
          <NavGroup
            icon={<ShieldCheck />}
            label="Safety"
            defaultOpen={isSafetyActive}
            collapsed={collapsed}
            moduleColor="var(--safety)"
            active={isSafetyActive}
          >
            <NavItem
              href="/safety/compliance"
              icon={<FileCheck />}
              label="Safety Compliance"
              active={isActive("/safety/compliance")}
              collapsed={collapsed}
              moduleColor="var(--safety)"
            />
            <NavItem
              href="/safety/inspections"
              icon={<FileSearch />}
              label="DOT Inspections"
              active={isActive("/safety/inspections")}
              collapsed={collapsed}
              moduleColor="var(--safety)"
            />
            <NavItem
              href="/safety/claims"
              icon={<FileWarning />}
              label="Collisions & Claims"
              active={isActive("/safety/claims")}
              collapsed={collapsed}
              moduleColor="var(--safety)"
            />
          </NavGroup>
          
          {/* Account Resources Module */}
          <NavGroup
            icon={<Building2 />}
            label="Account Resources"
            defaultOpen={isResourcesActive}
            collapsed={collapsed}
            moduleColor="var(--resources)"
            active={isResourcesActive}
          >
            <NavItem
              href="/resources/companies"
              icon={<Building2 />}
              label="My Companies"
              active={isActive("/resources/companies")}
              collapsed={collapsed}
              moduleColor="var(--resources)"
            />
            <NavItem
              href="/resources/factors"
              icon={<Handshake />}
              label="Factors"
              active={isActive("/resources/factors")}
              collapsed={collapsed}
              moduleColor="var(--resources)"
            />
            <NavItem
              href="/resources/drivers"
              icon={<Users />}
              label="Drivers & Contractors"
              active={isActive("/resources/drivers")}
              collapsed={collapsed}
              moduleColor="var(--resources)"
            />
            <NavItem
              href="/resources/users"
              icon={<Users />}
              label="Site Users"
              active={isActive("/resources/users")}
              collapsed={collapsed}
              moduleColor="var(--resources)"
            />
            <NavItem
              href="/resources/equipment"
              icon={<TruckIcon />}
              label="Equipment"
              active={isActive("/resources/equipment")}
              collapsed={collapsed}
              moduleColor="var(--resources)"
            />
            <NavItem
              href="/resources/customers"
              icon={<Users />}
              label="Customers"
              active={isActive("/resources/customers")}
              collapsed={collapsed}
              moduleColor="var(--resources)"
            />
            <NavItem
              href="/resources/vendors"
              icon={<ShoppingCart />}
              label="Vendors"
              active={isActive("/resources/vendors")}
              collapsed={collapsed}
              moduleColor="var(--resources)"
            />
            <NavItem
              href="/resources/integrations"
              icon={<Settings />}
              label="Integrations"
              active={isActive("/resources/integrations")}
              collapsed={collapsed}
              moduleColor="var(--resources)"
            />
            <NavItem
              href="/resources/inventory"
              icon={<Warehouse />}
              label="Inventory"
              active={isActive("/resources/inventory")}
              collapsed={collapsed}
              moduleColor="var(--resources)"
            />
            <NavItem
              href="/resources/addresses"
              icon={<Map />}
              label="Address Book"
              active={isActive("/resources/addresses")}
              collapsed={collapsed}
              moduleColor="var(--resources)"
            />
          </NavGroup>
        </nav>
      </div>

      {/* Mobile toggle */}
      <div className="lg:hidden absolute top-3 right-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>
    </aside>
  );
}

// Missing import
const ChevronLeft = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export default Sidebar;
