import { createClient } from '@supabase/supabase-js';

// Type declaration for Vite environment variables
interface ImportMetaEnv {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_SUPABASE_SERVICE_ROLE_KEY?: string;
}

// Augment the ImportMeta interface
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Environment variables (would be in .env file in production)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema types
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// User and authentication types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'dispatcher' | 'driver' | 'accountant' | 'manager' | 'safety_officer';
  phone_number?: string;
  profile_image_url?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive' | 'suspended';
  last_login_at?: string;
  settings?: Json;
}

// Company/Organization types
export interface Company {
  id: string;
  name: string;
  logo_url?: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone_number: string;
  email: string;
  website?: string;
  tax_id?: string;
  mc_number?: string;
  dot_number?: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive';
  subscription_tier?: 'free' | 'basic' | 'professional' | 'enterprise';
  settings?: Json;
  parent_company_id?: string;
}

// Branch/Terminal types
export interface Branch {
  id: string;
  company_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone_number?: string;
  email?: string;
  manager_id?: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive';
}

// Vehicle/Equipment types
export interface Vehicle {
  id: string;
  company_id: string;
  type: 'truck' | 'trailer' | 'other';
  make: string;
  model: string;
  year: number;
  vin: string;
  license_plate: string;
  state: string;
  status: 'active' | 'inactive' | 'maintenance' | 'out_of_service';
  current_driver_id?: string;
  current_location?: {
    latitude: number;
    longitude: number;
    address?: string;
    timestamp: string;
  };
  odometer: number;
  fuel_type: 'diesel' | 'gasoline' | 'electric' | 'hybrid' | 'other';
  created_at: string;
  updated_at: string;
  last_inspection_date?: string;
  next_service_date?: string;
  next_service_odometer?: number;
  registration_expiry?: string;
  insurance_expiry?: string;
  equipment_number?: string;
  notes?: string;
  specs?: {
    engine?: string;
    transmission?: string;
    horsepower?: number;
    torque?: number;
    weight?: number;
    length?: number;
    height?: number;
    width?: number;
    capacity?: number;
    axles?: number;
    [key: string]: any;
  };
}

// Driver types
export interface Driver {
  id: string;
  user_id?: string;
  company_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  license_number: string;
  license_state: string;
  license_expiry: string;
  license_class: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  status: 'active' | 'inactive' | 'on_duty' | 'off_duty' | 'driving' | 'suspended';
  hire_date: string;
  termination_date?: string;
  is_contractor: boolean;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  created_at: string;
  updated_at: string;
  current_vehicle_id?: string;
  current_location?: {
    latitude: number;
    longitude: number;
    address?: string;
    timestamp: string;
  };
  available_hours?: number;
  preferences?: Json;
  notes?: string;
  medical_card_expiry?: string;
  hazmat_endorsement?: boolean;
  hazmat_expiry?: string;
  tanker_endorsement?: boolean;
  doubles_triples_endorsement?: boolean;
}

// Customer types
export interface Customer {
  id: string;
  company_id: string;
  name: string;
  contact_name?: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  status: 'active' | 'inactive' | 'prospect' | 'archived';
  credit_limit?: number;
  payment_terms?: string;
  tax_id?: string;
  created_at: string;
  updated_at: string;
  notes?: string;
  customer_since?: string;
  rating?: number;
  billing_address?: {
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  default_billing_method?: 'invoice' | 'credit_card' | 'ach' | 'other';
  custom_fields?: Json;
}

// Load/Shipment types
export interface Load {
  id: string;
  company_id: string;
  customer_id: string;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';
  reference_number: string;
  load_type: 'full_truckload' | 'less_than_truckload' | 'partial' | 'dedicated' | 'other';
  equipment_type: 'dry_van' | 'refrigerated' | 'flatbed' | 'tanker' | 'other';
  created_at: string;
  updated_at: string;
  created_by: string;
  commodity: string;
  weight: number;
  weight_unit: 'lb' | 'kg';
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'in' | 'cm' | 'ft' | 'm';
  };
  temperature_requirements?: {
    min: number;
    max: number;
    unit: 'F' | 'C';
  };
  special_instructions?: string;
  hazardous_materials: boolean;
  pickup: {
    location_id?: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    appointment_time: string;
    contact_name?: string;
    contact_phone?: string;
    notes?: string;
    latitude?: number;
    longitude?: number;
  };
  delivery: {
    location_id?: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    appointment_time: string;
    contact_name?: string;
    contact_phone?: string;
    notes?: string;
    latitude?: number;
    longitude?: number;
  };
  stops?: Array<{
    location_id?: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    appointment_time: string;
    contact_name?: string;
    contact_phone?: string;
    notes?: string;
    latitude?: number;
    longitude?: number;
    stop_type: 'pickup' | 'delivery' | 'other';
  }>;
  rate: number;
  rate_currency: 'USD' | 'CAD' | 'MXN' | 'EUR';
  rate_type: 'flat' | 'per_mile' | 'per_weight' | 'percentage';
  estimated_distance: number;
  distance_unit: 'mi' | 'km';
  documents?: Array<{
    id: string;
    type: 'bill_of_lading' | 'proof_of_delivery' | 'rate_confirmation' | 'invoice' | 'other';
    url: string;
    name: string;
    uploaded_at: string;
    uploaded_by: string;
  }>;
  assigned_driver_id?: string;
  assigned_vehicle_id?: string;
  assigned_trailer_id?: string;
  invoice_id?: string;
  invoice_status?: 'not_invoiced' | 'invoiced' | 'partially_paid' | 'paid' | 'overdue';
}

// Trip/Dispatch types
export interface Trip {
  id: string;
  company_id: string;
  load_id: string;
  driver_id: string;
  vehicle_id: string;
  trailer_id?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  start_time?: string;
  end_time?: string;
  estimated_start_time: string;
  estimated_end_time: string;
  actual_start_time?: string;
  actual_end_time?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  route?: {
    waypoints: Array<{
      latitude: number;
      longitude: number;
      address?: string;
      type: 'start' | 'stop' | 'end';
    }>;
    polyline?: string;
    estimated_distance: number;
    estimated_duration: number;
    actual_distance?: number;
    actual_duration?: number;
  };
  current_location?: {
    latitude: number;
    longitude: number;
    address?: string;
    timestamp: string;
  };
  notes?: string;
  expenses?: Array<{
    id: string;
    type: 'fuel' | 'toll' | 'maintenance' | 'food' | 'lodging' | 'other';
    amount: number;
    currency: 'USD' | 'CAD' | 'MXN' | 'EUR';
    description?: string;
    receipt_url?: string;
    timestamp: string;
    location?: string;
    approved: boolean;
    approved_by?: string;
    approved_at?: string;
  }>;
  events?: Array<{
    id: string;
    type: 'departure' | 'arrival' | 'delay' | 'rest' | 'fuel' | 'inspection' | 'maintenance' | 'other';
    timestamp: string;
    location?: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    description?: string;
    created_by: string;
  }>;
}

// Invoice/Accounting types
export interface Invoice {
  id: string;
  company_id: string;
  customer_id: string;
  load_id: string;
  trip_id?: string;
  invoice_number: string;
  status: 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'void';
  issue_date: string;
  due_date: string;
  amount: number;
  currency: 'USD' | 'CAD' | 'MXN' | 'EUR';
  tax_amount?: number;
  discount_amount?: number;
  total_amount: number;
  notes?: string;
  terms?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  sent_at?: string;
  sent_by?: string;
  paid_at?: string;
  payment_method?: 'check' | 'credit_card' | 'ach' | 'wire' | 'cash' | 'other';
  payment_reference?: string;
  factored: boolean;
  factor_id?: string;
  factoring_fee?: number;
  line_items: Array<{
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
    tax_rate?: number;
    tax_amount?: number;
  }>;
  payments?: Array<{
    id: string;
    amount: number;
    payment_date: string;
    payment_method: 'check' | 'credit_card' | 'ach' | 'wire' | 'cash' | 'other';
    reference_number?: string;
    notes?: string;
  }>;
  documents?: Array<{
    id: string;
    type: 'invoice' | 'receipt' | 'proof_of_delivery' | 'other';
    url: string;
    name: string;
    uploaded_at: string;
    uploaded_by: string;
  }>;
}

// Maintenance records
export interface Maintenance {
  id: string;
  company_id: string;
  vehicle_id: string;
  type: 'preventive' | 'repair' | 'inspection' | 'other';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  odometer: number;
  start_date: string;
  end_date?: string;
  cost?: number;
  currency?: 'USD' | 'CAD' | 'MXN' | 'EUR';
  vendor_id?: string;
  vendor_name?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  completed_by?: string;
  notes?: string;
  parts?: Array<{
    id: string;
    name: string;
    part_number?: string;
    quantity: number;
    unit_cost?: number;
    total_cost?: number;
  }>;
  documents?: Array<{
    id: string;
    type: 'work_order' | 'invoice' | 'receipt' | 'inspection' | 'other';
    url: string;
    name: string;
    uploaded_at: string;
    uploaded_by: string;
  }>;
  issues_resolved?: string[];
}

// Safety records
export interface SafetyRecord {
  id: string;
  company_id: string;
  type: 'inspection' | 'incident' | 'violation' | 'training' | 'certification' | 'other';
  driver_id?: string;
  vehicle_id?: string;
  date: string;
  location?: string;
  description: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  created_by: string;
  resolved_by?: string;
  resolved_at?: string;
  resolution_notes?: string;
  documents?: Array<{
    id: string;
    type: 'report' | 'photo' | 'certificate' | 'other';
    url: string;
    name: string;
    uploaded_at: string;
    uploaded_by: string;
  }>;
  follow_up_actions?: Array<{
    id: string;
    description: string;
    due_date: string;
    assigned_to: string;
    status: 'pending' | 'in_progress' | 'completed';
    completed_at?: string;
    completed_by?: string;
    notes?: string;
  }>;
}

// Vendor types
export interface Vendor {
  id: string;
  company_id: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  vendor_type: 'maintenance' | 'fuel' | 'parts' | 'service' | 'insurance' | 'other';
  tax_id?: string;
  status: 'active' | 'inactive';
  payment_terms?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  website?: string;
  rating?: number;
}

// Expense types
export interface Expense {
  id: string;
  company_id: string;
  trip_id?: string;
  driver_id?: string;
  vehicle_id?: string;
  vendor_id?: string;
  expense_type: 'fuel' | 'toll' | 'maintenance' | 'repair' | 'parts' | 'food' | 'lodging' | 'permit' | 'other';
  amount: number;
  currency: 'USD' | 'CAD' | 'MXN' | 'EUR';
  date: string;
  description?: string;
  location?: string;
  odometer?: number;
  gallons?: number;
  price_per_gallon?: number;
  receipt_url?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  created_at: string;
  updated_at: string;
  submitted_by: string;
  approved_by?: string;
  approved_at?: string;
  payment_date?: string;
  payment_method?: 'cash' | 'credit_card' | 'debit_card' | 'company_card' | 'eft' | 'other';
  payment_reference?: string;
  notes?: string;
  tax_amount?: number;
  reimbursable: boolean;
  category?: string;
  tags?: string[];
}

// Database tables
export type Tables = {
  users: User;
  companies: Company;
  branches: Branch;
  vehicles: Vehicle;
  drivers: Driver;
  customers: Customer;
  loads: Load;
  trips: Trip;
  invoices: Invoice;
  maintenance: Maintenance;
  safety_records: SafetyRecord;
  vendors: Vendor;
  expenses: Expense;
}

// Supabase functions and helpers
export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

// Export default Supabase instance
export default supabase;
