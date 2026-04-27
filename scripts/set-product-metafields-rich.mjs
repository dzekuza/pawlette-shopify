#!/usr/bin/env node
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

function rt(...children) {
  return JSON.stringify({ type: 'root', children });
}
function p(text, bold = false) {
  return { type: 'paragraph', children: [bold ? { type: 'text', value: text, bold: true } : { type: 'text', value: text }] };
}
function ul(...items) {
  return { type: 'list', listType: 'unordered', children: items.map(t => ({ type: 'list-item', children: [{ type: 'text', value: t }] })) };
}

const SHARED = {
  features: rt(
    ul(
      'Waterproof silicone construction',
      'Lightweight adjustable fit',
      'Safe-release buckle',
      'Dirt and odor resistance',
      'Five interchangeable snap-on charms included'
    )
  ),
  set_includes: rt(
    ul(
      'Base collar in your chosen colour and size',
      'Five interchangeable snap-on charms',
      'Adjustable safe-release buckle',
      'Linen storage pouch'
    )
  ),
  care: rt(
    ul(
      'Rinse after every swim or muddy walk',
      'Air dry flat — no tumble dryers',
      'Wipe charms with a damp cloth, then air dry'
    )
  ),
  shipping: rt(
    ul(
      'Free shipping on orders over €40',
      'Delivered in 2–4 business days',
      'Returns accepted within 30 days of purchase in original condition'
    )
  ),
};

const COLLARS = [
  {
    id: 'gid://shopify/Product/15969414283644',
    title: 'Blossom Collar',
    description: rt(p('The Blossom Collar is a waterproof silicone collar set designed for everyday wear. Comes in a soft pink tone with five interchangeable snap-on charms — swap styles in seconds, no tools needed.')),
  },
  {
    id: 'gid://shopify/Product/15969414316412',
    title: 'Sage Collar',
    description: rt(p('The Sage Collar is a waterproof silicone collar set in a calm sage green. Lightweight and odor-resistant, with five interchangeable snap-on charms to personalise your dog\'s look.')),
  },
  {
    id: 'gid://shopify/Product/15969414349180',
    title: 'Sky Collar',
    description: rt(p('The Sky Collar is a waterproof silicone collar set in a soft sky blue. Built for active dogs — rinse clean after any adventure, and snap on a new charm whenever the mood strikes.')),
  },
  {
    id: 'gid://shopify/Product/15969414381948',
    title: 'Personalized Waterproof Dog Collar with Charms',
    description: rt(p('A fully customisable waterproof dog collar set. Choose your base colour, pick your size, and personalise with letter or icon charms. Built for daily wear, easy to clean, and ready for anything.')),
  },
];

const CHARMS_ID = 'gid://shopify/Product/15969498956156';

for (const collar of COLLARS) {
  console.log(`Setting metafields for ${collar.title}...`);
  const r = gql(`
    mutation SetMeta($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { key }
        userErrors { field message }
      }
    }
  `, {
    metafields: [
      { ownerId: collar.id, namespace: 'pawlette', key: 'description', type: 'rich_text_field', value: collar.description },
      { ownerId: collar.id, namespace: 'pawlette', key: 'features',    type: 'rich_text_field', value: SHARED.features },
      { ownerId: collar.id, namespace: 'pawlette', key: 'set_includes',type: 'rich_text_field', value: SHARED.set_includes },
      { ownerId: collar.id, namespace: 'pawlette', key: 'care',        type: 'rich_text_field', value: SHARED.care },
      { ownerId: collar.id, namespace: 'pawlette', key: 'shipping',    type: 'rich_text_field', value: SHARED.shipping },
    ],
  });
  const errs = r.metafieldsSet?.userErrors;
  if (errs?.length) console.error('  ✗', errs);
  else console.log(`  ✓ ${r.metafieldsSet.metafields.map(m => m.key).join(', ')}`);
}

console.log('\nSetting metafields for Charms...');
const cr = gql(`
  mutation SetMeta($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { key }
      userErrors { field message }
    }
  }
`, {
  metafields: [
    {
      ownerId: CHARMS_ID, namespace: 'pawlette', key: 'description', type: 'rich_text_field',
      value: rt(p('Snap-on silicone charms for all PawCharms collars. Each charm clicks on and off in around five seconds — no tools needed. Mix letters and icons to spell names, nicknames, or anything your dog deserves.')),
    },
    {
      ownerId: CHARMS_ID, namespace: 'pawlette', key: 'care', type: 'rich_text_field',
      value: rt(ul('Wipe with a damp cloth, then air dry', 'Do not use abrasive cleaners or soaking water')),
    },
    {
      ownerId: CHARMS_ID, namespace: 'pawlette', key: 'shipping', type: 'rich_text_field',
      value: rt(ul('Free shipping on orders over €40', 'Delivered in 2–4 business days', 'Returns accepted within 30 days')),
    },
  ],
});
const cerrs = cr.metafieldsSet?.userErrors;
if (cerrs?.length) console.error('  ✗', cerrs);
else console.log(`  ✓ ${cr.metafieldsSet.metafields.map(m => m.key).join(', ')}`);

console.log('\nDone!');
