# Žavesys Admin Dashboard — Design Spec

**Date:** 2026-04-26  
**Status:** Approved

---

## Overview

A standalone Next.js admin dashboard for managing the Žavesys dog collar e-commerce brand. Built by cloning and adapting the existing `dashboard-theme` project. Uses mock/hardcoded data — no real backend or auth required.

---

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Location | Separate Next.js project | Keeps admin isolated from storefront |
| Starting point | Clone `dashboard-theme`, strip unneeded routes | Fastest path; all UI primitives already built |
| Data | Mock/hardcoded | Demo-quality; no DB or API needed |
| Auth | None | Skip entirely for now |
| Sections | Products, Orders, Customers, Analytics | Scoped to what's meaningful for this brand |

---

## Architecture

**Source:** Clone `/Users/rysardgvozdovic/Desktop/projects/dashboard-theme`  
**Output location:** `/Users/rysardgvozdovic/Desktop/projects/dog-admin`  
**Framework:** Next.js 16 + React 19 + Tailwind CSS v4  
**UI kit:** shadcn/ui + Radix UI (already in template)  
**Charts:** Recharts (already in template)  
**Tables:** TanStack React Table (already in template)

### Routes to keep

| Route | Purpose |
|---|---|
| `/dashboard` | Overview — stats, revenue chart, top products, recent orders |
| `/dashboard/products` | Collar + charm inventory table |
| `/dashboard/orders` | Order list with status filter and search |
| `/dashboard/customers` | Customer list with spend summary |
| `/dashboard/analytics` | Revenue trend, orders by month, charm popularity |

### Routes to delete from template

All spa/booking-specific routes: `/bookings`, `/therapists`, `/locations`, `/partners`, `/kategorijos`, `/recenzijos`, `/services`, `/coupons`, `/gift-cards`, `/invoices`, `/blog`, `/landing`, `/media`, `/careers`, `/seo`, `/verify-qr`, `/ataskaitos`, `/mokejimai`, `/naudotojai`, `/nustatymai`, `/profilis` — and their corresponding API routes.

---

## Pages

### `/dashboard` — Overview

**Stats cards (4):**
- Total Revenue (€) — with month-over-month % change
- Total Orders — with month-over-month % change
- Total Customers — with new-this-week count
- Average Order Value — with product breakdown note

**Revenue chart:** Bar chart, last 6 months, using Recharts `BarChart`. Data keyed by month.

**Top Products widget:** List of top 4 products by revenue (collars + charms mixed).

**Recent Orders table:** Last 5 orders — columns: Order #, Customer, Items, Total, Status badge.

---

### `/dashboard/products` — Products

TanStack table with two tabs: **Collars** and **Charms**.

**Collar columns:** Image swatch, Name, Color, Price, Size options, Stock badge (In Stock / Low Stock / Out of Stock)  
**Charm columns:** Image swatch, Name, Category, Price, Stock badge

Mock data sourced from `src/lib/data.ts` in the storefront (COLLARS + ALL_CHARMS arrays) — copy and extend with price and stock fields.

---

### `/dashboard/orders` — Orders

TanStack table with search and status filter dropdown.

**Columns:** Order #, Date, Customer name, Items summary, Total (€), Status badge  
**Status values:** Pending, Processing, Shipped, Delivered, Cancelled  
**Actions:** Clickable row opens a detail sheet (customer address, items, timeline)

Mock data: 20–30 hardcoded orders spanning 6 months, realistic Lithuanian names, varied statuses.

---

### `/dashboard/customers` — Customers

TanStack table, searchable by name or email.

**Columns:** Avatar initials, Name, Email, Orders count, Total spent (€), Last order date  
**Actions:** Clickable row opens a detail sheet (order history list)

Mock data: 15–20 customers, each linked to orders from the orders mock set.

---

### `/dashboard/analytics` — Analytics

Four charts using Recharts:

1. **Revenue by month** — AreaChart, 12 months
2. **Orders by month** — BarChart, 12 months
3. **Top collars by revenue** — horizontal BarChart
4. **Charm popularity** — PieChart by units sold

All data is hardcoded arrays in a `src/lib/mock-data.ts` file in the admin project.

---

## Brand Tokens

Replace the template's color tokens in `globals.css`:

| Token | Value | Usage |
|---|---|---|
| `--color-sidebar-bg` | `#3D3530` (bark) | Sidebar background |
| `--color-sidebar-text` | `#FAF7F2` (cream) | Sidebar text |
| `--color-primary` | `#A8D5A2` (sage) | Active nav item, CTA buttons, positive stat indicators |
| `--color-background` | `#FAF7F2` (cream) | Main page background |
| `--color-foreground` | `#3D3530` (bark) | Body text |

Fonts: Keep template's default (`Inter` or system sans). Do not import storefront fonts (Luckiest Guy, Caveat) — admin is utility UI, not brand-expressive.

---

## Mock Data

All mock data lives in `src/lib/mock-data.ts` in the admin project.

**Exports:**
- `MOCK_ORDERS` — 25 orders, 6 months of dates, mixed statuses, realistic totals
- `MOCK_CUSTOMERS` — 18 customers, each with orders array of order IDs
- `MOCK_PRODUCTS` — collars (4) + charms (12) with price, stock status, image placeholder
- `MOCK_ANALYTICS` — monthly revenue + order count arrays (12 months), charm popularity counts

All monetary values in EUR. Customer names: Lithuanian first names + initials for last name.

---

## Implementation Order

1. Clone `dashboard-theme` → `dog-admin`
2. Delete unneeded routes and their API counterparts
3. Replace brand tokens in `globals.css`
4. Create `src/lib/mock-data.ts` with all mock data
5. Build `/dashboard` overview page
6. Build `/dashboard/products` with tabs
7. Build `/dashboard/orders` with search + filter + detail sheet
8. Build `/dashboard/customers` with search + detail sheet
9. Build `/dashboard/analytics` with 4 charts
10. Update sidebar nav to match the 5 routes
11. Verify build passes (`npm run build`)
