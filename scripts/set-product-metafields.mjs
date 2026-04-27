#!/usr/bin/env node
// Sets description, features, set_includes, care, shipping metafields
// on all collar products and the Charms product.
// Run: node scripts/set-product-metafields.mjs

import { execSync } from 'child_process';

const STORE = 'floria-lt.myshopify.com';

function gql(query, variables = {}) {
  const vars = JSON.stringify(variables).replace(/'/g, `'\\''`);
  const q = query.replace(/'/g, `'\\''`);
  const out = execSync(
    `shopify store execute --store ${STORE} --allow-mutations --json --query '${q}' --variables '${vars}'`,
    { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
  );
  return JSON.parse(out);
}

const SHARED = {
  features: 'Waterproof silicone construction · lightweight adjustable fit · safe-release buckle · dirt and odor resistance.',
  set_includes: 'Base collar in your chosen colour and size. Five interchangeable snap-on charms. Adjustable safe-release buckle. Linen storage pouch.',
  care: 'Rinse after every swim or muddy walk. Air dry flat — no tumble dryers. Wipe charms with a damp cloth, then air dry.',
  shipping: 'Free shipping on orders over €40. Delivered in 2–4 business days. Returns accepted within 30 days of purchase in original condition.',
};

const COLLARS = [
  {
    id: 'gid://shopify/Product/15969414283644',
    title: 'Blossom Collar',
    description: 'The Blossom Collar is a waterproof silicone collar set designed for everyday wear. Comes in a soft pink tone with five interchangeable snap-on charms — swap styles in seconds, no tools needed.',
  },
  {
    id: 'gid://shopify/Product/15969414316412',
    title: 'Sage Collar',
    description: 'The Sage Collar is a waterproof silicone collar set in a calm sage green. Lightweight and odor-resistant, with five interchangeable snap-on charms to personalise your dog\'s look.',
  },
  {
    id: 'gid://shopify/Product/15969414349180',
    title: 'Sky Collar',
    description: 'The Sky Collar is a waterproof silicone collar set in a soft sky blue. Built for active dogs — rinse clean after any adventure, and snap on a new charm whenever the mood strikes.',
  },
  {
    id: 'gid://shopify/Product/15969414381948',
    title: 'Personalized Waterproof Dog Collar with Charms',
    description: 'A fully customisable waterproof dog collar set. Choose your base colour, pick your size, and personalise with letter or icon charms. Built for daily wear, easy to clean, and ready for anything.',
  },
];

const CHARMS_ID = 'gid://shopify/Product/15969498956156';

// Set metafields for each collar
for (const collar of COLLARS) {
  console.log(`Setting metafields for ${collar.title}...`);
  const result = gql(`
    mutation SetMeta($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { key value }
        userErrors { field message }
      }
    }
  `, {
    metafields: [
      { ownerId: collar.id, namespace: 'pawlette', key: 'description', type: 'single_line_text_field', value: collar.description },
      { ownerId: collar.id, namespace: 'pawlette', key: 'features',    type: 'single_line_text_field', value: SHARED.features },
      { ownerId: collar.id, namespace: 'pawlette', key: 'set_includes',type: 'single_line_text_field', value: SHARED.set_includes },
      { ownerId: collar.id, namespace: 'pawlette', key: 'care',        type: 'single_line_text_field', value: SHARED.care },
      { ownerId: collar.id, namespace: 'pawlette', key: 'shipping',    type: 'single_line_text_field', value: SHARED.shipping },
    ],
  });
  const errs = result.metafieldsSet?.userErrors;
  if (errs?.length) { console.error(`  ✗ Errors:`, errs); continue; }
  console.log(`  ✓ ${result.metafieldsSet.metafields.map(m => m.key).join(', ')}`);
}

// Set metafields for Charms product
console.log('\nSetting metafields for Charms...');
const charmsResult = gql(`
  mutation SetMeta($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { key value }
      userErrors { field message }
    }
  }
`, {
  metafields: [
    {
      ownerId: CHARMS_ID,
      namespace: 'pawlette', key: 'description',
      type: 'single_line_text_field',
      value: 'Snap-on silicone charms for all PawCharms collars. Each charm clicks on and off in around five seconds — no tools needed. Mix letters and icons to spell names, nicknames, or anything your dog deserves.',
    },
    {
      ownerId: CHARMS_ID,
      namespace: 'pawlette', key: 'care',
      type: 'single_line_text_field',
      value: 'Wipe with a damp cloth, then air dry. Do not use abrasive cleaners or soaking water.',
    },
    {
      ownerId: CHARMS_ID,
      namespace: 'pawlette', key: 'shipping',
      type: 'single_line_text_field',
      value: 'Free shipping on orders over €40. Delivered in 2–4 business days. Returns accepted within 30 days.',
    },
  ],
});
const charmsErrs = charmsResult.metafieldsSet?.userErrors;
if (charmsErrs?.length) { console.error('  ✗ Errors:', charmsErrs); }
else console.log(`  ✓ ${charmsResult.metafieldsSet.metafields.map(m => m.key).join(', ')}`);

// Also fix the Charms product body description
console.log('\nFixing Charms product body description...');
const updateResult = gql(`
  mutation UpdateProduct($input: ProductInput!) {
    productUpdate(input: $input) {
      product { id description }
      userErrors { field message }
    }
  }
`, {
  input: {
    id: CHARMS_ID,
    descriptionHtml: 'Snap-on silicone charms for all PawCharms collars. Mix letters and icons to personalise your dog\'s collar.',
  },
});
const updateErrs = updateResult.productUpdate?.userErrors;
if (updateErrs?.length) { console.error('  ✗ Errors:', updateErrs); }
else console.log('  ✓ Body description updated');

console.log('\nDone!');
