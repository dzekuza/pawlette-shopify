import { AccountPageClient } from '@/components/account/AccountPageClient';
import { getCustomerSessionToken } from '@/lib/customer-session';
import { getCustomerByAccessToken } from '@/lib/shopify-customer';

export default async function AccountPage() {
  const customerAccessToken = await getCustomerSessionToken();
  const customer = customerAccessToken ? await getCustomerByAccessToken(customerAccessToken) : null;

  return <AccountPageClient initialCustomer={customer} />;
}
