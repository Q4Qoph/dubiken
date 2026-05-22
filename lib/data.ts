import type {
  CreateSourcingRequestBody,
  HubCode,
  SourcingShippingMethod,
  SourcingUnit,
  SourcingUrgency,
  UpsertCategoryRequest,
  UpsertOfficialQuoteRequest,
} from '@/lib/contracts';
import type {
  AdminCategoryCard,
  AdminDashboardKpis,
  AdminInventoryItem,
  AdminInventoryKpis,
  DashboardSourcingRow,
  ExploreCategory,
  LogisticsPipelineCard,
  MarketplaceProduct,
  Order,
  Product,
  RelatedProduct,
  Shipment,
  AdminMarketplaceOrderRow,
  SourcingOrderRow,
  SourcingRequest,
  SourcingRequestDetail,
  UserMarketplaceOrder,
  UserSourcingRequestDetail,
  UserSourcingRequestItem,
} from '@/lib/types';
import * as api from '@/lib/api/services';

export type { SourcingRequestFilters } from '@/lib/api/query-keys';
import type { SourcingRequestFilters } from '@/lib/api/query-keys';

export async function getRecentOrders(limit = 5): Promise<
  (Order & { tracking_id?: string | null })[]
> {
  const orders = await api.apiGetUserMarketplaceOrders();
  return orders.slice(0, limit).map((o) => ({
    id: o.id,
    order_number: o.order_number,
    tracking_id: o.tracking_id,
    customer_name: o.vendor,
    status: mapOrderStatus(o.status),
    origin: hubLabel(o.origin_flag),
    eta: o.date_value,
    created_at: new Date().toISOString(),
  }));
}

function mapOrderStatus(status: string): string {
  const s = status.toUpperCase();
  if (s.includes('TRANSIT')) return 'dispatched';
  if (s.includes('DELIVERED')) return 'delivered';
  if (s.includes('PROCESS')) return 'processing';
  return 'confirmed';
}

function hubLabel(code: string): string {
  if (code === 'CN') return 'China';
  if (code === 'AE') return 'Dubai';
  if (code === 'KE') return 'Kenya';
  return code;
}

export async function getShipmentByTrackingId(trackingId: string): Promise<Shipment | null> {
  return api.apiGetShipment(trackingId);
}

export async function listShipments(): Promise<Shipment[]> {
  return api.apiListShipments();
}

export async function getProductById(id: string): Promise<Product | null> {
  const dto = await api.apiGetProduct(id);
  return dto as Product | null;
}

export async function getRelatedProducts(excludeId: string, limit = 4): Promise<RelatedProduct[]> {
  const rows = await api.apiGetRelatedProducts(excludeId, limit);
  return rows.map(({ id, name, price, origin, image_url }) => ({
    id,
    name,
    price,
    origin,
    image_url,
  }));
}

export async function getSourcingRequests(
  filters: SourcingRequestFilters = {},
): Promise<SourcingRequest[]> {
  const query: Record<string, string | number> = {
    page: 1,
    page_size: 50,
  };
  if (filters.market && filters.market !== 'all') query.market = filters.market;
  if (filters.statuses?.length) query.status = filters.statuses.join(',');
  const res = await api.apiGetAdminSourcingRequests(query);
  return res.data as unknown as SourcingRequest[];
}

export async function getSourcingRequestById(
  id: string,
): Promise<SourcingRequestDetail | null> {
  return (await api.apiGetAdminSourcingDetail(id)) as SourcingRequestDetail | null;
}

export type AdminOfficialQuoteInput = UpsertOfficialQuoteRequest;

export async function saveAdminOfficialQuote(
  requestId: string,
  input: AdminOfficialQuoteInput,
): Promise<SourcingRequestDetail | null> {
  await api.apiSaveOfficialQuote(requestId, input);
  return getSourcingRequestById(requestId);
}

export async function getUserSourcingRequestById(
  id: string,
): Promise<UserSourcingRequestDetail | null> {
  return (await api.apiGetUserSourcingDetail(id)) as UserSourcingRequestDetail | null;
}

export async function getAdminMarketplaceOrders(): Promise<AdminMarketplaceOrderRow[]> {
  return api.apiGetAdminMarketplaceOrders();
}

export async function getUserSourcingDashboard(): Promise<{
  summary: { active: number; pending_quotes: number; procured_total: string };
  requests: UserSourcingRequestItem[];
}> {
  const res = await api.apiGetUserSourcingDashboard();
  return {
    summary: res.summary,
    requests: res.requests as UserSourcingRequestItem[],
  };
}

export type OriginMarket = HubCode;

export interface CreateSourcingRequestInput {
  productName: string;
  category: string;
  urgency: SourcingUrgency;
  description: string;
  origin: HubCode;
  destination: string;
  quantity: string;
  unit: string;
  targetDate: string;
  shippingMethod: SourcingShippingMethod;
  budget?: string;
}

export async function createUserSourcingRequest(
  input: CreateSourcingRequestInput,
): Promise<UserSourcingRequestItem> {
  const body: CreateSourcingRequestBody = {
    product_name: input.productName,
    category: input.category,
    urgency: input.urgency,
    description: input.description,
    origin: input.origin,
    destination: input.destination,
    quantity: input.quantity,
    unit: input.unit as CreateSourcingRequestBody['unit'],
    target_date: input.targetDate,
    shipping_method: input.shippingMethod,
    budget: input.budget,
    accept_terms: true,
  };
  return api.apiCreateSourcingRequest(body) as Promise<UserSourcingRequestItem>;
}

export async function getUserMarketplaceOrders(): Promise<UserMarketplaceOrder[]> {
  return api.apiGetUserMarketplaceOrders();
}

export type AdminCategoryFormInput = UpsertCategoryRequest & { id?: string };

export async function saveAdminCategory(
  input: AdminCategoryFormInput,
): Promise<AdminCategoryCard> {
  return api.apiSaveAdminCategory(input) as Promise<AdminCategoryCard>;
}

export async function getHomeFeed(): Promise<{
  categories: ExploreCategory[];
  products: MarketplaceProduct[];
}> {
  const res = await api.apiGetHomeFeed();
  return {
    categories: (res?.categories ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      origin: c.origin,
      product_count: c.product_count,
      image_url: c.image_url,
    })),
    products: (res?.products ?? []).map((p) => ({
      id: p.id,
      productId: p.product_id,
      name: p.name,
      vendor: p.vendor,
      origin: p.origin,
      price_usd: p.price_usd,
      price_kes: p.price_kes,
      price_aed: p.price_aed,
      image_url: p.image_url,
      cta: p.cta,
    })),
  };
}

export async function getExploreCategories(page = 1, pageSize = 12): Promise<{
  categories: ExploreCategory[];
  meta: { page: number; page_size: number; total: number };
}> {
  const res = await api.apiGetCategories({ page, page_size: pageSize });
  return {
    categories: res.data.map((c) => ({
      id: c.id,
      name: c.name,
      origin: c.origin,
      product_count: c.product_count,
      image_url: c.image_url,
    })),
    meta: res.meta,
  };
}

export async function getAdminAnalytics() {
  return api.apiGetAdminAnalytics();
}

export async function listMyShipments(): Promise<Shipment[]> {
  return api.apiGetMyShipments();
}

export async function getMarketplaceProducts(
  hub?: string,
  category?: string,
): Promise<MarketplaceProduct[]> {
  const query: Record<string, string | number> = { page_size: 48 };
  if (hub && hub !== 'all') query.hub = hub;
  if (category) query.category = category;
  const res = await api.apiGetMarketplaceProducts(query);
  return (res?.data ?? []).map((p) => ({
    id: p.id,
    productId: p.product_id,
    name: p.name,
    vendor: p.vendor,
    origin: p.origin,
    price_usd: p.price_usd,
    price_kes: p.price_kes,
    price_aed: p.price_aed,
    image_url: p.image_url,
    cta: p.cta,
  }));
}

export async function getAdminCategoryCards(): Promise<AdminCategoryCard[]> {
  return api.apiGetAdminCategories() as Promise<AdminCategoryCard[]>;
}

export async function getAdminCategoryById(id: string): Promise<AdminCategoryCard | null> {
  return api.apiGetAdminCategory(id) as Promise<AdminCategoryCard | null>;
}

export async function getAdminInventoryItems(search?: string): Promise<AdminInventoryItem[]> {
  const res = await api.apiListAdminInventory(
    search ? { search, page_size: 100 } : { page_size: 100 },
  );
  return res.data as AdminInventoryItem[];
}

export async function getAdminInventoryProduct(id: string) {
  return api.apiGetAdminInventoryProduct(id);
}

export async function getAdminInventoryKpis(): Promise<AdminInventoryKpis> {
  return api.apiGetAdminInventoryKpis() as Promise<AdminInventoryKpis>;
}

export async function getAdminDashboard(): Promise<{
  kpis: AdminDashboardKpis;
  sourcingRows: DashboardSourcingRow[];
  logistics: LogisticsPipelineCard[];
}> {
  const data = await api.apiGetAdminDashboard();
  return {
    kpis: data.kpis,
    sourcingRows: data.sourcing_rows,
    logistics: data.logistics,
  };
}
