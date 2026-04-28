import { NextResponse } from 'next/server';
import { recoverCustomerPassword } from '@/lib/shopify-customer';

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email ?? '').trim();

  if (!email) {
    return NextResponse.json({ error: 'El. paštas yra privalomas.' }, { status: 400 });
  }

  const errors = await recoverCustomerPassword(email);

  if (errors.length > 0) {
    return NextResponse.json({ error: errors[0] }, { status: 400 });
  }

  return NextResponse.json({
    message: 'Jei paskyra su šiuo el. paštu egzistuoja, atkūrimo nuoroda jau išsiųsta.',
  });
}
