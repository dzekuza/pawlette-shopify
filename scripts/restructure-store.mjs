/**
 * Restructures paws-rvycxg3u.myshopify.com to match the required catalog:
 *
 *   Collar  — €24.99, 45 units total (4 colors × 3 sizes, ~4 per variant)
 *   Leash   — €32.99,  5 units total (3 sizes, ~2-1-2 per variant)
 *   Charms  — €3.99,  33 variants × 41 units ≈ 1350 total
 *
 * All other products are deleted first.
 *
 * Requires Shopify CLI authenticated:
 *   shopify store auth --store paws-rvycxg3u.myshopify.com --scopes write_products,read_products,write_inventory,read_inventory,read_locations
 * Run:
 *   node scripts/restructure-store.mjs
 */

import { execSync } from 'child_process';

const STORE   = 'paws-rvycxg3u.myshopify.com';
const VERSION = '2026-01';

// ─── GraphQL helper ───────────────────────────────────────────────────────────

function gql(query, variables = {}) {
  const q = query.trim().replace(/'/g, `'\\''`);
  const v = JSON.stringify(variables).replace(/'/g, `'\\''`);
  const out = execSync(
    `shopify store execute --store ${STORE} --allow-mutations --json --version ${VERSION} --query '${q}' --variables '${v}'`,
    { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
  );
  return JSON.parse(out).data ?? JSON.parse(out);
}

// ─── Step helpers ─────────────────────────────────────────────────────────────

function createProduct(input) {
  const data = gql(`
    mutation Create($product: ProductCreateInput!) {
      productCreate(product: $product) {
        product { id title }
        userErrors { field message }
      }
    }
  `, { product: input });
  const { product, userErrors } = data.productCreate;
  if (userErrors?.length) throw new Error(userErrors.map(e => e.message).join(', '));
  return product;
}

function addOptions(productId, options) {
  const data = gql(`
    mutation AddOptions($productId: ID!, $options: [OptionCreateInput!]!) {
      productOptionsCreate(productId: $productId, options: $options, variantStrategy: CREATE) {
        product {
          variants(first: 250) {
            nodes {
              id
              selectedOptions { name value }
              inventoryItem { id }
            }
          }
        }
        userErrors { field message code }
      }
    }
  `, { productId, options });
  const { product, userErrors } = data.productOptionsCreate;
  if (userErrors?.length) throw new Error(userErrors.map(e => e.message).join(', '));
  return product.variants.nodes;
}

function setPrices(productId, variants) {
  const data = gql(`
    mutation SetPrices($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants { id price }
        userErrors { field message }
      }
    }
  `, { productId, variants });
  const { userErrors } = data.productVariantsBulkUpdate;
  if (userErrors?.length) console.warn('  ⚠ price update:', userErrors.map(e => e.message).join(', '));
}

function getDefaultLocation() {
  const data = gql(`query { locations(first: 1) { nodes { id name } } }`);
  const loc = data.locations.nodes[0];
  if (!loc) throw new Error('No location found in store');
  console.log(`  📍 Location: ${loc.name} (${loc.id})`);
  return loc.id;
}

function setInventory(locationId, quantities) {
  // quantities: [{ inventoryItemId, quantity }]
  const data = gql(`
    mutation SetInventory($input: InventorySetOnHandQuantitiesInput!) {
      inventorySetOnHandQuantities(input: $input) {
        inventoryAdjustmentGroup { id }
        userErrors { field message }
      }
    }
  `, {
    input: {
      reason: 'correction',
      setQuantities: quantities.map(q => ({
        inventoryItemId: q.inventoryItemId,
        locationId,
        quantity: q.quantity,
      })),
    },
  });
  const { userErrors } = data.inventorySetOnHandQuantities;
  if (userErrors?.length) console.warn('  ⚠ inventory update:', userErrors.map(e => e.message).join(', '));
}

function deleteProduct(id) {
  const data = gql(`
    mutation Delete($id: ID!) {
      productDelete(input: { id: $id }) {
        deletedProductId
        userErrors { field message }
      }
    }
  `, { id });
  const { userErrors } = data.productDelete;
  if (userErrors?.length) console.warn(`  ⚠ delete ${id}:`, userErrors.map(e => e.message).join(', '));
}

function getAllProducts() {
  const data = gql(`
    query {
      products(first: 100) {
        nodes { id title }
      }
    }
  `);
  return data.products.nodes;
}

// ─── Delete all existing products ────────────────────────────────────────────

function deleteAllProducts() {
  console.log('\n🗑️  Deleting all existing products...');
  const products = getAllProducts();
  for (const p of products) {
    console.log(`  Deleting "${p.title}" (${p.id})...`);
    deleteProduct(p.id);
  }
  console.log(`  ✅ Deleted ${products.length} products.`);
}

// ─── Collar ───────────────────────────────────────────────────────────────────
// 4 colors × 3 sizes = 12 variants, 4 units each → 48 (≈45)

const COLLAR_COLORS = ['Sage', 'Blossom', 'Sky', 'Honey'];
const COLLAR_SIZES  = ['S — 28–36 cm', 'M — 36–44 cm', 'L — 44–52 cm'];

function seedCollar(locationId) {
  console.log('\n🏷️  Creating Collar product...');

  const product = createProduct({
    title:       'Pawlette Collar',
    productType: 'collar',
    status:      'ACTIVE',
    tags:        ['collar', 'biothane', 'customizable'],
    descriptionHtml: '<p>Premium BioThane dog collar with magnetic charm slots. Waterproof, durable, and fully customizable with Pawlette charms.</p>',
  });

  const variants = addOptions(product.id, [
    { name: 'Color', values: COLLAR_COLORS.map(c => ({ name: c })) },
    { name: 'Size',  values: COLLAR_SIZES.map(s => ({ name: s })) },
  ]);

  setPrices(product.id, variants.map(v => ({
    id: v.id,
    price: '24.99',
  })));

  setInventory(locationId, variants.map(v => ({
    inventoryItemId: v.inventoryItem.id,
    quantity: 4, // 12 variants × 4 = 48 ≈ 45 units
  })));

  console.log(`  ✅ Pawlette Collar  (${variants.length} variants, id: ${product.id})`);
  return product;
}

// ─── Leash ────────────────────────────────────────────────────────────────────
// 3 sizes: S=2, M=2, L=1 → 5 units total

const LEASH_SIZES = ['S — up to 10 kg', 'M — 10–25 kg', 'L — 25 kg+'];
const LEASH_INV   = [2, 2, 1]; // total 5

function seedLeash(locationId) {
  console.log('\n🦮  Creating Leash product...');

  const product = createProduct({
    title:       'Pawlette Leash',
    productType: 'leash',
    status:      'ACTIVE',
    tags:        ['leash', 'biothane'],
    descriptionHtml: '<p>Matching BioThane leash. Pair with a Pawlette Collar and add charms for a complete custom look.</p>',
  });

  const variants = addOptions(product.id, [
    { name: 'Size', values: LEASH_SIZES.map(s => ({ name: s })) },
  ]);

  setPrices(product.id, variants.map(v => ({
    id: v.id,
    price: '32.99',
  })));

  setInventory(locationId, variants.map((v, i) => ({
    inventoryItemId: v.inventoryItem.id,
    quantity: LEASH_INV[i] ?? 1,
  })));

  console.log(`  ✅ Pawlette Leash  (${variants.length} variants, id: ${product.id})`);
  return product;
}

// ─── Charms ───────────────────────────────────────────────────────────────────
// 33 variants × 41 units ≈ 1353 (≈1350 total)

const CHARM_STYLES = [
  // Icon charms (15)
  'Paw Charm - Blue', 'Paw Charm - Pink', 'Paw Charm - Green',
  'Heart Charm - Pink', 'Heart Charm - Blue',
  'Star Charm - Yellow', 'Star Charm - Green',
  'Bow Charm - Pink', 'Bow Charm - Blue',
  'Sun Charm - Yellow',
  'Leaf Charm - Green',
  'Butterfly Charm - Purple',
  'Mushroom Charm - Pink',
  'Drop Charm - Blue',
  'Flower Charm - Purple',
  // Letter charms (18)
  'Letter A - Blue',   'Letter B - Pink',   'Letter C - Blue',
  'Letter D - Purple', 'Letter E - Green',  'Letter G - Purple',
  'Letter I - Pink',   'Letter K - Green',  'Letter L - Blue',
  'Letter M - Green',  'Letter N - Yellow', 'Letter O - Purple',
  'Letter R - Pink',   'Letter S - Yellow', 'Letter T - Blue',
  'Letter U - Pink',   'Letter V - Green',  'Letter Z - Blue',
];

const CHARM_DESC = 'Magnetiniai silikono pakabukai lengvai prisitvirtina prie bet kokio Pawlette BioThane antkaklio. Vandeniui atsparūs, saugūs šunims.';
const CHARM_CARE = 'Plaukite po tekančiu vandeniu arba valykite drėgna šluoste.';
const CHARM_SHIP = 'Pristatymas per 2–5 darbo dienas. Nemokamas pristatymas nuo €40.';

function seedCharms(locationId) {
  console.log('\n✨  Creating Charms product...');

  const product = createProduct({
    title:       'Pawlette Charms',
    productType: 'charm',
    status:      'ACTIVE',
    tags:        ['charm', 'silicone', 'magnetic', 'personalized'],
    metafields: [
      { namespace: 'pawlette', key: 'description', type: 'single_line_text_field', value: CHARM_DESC },
      { namespace: 'pawlette', key: 'care',        type: 'single_line_text_field', value: CHARM_CARE },
      { namespace: 'pawlette', key: 'shipping',    type: 'single_line_text_field', value: CHARM_SHIP },
    ],
  });

  const variants = addOptions(product.id, [{
    name:   'Style',
    values: CHARM_STYLES.map(s => ({ name: s })),
  }]);

  setPrices(product.id, variants.map(v => ({
    id:    v.id,
    price: '3.99',
  })));

  // 33 variants × 41 units = 1353 ≈ 1350 total
  setInventory(locationId, variants.map(v => ({
    inventoryItemId: v.inventoryItem.id,
    quantity: 41,
  })));

  console.log(`  ✅ Pawlette Charms  (${variants.length} variants × 41 units = ${variants.length * 41}, id: ${product.id})`);
  return product;
}

// ─── Run ──────────────────────────────────────────────────────────────────────

console.log(`🏪  Restructuring ${STORE} (API ${VERSION})...\n`);

const locationId = getDefaultLocation();

deleteAllProducts();
seedCollar(locationId);
seedLeash(locationId);
seedCharms(locationId);

console.log(`\n🎉  Done — https://${STORE}/admin/products`);
