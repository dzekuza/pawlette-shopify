'use client';

import type { ReactNode } from 'react';
import { Heart, LogOut, MapPin, Package, UserRound, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SurfaceCard } from '@/components/storefront/SurfaceCard';
import { useAccount, useSignedInAccount, type AccountTab } from './AccountContext';
import { getDisplayName } from './account-format';
import { AccountActionButton, AccountNavButton } from './AccountUi';

const NAV_ITEMS: { id: AccountTab; label: string; icon: LucideIcon }[] = [
  { id: 'orders', label: 'Užsakymai', icon: Package },
  { id: 'profile', label: 'Profilis', icon: UserRound },
  { id: 'addresses', label: 'Adresai', icon: MapPin },
  { id: 'wishlist', label: 'Norų sąrašas', icon: Heart },
];

export function AccountFeedbackBanner() {
  const { state } = useAccount();
  const { feedback } = state;
  if (!feedback) return null;

  return (
    <div className="mx-auto mb-2 mt-4 max-w-[900px] px-4 md:px-6">
      <div
        className={cn(
          'rounded-2xl border px-4 py-3 text-[14px]',
          feedback.kind === 'error'
            ? 'border-blossom/40 bg-blossom/20 text-bark'
            : 'border-sage/40 bg-sage/15 text-interactive-text',
        )}
      >
        {feedback.message}
      </div>
    </div>
  );
}

export function AccountSignedIn({ children }: { children: ReactNode }) {
  const { state } = useAccount();
  return state.customer ? <>{children}</> : null;
}

export function AccountSignedOut({ children }: { children?: ReactNode }) {
  const { state } = useAccount();
  return state.customer ? null : <>{children}</>;
}

export function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[980px] flex-col items-start gap-6 px-4 pb-[60px] md:flex-row md:gap-8 md:px-6 md:pb-20">
      {children}
    </div>
  );
}

/** Profile summary, tab navigation and (desktop) logout. */
export function AccountTabs() {
  const { state, actions } = useSignedInAccount();
  const { customer, customerInitials, activeTab } = state;

  return (
    <div className="w-full shrink-0 md:w-[240px]">
      <SurfaceCard className="rounded-[28px] p-4 md:p-5">
        <div className="mb-0 flex flex-row items-center gap-4 pb-5 md:mb-1 md:flex-col md:gap-3 md:pb-6">
          <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[18px] bg-sage text-[20px] font-bold tracking-[-0.04em] text-bark md:h-[72px] md:w-[72px] md:text-[26px]">
            {customerInitials}
          </div>
          <div className="min-w-0 md:text-center">
            <div className="truncate text-[15px] font-bold text-bark">{getDisplayName(customer)}</div>
            <div className="mt-1 truncate text-[12px] text-bark-muted">{customer.email}</div>
          </div>
        </div>

        <div className="flex flex-row gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-x-visible md:pb-0">
          {NAV_ITEMS.map((item) => (
            <AccountNavButton
              key={item.id}
              onClick={() => actions.setActiveTab(item.id)}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
            />
          ))}
        </div>

        <AccountActionButton
          onClick={actions.logout}
          variant="ghost"
          align="start"
          fullWidth
          icon={LogOut}
          className="mt-6 hidden md:inline-flex"
        >
          Atsijungti
        </AccountActionButton>
      </SurfaceCard>
    </div>
  );
}

/** Content column for the tab panels; also renders the mobile logout button. */
export function AccountContent({ children }: { children: ReactNode }) {
  const { actions } = useSignedInAccount();

  return (
    <div className="min-w-0 flex-1">
      {children}
      <AccountActionButton
        onClick={actions.logout}
        variant="ghost"
        align="start"
        fullWidth
        icon={LogOut}
        className="mt-8 md:hidden"
      >
        Atsijungti
      </AccountActionButton>
    </div>
  );
}

/** Hosted Shopify login card shown when there is no customer. */
export function AccountLoginCard() {
  const { meta } = useAccount();

  return (
    <div className="mx-auto w-full max-w-[560px] px-4 pb-20">
      <SurfaceCard className="rounded-3xl px-6 py-10 md:px-9">
        <h1 className="account-heading-1 mb-3">Prisijunkite per Shopify</h1>
        <p className="account-copy mb-6 max-w-[40ch]">
          PawsCharm klientų paskyros dabar naudoja Shopify el. pašto kodo prisijungimą, tokį patį kaip ir atsiskaityme.
        </p>
        <div className="mb-8 rounded-[22px] border border-border bg-surface-2/70 px-5 py-5">
          <div className="mb-2 text-[14px] font-semibold text-bark">Kaip prisijungti</div>
          <div className="text-[14px] leading-6 text-bark-light">
            Paspaudę mygtuką būsite nukreipti į oficialų Shopify paskyros langą. Ten įvesite el. paštą ir gausite prisijungimo kodą el. paštu.
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <a
            href={meta.hostedAccountLoginUrl}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-sage px-5 py-4 text-[15px] font-bold text-bark no-underline transition-colors duration-150 hover:bg-sage-dark"
          >
            Tęsti su el. paštu
          </a>
          <a
            href={meta.hostedAccountUrl}
            className="inline-flex w-full items-center justify-center rounded-2xl border border-border bg-white px-5 py-4 text-[15px] font-semibold text-bark no-underline transition-colors duration-150 hover:bg-surface-2"
          >
            Atidaryti paskyros centrą
          </a>
        </div>
        <p className="mt-6 text-[13px] leading-6 text-bark-muted">
          Jei paskyra jau aktyvi, Shopify atidarys jūsų užsakymus, profilį ir kitą paskyros informaciją.
        </p>
      </SurfaceCard>
    </div>
  );
}
