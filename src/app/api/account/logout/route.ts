import { NextResponse } from 'next/server';
import { clearCustomerSessionToken, getCustomerSessionToken } from '@/lib/customer-session';
import { deleteCustomerAccessToken } from '@/lib/shopify-customer';

export async function POST() {
  const customerAccessToken = await getCustomerSessionToken();

  if (customerAccessToken) {
    await deleteCustomerAccessToken(customerAccessToken);
  }

  await clearCustomerSessionToken();

  return NextResponse.json({ ok: true });
}
