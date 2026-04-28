import { NextResponse } from 'next/server';
import { setCustomerSessionToken } from '@/lib/customer-session';
import { loginCustomer } from '@/lib/shopify-customer';

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email ?? '').trim();
  const password = String(body.password ?? '');

  if (!email || !password) {
    return NextResponse.json({ error: 'El. paštas ir slaptažodis yra privalomi.' }, { status: 400 });
  }

  const result = await loginCustomer(email, password);

  if (!result.customer || !result.accessToken) {
    return NextResponse.json(
      { error: result.errors[0] ?? 'Nepavyko prisijungti.' },
      { status: 400 }
    );
  }

  await setCustomerSessionToken(result.accessToken, result.expiresAt);

  return NextResponse.json({ customer: result.customer });
}
