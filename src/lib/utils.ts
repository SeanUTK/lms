import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, formatDistance as dateFormatDistance, differenceInDays } from "date-fns";

/**
 * Tailwind CSS class merging utility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Date and Time Utilities
 */
export const formatDate = (date: string | Date, formatString: string = "MMM dd, yyyy") => {
  if (!date) return "N/A";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatString);
};

export const formatDateTime = (date: string | Date) => {
  if (!date) return "N/A";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMM dd, yyyy h:mm a");
};

export const formatTime = (date: string | Date) => {
  if (!date) return "N/A";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "h:mm a");
};

export const formatTimeAgo = (date: string | Date) => {
  if (!date) return "N/A";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return dateFormatDistance(dateObj, new Date(), { addSuffix: true });
};

export const isDateExpiring = (date: string | Date, daysThreshold: number = 30) => {
  if (!date) return false;
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const daysRemaining = differenceInDays(dateObj, new Date());
  return daysRemaining <= daysThreshold && daysRemaining >= 0;
};

export const isDateExpired = (date: string | Date) => {
  if (!date) return false;
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return dateObj < new Date();
};

/**
 * Currency and Number Formatting
 */
export const formatCurrency = (
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
) => {
  if (amount === undefined || amount === null) return "N/A";
  
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (
  number: number,
  options: Intl.NumberFormatOptions = {}
) => {
  if (number === undefined || number === null) return "N/A";
  
  return new Intl.NumberFormat("en-US", options).format(number);
};

export const formatPercentage = (value: number) => {
  if (value === undefined || value === null) return "N/A";
  
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

export const formatDistance = (
  distance: number,
  unit: "mi" | "km" = "mi"
) => {
  if (distance === undefined || distance === null) return "N/A";
  
  return `${formatNumber(distance, { maximumFractionDigits: 1 })} ${unit}`;
};

export const formatWeight = (
  weight: number,
  unit: "lb" | "kg" = "lb"
) => {
  if (weight === undefined || weight === null) return "N/A";
  
  return `${formatNumber(weight)} ${unit}`;
};

/**
 * Status Formatting and Display Utilities
 */
export const getLoadStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    assigned: "bg-blue-100 text-blue-800",
    in_transit: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    completed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
  };
  
  return statusMap[status] || "bg-gray-100 text-gray-800";
};

export const getVehicleStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    maintenance: "bg-orange-100 text-orange-800",
    out_of_service: "bg-red-100 text-red-800",
  };
  
  return statusMap[status] || "bg-gray-100 text-gray-800";
};

export const getDriverStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    on_duty: "bg-blue-100 text-blue-800",
    off_duty: "bg-purple-100 text-purple-800",
    driving: "bg-indigo-100 text-indigo-800",
    suspended: "bg-red-100 text-red-800",
  };
  
  return statusMap[status] || "bg-gray-100 text-gray-800";
};

export const getInvoiceStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    partially_paid: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
    void: "bg-slate-100 text-slate-800",
  };
  
  return statusMap[status] || "bg-gray-100 text-gray-800";
};

export const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getModuleColor = (module: string) => {
  const moduleMap: Record<string, string> = {
    dispatch: "var(--dispatch)",
    accounting: "var(--accounting)",
    fleet: "var(--fleet)",
    safety: "var(--safety)",
    resources: "var(--resources)",
  };
  
  return moduleMap[module] || "var(--primary)";
};

/**
 * String and Text Utilities
 */
export const truncateText = (text: string, maxLength: number = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const getInitials = (name: string) => {
  if (!name) return "??";
  
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const formatPhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) return "";
  
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, "");
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
  }
  
  // Return original if not a standard format
  return phoneNumber;
};

/**
 * Map and Location Utilities
 */
export const formatAddress = (
  address: string,
  city: string,
  state: string,
  zipCode: string,
  country: string = "USA"
) => {
  return `${address}, ${city}, ${state} ${zipCode}, ${country}`;
};

export const formatCoordinates = (lat: number, lng: number) => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

export const calculateDistanceValue = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: "mi" | "km" = "mi"
) => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }
  
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515; // Distance in miles
  
  if (unit === "km") {
    dist = dist * 1.609344; // Convert to kilometers
  }
  
  return dist;
};

/**
 * Data Validation and Transformation
 */
export const isValidEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidPhoneNumber = (phone: string) => {
  const re = /^\+?[1-9]\d{9,14}$/;
  return re.test(phone.replace(/\D/g, ""));
};

export const isValidVIN = (vin: string) => {
  // Basic VIN validation (17 alphanumeric characters, excluding I, O, Q)
  const re = /^[A-HJ-NPR-Z0-9]{17}$/i;
  return re.test(vin);
};

export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

/**
 * File and Document Utilities
 */
export const getFileExtension = (filename: string) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

export const getFileIcon = (filename: string) => {
  const ext = getFileExtension(filename).toLowerCase();
  const iconMap: Record<string, string> = {
    pdf: "file-pdf",
    doc: "file-text",
    docx: "file-text",
    xls: "file-spreadsheet",
    xlsx: "file-spreadsheet",
    csv: "file-spreadsheet",
    jpg: "image",
    jpeg: "image",
    png: "image",
    gif: "image",
    txt: "file-text",
  };
  
  return iconMap[ext] || "file";
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Business Logic Utilities
 */
export const calculateTotalRevenue = (invoices: any[]) => {
  return invoices.reduce((total, invoice) => total + (invoice.total_amount || 0), 0);
};

export const calculateFuelEfficiency = (
  distance: number,
  gallons: number,
  unit: "mpg" | "kpl" = "mpg"
) => {
  if (!distance || !gallons || gallons === 0) return 0;
  return unit === "mpg" ? distance / gallons : distance / gallons / 1.609344 * 0.425144;
};

export const calculatePayroll = (
  rate: number,
  miles: number,
  deductions: number = 0,
  rateType: "per_mile" | "percentage" | "flat" = "per_mile",
  grossAmount: number = 0
) => {
  let pay = 0;
  
  switch (rateType) {
    case "per_mile":
      pay = rate * miles;
      break;
    case "percentage":
      pay = (rate / 100) * grossAmount;
      break;
    case "flat":
      pay = rate;
      break;
    default:
      pay = 0;
  }
  
  return Math.max(0, pay - deductions);
};

export const calculateInvoiceTotal = (
  amount: number,
  taxRate: number = 0,
  discountAmount: number = 0
) => {
  const taxAmount = amount * (taxRate / 100);
  return amount + taxAmount - discountAmount;
};

/**
 * Random ID and Code Generation
 */
export const generateId = (prefix: string = "") => {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`;
};

export const generateReferenceNumber = (prefix: string = "TMS") => {
  const timestamp = Date.now().toString().substring(6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Array and Object Utilities
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    result[groupKey] = result[groupKey] || [];
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, direction: "asc" | "desc" = "asc") => {
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    
    if (valueA < valueB) return direction === "asc" ? -1 : 1;
    if (valueA > valueB) return direction === "asc" ? 1 : -1;
    return 0;
  });
};

export const filterBy = <T>(array: T[], key: keyof T, value: any): T[] => {
  return array.filter(item => item[key] === value);
};

export const searchInArray = <T>(array: T[], keys: (keyof T)[], searchTerm: string): T[] => {
  if (!searchTerm) return array;
  
  const lowercasedTerm = searchTerm.toLowerCase();
  
  return array.filter(item => {
    return keys.some(key => {
      const value = item[key];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(lowercasedTerm);
    });
  });
};

/**
 * Browser and Device Utilities
 */
export const isMobile = () => {
  return window.innerWidth <= 768;
};

export const isTablet = () => {
  return window.innerWidth > 768 && window.innerWidth <= 1024;
};

export const isDesktop = () => {
  return window.innerWidth > 1024;
};

export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  let browserName = "Unknown";
  
  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "Chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "Firefox";
  } else if (userAgent.match(/safari/i)) {
    browserName = "Safari";
  } else if (userAgent.match(/opr\//i)) {
    browserName = "Opera";
  } else if (userAgent.match(/edg/i)) {
    browserName = "Edge";
  }
  
  return browserName;
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy text: ", err);
    return false;
  }
};

/**
 * Color Utilities
 */
export const hexToRgb = (hex: string) => {
  // Remove # if present
  hex = hex.replace(/^#/, "");
  
  // Parse hex values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return { r, g, b };
};

export const rgbToHex = (r: number, g: number, b: number) => {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

export const getContrastColor = (hexColor: string) => {
  const { r, g, b } = hexToRgb(hexColor);
  
  // Calculate luminance - https://www.w3.org/TR/WCAG20-TECHS/G17.html
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  
  return luminance > 128 ? "#000000" : "#FFFFFF";
};

/**
 * Error Handling Utilities
 */
export const handleApiError = (error: any) => {
  console.error("API Error:", error);
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      status: error.response.status,
      message: error.response.data?.message || "An error occurred with the response",
      data: error.response.data,
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      status: 0,
      message: "No response received from server",
      data: null,
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      status: 0,
      message: error.message || "An unexpected error occurred",
      data: null,
    };
  }
};

export const isSupabaseError = (error: any) => {
  return error && error.code && error.message && error.details;
};

export const formatSupabaseError = (error: any) => {
  if (!isSupabaseError(error)) return "An unexpected error occurred";
  
  // Common Supabase error codes
  const errorMessages: Record<string, string> = {
    "auth/invalid-email": "The email address is invalid",
    "auth/user-disabled": "This user account has been disabled",
    "auth/user-not-found": "No user found with this email address",
    "auth/wrong-password": "Incorrect password",
    "auth/email-already-in-use": "This email is already in use",
    "auth/weak-password": "The password is too weak",
    "auth/invalid-credential": "Invalid login credentials",
    "auth/account-exists-with-different-credential": "An account already exists with the same email address",
    "auth/operation-not-allowed": "This operation is not allowed",
    "auth/too-many-requests": "Too many unsuccessful login attempts, please try again later",
    "auth/network-request-failed": "A network error occurred, please check your connection",
  };
  
  return errorMessages[error.code] || error.message || "An error occurred";
};
