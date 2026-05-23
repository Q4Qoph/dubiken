export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  status: string;
  origin: string;
  eta: string;
  created_at: string;
}

export interface ShipmentMilestone {
  label: string;
  detail: string;
  date: string;
  done: boolean;
  active?: boolean;
}

export interface Shipment {
  id: string;
  tracking_id: string;
  current_status: string;
  origin_city: string;
  destination_city: string;
  vessel: string;
  milestones: ShipmentMilestone[];
}

export interface SourcingRequest {
  id: string;
  request_number: string;
  client_name: string;
  client_initials: string;
  product_title: string;
  description: string;
  destination: string;
  destination_label: string;
  status: 'pending' | 'quoted' | 'shipping' | 'delivered';
  market: 'KE' | 'AE' | 'CN';
  reference_images: string[];
  reference_extra?: number;
  has_document?: boolean;
  created_at: string;
}

export interface SourcingAttachment {
  name: string;
  size: string;
  type: 'pdf' | 'zip';
}

export interface SourcingQuoteReceived {
  id: string;
  unit_price: string;
  shipping_cost?: string;
  lead_time: string;
  shipment: string;
  notes: string;
  official?: boolean;
}

/** Admin request id → user dashboard request id (demo sync) */
export const adminUserSourcingRequestMap: Record<string, string> = {
  'sr-1': 'usr-1',
};

export interface SourcingRequestDetail extends SourcingRequest {
  quantity: string;
  material_grade?: string;
  voltage_range?: string;
  budget_total: string;
  budget_subtitle: string;
  regional_targets: { code: 'KE' | 'AE' | 'CN'; label: string }[];
  attachments: SourcingAttachment[];
  quotes: SourcingQuoteReceived[];
  quote_date?: string;
  destination_port?: string;
  estimated_budget_range?: string;
  requester_location?: string;
  product_image_url?: string;
}

export interface UserSourcingRequestDetail {
  id: string;
  request_number: string;
  title: string;
  origin: string;
  status: string;
  status_variant: 'orange' | 'blue' | 'gray';
  description: string;
  quantity: string;
  voltage_range?: string;
  budget_total: string;
  budget_subtitle: string;
  regional_targets: { code: string; label: string }[];
  attachments: SourcingAttachment[];
  quotes: SourcingQuoteReceived[];
  quote_date?: string;
  destination_port?: string;
  estimated_budget_range?: string;
  delivery_county?: string;
  delivery_address?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price_kes: number;
  compare_at_price_kes: number | null;
  save_percent: number | null;
  origin: string;
  image_url: string;
  images: string[];
  specs: Record<string, string>;
  currency_ke: string;
  currency_ae: string;
  description: string;
  vendor: string;
  category: string;
  review_count: number;
  logistics_note: string;
}

export interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  price_kes: string;
  origin: string;
  image_url: string;
  stock: number;
}

export const mockOrders: Order[] = [
  {
    id: 'ord-1',
    order_number: '88291',
    customer_name: 'John Doe',
    status: 'in_port',
    origin: 'China',
    eta: '2024-10-10',
    created_at: '2024-09-20T10:00:00Z',
  },
  {
    id: 'ord-2',
    order_number: '88274',
    customer_name: 'John Doe',
    status: 'processing',
    origin: 'Dubai',
    eta: '2024-10-18',
    created_at: '2024-09-18T14:30:00Z',
  },
  {
    id: 'ord-3',
    order_number: '88102',
    customer_name: 'John Doe',
    status: 'dispatched',
    origin: 'China',
    eta: '2024-10-05',
    created_at: '2024-09-15T09:00:00Z',
  },
  {
    id: 'ord-4',
    order_number: '88056',
    customer_name: 'John Doe',
    status: 'delivered',
    origin: 'Kenya',
    eta: '2024-09-01',
    created_at: '2024-08-20T11:00:00Z',
  },
  {
    id: 'ord-5',
    order_number: '87990',
    customer_name: 'John Doe',
    status: 'confirmed',
    origin: 'China',
    eta: '2024-11-02',
    created_at: '2024-09-10T08:00:00Z',
  },
];

export const mockShipments: Shipment[] = [
  {
    id: 'shp-1',
    tracking_id: 'DBK-99281',
    current_status: 'in_transit',
    origin_city: 'Guangzhou',
    destination_city: 'Mombasa',
    vessel: 'MV Enterprise',
    milestones: [
      { label: 'Order Confirmed', detail: 'Warehouse: Guangzhou, CN', date: 'Sep 24', done: true },
      { label: 'Customs Clearance', detail: 'Port of Nansha', date: 'Sep 28', done: true },
      { label: 'In Transit (Sea)', detail: 'Vessel: MV Enterprise', date: 'Oct 01', done: true, active: true },
      { label: 'Arrival at Mombasa', detail: 'Expected: Oct 10', date: 'Oct 10', done: false },
    ],
  },
  {
    id: 'shp-2',
    tracking_id: 'DBK-88291',
    current_status: 'customs',
    origin_city: 'Dubai',
    destination_city: 'Nairobi',
    vessel: 'Air Freight',
    milestones: [
      { label: 'Order Confirmed', detail: 'Jebel Ali Free Zone', date: 'Sep 18', done: true },
      { label: 'Dispatched', detail: 'DXB → NBO', date: 'Sep 22', done: true, active: true },
      { label: 'Customs Clearance', detail: 'JKIA Cargo Terminal', date: 'Sep 26', done: false },
      { label: 'Delivered', detail: 'Expected: Sep 28', date: 'Sep 28', done: false },
    ],
  },
];

const inverterMain =
  'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=900';
const inverterThumb2 =
  'https://images.pexels.com/photos/159397/solar-panel-array-power-sun-159397.jpeg?auto=compress&cs=tinysrgb&w=400';
const inverterThumb3 =
  'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=400';
const inverterThumb4 =
  'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=400';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Hyperion X8 Industrial 3-Phase Solar Inverter (100kW)',
    sku: 'IND-SLR-8802',
    price_kes: 573_750,
    compare_at_price_kes: 648_000,
    save_percent: 11,
    origin: 'CN',
    image_url: inverterMain,
    images: [inverterMain, inverterThumb2, inverterThumb3, inverterThumb4],
    specs: {
      nominalACPower: '100,000 Watts [100kW]',
      maxInputVoltage: '1100 V DC',
      efficiency: '98.5% European Weighted (ETA)',
      coolingSystem: 'Liquid-Cooled (Dual Loop)',
      protectionClass: 'IP66 Outdoor Rated',
      weight: '86 kg (Standard Cabinet)',
      certification: 'CE, IEC 62109, UL1741',
      warranty: '10 Years (Industrial Grade)',
    },
    currency_ke: 'KES 551,250',
    currency_ae: 'AED 15,600',
    description:
      'Industrial-grade three-phase solar inverter for commercial and utility-scale installations.',
  },
  {
    id: '2',
    name: 'LiFePO4 Storage Rack 10kWh',
    sku: 'DBK-BAT-10K',
    price_kes: 378_000,
    compare_at_price_kes: null,
    save_percent: null,
    origin: 'CN',
    image_url: '',
    images: [],
    specs: {},
    currency_ke: 'KES 364,000',
    currency_ae: 'AED 10,280',
    description: 'Modular battery rack for commercial energy storage.',
  },
  {
    id: '3',
    name: 'Tier-1 Monocrystalline Panel 550W',
    sku: 'DBK-PNL-550',
    price_kes: 22_275,
    compare_at_price_kes: 25_515,
    save_percent: 13,
    origin: 'CN',
    image_url:
      'https://images.pexels.com/photos/159397/solar-panel-array-power-sun-159397.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [],
    specs: {},
    currency_ke: 'KES 21,450',
    currency_ae: 'AED 605',
    description: 'High-efficiency monocrystalline solar panel.',
  },
  {
    id: '4',
    name: 'Smart DC Power Optimizer 650W',
    sku: 'DBK-OPT-650',
    price_kes: 6_075,
    compare_at_price_kes: null,
    save_percent: null,
    origin: 'CN',
    image_url:
      'https://images.pexels.com/photos/3921320/pexels-photo-3921320.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [],
    specs: {},
    currency_ke: 'KES 5,850',
    currency_ae: 'AED 165',
    description: 'Module-level power optimizer for string inverters.',
  },
  {
    id: '5',
    name: 'Solar DC Cable 6mm² (100m Roll)',
    sku: 'DBK-CBL-6MM',
    price_kes: 11_475,
    compare_at_price_kes: null,
    save_percent: null,
    origin: 'CN',
    image_url:
      'https://images.pexels.com/photos/2881229/pexels-photo-2881229.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [],
    specs: {},
    currency_ke: 'KES 11,050',
    currency_ae: 'AED 312',
    description: 'UV-resistant DC solar cable, 100m roll.',
  },
];

const refImg1 =
  'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=120';
const refImg2 =
  'https://images.pexels.com/photos/159397/solar-panel-array-power-sun-159397.jpeg?auto=compress&cs=tinysrgb&w=120';
const refImg3 =
  'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=120';
const refImg4 =
  'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=120';

export const mockSourcingRequests: SourcingRequest[] = [
  {
    id: 'sr-1',
    request_number: 'SR-2024-0891',
    client_name: 'Jared Maina',
    client_initials: 'JM',
    product_title: 'Industrial Power Inverters',
    description:
      '50 units of 5KW hybrid solar inverters for commercial installation. Must include MPPT and grid-tie certification.',
    destination: 'Nairobi, KE',
    destination_label: 'Kenya',
    status: 'pending',
    market: 'KE',
    reference_images: [refImg1, refImg2],
    reference_extra: 2,
    created_at: '2024-09-24T08:00:00Z',
  },
  {
    id: 'sr-2',
    request_number: 'SR-2024-0722',
    client_name: 'Zahara Khan',
    client_initials: 'ZK',
    product_title: 'Premium Leather Handbags',
    description: '200 luxury grade tote bags with custom embossing and packaging for retail distribution.',
    destination: 'Dubai, AE',
    destination_label: 'UAE',
    status: 'quoted',
    market: 'AE',
    reference_images: [refImg3],
    has_document: true,
    created_at: '2024-09-23T14:00:00Z',
  },
  {
    id: 'sr-3',
    request_number: 'SR-2024-0615',
    client_name: 'BuildCorp Ltd.',
    client_initials: 'BC',
    product_title: 'Grade 8.8 Galvanized Bolts',
    description: '10,000 units M12 × 80mm galvanized hex bolts for structural steel project.',
    destination: 'Mombasa, KE',
    destination_label: 'Kenya',
    status: 'shipping',
    market: 'KE',
    reference_images: [refImg4],
    created_at: '2024-09-22T11:00:00Z',
  },
  {
    id: 'sr-4',
    request_number: 'SR-2024-0588',
    client_name: 'Nairobi Energy Ltd',
    client_initials: 'NE',
    product_title: 'Industrial Valves (50 Units)',
    description: 'Stainless steel ball valves, 2" diameter, ANSI 150 rating for pipeline project.',
    destination: 'Mombasa, KE',
    destination_label: 'Kenya',
    status: 'shipping',
    market: 'KE',
    reference_images: [refImg4, refImg1],
    created_at: '2024-09-21T08:00:00Z',
  },
  {
    id: 'sr-5',
    request_number: 'SR-2024-0551',
    client_name: 'Gulf Trade Co',
    client_initials: 'GT',
    product_title: 'Leather Goods Bulk Order',
    description: 'Premium leather wallets and belts, MOQ 500 units, custom branding.',
    destination: 'Dubai, AE',
    destination_label: 'UAE',
    status: 'quoted',
    market: 'AE',
    reference_images: [refImg3],
    reference_extra: 1,
    created_at: '2024-09-20T14:00:00Z',
  },
  {
    id: 'sr-6',
    request_number: 'SR-2024-0520',
    client_name: 'Shenzhen Tech Imports',
    client_initials: 'ST',
    product_title: 'Solar Panels (CN Origin)',
    description: '550W monocrystalline panels, 200 units, Tier-1 manufacturer required.',
    destination: 'Guangzhou, CN',
    destination_label: 'China',
    status: 'pending',
    market: 'CN',
    reference_images: [refImg2, refImg1],
    has_document: true,
    created_at: '2024-09-19T10:30:00Z',
  },
  {
    id: 'sr-7',
    request_number: 'SR-2024-0492',
    client_name: 'East Africa Retail',
    client_initials: 'EA',
    product_title: 'Consumer Electronics Lot',
    description: 'Wireless earbuds, smartwatches, phone accessories — mixed SKU pallet.',
    destination: 'Mombasa, KE',
    destination_label: 'Kenya',
    status: 'pending',
    market: 'KE',
    reference_images: [refImg1],
    created_at: '2024-09-18T16:00:00Z',
  },
  {
    id: 'sr-8',
    request_number: 'SR-2024-0461',
    client_name: 'Dubai Wholesale Hub',
    client_initials: 'DW',
    product_title: 'Construction Machinery Parts',
    description: 'Hydraulic pump assemblies and excavator track components.',
    destination: 'Jebel Ali, AE',
    destination_label: 'UAE',
    status: 'shipping',
    market: 'AE',
    reference_images: [refImg4],
    created_at: '2024-09-17T11:00:00Z',
  },
  {
    id: 'sr-9',
    request_number: 'SR-2024-0433',
    client_name: 'Coastal Imports KE',
    client_initials: 'CI',
    product_title: 'Textile Machinery Spares',
    description: 'Spinning and weaving machine replacement parts from verified OEM.',
    destination: 'Mombasa, KE',
    destination_label: 'Kenya',
    status: 'quoted',
    market: 'KE',
    reference_images: [refImg3, refImg2],
    created_at: '2024-09-16T08:30:00Z',
  },
  {
    id: 'sr-10',
    request_number: 'SR-2024-0405',
    client_name: 'Pearl River Manufacturing',
    client_initials: 'PR',
    product_title: 'Smart Home Devices',
    description: 'IoT sensors, smart switches, and hub controllers for B2B distribution.',
    destination: 'Shenzhen, CN',
    destination_label: 'China',
    status: 'quoted',
    market: 'CN',
    reference_images: [refImg1],
    reference_extra: 3,
    created_at: '2024-09-15T13:00:00Z',
  },
];

const defaultSolarAttachments: SourcingAttachment[] = [
  { name: 'Inverter_Specs_v2.pdf', size: '1.4 MB', type: 'pdf' },
  { name: 'Installation_Site_Photos.zip', size: '12.8 MB', type: 'zip' },
];

const defaultOfficialQuote: SourcingQuoteReceived[] = [
  {
    id: 'q-1',
    unit_price: 'KSh 2,903',
    shipping_cost: 'KSh 162,000',
    lead_time: '14 Days',
    shipment: 'FOB Ningbo',
    notes: 'Verified manufacturer with ISO 9001. Includes standard export packaging.',
    official: true,
  },
];

export const sourcingRequestDetailsById: Record<string, Partial<SourcingRequestDetail>> = {
  'sr-1': {
    quantity: '500 Units',
    material_grade: 'Aluminum Grade 6061',
    voltage_range: '1100V - 1500V',
    budget_total: 'KSh 1,687,500',
    budget_subtitle: 'Estimated Total (EXW/FOB)',
    regional_targets: [
      { code: 'CN', label: 'China (CN)' },
      { code: 'KE', label: 'Kenya (KE)' },
    ],
    attachments: defaultSolarAttachments,
    quotes: defaultOfficialQuote,
    requester_location: 'Nairobi, Kenya',
    product_image_url:
      'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=200',
    product_title: 'Industrial Solar Inverters (500 Units)',
    description:
      'High-efficiency string inverters for commercial rooftop arrays. Must support grid-tie certification, MPPT tracking, and export-grade packaging for East Africa distribution.',
  },
};

export const userSourcingRequestDetailsById: Record<string, UserSourcingRequestDetail> = {
  'usr-1': {
    id: 'usr-1',
    request_number: 'REQ-4029',
    title: 'Industrial Solar Inverters (500 Units)',
    origin: 'CN',
    status: 'ACTIVE REQUEST',
    status_variant: 'blue',
    description:
      'High-efficiency string inverters for commercial rooftop arrays. Must support grid-tie certification, MPPT tracking, and export-grade packaging for East Africa distribution.',
    quantity: '500 Units',
    voltage_range: '1100V - 1500V',
    budget_total: 'KSh 1,687,500',
    budget_subtitle: 'Estimated Total (EXW/FOB)',
    regional_targets: [
      { code: 'CN', label: 'China (CN)' },
      { code: 'KE', label: 'Kenya (KE)' },
    ],
    attachments: defaultSolarAttachments,
    quotes: defaultOfficialQuote,
  },
  'usr-2': {
    id: 'usr-2',
    request_number: 'DBK-98774',
    title: 'Premium Textile Fabric Rolls (Silk Blend)',
    origin: 'AE',
    status: 'PROCESSING',
    status_variant: 'blue',
    description:
      '200 rolls of premium silk-blend fabric with custom dye lot matching for Nairobi retail partners.',
    quantity: '200 Rolls',
    budget_total: 'KSh 1,107,000',
    budget_subtitle: 'Estimated Total (EXW)',
    regional_targets: [
      { code: 'AE', label: 'Dubai (AE)' },
      { code: 'KE', label: 'Kenya (KE)' },
    ],
    attachments: [{ name: 'Fabric_Spec_Sheet.pdf', size: '890 KB', type: 'pdf' }],
    quotes: [
      {
        id: 'q-u2-1',
        unit_price: 'KSh 5,535',
        lead_time: '21 Days',
        shipment: 'FOB Jebel Ali',
        notes: 'MOQ met. Includes lab dip approval before bulk run.',
        official: true,
      },
    ],
    quote_date: 'September 18, 2024',
    destination_port: 'Nairobi (KE-NBO)',
    estimated_budget_range: 'KSh 1,012,500 - KSh 1,215,000',
  },
  'usr-3': {
    id: 'usr-3',
    request_number: 'DBK-98661',
    title: 'Pneumatic Drilling Components',
    origin: 'CN',
    status: 'PENDING QUOTE',
    status_variant: 'gray',
    description:
      'Replacement drill heads and pneumatic couplers for mining equipment maintenance program.',
    quantity: '120 Units',
    budget_total: 'Est. KSh 607,500',
    budget_subtitle: 'Target Budget Range',
    regional_targets: [{ code: 'CN', label: 'China (CN)' }],
    attachments: [],
    quotes: [],
    quote_date: 'September 12, 2024',
    destination_port: 'Mombasa (KE-MBA)',
    estimated_budget_range: 'KSh 540,000 - KSh 742,500',
  },
};

export interface AdminDashboardKpis {
  global_sales_usd: number;
  global_sales_change: string;
  active_requests: number;
  pending_quotes: number;
  otd_percent: number;
  delayed_shipments: number;
}

export type DashboardTagVariant = 'orange' | 'blue' | 'red';

export interface DashboardSourcingRow {
  id: string;
  origin: 'CN' | 'AE' | 'KE';
  destination: 'CN' | 'AE' | 'KE';
  product_title: string;
  quantity: string;
  vendor: string;
  status_tags: { label: string; variant: DashboardTagVariant }[];
  time_ago: string;
  primary_action: { label: string; style: 'solid' | 'outline' };
  secondary_action?: { label: string; style: 'solid' | 'outline' };
}

export interface LogisticsPipelineCard {
  tracking_id: string;
  mode: 'Sea' | 'Air' | 'Land';
  status: string;
  status_variant: 'orange' | 'blue' | 'gray';
  route_from: string;
  route_to: string;
  eta: string;
}

export const adminDashboardKpis: AdminDashboardKpis = {
  global_sales_usd: 412890,
  global_sales_change: '+12.4% vs LW',
  active_requests: 142,
  pending_quotes: 8,
  otd_percent: 94,
  delayed_shipments: 2,
};

export const adminDashboardSourcingRows: DashboardSourcingRow[] = [
  {
    id: 'dash-sr-1',
    origin: 'CN',
    destination: 'KE',
    product_title: 'Industrial Solar Inverters',
    quantity: '50 units',
    vendor: 'Longi Solar HK',
    status_tags: [{ label: 'Pending Quote', variant: 'orange' }],
    time_ago: '2 hours ago',
    primary_action: { label: 'View Details', style: 'outline' },
  },
  {
    id: 'dash-sr-2',
    origin: 'AE',
    destination: 'KE',
    product_title: 'Premium Leather Handbags',
    quantity: '200 units',
    vendor: 'Dubai Leather Co.',
    status_tags: [{ label: 'Quoted', variant: 'blue' }],
    time_ago: '5 hours ago',
    primary_action: { label: 'View Details', style: 'outline' },
  },
  {
    id: 'dash-sr-3',
    origin: 'CN',
    destination: 'AE',
    product_title: 'Grade 8.8 Galvanized Bolts',
    quantity: '10,000 units',
    vendor: 'Shenzhen Fastener Ltd.',
    status_tags: [
      { label: 'Urgent Action', variant: 'red' },
      { label: 'Pending Quote', variant: 'orange' },
    ],
    time_ago: '1 day ago',
    primary_action: { label: 'View Details', style: 'outline' },
  },
  {
    id: 'dash-sr-4',
    origin: 'CN',
    destination: 'KE',
    product_title: 'Tier-1 Monocrystalline Panels',
    quantity: '200 units',
    vendor: 'Jinko Solar CN',
    status_tags: [{ label: 'Shipping', variant: 'blue' }],
    time_ago: '3 days ago',
    primary_action: { label: 'View Details', style: 'outline' },
  },
];

export interface InventoryStockHub {
  hub: string;
  qty: number;
  max: number;
  low?: boolean;
}

export interface InventoryCatalogItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  image_url: string;
  price: number;
  price_label: string;
  stock: InventoryStockHub[];
}

export const mockInventoryCatalog: InventoryCatalogItem[] = [
  {
    id: 'inv-1',
    name: 'Industrial Solar Inverter V3',
    sku: 'DBK-INV-V3-50',
    category: 'Energy',
    image_url: inverterMain,
    price: 870,
    price_label: 'MSRP (Global)',
    stock: [
      { hub: 'CN', qty: 450, max: 500 },
      { hub: 'KE', qty: 120, max: 200 },
    ],
  },
  {
    id: 'inv-2',
    name: 'Hyperion X8 100kW Inverter',
    sku: 'IND-SLR-8802',
    category: 'Energy',
    image_url: inverterMain,
    price: 4250,
    price_label: 'MSRP (Global)',
    stock: [
      { hub: 'CN', qty: 5, max: 100, low: true },
      { hub: 'AE', qty: 28, max: 80 },
    ],
  },
  {
    id: 'inv-3',
    name: 'Tier-1 Monocrystalline Panel 550W',
    sku: 'DBK-PNL-550',
    category: 'Energy',
    image_url:
      'https://images.pexels.com/photos/159397/solar-panel-array-power-sun-159397.jpeg?auto=compress&cs=tinysrgb&w=120',
    price: 165,
    price_label: 'Bulk Rate (AE)',
    stock: [
      { hub: 'CN', qty: 890, max: 1000 },
      { hub: 'AE', qty: 210, max: 300 },
    ],
  },
  {
    id: 'inv-4',
    name: 'Grade 8.8 Galvanized Bolts (M12)',
    sku: 'DBK-BLT-M12',
    category: 'Construction',
    image_url: refImg4,
    price: 0.42,
    price_label: 'MSRP (Global)',
    stock: [
      { hub: 'CN', qty: 12000, max: 15000 },
      { hub: 'KE', qty: 3400, max: 5000 },
    ],
  },
  {
    id: 'inv-5',
    name: 'LiFePO4 Storage Rack 10kWh',
    sku: 'DBK-BAT-10K',
    category: 'Energy',
    image_url: refImg1,
    price: 2800,
    price_label: 'MSRP (Global)',
    stock: [
      { hub: 'CN', qty: 42, max: 120 },
      { hub: 'KE', qty: 8, max: 50, low: true },
    ],
  },
];

export interface SourcingOrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  customer_detail: string;
  route: string;
  estimated_value: number;
  status: string;
  status_variant: 'blue' | 'orange';
  primary_action: string;
  secondary_action: string;
}

export const mockSourcingOrders: SourcingOrderRow[] = [
  {
    id: 'so-1',
    order_number: 'SRC-9921',
    customer_name: 'Jamal Abdulla',
    customer_detail: 'Textile Sourcing (B2B)',
    route: 'CN → AE',
    estimated_value: 12450,
    status: 'Quoted',
    status_variant: 'blue',
    primary_action: 'Review Docs',
    secondary_action: 'Approve',
  },
  {
    id: 'so-2',
    order_number: 'SRC-9922',
    customer_name: 'Shen Wei',
    customer_detail: 'Machinery Parts',
    route: 'CN → KE',
    estimated_value: 45000,
    status: 'Deposited',
    status_variant: 'orange',
    primary_action: 'Proforma',
    secondary_action: 'Update',
  },
];

export const adminLogisticsPipeline: LogisticsPipelineCard[] = [
  {
    tracking_id: 'DBK-8829',
    mode: 'Sea',
    status: 'TRANSIT',
    status_variant: 'orange',
    route_from: 'Shenzhen',
    route_to: 'Mombasa',
    eta: 'Oct 12',
  },
  {
    tracking_id: 'DBK-1102',
    mode: 'Air',
    status: 'CUSTOMS',
    status_variant: 'blue',
    route_from: 'Dubai',
    route_to: 'Nairobi',
    eta: 'Today',
  },
  {
    tracking_id: 'DBK-7742',
    mode: 'Land',
    status: 'PREPARING',
    status_variant: 'gray',
    route_from: 'Guangzhou',
    route_to: 'Dubai',
    eta: 'Nov 05',
  },
];

export interface UserSourcingRequestItem {
  id: string;
  request_number: string;
  title: string;
  origin: string;
  price: string;
  status: string;
  status_variant: 'orange' | 'blue' | 'gray';
}

export interface AdminMarketplaceOrderRow {
  id: string;
  order_number: string;
  title: string;
  vendor: string;
  origin_flag: string;
  image_url: string;
  status: string;
  status_icon: 'transit' | 'delivered' | 'processing';
  price_kes: string;
  customer_name: string;
  customer_detail: string;
  date_value: string;
  primary_action: string;
  secondary_action: string;
}

export interface UserMarketplaceOrderDetail {
  order: UserMarketplaceOrder;
  shipment: Shipment | null;
}

export interface UserMarketplaceOrder {
  id: string;
  order_number: string;
  tracking_id?: string | null;
  title: string;
  vendor: string;
  origin_flag: string;
  image_url: string;
  status: string;
  status_icon: 'transit' | 'delivered' | 'processing';
  progress_step: number;
  price_kes: string;
  price_secondary: string;
  date_label: string;
  date_value: string;
  primary_action: string;
  secondary_action: string;
  primary_style: 'navy' | 'red';
}

export const userSourcingSummary = {
  active: 12,
  pending_quotes: 4,
  procured_total: 'KSh 5.7M',
};

export const userSourcingRequestsList: UserSourcingRequestItem[] = [
  {
    id: 'usr-1',
    request_number: 'DBK-99021',
    title: 'High-Grade Photovoltaic Inverters (50 units)',
    origin: 'CN',
    price: 'KSh 1,687,500',
    status: 'QUOTED',
    status_variant: 'orange',
  },
  {
    id: 'usr-2',
    request_number: 'DBK-98774',
    title: 'Premium Textile Fabric Rolls (Silk Blend)',
    origin: 'AE',
    price: 'KSh 1,107,000',
    status: 'PROCESSING',
    status_variant: 'blue',
  },
  {
    id: 'usr-3',
    request_number: 'DBK-98661',
    title: 'Pneumatic Drilling Components',
    origin: 'CN',
    price: 'Est. KSh 607,500',
    status: 'PENDING QUOTE',
    status_variant: 'gray',
  },
];

export interface CategorySampleProduct {
  id: string;
  name: string;
  image_url: string;
  price: string;
}

export interface ExploreCategory {
  id: string;
  name: string;
  origin: string;
  product_count: number;
  image_url: string;
  sample_products?: CategorySampleProduct[];
}

export interface MarketplaceProduct {
  id: string;
  productId: string;
  name: string;
  vendor: string;
  origin: string;
  price_usd: number;
  price_kes: string;
  price_aed: string;
  image_url: string;
  cta: 'cart' | 'quote';
  stock: number;
  min_order?: number;
}

export interface AdminCategoryCard {
  id: string;
  name: string;
  description: string;
  origins: string[];
  trend: string;
  trend_variant: 'up' | 'stable' | 'down';
  total_skus: number;
  vendors: number;
  image_url: string;
  status: 'published' | 'draft';
}

export interface AdminInventoryStockLevel {
  hub: 'CN' | 'AE' | 'KE';
  percent: number;
  low?: boolean;
}

export interface AdminInventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  origin: 'CN' | 'AE' | 'KE';
  origin_label: string;
  image_url: string;
  stock: number;
  low_stock: boolean;
  status: 'draft' | 'published';
  value: string;
  marketplace_price: string;
  stock_levels: AdminInventoryStockLevel[];
}

export interface AdminInventoryHubCount {
  hub: 'CN' | 'AE' | 'KE';
  label: string;
  flag: string;
  product_count: number;
  published_count: number;
  stock_units: number;
}

export interface AdminInventoryKpis {
  total_active_products: number;
  new_this_week: number;
  total_inventory_value: string;
  hubs_label: string;
  low_stock_count: number;
  hub_counts?: AdminInventoryHubCount[];
}

export const adminInventoryKpis: AdminInventoryKpis = {
  total_active_products: 1248,
  new_this_week: 12,
  total_inventory_value: '$2.4M',
  hubs_label: 'Across 3 Hubs',
  low_stock_count: 24,
};

export const exploreCategories: ExploreCategory[] = [
  {
    id: 'cat-1',
    name: 'Industrial Machinery',
    origin: 'CN',
    product_count: 1240,
    image_url:
      'https://images.pexels.com/photos/256301/pexels-photo-256301.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'cat-2',
    name: 'Consumer Electronics',
    origin: 'AE',
    product_count: 856,
    image_url:
      'https://images.pexels.com/photos/163117/keyboard-full-technology-electronics-163117.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'cat-3',
    name: 'Agri-Exports',
    origin: 'KE',
    product_count: 432,
    image_url:
      'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'cat-4',
    name: 'Textiles & Apparel',
    origin: 'CN',
    product_count: 2105,
    image_url:
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'cat-5',
    name: 'Healthcare & Medical',
    origin: 'AE',
    product_count: 318,
    image_url:
      'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'cat-6',
    name: 'Commercial Furniture',
    origin: 'CN',
    product_count: 567,
    image_url:
      'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'cat-7',
    name: 'Renewable Energy',
    origin: 'CN',
    product_count: 189,
    image_url:
      'https://images.pexels.com/photos/159397/solar-panel-array-power-sun-159397.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'cat-8',
    name: 'Logistics Equipment',
    origin: 'AE',
    product_count: 94,
    image_url:
      'https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export const marketplaceProducts: MarketplaceProduct[] = [
  {
    id: 'mp-1',
    productId: '1',
    name: 'Hyperion X8 Solar Inverter 100kW',
    vendor: 'Verified OEM',
    origin: 'KE',
    price_usd: 4250,
    price_kes: 'KES 551,250',
    price_aed: 'AED 15,600',
    image_url: inverterMain,
    cta: 'quote',
  },
  {
    id: 'mp-2',
    productId: '3',
    name: 'Tier-1 Monocrystalline Panel 550W',
    vendor: 'Longi Solar HK',
    origin: 'CN',
    price_usd: 165,
    price_kes: 'KES 21,450',
    price_aed: 'AED 605',
    image_url:
      'https://images.pexels.com/photos/159397/solar-panel-array-power-sun-159397.jpeg?auto=compress&cs=tinysrgb&w=400',
    cta: 'cart',
  },
  {
    id: 'mp-3',
    productId: '1',
    name: 'Industrial Solar Inverter V3',
    vendor: 'Shenzhen Power Co.',
    origin: 'KE',
    price_usd: 870,
    price_kes: 'KES 112,950',
    price_aed: 'AED 3,195',
    image_url: inverterMain,
    cta: 'cart',
  },
  {
    id: 'mp-4',
    productId: '4',
    name: 'Smart DC Power Optimizer 650W',
    vendor: 'Dubai Tech Hub',
    origin: 'AE',
    price_usd: 45,
    price_kes: 'KES 5,850',
    price_aed: 'AED 165',
    image_url:
      'https://images.pexels.com/photos/3921320/pexels-photo-3921320.jpeg?auto=compress&cs=tinysrgb&w=400',
    cta: 'cart',
  },
];

export const adminInventoryItems: AdminInventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'DBK-INV-8821',
    name: 'Hyperion X8 Solar Inverter 100kW',
    category: 'Renewable Energy',
    origin: 'CN',
    image_url:
      'https://images.pexels.com/photos/159397/solar-panel-array-power-sun-159397.jpeg?auto=compress&cs=tinysrgb&w=120',
    stock: 842,
    low_stock: false,
    value: '$892,000',
    marketplace_price: '$4,250.00 USD',
    stock_levels: [
      { hub: 'CN', percent: 78 },
      { hub: 'KE', percent: 62 },
    ],
  },
  {
    id: 'inv-2',
    sku: 'DBK-INV-4412',
    name: 'Tier-1 Monocrystalline Panel 550W',
    category: 'Renewable Energy',
    origin: 'CN',
    image_url:
      'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=120',
    stock: 1205,
    low_stock: false,
    value: '$198,600',
    marketplace_price: '$165.00 USD',
    stock_levels: [
      { hub: 'CN', percent: 85 },
      { hub: 'KE', percent: 71 },
    ],
  },
  {
    id: 'inv-3',
    sku: 'DBK-INV-9934',
    name: 'Industrial Pneumatic Drill Set',
    category: 'Industrial Parts',
    origin: 'CN',
    image_url:
      'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=120',
    stock: 18,
    low_stock: true,
    value: '$12,400',
    marketplace_price: '$320.00 USD',
    stock_levels: [
      { hub: 'CN', percent: 22, low: true },
      { hub: 'KE', percent: 15, low: true },
    ],
  },
  {
    id: 'inv-4',
    sku: 'DBK-INV-2201',
    name: 'Premium Arabica Coffee Beans (50kg)',
    category: 'Agri-Exports',
    origin: 'KE',
    image_url:
      'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=120',
    stock: 456,
    low_stock: false,
    value: '$34,600',
    marketplace_price: '$12.50 USD',
    stock_levels: [{ hub: 'KE', percent: 68 }],
  },
  {
    id: 'inv-5',
    sku: 'DBK-INV-5512',
    name: 'Silk Fabric Roll (Grade A)',
    category: 'Textiles & Apparel',
    origin: 'CN',
    image_url:
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=120',
    stock: 204,
    low_stock: false,
    value: '$89,200',
    marketplace_price: '$48.00 USD',
    stock_levels: [
      { hub: 'CN', percent: 55 },
      { hub: 'AE', percent: 40 },
    ],
  },
  {
    id: 'inv-6',
    sku: 'DBK-INV-3309',
    name: 'Smart DC Power Optimizer 650W',
    category: 'Consumer Electronics',
    origin: 'AE',
    image_url:
      'https://images.pexels.com/photos/3921320/pexels-photo-3921320.jpeg?auto=compress&cs=tinysrgb&w=120',
    stock: 120,
    low_stock: false,
    value: '$5,400',
    marketplace_price: '$45.00 USD',
    stock_levels: [{ hub: 'AE', percent: 72 }],
  },
  {
    id: 'inv-7',
    sku: 'DBK-INV-1103',
    name: 'Macadamia Nuts (Export Grade)',
    category: 'Agri-Exports',
    origin: 'KE',
    image_url:
      'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=120',
    stock: 9,
    low_stock: true,
    value: '$8,100',
    marketplace_price: '$8.20 USD',
    stock_levels: [{ hub: 'KE', percent: 12, low: true }],
  },
  {
    id: 'inv-8',
    sku: 'DBK-INV-7744',
    name: 'Aluminum Framing Profile 6m',
    category: 'Industrial Parts',
    origin: 'AE',
    image_url:
      'https://images.pexels.com/photos/162846/pexels-photo-162846.jpeg?auto=compress&cs=tinysrgb&w=120',
    stock: 88,
    low_stock: false,
    value: '$22,100',
    marketplace_price: '$186.00 USD',
    stock_levels: [
      { hub: 'AE', percent: 58 },
      { hub: 'KE', percent: 44 },
    ],
  },
  {
    id: 'inv-9',
    sku: 'DBK-INV-6612',
    name: 'Wireless Industrial Sensor Hub',
    category: 'Consumer Electronics',
    origin: 'CN',
    image_url:
      'https://images.pexels.com/photos/163117/keyboard-full-technology-electronics-163117.jpeg?auto=compress&cs=tinysrgb&w=120',
    stock: 312,
    low_stock: false,
    value: '$41,800',
    marketplace_price: '$129.00 USD',
    stock_levels: [{ hub: 'CN', percent: 66 }],
  },
  {
    id: 'inv-10',
    sku: 'DBK-INV-9021',
    name: 'Commercial LED High-Bay Fixture',
    category: 'Industrial Parts',
    origin: 'CN',
    image_url:
      'https://images.pexels.com/photos/343457/pexels-photo-343457.jpeg?auto=compress&cs=tinysrgb&w=120',
    stock: 24,
    low_stock: true,
    value: '$15,600',
    marketplace_price: '$92.00 USD',
    stock_levels: [
      { hub: 'CN', percent: 28, low: true },
      { hub: 'KE', percent: 19, low: true },
    ],
  },
];

export const adminCategoryCards: AdminCategoryCard[] = [
  {
    id: 'ac-1',
    name: 'Consumer Electronics',
    description:
      'Verified OEM and retail electronics sourced from Shenzhen and Nairobi distribution hubs.',
    origins: ['KE', 'CN'],
    trend: '+12.5%',
    trend_variant: 'up',
    total_skus: 842,
    vendors: 124,
    image_url:
      'https://images.pexels.com/photos/163117/keyboard-full-technology-electronics-163117.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'published',
  },
  {
    id: 'ac-2',
    name: 'Textiles & Apparel',
    description: 'Finished garments and fabric rolls from UAE and Guangzhou suppliers.',
    origins: ['AE', 'CN'],
    trend: 'Stable',
    trend_variant: 'stable',
    total_skus: 1205,
    vendors: 89,
    image_url:
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'published',
  },
  {
    id: 'ac-3',
    name: 'Industrial Parts',
    description: 'Machinery components, fasteners, and pneumatic systems for B2B buyers.',
    origins: ['CN'],
    trend: '-2.1%',
    trend_variant: 'down',
    total_skus: 456,
    vendors: 42,
    image_url:
      'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'published',
  },
  {
    id: 'ac-4',
    name: 'Home & Kitchen',
    description: 'Furniture, appliances, and lifestyle goods for regional retail partners.',
    origins: ['KE', 'AE'],
    trend: '+5.3%',
    trend_variant: 'up',
    total_skus: 623,
    vendors: 67,
    image_url:
      'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'draft',
  },
];

export const userMarketplaceOrders: UserMarketplaceOrder[] = [
  {
    id: 'mo-1',
    order_number: 'DBK-882910',
    title: 'Aero-Max Pro Running Shoes',
    vendor: 'Shenzhen Footwear Co.',
    origin_flag: 'CN',
    image_url:
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200',
    status: 'IN TRANSIT',
    status_icon: 'transit',
    progress_step: 3,
    price_kes: 'KSh 14,200',
    price_secondary: '$109 USD',
    date_label: 'ETA',
    date_value: 'Oct 28, 2024',
    primary_action: 'Track Package',
    secondary_action: 'Order Details',
    primary_style: 'navy',
  },
  {
    id: 'mo-2',
    order_number: 'DBK-881205',
    title: 'Smart Home Hub Bundle',
    vendor: 'Dubai Tech Imports',
    origin_flag: 'AE',
    image_url:
      'https://images.pexels.com/photos/163117/keyboard-full-technology-electronics-163117.jpeg?auto=compress&cs=tinysrgb&w=200',
    status: 'DELIVERED',
    status_icon: 'delivered',
    progress_step: 4,
    price_kes: 'KSh 8,950',
    price_secondary: 'AED 265',
    date_label: 'Delivered on',
    date_value: 'Sep 12, 2024',
    primary_action: 'Buy Again',
    secondary_action: 'Request Support',
    primary_style: 'navy',
  },
  {
    id: 'mo-3',
    order_number: 'DBK-880442',
    title: 'Industrial Valve Set (20pc)',
    vendor: 'Guangzhou Industrial Ltd.',
    origin_flag: 'CN',
    image_url:
      'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=200',
    status: 'PROCESSING',
    status_icon: 'processing',
    progress_step: 1,
    price_kes: 'KSh 42,500',
    price_secondary: '$328 USD',
    date_label: 'Estimated Ship',
    date_value: 'Nov 02, 2024',
    primary_action: 'Cancel Order',
    secondary_action: 'Order Details',
    primary_style: 'red',
  },
];
