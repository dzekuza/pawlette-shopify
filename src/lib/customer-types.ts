export interface CustomerAddress {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  phone: string;
  formatted: string[];
}

export interface CustomerOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  fulfillmentStatus: string;
  financialStatus: string;
  totalAmount: string;
  currencyCode: string;
}

export interface CustomerAccount {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  acceptsMarketing: boolean;
  numberOfOrders: number;
  defaultAddressId: string | null;
  addresses: CustomerAddress[];
  orders: CustomerOrder[];
}
