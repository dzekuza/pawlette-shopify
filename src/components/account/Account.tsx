import { AccountProvider } from './AccountContext';
import { AddressesPanel, OrdersPanel, ProfilePanel, WishlistPanel } from './AccountPanels';
import {
  AccountContent,
  AccountFeedbackBanner,
  AccountLayout,
  AccountLoginCard,
  AccountSignedIn,
  AccountSignedOut,
  AccountTabs,
} from './AccountShell';

/**
 * Compound account page:
 *
 *   <Account.Provider ...>
 *     <Account.Feedback />
 *     <Account.SignedIn>
 *       <Account.Layout>
 *         <Account.Tabs />
 *         <Account.Content>
 *           <Account.Orders /> <Account.Profile /> <Account.Addresses /> <Account.Wishlist />
 *         </Account.Content>
 *       </Account.Layout>
 *     </Account.SignedIn>
 *     <Account.SignedOut><Account.LoginCard /></Account.SignedOut>
 *   </Account.Provider>
 */
export const Account = {
  Provider: AccountProvider,
  Feedback: AccountFeedbackBanner,
  SignedIn: AccountSignedIn,
  SignedOut: AccountSignedOut,
  Layout: AccountLayout,
  Tabs: AccountTabs,
  Content: AccountContent,
  Orders: OrdersPanel,
  Profile: ProfilePanel,
  Addresses: AddressesPanel,
  Wishlist: WishlistPanel,
  LoginCard: AccountLoginCard,
};
