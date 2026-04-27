import { NextResponse } from 'next/server';
import { getCustomerSessionToken, setCustomerSessionToken, clearCustomerSessionToken } from '@/lib/customer-session';
import { getCustomerByAccessToken, updateCustomerProfile } from '@/lib/shopify-customer';

export async function GET() {
  const customerAccessToken = await getCustomerSessionToken();

  if (!customerAccessToken) {
    return NextResponse.json({ customer: null }, { status: 401 });
  }

  const customer = await getCustomerByAccessToken(customerAccessToken);

  if (!customer) {
    await clearCustomerSessionToken();
    return NextResponse.json({ customer: null }, { status: 401 });
  }

  return NextResponse.json({ customer });
}

export async function PATCH(request: Request) {
  const customerAccessToken = await getCustomerSessionToken();

  if (!customerAccessToken) {
    return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 });
  }

  const body = await request.json();
  const result = await updateCustomerProfile(customerAccessToken, {
    firstName: String(body.firstName ?? '').trim(),
    lastName: String(body.lastName ?? '').trim(),
    email: String(body.email ?? '').trim(),
    phone: String(body.phone ?? '').trim(),
    acceptsMarketing: Boolean(body.acceptsMarketing),
  });

  if (result.errors.length > 0 || !result.customer) {
    return NextResponse.json(
      { error: result.errors[0] ?? 'Unable to update your profile.' },
      { status: 400 }
    );
  }

  if (result.accessToken) {
    await setCustomerSessionToken(result.accessToken, result.expiresAt);
  }

  return NextResponse.json({ customer: result.customer });
}
