#!/usr/bin/env node
// Uses cached `shopify store auth` — no token needed.
// Run: node scripts/seed-shopify.mjs

import { execSync } from 'child_process';

const STORE = 'floria-lt.myshopify.com';

function execute(query, variables) {
  const cmd = [
    'shopify store execute',
    `--store ${STORE}`,
    '--allow-mutations',
    '--json',
    `--query '${query.replace(/'/g, `'\\''`)}'`,
    `--variables '${JSON.stringify(variables).replace(/'/g, `'\\''`)}'`,
  ].join(' ');

  const out = execSync(cmd, { encoding: 'utf8' });
  return JSON.parse(out);
}

const HEADLESS_PUBLICATION_ID = 'gid://shopify/Publication/308380041596';

const CREATE_PRODUCT = `
  mutation CreateProduct($product: ProductCreateInput!) {
    productCreate(product: $product) {
      product { id variants(first: 1) { nodes { id } } }
      userErrors { field message }
    }
  }
`;

const UPDATE_PRICE = `
  mutation UpdatePrice($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      productVariants { id price }
      userErrors { field message }
    }
  }
`;

const PUBLISH = `
  mutation Publish($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      publishable { ... on Product { id } }
      userErrors { field message }
    }
  }
`;

async function createProduct({ title, productType, price, metafields }) {
  const data = execute(CREATE_PRODUCT, {
    product: { title, productType, status: 'ACTIVE', metafields },
  });

  const result = data.productCreate;
  if (result.userErrors?.length) {
    throw new Error(`${title}: ${result.userErrors.map(e => e.message).join(', ')}`);
  }

  const productId = result.product.id;
  const variantId = result.product.variants.nodes[0]?.id;

  if (variantId) {
    const priceData = execute(UPDATE_PRICE, {
      productId,
      variants: [{ id: variantId, price }],
    });
    if (priceData.productVariantsBulkUpdate?.userErrors?.length) {
      console.warn(`  Price update warning for ${title}`);
    }
  }

  execute(PUBLISH, {
    id: productId,
    input: [{ publicationId: HEADLESS_PUBLICATION_ID }],
  });

  console.log(`✓ ${productType.toUpperCase()}: ${title}`);
}

const collars = [
  { title: 'Blossom Collar', price: '28.00', metafields: [{ namespace: 'pawlette', key: 'color', type: 'single_line_text_field', value: '#F4B5C0' }] },
  { title: 'Sage Collar',    price: '28.00', metafields: [{ namespace: 'pawlette', key: 'color', type: 'single_line_text_field', value: '#A8D5A2' }] },
  { title: 'Sky Collar',     price: '28.00', metafields: [{ namespace: 'pawlette', key: 'color', type: 'single_line_text_field', value: '#B8D8F4' }] },
  { title: 'Honey Collar',   price: '28.00', metafields: [{ namespace: 'pawlette', key: 'color', type: 'single_line_text_field', value: '#F9E4A0' }] },
];

const charms = [
  { title: 'Letter T Charm',       price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#B8D8F4' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'letter' }] },
  { title: 'Letter D Charm',       price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#D4B8F4' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'letter' }] },
  { title: 'Blue Paw Charm',       price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#B8D8F4' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'icon'   }] },
  { title: 'Green Star Charm',     price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#A8D5A2' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'icon'   }] },
  { title: 'Letter K Charm',       price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#A8D5A2' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'letter' }] },
  { title: 'Letter O Charm',       price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#D4B8F4' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'letter' }] },
  { title: 'Letter B Charm',       price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#F4B5C0' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'letter' }] },
  { title: 'Sage Leaf Charm',      price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#A8D5A2' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'icon'   }] },
  { title: 'Lavender Flower Charm',price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#D4B8F4' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'icon'   }] },
  { title: 'Pink Heart Charm',     price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#F4B5C0' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'icon'   }] },
  { title: 'Mini Heart Charm',     price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#F4B5C0' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'icon'   }] },
  { title: 'Letter G Charm',       price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#D4B8F4' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'letter' }] },
  { title: 'Pink Bow Charm',       price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#F4B5C0' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'icon'   }] },
  { title: 'Sage Sun Charm',       price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#A8D5A2' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'icon'   }] },
  { title: 'Letter S Charm',       price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#F9E4A0' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'letter' }] },
  { title: 'Letter L Charm',       price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#B8D8F4' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'letter' }] },
  { title: 'Yellow Star Charm',    price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#F9E4A0' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'icon'   }] },
  { title: 'Letter C Charm',       price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#B8D8F4' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'letter' }] },
  { title: 'Letter R Charm',       price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#F4B5C0' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'letter' }] },
  { title: 'Light Paw Charm',      price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#B8D8F4' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'icon'   }] },
  { title: 'Blue Drop Charm',      price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#B8D8F4' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'icon'   }] },
  { title: 'Letter N Charm',       price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#F9E4A0' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'letter' }] },
  { title: 'Letter M Charm',       price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#A8D5A2' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'letter' }] },
  { title: 'Butterfly Charm',      price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#D4B8F4' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'icon'   }] },
  { title: 'Pink Mushroom Charm',  price: '6.00', metafields: [{ namespace: 'pawlette', key: 'bg', type: 'single_line_text_field', value: '#F4B5C0' }, { namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: 'icon'   }] },
];

console.log('Creating 4 collars...');
for (const c of collars) await createProduct({ ...c, productType: 'collar' });

console.log('\nCreating 25 charms...');
for (const c of charms) await createProduct({ ...c, productType: 'charm' });

console.log('\nAll done! Refresh localhost:3000 to see products.');
