/**
 * Seeds paws-rvycxg3u.myshopify.com with Pawlette products.
 * Uses the 2026-01 Admin GraphQL new product model (3-step: create → options → prices).
 * Requires: shopify store auth --store paws-rvycxg3u.myshopify.com --scopes write_products,read_products
 * Run: node scripts/seed-pawlette.mjs
 */

import { execSync } from 'child_process';

const STORE = 'paws-rvycxg3u.myshopify.com';
const VERSION = '2026-01';

function gql(query, variables = {}) {
  const q = query.trim().replace(/'/g, `'\\''`);
  const v = JSON.stringify(variables).replace(/'/g, `'\\''`);
  const out = execSync(
    `shopify store execute --store ${STORE} --allow-mutations --json --version ${VERSION} --query '${q}' --variables '${v}'`,
    { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
  );
  const parsed = JSON.parse(out);
  return parsed.data ?? parsed;
}

// ─── Step 1: Create base product ─────────────────────────────────────────────

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

// ─── Step 2: Add options (creates variants automatically) ─────────────────────

function addOptions(productId, options) {
  const data = gql(`
    mutation AddOptions($productId: ID!, $options: [OptionCreateInput!]!) {
      productOptionsCreate(productId: $productId, options: $options, variantStrategy: CREATE) {
        product {
          id
          variants(first: 250) { nodes { id selectedOptions { name value } } }
        }
        userErrors { field message code }
      }
    }
  `, { productId, options });
  const { product, userErrors } = data.productOptionsCreate;
  if (userErrors?.length) throw new Error(userErrors.map(e => e.message).join(', '));
  return product.variants.nodes;
}

// ─── Step 3: Set prices on variants ──────────────────────────────────────────

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

// ─── Collars ─────────────────────────────────────────────────────────────────

const COLLAR_SIZES = ['S — 28–36 cm', 'M — 36–44 cm', 'L — 44–52 cm'];

const COLLARS = [
  { title: 'Sage Collar',    color: '#A8D5A2', tag: 'sage'    },
  { title: 'Blossom Collar', color: '#F4B5C0', tag: 'blossom' },
  { title: 'Sky Collar',     color: '#B8D8F4', tag: 'sky'     },
  { title: 'Honey Collar',   color: '#F9E4A0', tag: 'honey'   },
];

const COLLAR_DESC  = 'Vandeniui atsparus BioThane antkaklis su magnetiniais silikono pakabukų laikikliais. Pagaminta Lietuvoje.';
const COLLAR_FEATS = '• Vandeniui atspari BioThane medžiaga\n• 5 magnetinių pakabukų laikikliai\n• Lengva valyti\n• Pagaminta Lietuvoje';
const COLLAR_SET   = '• 1× BioThane antkaklis\n• 5× magnetinių pakabukų laikikliai\n• Dovanų dėžutė';
const COLLAR_CARE  = 'Valykite drėgna šluoste arba plaukite po tekančiu vandeniu. Nedžiovinkite džiovintuvu.';
const COLLAR_SHIP  = 'Pristatymas per 2–5 darbo dienas. Nemokamas pristatymas nuo €40.';

function seedCollars() {
  console.log('\n🐾  Creating collars...');
  for (const c of COLLARS) {
    // Step 1
    const product = createProduct({
      title: c.title,
      productType: 'collar',
      status: 'ACTIVE',
      tags: ['collar', c.tag, 'biothane'],
      metafields: [
        { namespace: 'pawlette', key: 'color',        type: 'single_line_text_field', value: c.color     },
        { namespace: 'pawlette', key: 'description',  type: 'single_line_text_field', value: COLLAR_DESC  },
        { namespace: 'pawlette', key: 'features',     type: 'multi_line_text_field', value: COLLAR_FEATS },
        { namespace: 'pawlette', key: 'set_includes', type: 'multi_line_text_field', value: COLLAR_SET   },
        { namespace: 'pawlette', key: 'care',         type: 'single_line_text_field', value: COLLAR_CARE  },
        { namespace: 'pawlette', key: 'shipping',     type: 'single_line_text_field', value: COLLAR_SHIP  },
      ],
    });

    // Step 2 — creates S/M/L variants automatically
    const variants = addOptions(product.id, [{
      name: 'Size',
      values: COLLAR_SIZES.map(s => ({ name: s })),
    }]);

    // Step 3 — set price on each variant
    setPrices(product.id, variants.map(v => ({
      id: v.id,
      price: '28.00',
      compareAtPrice: '35.00',
    })));

    console.log(`  ✅ ${product.title}  (${variants.length} variants, id: ${product.id})`);
  }
}

// ─── Charms ──────────────────────────────────────────────────────────────────

const CHARM_STYLES = [
  // Icon charms
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
  // Letter charms
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

function seedCharms() {
  console.log('\n✨  Creating charms product...');

  // Step 1
  const product = createProduct({
    title: 'Pawlette Charms',
    productType: 'charm',
    status: 'ACTIVE',
    tags: ['charm', 'silicone', 'magnetic', 'personalized'],
    metafields: [
      { namespace: 'pawlette', key: 'description', type: 'single_line_text_field', value: CHARM_DESC },
      { namespace: 'pawlette', key: 'care',        type: 'single_line_text_field', value: CHARM_CARE },
      { namespace: 'pawlette', key: 'shipping',    type: 'single_line_text_field', value: CHARM_SHIP },
    ],
  });

  // Step 2 — creates one variant per charm style
  const variants = addOptions(product.id, [{
    name: 'Style',
    values: CHARM_STYLES.map(s => ({ name: s })),
  }]);

  // Step 3 — set price on all charm variants
  setPrices(product.id, variants.map(v => ({
    id: v.id,
    price: '6.00',
    compareAtPrice: '9.00',
  })));

  console.log(`  ✅ Pawlette Charms  (${variants.length} variants, id: ${product.id})`);
}

// ─── Run ──────────────────────────────────────────────────────────────────────

console.log(`🏪  Seeding ${STORE} (API ${VERSION})...`);
seedCollars();
seedCharms();
console.log(`\n🎉  Done — https://${STORE}/admin/products`);
