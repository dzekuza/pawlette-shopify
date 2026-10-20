import { randomUUID } from 'node:crypto';
import { after, NextResponse } from 'next/server';
import { shopifyClient } from '@/lib/shopify';
import { NEWSLETTER_DISCOUNT_CODE } from '@/lib/site-config';
import { GA_LEAD_SOURCES, sendGaLead, type GaLeadSource } from '@/lib/ga-purchase';

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

// Basic per-IP limit so the endpoint can't be used to probe many addresses quickly. It is held in
// memory per server instance, so it slows bursts rather than guaranteeing a global cap; add a
// Vercel WAF rate-limit rule on /api/newsletter for a hard limit.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestLog = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  if (requestLog.size > 1000) {
    for (const [key, entry] of requestLog) {
      if (entry.resetAt <= now) requestLog.delete(key);
    }
  }
  const entry = requestLog.get(ip);
  if (!entry || entry.resetAt <= now) {
    requestLog.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

function isExistingCustomerError(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes('already') || normalized.includes('exists') || normalized.includes('taken');
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Per daug bandymų. Pabandykite vėliau.' }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? '').trim().toLowerCase();
  const consent = body.consent === true;
  // Present only when the visitor accepted analytics cookies (see getGaBrowserIds on the client).
  const gaClientId = typeof body.gaClientId === 'string' ? body.gaClientId.slice(0, 100) : '';
  const leadSource = GA_LEAD_SOURCES.find((source) => source === body.leadSource) as GaLeadSource | undefined;

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Įveskite galiojantį el. pašto adresą.' }, { status: 400 });
  }

  // EU marketing opt-in must be explicit: never subscribe without the consent checkbox.
  if (!consent) {
    return NextResponse.json({ error: 'Reikalingas sutikimas gauti naujienas el. paštu.' }, { status: 400 });
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
          acceptsMarketing: consent,
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

  // Count the lead only for a newly created customer, and do it here: telling the browser
  // whether the address already existed would let anyone test which emails are customers.
  // `after` runs it once the response has gone out, so response time is the same either way.
  if (data?.customerCreate.customer && gaClientId && leadSource) {
    after(() => sendGaLead(gaClientId, leadSource));
  }

  return NextResponse.json({
    success: true,
    code: NEWSLETTER_DISCOUNT_CODE,
  });
}
