#!/usr/bin/env node
// Creates metafield definitions for the pawlette namespace with PUBLIC_READ storefront access.
// This allows the Storefront API to read them via metafields(identifiers: [...]).
// Run: node scripts/expose-metafields-storefront.mjs

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

const KEYS = ['description', 'features', 'set_includes', 'care', 'shipping'];

for (const key of KEYS) {
  console.log(`Exposing pawlette.${key} to storefront...`);
  const result = gql(`
    mutation Expose($input: MetafieldStorefrontVisibilityInput!) {
      metafieldStorefrontVisibilityCreate(input: $input) {
        metafieldStorefrontVisibility { id namespace key ownerType }
        userErrors { field message }
      }
    }
  `, {
    input: { namespace: 'pawlette', key, ownerType: 'PRODUCT' },
  });

  const errors = result.metafieldStorefrontVisibilityCreate?.userErrors;
  if (errors?.length) {
    console.log(`  ⚠ ${errors[0].message}`);
    continue;
  }
  const vis = result.metafieldStorefrontVisibilityCreate?.metafieldStorefrontVisibility;
  console.log(`  ✓ Exposed: ${vis?.namespace}.${vis?.key}`);
}

console.log('\nDone! pawlette.* metafields are now readable via Storefront API.');
