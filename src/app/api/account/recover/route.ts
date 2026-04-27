import { NextResponse } from 'next/server';
import { recoverCustomerPassword } from '@/lib/shopify-customer';

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email ?? '').trim();

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  const errors = await recoverCustomerPassword(email);

  if (errors.length > 0) {
    return NextResponse.json({ error: errors[0] }, { status: 400 });
  }

  return NextResponse.json({
    message: 'If an account exists for that email, a reset link has been sent.',
  });
}
