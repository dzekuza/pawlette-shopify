import type { Metadata } from 'next';
import { AccountPageClient } from '@/components/account/AccountPageClient';
import { getCustomerSessionToken } from '@/lib/customer-session';
import { getCustomerByAccessToken } from '@/lib/shopify-customer';

export const metadata: Metadata = {
  title: 'Paskyra',
  description: 'Prisijunkite prie PawCharms paskyros, peržiūrėkite užsakymus ir tvarkykite adresus.',
};

export default async function AccountPage() {
  const customerAccessToken = await getCustomerSessionToken();
  const customer = customerAccessToken ? await getCustomerByAccessToken(customerAccessToken) : null;

  return <AccountPageClient initialCustomer={customer} />;
}
