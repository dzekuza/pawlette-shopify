import { NextResponse } from 'next/server';
import { getCustomerSessionToken } from '@/lib/customer-session';
import { createCustomerAddress } from '@/lib/shopify-customer';

export async function POST(request: Request) {
  const customerAccessToken = await getCustomerSessionToken();

  if (!customerAccessToken) {
    return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 });
  }

  const body = await request.json();
  const result = await createCustomerAddress(customerAccessToken, {
    firstName: String(body.firstName ?? '').trim(),
    lastName: String(body.lastName ?? '').trim(),
    address1: String(body.address1 ?? '').trim(),
    address2: String(body.address2 ?? '').trim(),
    city: String(body.city ?? '').trim(),
    province: String(body.province ?? '').trim(),
    zip: String(body.zip ?? '').trim(),
    country: String(body.country ?? '').trim(),
    phone: String(body.phone ?? '').trim(),
  });

  if (result.errors.length > 0 || !result.customer) {
    return NextResponse.json(
      { error: result.errors[0] ?? 'Unable to save your address.' },
      { status: 400 }
    );
  }

  return NextResponse.json({ customer: result.customer });
}
