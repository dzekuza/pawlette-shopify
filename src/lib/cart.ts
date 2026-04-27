import { shopifyClient } from './shopify';

const CART_ID_KEY = 'pawlette_shopify_cart_id';

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: { title: string };
    price: { amount: string };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: ShopifyCartLine[];
  cost: {
    totalAmount: { amount: string; currencyCode: string };
  };
}

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price { amount }
              product { title }
            }
          }
        }
      }
    }
    cost {
      totalAmount { amount currencyCode }
    }
  }
`;

const CREATE_CART = `
  ${CART_FRAGMENT}
  mutation cartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFields }
    }
  }
`;

const ADD_TO_CART = `
  ${CART_FRAGMENT}
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
    }
  }
`;

const GET_CART = `
  ${CART_FRAGMENT}
  query getCart($cartId: ID!) {
    cart(id: $cartId) { ...CartFields }
  }
`;

const REMOVE_CART_LINES = `
  ${CART_FRAGMENT}
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseCart(cartData: any): ShopifyCart {
  return {
    id: cartData.id,
    checkoutUrl: cartData.checkoutUrl,
    totalQuantity: cartData.totalQuantity,
    lines: cartData.lines.edges.map((e: any) => e.node),
    cost: cartData.cost,
  };
}

export function getStoredCartId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CART_ID_KEY);
}

export function setStoredCartId(id: string): void {
  localStorage.setItem(CART_ID_KEY, id);
}

export async function addLineToCart(variantId: string, quantity = 1): Promise<ShopifyCart> {
  const cartId = getStoredCartId();

  if (cartId) {
    const { data } = await shopifyClient.request(ADD_TO_CART, {
      variables: { cartId, lines: [{ merchandiseId: variantId, quantity }] },
    });
    return parseCart(data.cartLinesAdd.cart);
  }

  const { data } = await shopifyClient.request(CREATE_CART, {
    variables: { lines: [{ merchandiseId: variantId, quantity }] },
  });
  const cart = parseCart(data.cartCreate.cart);
  setStoredCartId(cart.id);
  return cart;
}

export async function fetchCart(): Promise<ShopifyCart | null> {
  const cartId = getStoredCartId();
  if (!cartId) return null;
  const { data } = await shopifyClient.request(GET_CART, { variables: { cartId } });
  if (!data?.cart) return null;
  return parseCart(data.cart);
}

export async function removeCartLine(cartId: string, lineId: string): Promise<ShopifyCart> {
  const { data } = await shopifyClient.request(REMOVE_CART_LINES, {
    variables: { cartId, lineIds: [lineId] },
  });
  return parseCart(data.cartLinesRemove.cart);
}
