import {
  mockOrders,
  mockShipments,
  mockProducts,
  mockSourcingRequests,
  type Order,
  type Shipment,
  type Product,
  type RelatedProduct,
  type SourcingRequest,
  type SourcingRequestDetail,
  type SourcingQuoteReceived,
  type UserSourcingRequestDetail,
  sourcingRequestDetailsById,
  userSourcingRequestDetailsById,
  adminUserSourcingRequestMap,
  adminDashboardKpis,
  adminDashboardSourcingRows,
  adminLogisticsPipeline,
  mockInventoryCatalog,
  mockSourcingOrders,
  type AdminDashboardKpis,
  type DashboardSourcingRow,
  type LogisticsPipelineCard,
  type InventoryCatalogItem,
  type SourcingOrderRow,
  userSourcingSummary,
  userSourcingRequestsList,
  userMarketplaceOrders,
  exploreCategories,
  marketplaceProducts,
  adminCategoryCards,
  adminInventoryItems,
  adminInventoryKpis,
  type UserSourcingRequestItem,
  type AdminCategoryCard,
  type AdminInventoryItem,
  type AdminInventoryKpis,
  type UserMarketplaceOrder,
  type ExploreCategory,
  type MarketplaceProduct,
} from './mock-data';

function delay(ms = 80): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getRecentOrders(limit = 5): Promise<Order[]> {
  await delay();
  return [...mockOrders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

export async function getShipmentByTrackingId(trackingId: string): Promise<Shipment | null> {
  await delay();
  return mockShipments.find((s) => s.tracking_id === trackingId) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  await delay();
  return mockProducts.find((p) => p.id === id) ?? null;
}

export async function getRelatedProducts(excludeId: string, limit = 4): Promise<RelatedProduct[]> {
  await delay();
  return mockProducts
    .filter((p) => p.id !== excludeId)
    .slice(0, limit)
    .map(({ id, name, price, origin, image_url }) => ({ id, name, price, origin, image_url }));
}

export interface SourcingRequestFilters {
  market?: string;
  statuses?: string[];
}

export async function getSourcingRequests(
  filters: SourcingRequestFilters = {}
): Promise<SourcingRequest[]> {
  await delay();
  let results = [...mockSourcingRequests].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (filters.market && filters.market !== 'all') {
    results = results.filter((r) => r.market === filters.market);
  }
  if (filters.statuses && filters.statuses.length > 0) {
    results = results.filter((r) => filters.statuses!.includes(r.status));
  }

  return results;
}

function buildAdminSourcingDetail(req: SourcingRequest): SourcingRequestDetail {
  const extra = sourcingRequestDetailsById[req.id];
  return {
    ...req,
    quantity: extra?.quantity ?? '—',
    material_grade: extra?.material_grade,
    voltage_range: extra?.voltage_range,
    budget_total: extra?.budget_total ?? '—',
    budget_subtitle: extra?.budget_subtitle ?? 'Estimated Total',
    regional_targets: extra?.regional_targets ?? [
      { code: req.market, label: req.destination_label },
    ],
    attachments: extra?.attachments ?? [],
    quotes: extra?.quotes ?? [],
    quote_date: extra?.quote_date,
    destination_port: extra?.destination_port ?? req.destination,
    estimated_budget_range: extra?.estimated_budget_range,
    requester_location: extra?.requester_location ?? req.destination,
    product_image_url: extra?.product_image_url ?? req.reference_images[0],
    product_title: extra?.product_title ?? req.product_title,
    description: extra?.description ?? req.description,
  };
}

export async function getSourcingRequestById(
  id: string,
): Promise<SourcingRequestDetail | null> {
  await delay();
  const req = mockSourcingRequests.find((r) => r.id === id);
  if (!req) return null;
  return buildAdminSourcingDetail(req);
}

export type AdminOfficialQuoteInput = {
  unit_price: string;
  shipping_cost: string;
  transport: string;
  lead_time_days: string;
  notes: string;
};

function formatUsd(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('$') ? trimmed : `$${trimmed}`;
}

export async function saveAdminOfficialQuote(
  requestId: string,
  input: AdminOfficialQuoteInput,
): Promise<SourcingRequestDetail | null> {
  await delay();
  const req = mockSourcingRequests.find((r) => r.id === requestId);
  if (!req) return null;

  const existing = sourcingRequestDetailsById[requestId]?.quotes?.[0];
  const quote: SourcingQuoteReceived = {
    id: existing?.id ?? `q-${Date.now()}`,
    unit_price: formatUsd(input.unit_price),
    shipping_cost: formatUsd(input.shipping_cost) || undefined,
    lead_time: `${input.lead_time_days.trim()} Days`,
    shipment: input.transport.trim(),
    notes: input.notes.trim(),
    official: true,
  };

  if (!sourcingRequestDetailsById[requestId]) {
    sourcingRequestDetailsById[requestId] = {};
  }
  sourcingRequestDetailsById[requestId].quotes = [quote];

  if (req.status === 'pending') {
    req.status = 'quoted';
  }

  const userId = adminUserSourcingRequestMap[requestId];
  if (userId && userSourcingRequestDetailsById[userId]) {
    userSourcingRequestDetailsById[userId].quotes = [{ ...quote }];
    if (userSourcingRequestDetailsById[userId].status === 'PENDING QUOTE') {
      userSourcingRequestDetailsById[userId].status = 'QUOTED';
      userSourcingRequestDetailsById[userId].status_variant = 'orange';
    }
  }

  return buildAdminSourcingDetail(req);
}

export async function getUserSourcingRequestById(
  id: string,
): Promise<UserSourcingRequestDetail | null> {
  await delay();
  const detail = userSourcingRequestDetailsById[id];
  if (detail) return { ...detail };
  const listItem = userSourcingRequestsList.find((r) => r.id === id);
  if (!listItem) return null;
  return {
    id: listItem.id,
    request_number: listItem.request_number,
    title: listItem.title,
    origin: listItem.origin,
    status: listItem.status,
    status_variant: listItem.status_variant,
    description: 'Request details will appear here once your sourcing team reviews the submission.',
    quantity: '—',
    budget_total: listItem.price,
    budget_subtitle: 'Estimated Total',
    regional_targets: [{ code: listItem.origin, label: listItem.origin }],
    attachments: [],
    quotes: [],
  };
}

export async function getInventoryCatalog(): Promise<InventoryCatalogItem[]> {
  await delay();
  return [...mockInventoryCatalog];
}

export async function getSourcingOrders(): Promise<SourcingOrderRow[]> {
  await delay();
  return [...mockSourcingOrders];
}

export async function getUserSourcingDashboard(): Promise<{
  summary: typeof userSourcingSummary;
  requests: UserSourcingRequestItem[];
}> {
  await delay();
  return { summary: userSourcingSummary, requests: userSourcingRequestsList };
}

export type OriginMarket = 'CN' | 'AE' | 'KE';

export interface CreateSourcingRequestInput {
  productName: string;
  category: string;
  urgency: 'standard' | 'express';
  description: string;
  origin: OriginMarket;
  destination: string;
  quantity: string;
  unit: string;
  targetDate: string;
  shippingMethod: 'air' | 'sea' | 'flexible';
  budget?: string;
}

export async function createUserSourcingRequest(
  input: CreateSourcingRequestInput,
): Promise<UserSourcingRequestItem> {
  await delay(400);

  const requestNumber = `DBK-${Math.floor(90000 + Math.random() * 9999)}`;
  const newRequest: UserSourcingRequestItem = {
    id: `usr-${Date.now()}`,
    request_number: requestNumber,
    title: input.productName,
    origin: input.origin,
    price: 'Pending quote',
    status: 'PENDING',
    status_variant: 'gray',
  };

  userSourcingRequestsList.unshift(newRequest);
  userSourcingSummary.active += 1;
  userSourcingSummary.pending_quotes += 1;

  return newRequest;
}

export async function getUserMarketplaceOrders(): Promise<UserMarketplaceOrder[]> {
  await delay();
  return [...userMarketplaceOrders];
}

function inventorySkuCountForCategory(categoryName: string): number {
  return adminInventoryItems.filter((i) => i.category === categoryName).length;
}

export type AdminCategoryFormInput = {
  id?: string;
  name: string;
  description: string;
  origins: AdminCategoryCard['origins'];
  image_url: string;
  status: AdminCategoryCard['status'];
};

function storefrontOrigin(origins: string[]): ExploreCategory['origin'] {
  const hubOrder: ExploreCategory['origin'][] = ['KE', 'AE', 'CN'];
  return hubOrder.find((h) => origins.includes(h)) ?? (origins[0] as ExploreCategory['origin']) ?? 'KE';
}

const DEFAULT_CATEGORY_IMAGE =
  'https://images.pexels.com/photos/424196/pexels-photo-424196.jpeg?auto=compress&cs=tinysrgb&w=600';

export async function saveAdminCategory(
  input: AdminCategoryFormInput,
): Promise<AdminCategoryCard> {
  await delay();
  const image_url = input.image_url || DEFAULT_CATEGORY_IMAGE;
  const skuCount = inventorySkuCountForCategory(input.name);

  if (input.id) {
    const idx = adminCategoryCards.findIndex((c) => c.id === input.id);
    if (idx === -1) throw new Error('Category not found');
    const existing = adminCategoryCards[idx];
    const updated: AdminCategoryCard = {
      ...existing,
      name: input.name,
      description: input.description,
      origins: [...input.origins],
      image_url,
      status: input.status,
      total_skus: skuCount > 0 ? skuCount : existing.total_skus,
    };
    adminCategoryCards[idx] = updated;
    return updated;
  }

  const created: AdminCategoryCard = {
    id: `ac-${Date.now()}`,
    name: input.name,
    description: input.description,
    origins: [...input.origins],
    trend: 'Stable',
    trend_variant: 'stable',
    total_skus: skuCount,
    vendors: 0,
    image_url,
    status: input.status,
  };
  adminCategoryCards.push(created);
  return created;
}

export async function getExploreCategories(): Promise<ExploreCategory[]> {
  await delay();
  const published = adminCategoryCards.filter((c) => c.status === 'published');
  if (published.length === 0) return [...exploreCategories];
  return published.map((c) => ({
    id: c.id,
    name: c.name,
    origin: storefrontOrigin(c.origins),
    product_count: inventorySkuCountForCategory(c.name) || c.total_skus,
    image_url: c.image_url,
  }));
}

export async function getMarketplaceProducts(): Promise<MarketplaceProduct[]> {
  await delay();
  return [...marketplaceProducts];
}

export async function getAdminCategoryCards(): Promise<AdminCategoryCard[]> {
  await delay();
  return [...adminCategoryCards];
}

export async function getAdminCategoryById(
  id: string,
): Promise<AdminCategoryCard | null> {
  await delay();
  return adminCategoryCards.find((c) => c.id === id) ?? null;
}

export async function getAdminInventoryItems(): Promise<AdminInventoryItem[]> {
  await delay();
  return [...adminInventoryItems];
}

export async function getAdminInventoryKpis(): Promise<AdminInventoryKpis> {
  await delay();
  return { ...adminInventoryKpis };
}

export async function getAdminDashboard(): Promise<{
  kpis: AdminDashboardKpis;
  sourcingRows: DashboardSourcingRow[];
  logistics: LogisticsPipelineCard[];
}> {
  await delay();
  return {
    kpis: adminDashboardKpis,
    sourcingRows: adminDashboardSourcingRows,
    logistics: adminLogisticsPipeline,
  };
}
