import 'server-only';

import { cookies } from 'next/headers';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from './shopify-customer';

const baseCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

export async function getCustomerSessionToken(): Promise<string | null> {
  return (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function setCustomerSessionToken(accessToken: string, expiresAt?: string): Promise<void> {
  (await cookies()).set(CUSTOMER_ACCESS_TOKEN_COOKIE, accessToken, {
    ...baseCookieOptions,
    expires: expiresAt ? new Date(expiresAt) : undefined,
  });
}

export async function clearCustomerSessionToken(): Promise<void> {
  (await cookies()).set(CUSTOMER_ACCESS_TOKEN_COOKIE, '', {
    ...baseCookieOptions,
    maxAge: 0,
  });
}
