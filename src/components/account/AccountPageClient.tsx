'use client';

import { useRouter } from 'next/navigation';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useCartCount } from '@/hooks/useCartCount';
import type { CustomerAccount } from '@/lib/customer-types';
import { Account } from './Account';

interface AccountPageClientProps {
  initialCustomer: CustomerAccount | null;
  hostedAccountLoginUrl: string;
  hostedAccountUrl: string;
}

export function AccountPageClient({
  initialCustomer,
  hostedAccountLoginUrl,
  hostedAccountUrl,
}: AccountPageClientProps) {
  const router = useRouter();
  const cartCount = useCartCount();

  return (
    <div className="account-page min-h-screen bg-cream font-sans">
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      <div className="pt-[100px]">
        <Account.Provider
          initialCustomer={initialCustomer}
          hostedAccountLoginUrl={hostedAccountLoginUrl}
          hostedAccountUrl={hostedAccountUrl}
        >
          <Account.Feedback />

          <Account.SignedIn>
            <Account.Layout>
              <Account.Tabs />
              <Account.Content>
                <Account.Orders />
                <Account.Profile />
                <Account.Addresses />
                <Account.Wishlist />
              </Account.Content>
            </Account.Layout>
          </Account.SignedIn>

          <Account.SignedOut>
            <Account.LoginCard />
          </Account.SignedOut>
        </Account.Provider>
      </div>

      <LandingFooter />
    </div>
  );
}
