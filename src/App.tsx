import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import "@/styles/globals.css";

// Import the Dashboard component
import Dashboard from "@/pages/dashboard";

// Placeholder component for routes not yet implemented
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-muted-foreground max-w-md">
      This page is under construction. The {title.toLowerCase()} module will be implemented in the next development phase.
    </p>
  </div>
);

// Auth pages
const LoginPage = () => <PlaceholderPage title="Login" />;
const RegisterPage = () => <PlaceholderPage title="Register" />;
const ForgotPasswordPage = () => <PlaceholderPage title="Forgot Password" />;

// Core pages
const ReportsPage = () => <PlaceholderPage title="Reports" />;
const NotificationsPage = () => <PlaceholderPage title="Notifications" />;

// Dispatch module pages
const DispatchBoardPage = () => <PlaceholderPage title="Dispatch Board" />;
const EDITendersPage = () => <PlaceholderPage title="EDI Tenders" />;
const TripsPage = () => <PlaceholderPage title="Trips" />;
const TripDetailsPage = () => <PlaceholderPage title="Trip Details" />;

// Accounting module pages
const ReceivablesPage = () => <PlaceholderPage title="Receivables" />;
const FreightBillsPage = () => <PlaceholderPage title="Freight Bills" />;
const PrepaymentsPage = () => <PlaceholderPage title="Prepayments" />;
const FuelTollsPage = () => <PlaceholderPage title="Fuel & Tolls" />;
const PayrollPage = () => <PlaceholderPage title="Payroll" />;
const TransactionsPage = () => <PlaceholderPage title="Transactions" />;

// Fleet module pages
const FleetCompliancePage = () => <PlaceholderPage title="Fleet Compliance" />;
const FleetOverviewPage = () => <PlaceholderPage title="Fleet Overview" />;
const MaintenanceRepairsPage = () => <PlaceholderPage title="Maintenance & Repairs" />;

// Safety module pages
const SafetyCompliancePage = () => <PlaceholderPage title="Safety Compliance" />;
const DOTInspectionsPage = () => <PlaceholderPage title="DOT Inspections" />;
const CollisionsClaimsPage = () => <PlaceholderPage title="Collisions & Claims" />;

// Account Resources module pages
const CompaniesPage = () => <PlaceholderPage title="My Companies" />;
const FactorsPage = () => <PlaceholderPage title="Factors" />;
const DriversContractorsPage = () => <PlaceholderPage title="Drivers & Contractors" />;
const SiteUsersPage = () => <PlaceholderPage title="Site Users" />;
const EquipmentPage = () => <PlaceholderPage title="Equipment" />;
const CustomersPage = () => <PlaceholderPage title="Customers" />;
const VendorsPage = () => <PlaceholderPage title="Vendors" />;
const IntegrationsPage = () => <PlaceholderPage title="Integrations" />;
const InventoryPage = () => <PlaceholderPage title="Inventory" />;
const AddressBookPage = () => <PlaceholderPage title="Address Book" />;

// Settings and profile pages
const SettingsPage = () => <PlaceholderPage title="Settings" />;
const ProfilePage = () => <PlaceholderPage title="Profile" />;
const HelpSupportPage = () => <PlaceholderPage title="Help & Support" />;

// Error pages
const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="text-muted-foreground max-w-md mb-8">
      The page you are looking for doesn't exist or has been moved.
    </p>
    <a href="/" className="text-primary hover:underline">
      Return to Dashboard
    </a>
  </div>
);

// Module wrapper components for proper nesting
const DispatchModule = () => (
  <>
    <Outlet />
  </>
);

const AccountingModule = () => (
  <>
    <Outlet />
  </>
);

const FleetModule = () => (
  <>
    <Outlet />
  </>
);

const SafetyModule = () => (
  <>
    <Outlet />
  </>
);

const ResourcesModule = () => (
  <>
    <Outlet />
  </>
);

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    <span className="ml-2">Loading...</span>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Main app routes */}
          <Route path="/" element={<AppLayout />}>
            {/* Dashboard */}
            <Route index element={<Dashboard />} />
            
            {/* Reports */}
            <Route path="reports" element={<ReportsPage />} />
            <Route path="reports/:reportType" element={<ReportsPage />} />
            
            {/* Notifications */}
            <Route path="notifications" element={<NotificationsPage />} />
            
            {/* Dispatching Module */}
            <Route path="dispatch" element={<DispatchModule />}>
              <Route index element={<Navigate to="/dispatch/board" replace />} />
              <Route path="board" element={<DispatchBoardPage />} />
              <Route path="tenders" element={<EDITendersPage />} />
              <Route path="trips" element={<TripsPage />} />
              <Route path="trips/:tripId" element={<TripDetailsPage />} />
            </Route>
            
            {/* Accounting Module */}
            <Route path="accounting" element={<AccountingModule />}>
              <Route index element={<Navigate to="/accounting/receivables" replace />} />
              <Route path="receivables" element={<ReceivablesPage />} />
              <Route path="receivables/:invoiceId" element={<PlaceholderPage title="Invoice Details" />} />
              <Route path="freight-bills" element={<FreightBillsPage />} />
              <Route path="prepayments" element={<PrepaymentsPage />} />
              <Route path="fuel-tolls" element={<FuelTollsPage />} />
              <Route path="payroll" element={<PayrollPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
            </Route>
            
            {/* Fleet Module */}
            <Route path="fleet" element={<FleetModule />}>
              <Route index element={<Navigate to="/fleet/overview" replace />} />
              <Route path="compliance" element={<FleetCompliancePage />} />
              <Route path="overview" element={<FleetOverviewPage />} />
              <Route path="maintenance" element={<MaintenanceRepairsPage />} />
              <Route path="equipment/:equipmentId" element={<PlaceholderPage title="Equipment Details" />} />
            </Route>
            
            {/* Safety Module */}
            <Route path="safety" element={<SafetyModule />}>
              <Route index element={<Navigate to="/safety/compliance" replace />} />
              <Route path="compliance" element={<SafetyCompliancePage />} />
              <Route path="inspections" element={<DOTInspectionsPage />} />
              <Route path="claims" element={<CollisionsClaimsPage />} />
            </Route>
            
            {/* Account Resources Module */}
            <Route path="resources" element={<ResourcesModule />}>
              <Route index element={<Navigate to="/resources/companies" replace />} />
              <Route path="companies" element={<CompaniesPage />} />
              <Route path="factors" element={<FactorsPage />} />
              <Route path="drivers" element={<DriversContractorsPage />} />
              <Route path="drivers/:driverId" element={<PlaceholderPage title="Driver Details" />} />
              <Route path="users" element={<SiteUsersPage />} />
              <Route path="equipment" element={<EquipmentPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="vendors" element={<VendorsPage />} />
              <Route path="integrations" element={<IntegrationsPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="addresses" element={<AddressBookPage />} />
            </Route>
            
            {/* Settings and Profile */}
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="help" element={<HelpSupportPage />} />
          </Route>
          
          {/* 404 - Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
