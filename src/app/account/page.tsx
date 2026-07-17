import type { Metadata } from 'next';
import { AccountPageClient } from '@/components/account/AccountPageClient';
import { getCustomerSessionToken } from '@/lib/customer-session';
import { getCustomerByAccessToken } from '@/lib/shopify-customer';

const HOSTED_ACCOUNT_LOGIN_URL = 'https://checkout.pawcharms.lt/customer_authentication/login';
const HOSTED_ACCOUNT_URL = 'https://checkout.pawcharms.lt/account';

export const metadata: Metadata = {
  title: 'Paskyra',
  description: 'Prisijunkite prie PawCharms paskyros, peržiūrėkite užsakymus ir tvarkykite adresus.',
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const customerAccessToken = await getCustomerSessionToken();
  const customer = customerAccessToken ? await getCustomerByAccessToken(customerAccessToken) : null;

  return (
    <AccountPageClient
      initialCustomer={customer}
      hostedAccountLoginUrl={HOSTED_ACCOUNT_LOGIN_URL}
      hostedAccountUrl={HOSTED_ACCOUNT_URL}
    />
  );
}
