#!/usr/bin/env node
// Deletes multi_line_text_field definitions and recreates as rich_text_field with PUBLIC_READ storefront access

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

const DEF_IDS = {
  description: 'gid://shopify/MetafieldDefinition/295208157564',
  features:    'gid://shopify/MetafieldDefinition/295208190332',
  set_includes:'gid://shopify/MetafieldDefinition/295208223100',
  care:        'gid://shopify/MetafieldDefinition/295208255868',
  shipping:    'gid://shopify/MetafieldDefinition/295208288636',
};

// Step 1: Delete existing definitions (values cascade-deleted)
console.log('Step 1: Deleting old definitions...');
for (const [key, id] of Object.entries(DEF_IDS)) {
  const r = gql(`
    mutation Del($id: ID!) {
      metafieldDefinitionDelete(id: $id, deleteAllAssociatedMetafields: true) {
        deletedDefinitionId
        userErrors { field message }
      }
    }
  `, { id });
  const errs = r.metafieldDefinitionDelete?.userErrors;
  if (errs?.length) console.log(`  ⚠ ${key}: ${errs[0].message}`);
  else console.log(`  ✓ Deleted ${key}`);
}

// Step 2: Create as rich_text_field with storefront PUBLIC_READ
console.log('\nStep 2: Creating rich_text_field definitions...');
for (const key of Object.keys(DEF_IDS)) {
  const r = gql(`
    mutation Create($def: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $def) {
        createdDefinition { id namespace key type { name } access { storefront } }
        userErrors { field message }
      }
    }
  `, {
    def: {
      namespace: 'pawlette',
      key,
      name: key.replace(/_/g, ' '),
      type: 'rich_text_field',
      ownerType: 'PRODUCT',
      access: { storefront: 'PUBLIC_READ' },
    },
  });
  const errs = r.metafieldDefinitionCreate?.userErrors;
  if (errs?.length) console.log(`  ⚠ ${key}: ${errs[0].message}`);
  else {
    const d = r.metafieldDefinitionCreate?.createdDefinition;
    console.log(`  ✓ Created ${d?.namespace}.${d?.key} (${d?.type?.name}) storefront=${d?.access?.storefront}`);
  }
}

console.log('\nDone! Now run: node scripts/set-product-metafields-rich.mjs');
