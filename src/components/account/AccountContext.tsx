'use client';

import { createContext, use, useMemo, useState, type Dispatch, type FormEvent, type ReactNode, type SetStateAction } from 'react';
import type { CustomerAccount } from '@/lib/customer-types';
import { getInitials, readJson } from './account-format';

export type AccountTab = 'orders' | 'profile' | 'addresses' | 'wishlist';
export type AccountFeedback = { kind: 'error' | 'success'; message: string } | null;

export interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  acceptsMarketing: boolean;
}

export interface AddressForm {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  phone: string;
}

interface AccountState {
  customer: CustomerAccount | null;
  customerInitials: string;
  activeTab: AccountTab;
  feedback: AccountFeedback;
  isProfileSaving: boolean;
  isAddressSaving: boolean;
  showAddressForm: boolean;
  profileForm: ProfileForm;
  addressForm: AddressForm;
}

interface AccountActions {
  setActiveTab: (tab: AccountTab) => void;
  setProfileForm: Dispatch<SetStateAction<ProfileForm>>;
  setAddressForm: Dispatch<SetStateAction<AddressForm>>;
  toggleAddressForm: () => void;
  saveProfile: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  saveAddress: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  logout: () => Promise<void>;
}

interface AccountMeta {
  hostedAccountLoginUrl: string;
  hostedAccountUrl: string;
}

interface AccountContextValue {
  state: AccountState;
  actions: AccountActions;
  meta: AccountMeta;
}

const AccountContext = createContext<AccountContextValue | null>(null);

/** Reads account state, actions and meta. Must be used inside `<Account.Provider>`. */
export function useAccount(): AccountContextValue {
  const ctx = use(AccountContext);
  if (!ctx) throw new Error('useAccount must be used within <Account.Provider>');
  return ctx;
}

/** Same as `useAccount`, but `state.customer` is guaranteed — use only under `<Account.SignedIn>`. */
export function useSignedInAccount() {
  const { state, actions, meta } = useAccount();
  if (!state.customer) throw new Error('useSignedInAccount must be used within <Account.SignedIn>');
  return { state: { ...state, customer: state.customer }, actions, meta };
}

function toMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

async function sendJson<T>(url: string, method: 'POST' | 'PATCH', body: unknown): Promise<T> {
  return readJson<T>(
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  );
}

/** The only place that knows how customer, tab, feedback and form state are managed. */
export function AccountProvider({
  initialCustomer,
  hostedAccountLoginUrl,
  hostedAccountUrl,
  children,
}: {
  initialCustomer: CustomerAccount | null;
  hostedAccountLoginUrl: string;
  hostedAccountUrl: string;
  children: ReactNode;
}) {
  const [customer, setCustomer] = useState<CustomerAccount | null>(initialCustomer);
  const [activeTab, setActiveTab] = useState<AccountTab>('orders');
  const [feedback, setFeedback] = useState<AccountFeedback>(null);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isAddressSaving, setIsAddressSaving] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    firstName: initialCustomer?.firstName ?? '',
    lastName: initialCustomer?.lastName ?? '',
    email: initialCustomer?.email ?? '',
    phone: initialCustomer?.phone ?? '',
    acceptsMarketing: initialCustomer?.acceptsMarketing ?? false,
  });
  const [addressForm, setAddressForm] = useState<AddressForm>({
    firstName: initialCustomer?.firstName ?? '',
    lastName: initialCustomer?.lastName ?? '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    zip: '',
    country: 'Lietuva',
    phone: initialCustomer?.phone ?? '',
  });

  const customerInitials = useMemo(() => (customer ? getInitials(customer) : 'PŽ'), [customer]);

  function applyCustomer(nextCustomer: CustomerAccount | null) {
    setCustomer(nextCustomer);
    if (!nextCustomer) return;

    setProfileForm({
      firstName: nextCustomer.firstName,
      lastName: nextCustomer.lastName,
      email: nextCustomer.email,
      phone: nextCustomer.phone,
      acceptsMarketing: nextCustomer.acceptsMarketing,
    });
    setAddressForm((current) => ({
      ...current,
      firstName: nextCustomer.firstName,
      lastName: nextCustomer.lastName,
      phone: nextCustomer.phone,
    }));
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsProfileSaving(true);
    setFeedback(null);

    try {
      const payload = await sendJson<{ customer: CustomerAccount }>('/api/account', 'PATCH', profileForm);
      applyCustomer(payload.customer);
      setFeedback({ kind: 'success', message: 'Profilis atnaujintas.' });
    } catch (error) {
      setFeedback({ kind: 'error', message: toMessage(error, 'Nepavyko išsaugoti profilio.') });
    } finally {
      setIsProfileSaving(false);
    }
  }

  async function saveAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsAddressSaving(true);
    setFeedback(null);

    try {
      const payload = await sendJson<{ customer: CustomerAccount }>('/api/account/addresses', 'POST', addressForm);
      applyCustomer(payload.customer);
      setShowAddressForm(false);
      setAddressForm((current) => ({
        ...current,
        address1: '',
        address2: '',
        city: '',
        province: '',
        zip: '',
        country: current.country || 'Lietuva',
      }));
      setFeedback({ kind: 'success', message: 'Adresas išsaugotas.' });
    } catch (error) {
      setFeedback({ kind: 'error', message: toMessage(error, 'Nepavyko išsaugoti adreso.') });
    } finally {
      setIsAddressSaving(false);
    }
  }

  async function logout() {
    setFeedback(null);
    await fetch('/api/account/logout', { method: 'POST' });
    applyCustomer(null);
    setActiveTab('orders');
    setFeedback({ kind: 'success', message: 'Atsijungėte sėkmingai.' });
  }

  return (
    <AccountContext
      value={{
        state: {
          customer,
          customerInitials,
          activeTab,
          feedback,
          isProfileSaving,
          isAddressSaving,
          showAddressForm,
          profileForm,
          addressForm,
        },
        actions: {
          setActiveTab,
          setProfileForm,
          setAddressForm,
          toggleAddressForm: () => setShowAddressForm((current) => !current),
          saveProfile,
          saveAddress,
          logout,
        },
        meta: { hostedAccountLoginUrl, hostedAccountUrl },
      }}
    >
      {children}
    </AccountContext>
  );
}
