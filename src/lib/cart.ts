import { shopifyClient } from './shopify';

const CART_ID_KEY = 'pawlette_shopify_cart_id';
export const SHOPIFY_CART_UPDATED_EVENT = 'shopify-cart-updated';

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: { title: string; featuredImage?: { url: string } };
    price: { amount: string };
    image?: { url: string };
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

interface CartUpdatedEventDetail {
  totalQuantity: number;
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
              image { url }
              price { amount }
              product { title featuredImage { url } }
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

interface CartLineNode {
  node: ShopifyCartLine;
}

interface CartShape {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: CartLineNode[];
  };
  cost: ShopifyCart['cost'];
}

function emitCartUpdated(cart: ShopifyCart | null): void {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent<CartUpdatedEventDetail>(SHOPIFY_CART_UPDATED_EVENT, {
      detail: { totalQuantity: cart?.totalQuantity ?? 0 },
    })
  );
}

function parseCart(cartData: CartShape): ShopifyCart {
  return {
    id: cartData.id,
    checkoutUrl: cartData.checkoutUrl,
    totalQuantity: cartData.totalQuantity,
    lines: cartData.lines.edges.map((edge) => edge.node),
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

export function clearStoredCartId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_ID_KEY);
}

export async function addLineToCart(variantId: string, quantity = 1): Promise<ShopifyCart> {
  return addLinesToCart([{ merchandiseId: variantId, quantity }]);
}

export async function addLinesToCart(lines: { merchandiseId: string; quantity: number }[]): Promise<ShopifyCart> {
  const cartId = getStoredCartId();

  if (cartId) {
    const { data } = await shopifyClient.request(ADD_TO_CART, {
      variables: { cartId, lines },
    });
    const cart = parseCart(data.cartLinesAdd.cart);
    emitCartUpdated(cart);
    return cart;
  }

  const { data } = await shopifyClient.request(CREATE_CART, {
    variables: { lines },
  });
  const cart = parseCart(data.cartCreate.cart);
  setStoredCartId(cart.id);
  emitCartUpdated(cart);
  return cart;
}

export async function fetchCart(): Promise<ShopifyCart | null> {
  const cartId = getStoredCartId();
  if (!cartId) {
    emitCartUpdated(null);
    return null;
  }
  const { data } = await shopifyClient.request(GET_CART, { variables: { cartId } });
  if (!data?.cart) {
    clearStoredCartId();
    emitCartUpdated(null);
    return null;
  }
  const cart = parseCart(data.cart);
  emitCartUpdated(cart);
  return cart;
}

export async function removeCartLine(cartId: string, lineId: string): Promise<ShopifyCart> {
  const { data } = await shopifyClient.request(REMOVE_CART_LINES, {
    variables: { cartId, lineIds: [lineId] },
  });
  const cart = parseCart(data.cartLinesRemove.cart);
  emitCartUpdated(cart);
  return cart;
}
