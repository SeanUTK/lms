import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { 
  BarChart3, 
  TruckIcon, 
  Users, 
  FileText, 
  DollarSign, 
  Package, 
  Calendar, 
  ArrowRight, 
  ArrowUpRight, 
  ArrowDownRight,
  Percent,
  Clock,
  Route,
  ChevronDown,
  CreditCard,
  Wallet,
  FileCheck,
  Building2,
  AlertTriangle
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Type declaration for Vite environment variables
interface ImportMetaEnv {
  VITE_MAPBOX_ACCESS_TOKEN: string;
  VITE_MAPBOX_STYLE?: string;
  [key: string]: string | undefined;
}

// Augment the ImportMeta interface
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Mock data for the dashboard
const mockRevenueData = [
  { month: "Jan", revenue: 125000, expenses: 95000, profit: 30000 },
  { month: "Feb", revenue: 140000, expenses: 100000, profit: 40000 },
  { month: "Mar", revenue: 155000, expenses: 110000, profit: 45000 },
  { month: "Apr", revenue: 170000, expenses: 120000, profit: 50000 },
  { month: "May", revenue: 185000, expenses: 130000, profit: 55000 },
  { month: "Jun", revenue: 200000, expenses: 140000, profit: 60000 },
];

const mockLoadsByType = [
  { name: "Dry Van", value: 65 },
  { name: "Refrigerated", value: 20 },
  { name: "Flatbed", value: 10 },
  { name: "Specialized", value: 5 },
];

const mockActiveTrips = [
  {
    id: "TRIP-78901",
    driver: "John Smith",
    origin: "Chicago, IL",
    destination: "Denver, CO",
    status: "in_transit",
    progress: 65,
    eta: "2025-06-02T14:30:00",
  },
  {
    id: "TRIP-78902",
    driver: "Maria Garcia",
    origin: "Atlanta, GA",
    destination: "Miami, FL",
    status: "in_transit",
    progress: 40,
    eta: "2025-06-03T10:15:00",
  },
  {
    id: "TRIP-78903",
    driver: "Robert Johnson",
    origin: "Dallas, TX",
    destination: "Phoenix, AZ",
    status: "in_transit",
    progress: 25,
    eta: "2025-06-03T16:45:00",
  },
];

const mockActiveReceivables = [
  {
    id: "INV-45678",
    customer: "Acme Logistics",
    amount: 3250.75,
    dueDate: "2025-06-10",
    status: "pending",
    age: 5,
  },
  {
    id: "INV-45679",
    customer: "Global Transport Inc.",
    amount: 4780.50,
    dueDate: "2025-06-15",
    status: "pending",
    age: 3,
  },
  {
    id: "INV-45680",
    customer: "FastFreight Solutions",
    amount: 2890.25,
    dueDate: "2025-06-08",
    status: "partially_paid",
    age: 8,
  },
];

const mockDrivers = [
  {
    id: "DRV-1234",
    name: "John Smith",
    status: "driving",
    location: "Kansas City, MO",
    hoursAvailable: 6.5,
  },
  {
    id: "DRV-1235",
    name: "Maria Garcia",
    status: "on_duty",
    location: "Jacksonville, FL",
    hoursAvailable: 8,
  },
  {
    id: "DRV-1236",
    name: "Robert Johnson",
    status: "off_duty",
    location: "Phoenix, AZ",
    hoursAvailable: 10,
  },
];

const mockEquipment = [
  {
    id: "TRK-5678",
    type: "Truck",
    model: "Freightliner Cascadia",
    status: "active",
    location: "Kansas City, MO",
    driver: "John Smith",
  },
  {
    id: "TRL-9012",
    type: "Trailer",
    model: "Great Dane Dry Van",
    status: "active",
    location: "Jacksonville, FL",
    driver: "Maria Garcia",
  },
  {
    id: "TRK-5679",
    type: "Truck",
    model: "Peterbilt 579",
    status: "maintenance",
    location: "Denver, CO",
    driver: "Unassigned",
  },
];

// US States with mock load data
const mockStateLoads: Record<string, number> = {
  "AL": 12, "AK": 3, "AZ": 18, "AR": 7, "CA": 45, "CO": 15, "CT": 8, "DE": 2,
  "FL": 35, "GA": 25, "HI": 1, "ID": 5, "IL": 28, "IN": 17, "IA": 9, "KS": 8,
  "KY": 11, "LA": 14, "ME": 4, "MD": 13, "MA": 16, "MI": 22, "MN": 12, "MS": 6,
  "MO": 15, "MT": 4, "NE": 6, "NV": 9, "NH": 3, "NJ": 19, "NM": 7, "NY": 33,
  "NC": 21, "ND": 2, "OH": 26, "OK": 10, "OR": 11, "PA": 29, "RI": 2, "SC": 13,
  "SD": 3, "TN": 17, "TX": 52, "UT": 8, "VT": 2, "VA": 18, "WA": 19, "WV": 5,
  "WI": 14, "WY": 3
};

// Color scale for the map
const getColorForValue = (value: number) => {
  if (value > 40) return "#0f766e"; // dark teal
  if (value > 30) return "#14b8a6"; // teal
  if (value > 20) return "#2dd4bf"; // light teal
  if (value > 10) return "#5eead4"; // lighter teal
  if (value > 5) return "#99f6e4"; // very light teal
  return "#ccfbf1"; // almost white teal
};

const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<"daily" | "monthly">("daily");
  const [activeTab, setActiveTab] = useState("business");
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  
  useEffect(() => {
    // Get Mapbox token from environment variables
    const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';
    const mapboxStyle = import.meta.env.VITE_MAPBOX_STYLE || 'mapbox://styles/mapbox/light-v11';
    
    // Check if token exists and mapContainer is available
    if (!mapboxToken) {
      setMapError("Mapbox token is missing. Please add VITE_MAPBOX_ACCESS_TOKEN to your environment variables.");
      return;
    }
    
    if (!mapContainer.current) {
      return;
    }
    
    try {
      // Initialize Mapbox
      mapboxgl.accessToken = mapboxToken;
      
      if (!map.current) {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: mapboxStyle,
          center: [-98.5795, 39.8283], // Center of the US
          zoom: 3,
          interactive: true,
        });
        
        // Add event listeners with proper error handling
        map.current.on('load', () => {
          setMapLoaded(true);
          
          try {
            // Add US states layer
            if (map.current) {
              // Add source for US states
              map.current.addSource('states', {
                type: 'geojson',
                data: 'https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson'
              });
              
              // Add fill layer
              map.current.addLayer({
                id: 'states-fill',
                type: 'fill',
                source: 'states',
                layout: {},
                paint: {
                  'fill-color': [
                    'match',
                    ['get', 'STATE_ABBR'],
                    'CA', getColorForValue(mockStateLoads['CA'] || 0),
                    'TX', getColorForValue(mockStateLoads['TX'] || 0),
                    'NY', getColorForValue(mockStateLoads['NY'] || 0),
                    'FL', getColorForValue(mockStateLoads['FL'] || 0),
                    'IL', getColorForValue(mockStateLoads['IL'] || 0),
                    'PA', getColorForValue(mockStateLoads['PA'] || 0),
                    'OH', getColorForValue(mockStateLoads['OH'] || 0),
                    'GA', getColorForValue(mockStateLoads['GA'] || 0),
                    'NC', getColorForValue(mockStateLoads['NC'] || 0),
                    'MI', getColorForValue(mockStateLoads['MI'] || 0),
                    'NJ', getColorForValue(mockStateLoads['NJ'] || 0),
                    'VA', getColorForValue(mockStateLoads['VA'] || 0),
                    'WA', getColorForValue(mockStateLoads['WA'] || 0),
                    'AZ', getColorForValue(mockStateLoads['AZ'] || 0),
                    'MA', getColorForValue(mockStateLoads['MA'] || 0),
                    'TN', getColorForValue(mockStateLoads['TN'] || 0),
                    'IN', getColorForValue(mockStateLoads['IN'] || 0),
                    'MO', getColorForValue(mockStateLoads['MO'] || 0),
                    'MD', getColorForValue(mockStateLoads['MD'] || 0),
                    'CO', getColorForValue(mockStateLoads['CO'] || 0),
                    'WI', getColorForValue(mockStateLoads['WI'] || 0),
                    'MN', getColorForValue(mockStateLoads['MN'] || 0),
                    'SC', getColorForValue(mockStateLoads['SC'] || 0),
                    'AL', getColorForValue(mockStateLoads['AL'] || 0),
                    'LA', getColorForValue(mockStateLoads['LA'] || 0),
                    'KY', getColorForValue(mockStateLoads['KY'] || 0),
                    'OR', getColorForValue(mockStateLoads['OR'] || 0),
                    'OK', getColorForValue(mockStateLoads['OK'] || 0),
                    'CT', getColorForValue(mockStateLoads['CT'] || 0),
                    'IA', getColorForValue(mockStateLoads['IA'] || 0),
                    'MS', getColorForValue(mockStateLoads['MS'] || 0),
                    'AR', getColorForValue(mockStateLoads['AR'] || 0),
                    'KS', getColorForValue(mockStateLoads['KS'] || 0),
                    'UT', getColorForValue(mockStateLoads['UT'] || 0),
                    'NV', getColorForValue(mockStateLoads['NV'] || 0),
                    'NM', getColorForValue(mockStateLoads['NM'] || 0),
                    'WV', getColorForValue(mockStateLoads['WV'] || 0),
                    'NE', getColorForValue(mockStateLoads['NE'] || 0),
                    'ID', getColorForValue(mockStateLoads['ID'] || 0),
                    'HI', getColorForValue(mockStateLoads['HI'] || 0),
                    'ME', getColorForValue(mockStateLoads['ME'] || 0),
                    'NH', getColorForValue(mockStateLoads['NH'] || 0),
                    'RI', getColorForValue(mockStateLoads['RI'] || 0),
                    'MT', getColorForValue(mockStateLoads['MT'] || 0),
                    'DE', getColorForValue(mockStateLoads['DE'] || 0),
                    'SD', getColorForValue(mockStateLoads['SD'] || 0),
                    'ND', getColorForValue(mockStateLoads['ND'] || 0),
                    'AK', getColorForValue(mockStateLoads['AK'] || 0),
                    'VT', getColorForValue(mockStateLoads['VT'] || 0),
                    'WY', getColorForValue(mockStateLoads['WY'] || 0),
                    '#ccfbf1' // default color
                  ],
                  'fill-opacity': 0.8
                }
              });
              
              // Add outline layer
              map.current.addLayer({
                id: 'states-outline',
                type: 'line',
                source: 'states',
                layout: {},
                paint: {
                  'line-color': '#ffffff',
                  'line-width': 1
                }
              });
              
              // Add hover effect
              map.current.on('mouseenter', 'states-fill', () => {
                if (map.current) {
                  map.current.getCanvas().style.cursor = 'pointer';
                }
              });
              
              map.current.on('mouseleave', 'states-fill', () => {
                if (map.current) {
                  map.current.getCanvas().style.cursor = '';
                }
              });
              
              // Add click event for state details
              map.current.on('click', 'states-fill', (e) => {
                if (e.features && e.features[0] && e.features[0].properties) {
                  const properties = e.features[0].properties;
                  const stateName = properties.STATE_NAME;
                  const stateAbbr = properties.STATE_ABBR;
                  
                  if (stateName && stateAbbr && map.current) {
                    const loadCount = mockStateLoads[stateAbbr as string] || 0;
                    
                    new mapboxgl.Popup()
                      .setLngLat(e.lngLat)
                      .setHTML(`
                        <strong>${stateName}</strong><br/>
                        <span>Booked Loads: ${loadCount}</span>
                      `)
                      .addTo(map.current);
                  }
                }
              });
            }
          } catch (error) {
            console.error("Error adding map layers:", error);
            setMapError("Failed to load map data. Please try refreshing the page.");
          }
        });
        
        map.current.on('error', (e) => {
          console.error("Mapbox error:", e);
          setMapError("An error occurred while loading the map. Please check your connection.");
        });
      }
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Failed to initialize map. Please check your Mapbox configuration.");
    }
    
    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  
  // Get status color for trip status
  const getTripStatusColor = (status: string) => {
    switch (status) {
      case "in_transit":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "planned":
        return "bg-amber-100 text-amber-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Get status color for driver status
  const getDriverStatusColor = (status: string) => {
    switch (status) {
      case "driving":
        return "bg-blue-100 text-blue-800";
      case "on_duty":
        return "bg-green-100 text-green-800";
      case "off_duty":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Get status color for equipment status
  const getEquipmentStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-amber-100 text-amber-800";
      case "out_of_service":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Format status text
  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  
  // COLORS for charts
  const COLORS = {
    revenue: "hsl(var(--primary))",
    expenses: "hsl(var(--muted-foreground) / 0.7)",
    profit: "hsl(var(--accounting))",
    pieColors: ["#14b8a6", "#0d9488", "#0f766e", "#115e59"]
  };
  
  // Map error fallback component
  const MapErrorFallback = ({ error }: { error: string }) => (
    <div className="flex flex-col items-center justify-center h-[400px] bg-muted/20 rounded-lg border border-dashed border-muted-foreground/50 p-6 text-center">
      <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
      <h3 className="text-lg font-medium mb-2">Map Could Not Be Loaded</h3>
      <p className="text-muted-foreground max-w-md mb-4">{error}</p>
      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
        Retry Loading Map
      </Button>
    </div>
  );
  
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">Welcome to TMS Pro</h2>
              <p className="text-muted-foreground mt-1">
                Your strategic command center for trucking operations
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="default" size="sm" className="gap-1">
                <Package className="h-4 w-4" />
                <span>New Load</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Route className="h-4 w-4" />
                <span>Plan Trip</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Date Range Selector and Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="business">Business Overview</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="fleet">Fleet</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">View:</div>
          <div className="flex rounded-md border overflow-hidden">
            <button
              className={`px-3 py-1.5 text-sm ${dateRange === "daily" ? "bg-primary text-white" : "bg-background"}`}
              onClick={() => setDateRange("daily")}
            >
              Daily
            </button>
            <button
              className={`px-3 py-1.5 text-sm ${dateRange === "monthly" ? "bg-primary text-white" : "bg-background"}`}
              onClick={() => setDateRange("monthly")}
            >
              Monthly
            </button>
          </div>
          
          <div className="flex items-center border rounded-md px-3 py-1.5">
            <span className="text-sm">05/20/2025 - 05/27/2025</span>
            <Calendar className="ml-2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats and Charts */}
        <div className="lg:col-span-1 space-y-6">
          <TabsContent value="business" className="space-y-6 mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Financial Overview</CardTitle>
                <CardDescription>Revenue, expenses, and profit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis 
                        tickFormatter={(value) => `$${value/1000}k`} 
                        width={60}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, undefined]}
                        labelFormatter={(label) => `${label} 2025`}
                      />
                      <Bar dataKey="revenue" fill={COLORS.revenue} name="Revenue" />
                      <Bar dataKey="expenses" fill={COLORS.expenses} name="Expenses" />
                      <Bar dataKey="profit" fill={COLORS.profit} name="Profit" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="grid grid-cols-3 w-full gap-2 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="text-lg font-medium">{formatCurrency(975000)}</p>
                    <Badge variant="success" className="mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      12.4%
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expenses</p>
                    <p className="text-lg font-medium">{formatCurrency(695000)}</p>
                    <Badge variant="warning" className="mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      8.2%
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Profit</p>
                    <p className="text-lg font-medium">{formatCurrency(280000)}</p>
                    <Badge variant="success" className="mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      15.6%
                    </Badge>
                  </div>
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Load Distribution</CardTitle>
                <CardDescription>Shipment types breakdown</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[200px] w-full max-w-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockLoadsByType}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {mockLoadsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS.pieColors[index % COLORS.pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, undefined]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="pt-0 justify-center">
                <div className="flex flex-wrap justify-center gap-2">
                  {mockLoadsByType.map((type, index) => (
                    <Badge 
                      key={type.name} 
                      variant="outline" 
                      className="flex items-center gap-1.5"
                    >
                      <span 
                        className="h-2 w-2 rounded-full" 
                        style={{ backgroundColor: COLORS.pieColors[index % COLORS.pieColors.length] }} 
                      />
                      {type.name}
                    </Badge>
                  ))}
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="operations" className="space-y-6 mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">On-Time Performance</CardTitle>
                <CardDescription>Delivery reliability trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { month: "Jan", onTime: 92, late: 8 },
                      { month: "Feb", onTime: 94, late: 6 },
                      { month: "Mar", onTime: 91, late: 9 },
                      { month: "Apr", onTime: 95, late: 5 },
                      { month: "May", onTime: 97, late: 3 },
                      { month: "Jun", onTime: 96, late: 4 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis 
                        tickFormatter={(value) => `${value}%`} 
                        width={40}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, undefined]}
                        labelFormatter={(label) => `${label} 2025`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="onTime" 
                        name="On-Time" 
                        stroke="hsl(var(--dispatch))" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="late" 
                        name="Late" 
                        stroke="hsl(var(--destructive))" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="w-full flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Current On-Time Rate</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-medium">96%</p>
                      <Badge variant="success" className="ml-2">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        2.1%
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/reports/performance">
                      <span>View Details</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="fleet" className="space-y-6 mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Fleet Utilization</CardTitle>
                <CardDescription>Equipment usage statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { day: "Mon", trucks: 85, trailers: 78 },
                      { day: "Tue", trucks: 88, trailers: 82 },
                      { day: "Wed", trucks: 92, trailers: 85 },
                      { day: "Thu", trucks: 90, trailers: 83 },
                      { day: "Fri", trucks: 94, trailers: 87 },
                      { day: "Sat", trucks: 75, trailers: 68 },
                      { day: "Sun", trucks: 65, trailers: 60 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" />
                      <YAxis 
                        tickFormatter={(value) => `${value}%`} 
                        width={40}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, undefined]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="trucks" 
                        name="Trucks" 
                        stroke="hsl(var(--fleet))" 
                        fill="hsl(var(--fleet-light))" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="trailers" 
                        name="Trailers" 
                        stroke="hsl(var(--fleet) / 0.7)" 
                        fill="hsl(var(--fleet-light) / 0.7)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="w-full grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Avg. Truck Utilization</p>
                    <div className="flex items-center">
                      <p className="text-xl font-medium">84%</p>
                      <Badge variant="success" className="ml-2">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        3.5%
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Avg. Trailer Utilization</p>
                    <div className="flex items-center">
                      <p className="text-xl font-medium">77%</p>
                      <Badge variant="success" className="ml-2">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        2.8%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="safety" className="space-y-6 mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Safety Performance</CardTitle>
                <CardDescription>Incidents and compliance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">DOT Compliance Score</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-safety rounded-full" 
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Driver Qualification Files</span>
                      <span className="text-sm font-medium">98%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-safety rounded-full" 
                        style={{ width: "98%" }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Vehicle Inspections</span>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-safety rounded-full" 
                        style={{ width: "87%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 flex-col items-start">
                <div className="flex justify-between w-full mb-2">
                  <span className="text-sm font-medium">Recent Incidents</span>
                  <Badge variant="outline">Last 30 days</Badge>
                </div>
                <div className="w-full space-y-2">
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                    <div className="flex items-center">
                      <Badge variant="warning" className="mr-2">Minor</Badge>
                      <span className="text-sm">Trailer door damage</span>
                    </div>
                    <span className="text-xs text-muted-foreground">May 15, 2025</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                    <div className="flex items-center">
                      <Badge variant="info" className="mr-2">Report</Badge>
                      <span className="text-sm">Roadside inspection passed</span>
                    </div>
                    <span className="text-xs text-muted-foreground">May 22, 2025</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
        
        {/* Middle and Right Columns - Map and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map Section */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Booked Loads By Regions</CardTitle>
                  <CardDescription>Geographic distribution of current loads</CardDescription>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <span>Total Loads:</span>
                  <span className="font-semibold">{Object.values(mockStateLoads).reduce((a, b) => a + b, 0)}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 pt-4 relative">
              {mapError ? (
                <MapErrorFallback error={mapError} />
              ) : (
                <div 
                  ref={mapContainer} 
                  className="h-[400px] w-full rounded-b-lg overflow-hidden"
                />
              )}
              
              {!mapLoaded && !mapError && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <span className="mt-2 text-sm text-muted-foreground">Loading map...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Activity Counters */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="card-hover">
              <CardContent className="p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Active Trips</h3>
                  <Route className="h-4 w-4 text-dispatch" />
                </div>
                <div className="text-2xl font-bold">{mockActiveTrips.length}</div>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                  <span>12% from last week</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Receivables</h3>
                  <DollarSign className="h-4 w-4 text-accounting" />
                </div>
                <div className="text-2xl font-bold">{formatCurrency(10921.50)}</div>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                  <span>3% from last week</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Statements</h3>
                  <FileText className="h-4 w-4 text-accounting" />
                </div>
                <div className="text-2xl font-bold">12</div>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <span>Due this week</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Drivers</h3>
                  <Users className="h-4 w-4 text-resources" />
                </div>
                <div className="text-2xl font-bold">18</div>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <span>14 active, 4 off-duty</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Equipment</h3>
                  <TruckIcon className="h-4 w-4 text-fleet" />
                </div>
                <div className="text-2xl font-bold">32</div>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <span>28 active, 4 in maintenance</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Contractors</h3>
                  <Building2 className="h-4 w-4 text-resources" />
                </div>
                <div className="text-2xl font-bold">7</div>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                  <span>2 new this month</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Activity Lists */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Active Trips */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Route className="h-5 w-5 mr-2 text-dispatch" />
                    Active Trips
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/dispatch/trips">
                      <span>View All</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActiveTrips.map((trip) => (
                    <div key={trip.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link to={`/dispatch/trips/${trip.id}`} className="font-medium hover:text-primary">
                            {trip.id}
                          </Link>
                          <Badge className={getTripStatusColor(trip.status)}>
                            {formatStatus(trip.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {trip.origin} → {trip.destination}
                        </div>
                        <div className="text-sm">
                          Driver: {trip.driver}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-medium flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          ETA: {formatDate(trip.eta, "MMM d, h:mm a")}
                        </div>
                        <div className="w-24 h-2 bg-muted rounded-full mt-1">
                          <div 
                            className="h-full bg-dispatch rounded-full" 
                            style={{ width: `${trip.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {trip.progress}% complete
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Active Receivables */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-accounting" />
                    Active Receivables
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/accounting/receivables">
                      <span>View All</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActiveReceivables.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link to={`/accounting/receivables/${invoice.id}`} className="font-medium hover:text-primary">
                            {invoice.id}
                          </Link>
                          <Badge 
                            variant={invoice.status === "pending" ? "warning" : "info"}
                          >
                            {formatStatus(invoice.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.customer}
                        </div>
                        <div className="text-sm">
                          Due: {formatDate(invoice.dueDate)}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-lg font-medium">
                          {formatCurrency(invoice.amount)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {invoice.age} days old
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Driver and Equipment Status */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Active Drivers */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Users className="h-5 w-5 mr-2 text-resources" />
                    Driver Status
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/resources/drivers">
                      <span>Manage</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDrivers.map((driver) => (
                    <div key={driver.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link to={`/resources/drivers/${driver.id}`} className="font-medium hover:text-primary">
                            {driver.name}
                          </Link>
                          <Badge className={getDriverStatusColor(driver.status)}>
                            {formatStatus(driver.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {driver.id}
                        </div>
                        <div className="text-sm">
                          Location: {driver.location}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-medium flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Hours Available: {driver.hoursAvailable}
                        </div>
                        <div className="w-24 h-2 bg-muted rounded-full mt-1">
                          <div 
                            className="h-full bg-resources rounded-full" 
                            style={{ width: `${(driver.hoursAvailable / 11) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Equipment Status */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <TruckIcon className="h-5 w-5 mr-2 text-fleet" />
                    Equipment Status
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/fleet/overview">
                      <span>Manage</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEquipment.map((equipment) => (
                    <div key={equipment.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link to={`/fleet/equipment/${equipment.id}`} className="font-medium hover:text-primary">
                            {equipment.id}
                          </Link>
                          <Badge className={getEquipmentStatusColor(equipment.status)}>
                            {formatStatus(equipment.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {equipment.type}: {equipment.model}
                        </div>
                        <div className="text-sm">
                          Location: {equipment.location}
                        </div>
                      </div>
                      <div className="text-sm">
                        {equipment.driver !== "Unassigned" ? (
                          <div className="text-right">
                            <div className="font-medium">Assigned to:</div>
                            <div>{equipment.driver}</div>
                          </div>
                        ) : (
                          <Badge variant="outline">Unassigned</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
