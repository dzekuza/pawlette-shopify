import { NextResponse } from 'next/server';
import { setCustomerSessionToken } from '@/lib/customer-session';
import { registerCustomer } from '@/lib/shopify-customer';

export async function POST(request: Request) {
  const body = await request.json();
  const firstName = String(body.firstName ?? '').trim();
  const lastName = String(body.lastName ?? '').trim();
  const email = String(body.email ?? '').trim();
  const password = String(body.password ?? '');

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  const result = await registerCustomer({ firstName, lastName, email, password });

  if (!result.customer || !result.accessToken) {
    return NextResponse.json(
      { error: result.errors[0] ?? 'Unable to create your account.' },
      { status: 400 }
    );
  }

  await setCustomerSessionToken(result.accessToken, result.expiresAt);

  return NextResponse.json({ customer: result.customer });
}
