# Žavesys Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a standalone Next.js admin dashboard at `/Users/rysardgvozdovic/Desktop/projects/dog-admin` by cloning `dashboard-theme`, stripping Supabase/auth, and replacing content with Žavesys brand + mock data across 5 pages: Overview, Products, Orders, Customers, Analytics.

**Architecture:** Clone dashboard-theme as the base, remove all Supabase/permissions/auth wiring, replace the dashboard layout with a simple passthrough, write a single `lib/mock-data.ts` with all data, then build each page as a clean client/server component that reads from mock data. The existing shadcn/ui components, sidebar, charts, and tables are kept intact — only content and data wiring changes.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, shadcn/ui, Recharts, TanStack React Table, @tabler/icons-react

---

## File Map

**New files:**
- `lib/mock-data.ts` — all mock data (products, orders, customers, analytics series)
- `app/dashboard/products/page.tsx` — products table with collar/charm tabs
- `app/dashboard/analytics/page.tsx` — 4 Recharts charts

**Rewritten files:**
- `app/globals.css` — brand tokens (bark/sage/cream palette)
- `app/dashboard/layout.tsx` — remove Supabase/permissions, simple passthrough
- `components/app-sidebar.tsx` — 5 nav items only, Žavesys branding
- `app/dashboard/page.tsx` — overview with mock stats + chart + table
- `app/dashboard/orders/page.tsx` — orders table with search + status filter
- `app/dashboard/customers/page.tsx` — customers table with search

**Deleted directories** (done in Task 1):
- `app/auth/`
- `app/dashboard/bookings/`, `gift-cards/`, `invoices/`, `blog/`, `landing/`, `media/`, `careers/`, `seo/`, `verify-qr/`, `naudotojai/`, `nustatymai/`, `profilis/`, `ataskaitos/`, `mokejimai/`, `therapists/`, `locations/`, `partners/`, `kategorijos/`, `recenzijos/`, `coupons/`, `services/`, `[slug]/`, `greiti-veiksmai/`, `pardavimai/`, `rezervacijos/`, `terapeutai/`, `apmokejimai/`, `pranesimai/`, `zinutes/`, `kuponai-ir-dovanos/`, `settings/`
- `app/api/` (entire directory)
- `lib/supabase.ts`, `lib/supabase-server.ts`, `lib/data-fetchers.ts`, `lib/permissions.ts`, `lib/permissions-context.ts`, `lib/customer-detail.ts`
- `components/permissions-client-wrapper.tsx`, `components/permission-guard.tsx`, `components/orders-realtime-sync.tsx`

---

## Task 1: Clone and strip the template

**Files:**
- Clone: `/Users/rysardgvozdovic/Desktop/projects/dashboard-theme` → `/Users/rysardgvozdovic/Desktop/projects/dog-admin`
- Delete: all unneeded routes and Supabase lib files listed above

- [ ] **Step 1: Clone the template**

```bash
cp -r /Users/rysardgvozdovic/Desktop/projects/dashboard-theme /Users/rysardgvozdovic/Desktop/projects/dog-admin
cd /Users/rysardgvozdovic/Desktop/projects/dog-admin
rm -rf .git
git init
git add -A
git commit -m "chore: init from dashboard-theme"
```

- [ ] **Step 2: Delete unneeded route directories**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-admin
rm -rf app/auth
rm -rf app/api
rm -rf app/dashboard/bookings
rm -rf app/dashboard/gift-cards
rm -rf app/dashboard/invoices
rm -rf app/dashboard/blog
rm -rf app/dashboard/landing
rm -rf app/dashboard/media
rm -rf app/dashboard/careers
rm -rf app/dashboard/seo
rm -rf app/dashboard/verify-qr
rm -rf app/dashboard/naudotojai
rm -rf app/dashboard/nustatymai
rm -rf app/dashboard/profilis
rm -rf app/dashboard/ataskaitos
rm -rf app/dashboard/mokejimai
rm -rf app/dashboard/therapists
rm -rf app/dashboard/locations
rm -rf app/dashboard/partners
rm -rf app/dashboard/kategorijos
rm -rf app/dashboard/recenzijos
rm -rf app/dashboard/coupons
rm -rf "app/dashboard/[slug]"
rm -rf app/dashboard/greiti-veiksmai
rm -rf app/dashboard/pardavimai
rm -rf app/dashboard/rezervacijos
rm -rf app/dashboard/terapeutai
rm -rf app/dashboard/apmokejimai
rm -rf app/dashboard/pranesimai
rm -rf app/dashboard/zinutes
rm -rf "app/dashboard/kuponai-ir-dovanos"
rm -rf app/dashboard/settings
rm -rf app/dashboard/services
```

- [ ] **Step 3: Delete Supabase and permissions files**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-admin
rm -f lib/supabase.ts lib/supabase-server.ts lib/data-fetchers.ts
rm -f lib/permissions.ts lib/permissions-context.ts lib/customer-detail.ts
rm -f components/permissions-client-wrapper.tsx
rm -f components/permission-guard.tsx
rm -f components/orders-realtime-sync.tsx
```

- [ ] **Step 4: Install dependencies**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-admin
npm install
```

- [ ] **Step 5: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-admin
git add -A
git commit -m "chore: strip unneeded routes and Supabase dependencies"
```

---

## Task 2: Apply brand tokens

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace the `:root` color block in `app/globals.css`**

Find the `:root { ... }` block (around line 50) and replace just the color variables (keep `--radius` and the `@theme` block above it intact):

```css
:root {
  --radius: 0.625rem;
  --background: oklch(0.98 0.005 80);
  --foreground: oklch(0.22 0.02 50);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.22 0.02 50);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.22 0.02 50);
  --primary: oklch(0.22 0.02 50);
  --primary-foreground: oklch(0.98 0.005 80);
  --secondary: oklch(0.95 0.01 80);
  --secondary-foreground: oklch(0.22 0.02 50);
  --muted: oklch(0.95 0.01 80);
  --muted-foreground: oklch(0.52 0.01 50);
  --accent: oklch(0.82 0.08 140);
  --accent-foreground: oklch(0.22 0.02 50);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.90 0.005 80);
  --input: oklch(0.90 0.005 80);
  --ring: oklch(0.82 0.08 140);
  --chart-1: oklch(0.82 0.08 140);
  --chart-2: oklch(0.65 0.12 140);
  --chart-3: oklch(0.48 0.10 140);
  --chart-4: oklch(0.35 0.06 140);
  --chart-5: oklch(0.22 0.02 50);
  --sidebar: oklch(0.22 0.02 50);
  --sidebar-foreground: oklch(0.98 0.005 80);
  --sidebar-primary: oklch(0.82 0.08 140);
  --sidebar-primary-foreground: oklch(0.22 0.02 50);
  --sidebar-accent: oklch(0.30 0.02 50);
  --sidebar-accent-foreground: oklch(0.98 0.005 80);
  --sidebar-border: oklch(0.30 0.02 50);
  --sidebar-ring: oklch(0.82 0.08 140);
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-admin
git add app/globals.css
git commit -m "feat: apply Žavesys bark/sage/cream brand tokens"
```

---

## Task 3: Simplify dashboard layout (remove Supabase/permissions)

**Files:**
- Rewrite: `app/dashboard/layout.tsx`

- [ ] **Step 1: Replace `app/dashboard/layout.tsx` entirely**

```tsx
import type { ReactNode } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 2: Fix any remaining import errors from deleted files**

Run the build to see what's broken:
```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-admin
npm run build 2>&1 | grep "error" | head -30
```

For each broken import, either delete the file or stub it. Common fixes:
- `components/nav-user.tsx` may import from `lib/permissions-context` — replace that import with a hardcoded user object:
  ```tsx
  const user = { name: "Admin", email: "admin@zavesys.lt", avatar: "" }
  ```
- Any component importing `PermissionGuard` — remove the wrapper, keep `children`
- Any component importing `createDashboardServerClient` or Supabase — remove the import and the code block that uses it

- [ ] **Step 3: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-admin
git add -A
git commit -m "feat: replace layout with simple passthrough, stub removed deps"
```

---

## Task 4: Create mock data

**Files:**
- Create: `lib/mock-data.ts`

- [ ] **Step 1: Create `lib/mock-data.ts`**

```ts
// Žavesys admin mock data — all values are illustrative

export type ProductType = "collar" | "charm"
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock"
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

export interface Product {
  id: string
  type: ProductType
  name: string
  color: string
  price: number
  stock: StockStatus
  image: string
}

export interface Order {
  id: string
  date: string
  customerName: string
  customerId: string
  items: string
  total: number
  status: OrderStatus
}

export interface Customer {
  id: string
  name: string
  email: string
  orderCount: number
  totalSpent: number
  lastOrderDate: string
}

export interface MonthPoint {
  month: string
  revenue: number
  orders: number
}

export interface CharmStat {
  name: string
  units: number
}

// --- Products ---

export const MOCK_PRODUCTS: Product[] = [
  { id: "c1", type: "collar", name: "Bark Collar", color: "#3D3530", price: 28, stock: "in_stock", image: "" },
  { id: "c2", type: "collar", name: "Blossom Collar", color: "#F4C2C2", price: 28, stock: "in_stock", image: "" },
  { id: "c3", type: "collar", name: "Sky Collar", color: "#B8D8E8", price: 28, stock: "low_stock", image: "" },
  { id: "c4", type: "collar", name: "Honey Collar", color: "#F5D78E", price: 28, stock: "in_stock", image: "" },
  { id: "ch1", type: "charm", name: "Star Charm", color: "#FFD700", price: 8, stock: "in_stock", image: "" },
  { id: "ch2", type: "charm", name: "Moon Charm", color: "#C0C0C0", price: 8, stock: "in_stock", image: "" },
  { id: "ch3", type: "charm", name: "Heart Charm", color: "#FF6B6B", price: 8, stock: "in_stock", image: "" },
  { id: "ch4", type: "charm", name: "Paw Charm", color: "#A8D5A2", price: 8, stock: "low_stock", image: "" },
  { id: "ch5", type: "charm", name: "Bone Charm", color: "#F5F5DC", price: 8, stock: "in_stock", image: "" },
  { id: "ch6", type: "charm", name: "Crown Charm", color: "#FFD700", price: 10, stock: "out_of_stock", image: "" },
  { id: "ch7", type: "charm", name: "Flower Charm", color: "#FFB6C1", price: 8, stock: "in_stock", image: "" },
  { id: "ch8", type: "charm", name: "Diamond Charm", color: "#B9F2FF", price: 12, stock: "in_stock", image: "" },
]

// --- Orders ---

export const MOCK_ORDERS: Order[] = [
  { id: "#1042", date: "2026-04-25", customerName: "Mia K.", customerId: "cu1", items: "Blossom Collar + Star, Moon, Heart", total: 52, status: "shipped" },
  { id: "#1041", date: "2026-04-24", customerName: "Jonas R.", customerId: "cu2", items: "Bark Collar + Paw Charm", total: 36, status: "pending" },
  { id: "#1040", date: "2026-04-23", customerName: "Sara T.", customerId: "cu3", items: "Sky Collar", total: 28, status: "delivered" },
  { id: "#1039", date: "2026-04-22", customerName: "Lukas B.", customerId: "cu4", items: "Honey Collar + Star, Bone", total: 44, status: "processing" },
  { id: "#1038", date: "2026-04-21", customerName: "Aistė M.", customerId: "cu5", items: "Bark Collar + Crown Charm", total: 38, status: "delivered" },
  { id: "#1037", date: "2026-04-20", customerName: "Eglė V.", customerId: "cu6", items: "Blossom Collar + Flower, Diamond", total: 48, status: "shipped" },
  { id: "#1036", date: "2026-04-18", customerName: "Tomas P.", customerId: "cu7", items: "Sky Collar + Moon, Heart", total: 44, status: "delivered" },
  { id: "#1035", date: "2026-04-17", customerName: "Rūta D.", customerId: "cu8", items: "Honey Collar", total: 28, status: "delivered" },
  { id: "#1034", date: "2026-04-15", customerName: "Mia K.", customerId: "cu1", items: "Star Charm × 2", total: 16, status: "delivered" },
  { id: "#1033", date: "2026-04-12", customerName: "Jonas R.", customerId: "cu2", items: "Blossom Collar + Paw, Flower", total: 44, status: "delivered" },
  { id: "#1032", date: "2026-04-10", customerName: "Viktorija A.", customerId: "cu9", items: "Bark Collar + Diamond", total: 40, status: "cancelled" },
  { id: "#1031", date: "2026-04-08", customerName: "Darius K.", customerId: "cu10", items: "Sky Collar + Star, Crown", total: 46, status: "delivered" },
  { id: "#1030", date: "2026-04-05", customerName: "Neringa S.", customerId: "cu11", items: "Honey Collar + Moon", total: 36, status: "delivered" },
  { id: "#1029", date: "2026-04-02", customerName: "Lina J.", customerId: "cu12", items: "Blossom Collar + Heart, Bone", total: 44, status: "delivered" },
  { id: "#1028", date: "2026-03-30", customerName: "Mindaugas R.", customerId: "cu13", items: "Bark Collar", total: 28, status: "delivered" },
  { id: "#1027", date: "2026-03-28", customerName: "Kotryna L.", customerId: "cu14", items: "Sky Collar + Flower, Diamond", total: 48, status: "delivered" },
  { id: "#1026", date: "2026-03-25", customerName: "Arvydas M.", customerId: "cu15", items: "Honey Collar + Star", total: 36, status: "delivered" },
  { id: "#1025", date: "2026-03-22", customerName: "Sara T.", customerId: "cu3", items: "Bark Collar + Paw, Crown", total: 46, status: "delivered" },
  { id: "#1024", date: "2026-03-18", customerName: "Eglė V.", customerId: "cu6", items: "Blossom Collar", total: 28, status: "delivered" },
  { id: "#1023", date: "2026-03-15", customerName: "Lukas B.", customerId: "cu4", items: "Sky Collar + Moon, Heart, Star", total: 52, status: "delivered" },
  { id: "#1022", date: "2026-03-10", customerName: "Aistė M.", customerId: "cu5", items: "Honey Collar + Bone", total: 36, status: "delivered" },
  { id: "#1021", date: "2026-03-05", customerName: "Viktorija A.", customerId: "cu9", items: "Bark Collar + Flower", total: 36, status: "delivered" },
  { id: "#1020", date: "2026-03-01", customerName: "Darius K.", customerId: "cu10", items: "Blossom Collar + Diamond", total: 40, status: "delivered" },
  { id: "#1019", date: "2026-02-25", customerName: "Neringa S.", customerId: "cu11", items: "Sky Collar + Star, Moon", total: 44, status: "delivered" },
  { id: "#1018", date: "2026-02-20", customerName: "Mia K.", customerId: "cu1", items: "Honey Collar + Heart", total: 36, status: "delivered" },
]

// --- Customers ---

export const MOCK_CUSTOMERS: Customer[] = [
  { id: "cu1", name: "Mia K.", email: "mia.k@email.com", orderCount: 3, totalSpent: 104, lastOrderDate: "2026-04-25" },
  { id: "cu2", name: "Jonas R.", email: "jonas.r@email.com", orderCount: 2, totalSpent: 80, lastOrderDate: "2026-04-24" },
  { id: "cu3", name: "Sara T.", email: "sara.t@email.com", orderCount: 2, totalSpent: 74, lastOrderDate: "2026-04-23" },
  { id: "cu4", name: "Lukas B.", email: "lukas.b@email.com", orderCount: 2, totalSpent: 96, lastOrderDate: "2026-04-22" },
  { id: "cu5", name: "Aistė M.", email: "aiste.m@email.com", orderCount: 2, totalSpent: 74, lastOrderDate: "2026-04-21" },
  { id: "cu6", name: "Eglė V.", email: "egle.v@email.com", orderCount: 2, totalSpent: 76, lastOrderDate: "2026-04-20" },
  { id: "cu7", name: "Tomas P.", email: "tomas.p@email.com", orderCount: 1, totalSpent: 44, lastOrderDate: "2026-04-18" },
  { id: "cu8", name: "Rūta D.", email: "ruta.d@email.com", orderCount: 1, totalSpent: 28, lastOrderDate: "2026-04-17" },
  { id: "cu9", name: "Viktorija A.", email: "viktorija.a@email.com", orderCount: 2, totalSpent: 76, lastOrderDate: "2026-04-10" },
  { id: "cu10", name: "Darius K.", email: "darius.k@email.com", orderCount: 2, totalSpent: 86, lastOrderDate: "2026-04-08" },
  { id: "cu11", name: "Neringa S.", email: "neringa.s@email.com", orderCount: 2, totalSpent: 80, lastOrderDate: "2026-04-05" },
  { id: "cu12", name: "Lina J.", email: "lina.j@email.com", orderCount: 1, totalSpent: 44, lastOrderDate: "2026-04-02" },
  { id: "cu13", name: "Mindaugas R.", email: "mindaugas.r@email.com", orderCount: 1, totalSpent: 28, lastOrderDate: "2026-03-30" },
  { id: "cu14", name: "Kotryna L.", email: "kotryna.l@email.com", orderCount: 1, totalSpent: 48, lastOrderDate: "2026-03-28" },
  { id: "cu15", name: "Arvydas M.", email: "arvydas.m@email.com", orderCount: 1, totalSpent: 36, lastOrderDate: "2026-03-25" },
]

// --- Analytics ---

export const MOCK_MONTHLY: MonthPoint[] = [
  { month: "May '25", revenue: 540, orders: 15 },
  { month: "Jun '25", revenue: 680, orders: 18 },
  { month: "Jul '25", revenue: 720, orders: 21 },
  { month: "Aug '25", revenue: 860, orders: 24 },
  { month: "Sep '25", revenue: 790, orders: 22 },
  { month: "Oct '25", revenue: 920, orders: 26 },
  { month: "Nov '25", revenue: 1040, orders: 29 },
  { month: "Dec '25", revenue: 1380, orders: 38 },
  { month: "Jan '26", revenue: 960, orders: 27 },
  { month: "Feb '26", revenue: 880, orders: 24 },
  { month: "Mar '26", revenue: 1120, orders: 31 },
  { month: "Apr '26", revenue: 1240, orders: 34 },
]

export const MOCK_CHARM_STATS: CharmStat[] = [
  { name: "Star", units: 42 },
  { name: "Moon", units: 35 },
  { name: "Heart", units: 31 },
  { name: "Paw", units: 28 },
  { name: "Flower", units: 24 },
  { name: "Diamond", units: 18 },
  { name: "Bone", units: 16 },
  { name: "Crown", units: 12 },
]

export const MOCK_COLLAR_REVENUE = [
  { name: "Bark Collar", revenue: 1240 },
  { name: "Blossom Collar", revenue: 980 },
  { name: "Sky Collar", revenue: 756 },
  { name: "Honey Collar", revenue: 700 },
]

// --- Overview summary ---

export const MOCK_STATS = {
  revenue: 4820,
  revenueTrend: "+12%",
  orders: 134,
  ordersTrend: "+8%",
  customers: 89,
  newThisWeek: 5,
  avgOrder: 36,
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-admin
git add lib/mock-data.ts
git commit -m "feat: add Žavesys mock data (products, orders, customers, analytics)"
```

---

## Task 5: Rewrite sidebar navigation

**Files:**
- Modify: `components/app-sidebar.tsx`

- [ ] **Step 1: Replace `components/app-sidebar.tsx`**

```tsx
"use client"

import {
  IconChartBar,
  IconDashboard,
  IconPackage,
  IconReceipt2,
  IconUsers,
} from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const NAV_ITEMS = [
  { title: "Overview", url: "/dashboard", icon: IconDashboard },
  { title: "Products", url: "/dashboard/products", icon: IconPackage },
  { title: "Orders", url: "/dashboard/orders", icon: IconReceipt2 },
  { title: "Customers", url: "/dashboard/customers", icon: IconUsers },
  { title: "Analytics", url: "/dashboard/analytics", icon: IconChartBar },
]

const ADMIN_USER = {
  name: "Admin",
  email: "admin@zavesys.lt",
  avatar: "",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === "/dashboard"}
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <span className="text-base font-semibold">🐾 Žavesys</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NAV_ITEMS} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={ADMIN_USER} />
      </SidebarFooter>
    </Sidebar>
  )
}
```

- [ ] **Step 2: Fix NavMain — it may use `usePermissions()`. Open `components/nav-main.tsx` and remove any `usePermissions` import and `can()` call. Every item should always render.**

If `nav-main.tsx` has a pattern like:
```tsx
if (!can(item.section, "view")) return null
```
Remove that check so all items always render.

- [ ] **Step 3: Fix NavUser — remove any Supabase logout call. Replace with a no-op or remove the logout button.**

In `components/nav-user.tsx`, find any `supabase.auth.signOut()` call and replace with `console.log("logout")` or remove the handler entirely.

- [ ] **Step 4: Verify build compiles**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-admin
npm run build 2>&1 | tail -20
```

- [ ] **Step 5: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-admin
git add -A
git commit -m "feat: simplify sidebar to 5 Žavesys nav items"
```

---

## Task 6: Build Overview page

**Files:**
- Rewrite: `app/dashboard/page.tsx`

- [ ] **Step 1: Replace `app/dashboard/page.tsx`**

```tsx
import {
  IconCreditCard,
  IconPackage,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DashboardShell } from "@/components/dashboard-shell"
import { MOCK_STATS, MOCK_ORDERS, MOCK_COLLAR_REVENUE, MOCK_MONTHLY } from "@/lib/mock-data"
import { RevenueChart } from "@/components/dashboard/revenue-chart"

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function OverviewPage() {
  const recentOrders = MOCK_ORDERS.slice(0, 5)

  return (
    <DashboardShell>
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 2xl:grid-cols-4">
          <Card className="border-border/70 shadow-none">
            <CardHeader className="gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardDescription className="text-xs uppercase tracking-widest">Revenue</CardDescription>
                  <CardTitle className="text-3xl font-semibold">€{MOCK_STATS.revenue.toLocaleString()}</CardTitle>
                </div>
                <div className="rounded-2xl bg-neutral-100 p-3 text-neutral-700">
                  <IconCreditCard className="size-5" />
                </div>
              </div>
              <Badge className="border-emerald-200/80 bg-emerald-50 text-emerald-700 w-fit" variant="outline">
                <IconTrendingUp className="mr-1 size-3.5" />{MOCK_STATS.revenueTrend} this month
              </Badge>
            </CardHeader>
          </Card>

          <Card className="border-border/70 shadow-none">
            <CardHeader className="gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardDescription className="text-xs uppercase tracking-widest">Orders</CardDescription>
                  <CardTitle className="text-3xl font-semibold">{MOCK_STATS.orders}</CardTitle>
                </div>
                <div className="rounded-2xl bg-neutral-100 p-3 text-neutral-700">
                  <IconPackage className="size-5" />
                </div>
              </div>
              <Badge className="border-emerald-200/80 bg-emerald-50 text-emerald-700 w-fit" variant="outline">
                <IconTrendingUp className="mr-1 size-3.5" />{MOCK_STATS.ordersTrend} this month
              </Badge>
            </CardHeader>
          </Card>

          <Card className="border-border/70 shadow-none">
            <CardHeader className="gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardDescription className="text-xs uppercase tracking-widest">Customers</CardDescription>
                  <CardTitle className="text-3xl font-semibold">{MOCK_STATS.customers}</CardTitle>
                </div>
                <div className="rounded-2xl bg-neutral-100 p-3 text-neutral-700">
                  <IconUsers className="size-5" />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">+{MOCK_STATS.newThisWeek} new this week</span>
            </CardHeader>
          </Card>

          <Card className="border-border/70 shadow-none">
            <CardHeader className="gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardDescription className="text-xs uppercase tracking-widest">Avg Order</CardDescription>
                  <CardTitle className="text-3xl font-semibold">€{MOCK_STATS.avgOrder}</CardTitle>
                </div>
                <div className="rounded-2xl bg-neutral-100 p-3 text-neutral-700">
                  <IconCreditCard className="size-5" />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">Collar + ~2 charms</span>
            </CardHeader>
          </Card>
        </div>

        {/* Chart + top collars */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
          <RevenueChart data={MOCK_MONTHLY} />

          <Card className="border-border/70 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Top Collars by Revenue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {MOCK_COLLAR_REVENUE.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="font-semibold">€{item.revenue}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent orders */}
        <Card className="border-border/70 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Order</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium hidden md:table-cell">Items</th>
                  <th className="pb-2 font-medium text-right">Total</th>
                  <th className="pb-2 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-2.5 font-mono text-xs">{order.id}</td>
                    <td className="py-2.5">{order.customerName}</td>
                    <td className="py-2.5 text-muted-foreground hidden md:table-cell max-w-[200px] truncate">{order.items}</td>
                    <td className="py-2.5 text-right font-semibold">€{order.total}</td>
                    <td className="py-2.5 text-right">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
```

- [ ] **Step 2: Create `components/dashboard/revenue-chart.tsx`**

```tsx
"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import type { MonthPoint } from "@/lib/mock-data"

const chartConfig = {
  revenue: { label: "Revenue (€)", color: "var(--color-chart-1)" },
} satisfies ChartConfig

export function RevenueChart({ data }: { data: MonthPoint[] }) {
  return (
    <Card className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Monthly revenue over the last 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart data={data} margin={{ left: 8, right: 8 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v) => `€${v}`} tick={{ fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent formatter={(v) => [`€${v}`, "Revenue"]} />} />
            <Area type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" fill="url(#fillRevenue)" strokeWidth={2} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-admin
npm run build 2>&1 | tail -20
```

Expected: no errors related to overview page.

- [ ] **Step 4: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-admin
git add app/dashboard/page.tsx components/dashboard/revenue-chart.tsx
git commit -m "feat: build overview page with stats, chart, top products, recent orders"
```

---

## Task 7: Build Products page

**Files:**
- Create: `app/dashboard/products/page.tsx`

- [ ] **Step 1: Create `app/dashboard/products/page.tsx`**

```tsx
"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardShell } from "@/components/dashboard-shell"
import { MOCK_PRODUCTS, type Product, type StockStatus } from "@/lib/mock-data"

const STOCK_COLORS: Record<StockStatus, string> = {
  in_stock: "bg-emerald-100 text-emerald-800",
  low_stock: "bg-amber-100 text-amber-800",
  out_of_stock: "bg-red-100 text-red-800",
}

const STOCK_LABELS: Record<StockStatus, string> = {
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
}

function ProductTable({ products }: { products: Product[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-muted-foreground">
          <th className="pb-2 font-medium">Color</th>
          <th className="pb-2 font-medium">Name</th>
          <th className="pb-2 font-medium text-right">Price</th>
          <th className="pb-2 font-medium text-right">Stock</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="border-b last:border-0 hover:bg-muted/40">
            <td className="py-2.5">
              <div className="size-6 rounded-full border border-border/50" style={{ background: p.color }} />
            </td>
            <td className="py-2.5 font-medium">{p.name}</td>
            <td className="py-2.5 text-right">€{p.price}</td>
            <td className="py-2.5 text-right">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STOCK_COLORS[p.stock]}`}>
                {STOCK_LABELS[p.stock]}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function ProductsPage() {
  const [search, setSearch] = useState("")

  const collars = useMemo(() =>
    MOCK_PRODUCTS.filter((p) => p.type === "collar" && p.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  )
  const charms = useMemo(() =>
    MOCK_PRODUCTS.filter((p) => p.type === "charm" && p.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  )

  return (
    <DashboardShell>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Products</h1>
          <Input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56"
          />
        </div>

        <Tabs defaultValue="collars">
          <TabsList>
            <TabsTrigger value="collars">Collars ({collars.length})</TabsTrigger>
            <TabsTrigger value="charms">Charms ({charms.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="collars">
            <Card className="border-border/70 shadow-none">
              <CardContent className="pt-4">
                <ProductTable products={collars} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="charms">
            <Card className="border-border/70 shadow-none">
              <CardContent className="pt-4">
                <ProductTable products={charms} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-admin
git add app/dashboard/products/page.tsx
git commit -m "feat: build products page with collar/charm tabs and search"
```

---

## Task 8: Build Orders page

**Files:**
- Rewrite: `app/dashboard/orders/page.tsx`

- [ ] **Step 1: Replace `app/dashboard/orders/page.tsx`**

```tsx
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardShell } from "@/components/dashboard-shell"
import { MOCK_ORDERS, type OrderStatus } from "@/lib/mock-data"

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
}

const ALL_STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"]

export default function OrdersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all")

  const filtered = useMemo(() =>
    MOCK_ORDERS.filter((o) => {
      const matchesSearch =
        o.id.includes(search) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.items.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "all" || o.status === statusFilter
      return matchesSearch && matchesStatus
    }),
    [search, statusFilter]
  )

  return (
    <DashboardShell>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold">Orders</h1>
          <div className="flex gap-2">
            <Input
              placeholder="Search orders…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
            />
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | OrderStatus)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {ALL_STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="border-border/70 shadow-none">
          <CardContent className="pt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Order</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium hidden lg:table-cell">Items</th>
                  <th className="pb-2 font-medium text-right">Total</th>
                  <th className="pb-2 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No orders found</td></tr>
                ) : filtered.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/40">
                    <td className="py-2.5 font-mono text-xs">{order.id}</td>
                    <td className="py-2.5 text-muted-foreground">{order.date}</td>
                    <td className="py-2.5">{order.customerName}</td>
                    <td className="py-2.5 text-muted-foreground hidden lg:table-cell max-w-[220px] truncate">{order.items}</td>
                    <td className="py-2.5 text-right font-semibold">€{order.total}</td>
                    <td className="py-2.5 text-right">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-muted-foreground">{filtered.length} of {MOCK_ORDERS.length} orders</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-admin
git add app/dashboard/orders/page.tsx
git commit -m "feat: build orders page with search and status filter"
```

---

## Task 9: Build Customers page

**Files:**
- Rewrite: `app/dashboard/customers/page.tsx`

- [ ] **Step 1: Replace `app/dashboard/customers/page.tsx`**

```tsx
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DashboardShell } from "@/components/dashboard-shell"
import { MOCK_CUSTOMERS } from "@/lib/mock-data"

export default function CustomersPage() {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() =>
    MOCK_CUSTOMERS.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  )

  return (
    <DashboardShell>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Customers</h1>
          <Input
            placeholder="Search customers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56"
          />
        </div>

        <Card className="border-border/70 shadow-none">
          <CardContent className="pt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium hidden sm:table-cell">Email</th>
                  <th className="pb-2 font-medium text-right">Orders</th>
                  <th className="pb-2 font-medium text-right">Total Spent</th>
                  <th className="pb-2 font-medium text-right hidden md:table-cell">Last Order</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No customers found</td></tr>
                ) : filtered.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-muted/40">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                          {c.name.charAt(0)}
                        </div>
                        <span className="font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-muted-foreground hidden sm:table-cell">{c.email}</td>
                    <td className="py-2.5 text-right">{c.orderCount}</td>
                    <td className="py-2.5 text-right font-semibold">€{c.totalSpent}</td>
                    <td className="py-2.5 text-right text-muted-foreground hidden md:table-cell">{c.lastOrderDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-muted-foreground">{filtered.length} of {MOCK_CUSTOMERS.length} customers</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-admin
git add app/dashboard/customers/page.tsx
git commit -m "feat: build customers page with search"
```

---

## Task 10: Build Analytics page

**Files:**
- Create: `app/dashboard/analytics/page.tsx`
- Create: `components/dashboard/orders-chart.tsx`
- Create: `components/dashboard/charm-chart.tsx`

- [ ] **Step 1: Create `components/dashboard/orders-chart.tsx`**

```tsx
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import type { MonthPoint } from "@/lib/mock-data"

const chartConfig = {
  orders: { label: "Orders", color: "var(--color-chart-2)" },
} satisfies ChartConfig

export function OrdersChart({ data }: { data: MonthPoint[] }) {
  return (
    <Card className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle>Orders by Month</CardTitle>
        <CardDescription>Monthly order volume over 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <BarChart data={data} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} width={28} tick={{ fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="orders" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Create `components/dashboard/charm-chart.tsx`**

```tsx
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import type { CharmStat } from "@/lib/mock-data"

const chartConfig = {
  units: { label: "Units Sold", color: "var(--color-chart-3)" },
} satisfies ChartConfig

export function CharmChart({ data }: { data: CharmStat[] }) {
  return (
    <Card className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle>Charm Popularity</CardTitle>
        <CardDescription>Units sold per charm type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 8 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={60} tick={{ fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="units" fill="var(--color-chart-3)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 3: Create `app/dashboard/analytics/page.tsx`**

```tsx
import { DashboardShell } from "@/components/dashboard-shell"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { OrdersChart } from "@/components/dashboard/orders-chart"
import { CharmChart } from "@/components/dashboard/charm-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MOCK_MONTHLY, MOCK_CHARM_STATS, MOCK_COLLAR_REVENUE } from "@/lib/mock-data"

export default function AnalyticsPage() {
  return (
    <DashboardShell>
      <div className="space-y-5">
        <h1 className="text-xl font-semibold">Analytics</h1>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <RevenueChart data={MOCK_MONTHLY} />
          <OrdersChart data={MOCK_MONTHLY} />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <CharmChart data={MOCK_CHARM_STATS} />

          <Card className="border-border/70 shadow-none">
            <CardHeader>
              <CardTitle>Collar Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_COLLAR_REVENUE.map((item) => {
                  const max = MOCK_COLLAR_REVENUE[0].revenue
                  const pct = Math.round((item.revenue / max) * 100)
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="font-semibold">€{item.revenue}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-chart-1" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
```

- [ ] **Step 4: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-admin
git add app/dashboard/analytics/ components/dashboard/orders-chart.tsx components/dashboard/charm-chart.tsx
git commit -m "feat: build analytics page with 4 charts (revenue, orders, charms, collar revenue)"
```

---

## Task 11: Final build verification

- [ ] **Step 1: Run full build**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-admin
npm run build 2>&1
```

Expected: `✓ Compiled successfully` with no errors. If errors appear, fix them — common causes:
- Missing imports from deleted files: trace the import chain and stub or remove
- `"use client"` missing on pages that use `useState` — add it at the top
- Type errors from mock data: check that exported types match usage in pages

- [ ] **Step 2: Start dev server and verify all 5 pages**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-admin
npm run dev
```

Open in browser and verify:
- `http://localhost:3000/dashboard` — stats cards, revenue chart, top collars, recent orders table
- `http://localhost:3000/dashboard/products` — collar tab, charm tab, search works
- `http://localhost:3000/dashboard/orders` — table with search + status filter
- `http://localhost:3000/dashboard/customers` — table with search, avatar initials
- `http://localhost:3000/dashboard/analytics` — 4 charts render with data

- [ ] **Step 3: Final commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-admin
git add -A
git commit -m "feat: Žavesys admin dashboard — all 5 pages complete"
```
