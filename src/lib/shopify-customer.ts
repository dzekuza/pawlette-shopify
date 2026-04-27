import 'server-only';

import { shopifyClient } from './shopify';
import type { CustomerAccount, CustomerAddress } from './customer-types';

export const CUSTOMER_ACCESS_TOKEN_COOKIE = 'pawlette_customer_access_token';

export interface CustomerAuthResult {
  customer: CustomerAccount | null;
  accessToken?: string;
  expiresAt?: string;
  errors: string[];
}

export interface CustomerRegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CustomerProfileInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  acceptsMarketing: boolean;
}

export interface CustomerAddressInput {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  zip?: string;
  country: string;
  phone?: string;
}

interface ShopifyUserError {
  message: string;
}

interface GraphQlError {
  message: string;
}

interface ResponseErrorsLike {
  message?: string;
  graphQLErrors?: GraphQlError[];
}

interface CustomerAccessTokenShape {
  accessToken: string;
  expiresAt: string;
}

interface CustomerAddressNode {
  id: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  province?: string | null;
  zip?: string | null;
  country?: string | null;
  phone?: string | null;
  formatted?: string[] | null;
}

interface CustomerOrderNode {
  id: string;
  orderNumber: number;
  processedAt: string;
  fulfillmentStatus?: string | null;
  financialStatus?: string | null;
  currentTotalPrice: {
    amount: string;
    currencyCode: string;
  };
}

interface CustomerShape {
  id: string;
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  acceptsMarketing: boolean;
  numberOfOrders: number;
  defaultAddress?: CustomerAddressNode | null;
  addresses: {
    nodes: CustomerAddressNode[];
  };
  orders: {
    nodes: CustomerOrderNode[];
  };
}

interface CustomerQueryResponse {
  customer: CustomerShape | null;
}

interface CustomerAccessTokenCreateResponse {
  customerAccessTokenCreate: {
    customerAccessToken: CustomerAccessTokenShape | null;
    customerUserErrors: ShopifyUserError[];
  };
}

interface CustomerCreateResponse {
  customerCreate: {
    customer: {
      id: string;
    } | null;
    customerUserErrors: ShopifyUserError[];
  };
}

interface CustomerRecoverResponse {
  customerRecover: {
    customerUserErrors: ShopifyUserError[];
  };
}

interface CustomerUpdateResponse {
  customerUpdate: {
    customer: CustomerShape | null;
    customerAccessToken: CustomerAccessTokenShape | null;
    customerUserErrors: ShopifyUserError[];
  };
}

interface CustomerAddressCreateResponse {
  customerAddressCreate: {
    customerAddress: CustomerAddressNode | null;
    customerUserErrors: ShopifyUserError[];
  };
}

interface CustomerAccessTokenDeleteResponse {
  customerAccessTokenDelete: {
    deletedAccessToken?: string | null;
    userErrors: ShopifyUserError[];
  };
}

const CUSTOMER_FRAGMENT = `
  fragment CustomerAccountFields on Customer {
    id
    displayName
    firstName
    lastName
    email
    phone
    acceptsMarketing
    numberOfOrders
    defaultAddress {
      id
    }
    addresses(first: 20) {
      nodes {
        id
        name
        firstName
        lastName
        address1
        address2
        city
        province
        zip
        country
        phone
        formatted
      }
    }
    orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
      nodes {
        id
        orderNumber
        processedAt
        fulfillmentStatus
        financialStatus
        currentTotalPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

const CUSTOMER_QUERY = `
  ${CUSTOMER_FRAGMENT}
  query GetCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerAccountFields
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        message
      }
    }
  }
`;

const CUSTOMER_CREATE_MUTATION = `
  mutation CustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        message
      }
    }
  }
`;

const CUSTOMER_RECOVER_MUTATION = `
  mutation CustomerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        message
      }
    }
  }
`;

const CUSTOMER_UPDATE_MUTATION = `
  ${CUSTOMER_FRAGMENT}
  mutation CustomerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        ...CustomerAccountFields
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        message
      }
    }
  }
`;

const CUSTOMER_ADDRESS_CREATE_MUTATION = `
  mutation CustomerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        id
      }
      customerUserErrors {
        message
      }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION = `
  mutation CustomerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      userErrors {
        message
      }
    }
  }
`;

function collectMessages(userErrors?: ShopifyUserError[], responseErrors?: ResponseErrorsLike): string[] {
  const graphQlMessages = responseErrors?.graphQLErrors?.map((error) => error.message) ?? [];
  const responseMessage = responseErrors?.message ? [responseErrors.message] : [];
  const messages = [
    ...(userErrors ?? []).map((error) => error.message),
    ...graphQlMessages,
    ...responseMessage,
  ].filter(Boolean);

  return messages.length > 0 ? messages : [];
}

function toCustomerAddress(address: CustomerAddressNode): CustomerAddress {
  return {
    id: address.id,
    name: address.name ?? '',
    firstName: address.firstName ?? '',
    lastName: address.lastName ?? '',
    address1: address.address1 ?? '',
    address2: address.address2 ?? '',
    city: address.city ?? '',
    province: address.province ?? '',
    zip: address.zip ?? '',
    country: address.country ?? '',
    phone: address.phone ?? '',
    formatted: address.formatted ?? [],
  };
}

function toCustomerAccount(customer: CustomerShape): CustomerAccount {
  return {
    id: customer.id,
    displayName: customer.displayName ?? '',
    firstName: customer.firstName ?? '',
    lastName: customer.lastName ?? '',
    email: customer.email ?? '',
    phone: customer.phone ?? '',
    acceptsMarketing: customer.acceptsMarketing,
    numberOfOrders: customer.numberOfOrders,
    defaultAddressId: customer.defaultAddress?.id ?? null,
    addresses: customer.addresses.nodes.map(toCustomerAddress),
    orders: customer.orders.nodes.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      processedAt: order.processedAt,
      fulfillmentStatus: order.fulfillmentStatus ?? 'UNFULFILLED',
      financialStatus: order.financialStatus ?? 'PENDING',
      totalAmount: order.currentTotalPrice.amount,
      currencyCode: order.currentTotalPrice.currencyCode,
    })),
  };
}

export async function getCustomerByAccessToken(customerAccessToken: string): Promise<CustomerAccount | null> {
  const { data, errors } = await shopifyClient.request<CustomerQueryResponse>(CUSTOMER_QUERY, {
    variables: { customerAccessToken },
  });

  if (errors || !data?.customer) {
    return null;
  }

  return toCustomerAccount(data.customer);
}

export async function loginCustomer(email: string, password: string): Promise<CustomerAuthResult> {
  const { data, errors } = await shopifyClient.request<CustomerAccessTokenCreateResponse>(
    CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
    {
      variables: {
        input: {
          email,
          password,
        },
      },
    }
  );

  const userErrors = data?.customerAccessTokenCreate.customerUserErrors ?? [];
  const messages = collectMessages(userErrors, errors);

  if (!data?.customerAccessTokenCreate.customerAccessToken) {
    return {
      customer: null,
      errors: messages.length > 0 ? messages : ['Unable to sign in.'],
    };
  }

  const token = data.customerAccessTokenCreate.customerAccessToken;
  const customer = await getCustomerByAccessToken(token.accessToken);

  if (!customer) {
    return {
      customer: null,
      errors: ['We could not load your account right now.'],
    };
  }

  return {
    customer,
    accessToken: token.accessToken,
    expiresAt: token.expiresAt,
    errors: messages,
  };
}

export async function registerCustomer(input: CustomerRegisterInput): Promise<CustomerAuthResult> {
  const { data, errors } = await shopifyClient.request<CustomerCreateResponse>(CUSTOMER_CREATE_MUTATION, {
    variables: {
      input,
    },
  });

  const userErrors = data?.customerCreate.customerUserErrors ?? [];
  const messages = collectMessages(userErrors, errors);

  if (!data?.customerCreate.customer || messages.length > 0) {
    return {
      customer: null,
      errors: messages.length > 0 ? messages : ['Unable to create your account.'],
    };
  }

  return loginCustomer(input.email, input.password);
}

export async function recoverCustomerPassword(email: string): Promise<string[]> {
  const { data, errors } = await shopifyClient.request<CustomerRecoverResponse>(CUSTOMER_RECOVER_MUTATION, {
    variables: { email },
  });

  return collectMessages(data?.customerRecover.customerUserErrors, errors);
}

export async function updateCustomerProfile(
  customerAccessToken: string,
  profile: CustomerProfileInput
): Promise<CustomerAuthResult> {
  const { data, errors } = await shopifyClient.request<CustomerUpdateResponse>(CUSTOMER_UPDATE_MUTATION, {
    variables: {
      customerAccessToken,
      customer: profile,
    },
  });

  const userErrors = data?.customerUpdate.customerUserErrors ?? [];
  const messages = collectMessages(userErrors, errors);
  const customer = data?.customerUpdate.customer ? toCustomerAccount(data.customerUpdate.customer) : null;

  return {
    customer,
    accessToken: data?.customerUpdate.customerAccessToken?.accessToken,
    expiresAt: data?.customerUpdate.customerAccessToken?.expiresAt,
    errors: messages,
  };
}

export async function createCustomerAddress(
  customerAccessToken: string,
  address: CustomerAddressInput
): Promise<{ customer: CustomerAccount | null; errors: string[] }> {
  const { data, errors } = await shopifyClient.request<CustomerAddressCreateResponse>(
    CUSTOMER_ADDRESS_CREATE_MUTATION,
    {
      variables: {
        customerAccessToken,
        address,
      },
    }
  );

  const messages = collectMessages(data?.customerAddressCreate.customerUserErrors, errors);

  if (messages.length > 0 || !data?.customerAddressCreate.customerAddress) {
    return {
      customer: null,
      errors: messages.length > 0 ? messages : ['Unable to save your address.'],
    };
  }

  return {
    customer: await getCustomerByAccessToken(customerAccessToken),
    errors: [],
  };
}

export async function deleteCustomerAccessToken(customerAccessToken: string): Promise<string[]> {
  const { data, errors } = await shopifyClient.request<CustomerAccessTokenDeleteResponse>(
    CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
    {
      variables: { customerAccessToken },
    }
  );

  return collectMessages(data?.customerAccessTokenDelete.userErrors, errors);
}
