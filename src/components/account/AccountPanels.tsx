'use client';

import type { ComponentProps, ReactNode } from 'react';
import { Heart, MapPin, Package, Plus } from 'lucide-react';
import type { AddressForm } from './AccountContext';
import { useSignedInAccount, type AccountTab } from './AccountContext';
import { AccountActionButton, AccountEmptyState, AddressCard, OrderCard, inputClass } from './AccountUi';

function TabPanel({ tab, title, children }: { tab: AccountTab; title: string; children: ReactNode }) {
  const { state } = useSignedInAccount();
  if (state.activeTab !== tab) return null;

  return (
    <div>
      <h2 className="account-heading-2 mb-6">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, ...props }: { label: string } & ComponentProps<'input'>) {
  return (
    <div>
      <label className="account-label mb-2 block">{label}</label>
      <input className={`${inputClass} text-bark`} {...props} />
    </div>
  );
}

export function OrdersPanel() {
  const { state } = useSignedInAccount();
  const { orders } = state.customer;

  return (
    <TabPanel tab="orders" title="Jūsų užsakymai">
      {orders.length > 0 ? (
        orders.map((order) => <OrderCard key={order.id} order={order} />)
      ) : (
        <AccountEmptyState
          icon={Package}
          title="Užsakymų dar nėra"
          description="Būsimi jūsų užsakymai atsiras čia po apmokėjimo."
          actionHref="/products"
          actionLabel="Peržiūrėti produktus"
        />
      )}
    </TabPanel>
  );
}

export function ProfilePanel() {
  const { state, actions } = useSignedInAccount();
  const { profileForm, isProfileSaving } = state;

  return (
    <TabPanel tab="profile" title="Profilis">
      <form onSubmit={actions.saveProfile} className="flex max-w-[480px] flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="Vardas"
            value={profileForm.firstName}
            onChange={(event) => actions.setProfileForm((current) => ({ ...current, firstName: event.target.value }))}
          />
          <Field
            label="Pavardė"
            value={profileForm.lastName}
            onChange={(event) => actions.setProfileForm((current) => ({ ...current, lastName: event.target.value }))}
          />
        </div>
        <Field
          label="El. paštas"
          type="email"
          value={profileForm.email}
          onChange={(event) => actions.setProfileForm((current) => ({ ...current, email: event.target.value }))}
        />
        <Field
          label="Telefono numeris"
          value={profileForm.phone}
          onChange={(event) => actions.setProfileForm((current) => ({ ...current, phone: event.target.value }))}
        />
        <label className="flex items-center gap-3 text-[14px] text-bark">
          <input
            type="checkbox"
            checked={profileForm.acceptsMarketing}
            onChange={(event) =>
              actions.setProfileForm((current) => ({ ...current, acceptsMarketing: event.target.checked }))
            }
          />
          Siųskite man naujienas apie pristatymus, pasiūlymus ir naujus pakabukus.
        </label>
        <AccountActionButton type="submit" disabled={isProfileSaving} variant="primary" className="mt-2 self-start">
          {isProfileSaving ? 'Saugoma...' : 'Išsaugoti pakeitimus'}
        </AccountActionButton>
      </form>
    </TabPanel>
  );
}

function AddressInput({ field, placeholder }: { field: keyof AddressForm; placeholder: string }) {
  const { state, actions } = useSignedInAccount();

  return (
    <input
      className={inputClass}
      placeholder={placeholder}
      value={state.addressForm[field]}
      onChange={(event) => actions.setAddressForm((current) => ({ ...current, [field]: event.target.value }))}
    />
  );
}

function NewAddressForm() {
  const { state, actions } = useSignedInAccount();

  return (
    <form onSubmit={actions.saveAddress} className="mt-6 flex max-w-[520px] flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AddressInput field="firstName" placeholder="Vardas" />
        <AddressInput field="lastName" placeholder="Pavardė" />
      </div>
      <AddressInput field="address1" placeholder="Adresas 1" />
      <AddressInput field="address2" placeholder="Adresas 2" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AddressInput field="city" placeholder="Miestas" />
        <AddressInput field="province" placeholder="Regionas / valstija" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AddressInput field="zip" placeholder="Pašto kodas" />
        <AddressInput field="country" placeholder="Šalis" />
      </div>
      <AddressInput field="phone" placeholder="Telefono numeris" />
      <AccountActionButton type="submit" disabled={state.isAddressSaving} variant="primary" className="self-start">
        {state.isAddressSaving ? 'Saugoma...' : 'Išsaugoti adresą'}
      </AccountActionButton>
    </form>
  );
}

export function AddressesPanel() {
  const { state, actions } = useSignedInAccount();
  const { customer, showAddressForm } = state;

  return (
    <TabPanel tab="addresses" title="Adresai">
      {customer.addresses.length > 0 ? (
        customer.addresses.map((address) => (
          <AddressCard key={address.id} address={address} isDefault={customer.defaultAddressId === address.id} />
        ))
      ) : (
        <div className="mb-4 max-w-[520px]">
          <AccountEmptyState
            icon={MapPin}
            title="Išsaugotų adresų dar nėra"
            description="Išsaugokite adresą čia, kad kiti atsiskaitymai būtų greitesni."
          />
        </div>
      )}

      <AccountActionButton
        onClick={actions.toggleAddressForm}
        variant={showAddressForm ? 'ghost' : 'secondary'}
        icon={showAddressForm ? undefined : Plus}
      >
        {showAddressForm ? 'Atšaukti' : '+ Pridėti adresą'}
      </AccountActionButton>

      {showAddressForm && <NewAddressForm />}
    </TabPanel>
  );
}

export function WishlistPanel() {
  return (
    <TabPanel tab="wishlist" title="Norų sąrašas">
      <AccountEmptyState
        icon={Heart}
        title="Norų sąrašas netrukus"
        description="Jūsų kliento paskyra jau veikia. Norų sąrašas gali būti kitas žingsnis."
        actionHref="/products"
        actionLabel="Peržiūrėti produktus"
      />
    </TabPanel>
  );
}
