import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { shopifyClient } from '@/lib/shopify';
import { NEWSLETTER_DISCOUNT_CODE } from '@/lib/site-config';

interface CustomerCreateResponse {
  customerCreate: {
    customer: {
      id: string;
    } | null;
    customerUserErrors: Array<{
      code?: string;
      message: string;
    }>;
  };
}

const NEWSLETTER_CUSTOMER_CREATE_MUTATION = `
  mutation NewsletterCustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        message
      }
    }
  }
`;

function isExistingCustomerError(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes('already') || normalized.includes('exists') || normalized.includes('taken');
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? '').trim().toLowerCase();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Įveskite galiojantį el. pašto adresą.' }, { status: 400 });
  }

  // Shopify limits password length to a maximum of 40 characters.
  const password = `PC-${randomUUID().slice(0, 16)}-Aa1!`;

  const { data, errors } = await shopifyClient.request<CustomerCreateResponse>(
    NEWSLETTER_CUSTOMER_CREATE_MUTATION,
    {
      variables: {
        input: {
          email,
          password,
          acceptsMarketing: true,
        },
      },
    }
  );

  const messages = [
    ...(data?.customerCreate.customerUserErrors ?? []).map((error) => error.message),
    ...(errors?.graphQLErrors?.map((error) => error.message) ?? []),
    ...(errors?.message ? [errors.message] : []),
  ].filter(Boolean);

  const hasTakenError = (data?.customerCreate.customerUserErrors ?? []).some(
    (error) => error.code === 'TAKEN'
  );
  const duplicate = hasTakenError || messages.some(isExistingCustomerError);
  if (!data?.customerCreate.customer && !duplicate) {
    return NextResponse.json(
      { error: messages[0] ?? 'Nepavyko užregistruoti el. pašto.' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    code: NEWSLETTER_DISCOUNT_CODE,
  });
}
