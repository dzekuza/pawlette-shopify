#!/usr/bin/env node
// Retries variant assignment for dark blue letters that had "Non-ready media" errors.
// Finds the already-uploaded media on each product, polls until READY, then assigns.
// Run: node scripts/retry-dark-blue-assign.mjs

import { execSync } from 'child_process';

const STORE = 'paws-rvycxg3u.myshopify.com';

const FAILED = {
  J: { productId: 'gid://shopify/Product/15777048953206',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087526891894' },
  N: { productId: 'gid://shopify/Product/15777049084278',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087527580022' },
  Q: { productId: 'gid://shopify/Product/15777049182582',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087528104310' },
  V: { productId: 'gid://shopify/Product/15777049346422',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087528956278' },
  W: { productId: 'gid://shopify/Product/15777049379190',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087529120118' },
  Z: { productId: 'gid://shopify/Product/15777049477494',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087529611638' },
};

function gql(query, variables = {}) {
  const vars = JSON.stringify(variables).replace(/'/g, `'\\''`);
  const q = query.replace(/'/g, `'\\''`);
  const out = execSync(
    `shopify store execute --store ${STORE} --allow-mutations --json --query '${q}' --variables '${vars}'`,
    { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
  );
  return JSON.parse(out);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

let successCount = 0;
let failCount = 0;

for (const [letter, { productId, darkBlueVariantId }] of Object.entries(FAILED)) {
  console.log(`\n[${letter}] Finding media on product...`);

  // Find the dark blue media that was already uploaded (matched by alt text)
  let mediaId;
  const altText = `Letter ${letter} Charm - Dark Blue`;

  const mediaData = gql(`
    query GetMedia($id: ID!) {
      product(id: $id) {
        media(first: 20) {
          edges {
            node {
              ... on MediaImage {
                id
                alt
                status
              }
            }
          }
        }
      }
    }
  `, { id: productId });

  const mediaList = mediaData.product?.media?.edges ?? [];
  const found = mediaList.find(e => e.node.alt === altText);

  if (!found) {
    console.log(`  ⚠ No media found with alt "${altText}"`);
    failCount++;
    continue;
  }

  mediaId = found.node.id;
  let status = found.node.status;
  console.log(`  Found media ${mediaId} (status: ${status})`);

  // Poll until READY (max 30s)
  let attempts = 0;
  while (status !== 'READY' && attempts < 15) {
    await sleep(2000);
    attempts++;
    const poll = gql(`
      query PollMedia($id: ID!) {
        product(id: $id) {
          media(first: 20) {
            edges { node { ... on MediaImage { id alt status } } }
          }
        }
      }
    `, { id: productId });

    const pollList = poll.product?.media?.edges ?? [];
    const pollFound = pollList.find(e => e.node.id === mediaId);
    status = pollFound?.node?.status ?? status;
    console.log(`  Polling... status: ${status} (attempt ${attempts})`);
  }

  if (status !== 'READY') {
    console.log(`  ⚠ Media never reached READY after ${attempts} attempts`);
    failCount++;
    continue;
  }

  // Assign to variant
  try {
    const appendData = gql(`
      mutation AppendMedia($productId: ID!, $variantMedia: [ProductVariantAppendMediaInput!]!) {
        productVariantAppendMedia(productId: $productId, variantMedia: $variantMedia) {
          product { id }
          userErrors { field message }
        }
      }
    `, {
      productId,
      variantMedia: [{ variantId: darkBlueVariantId, mediaIds: [mediaId] }],
    });

    const appendErrors = appendData.productVariantAppendMedia?.userErrors;
    if (appendErrors?.length) {
      console.log(`  ⚠ Assign errors: ${appendErrors[0].message}`);
      failCount++;
      continue;
    }
  } catch (e) {
    console.log(`  ⚠ Assign failed: ${e.message}`);
    failCount++;
    continue;
  }

  console.log(`  ✓ Assigned to Dark Blue variant`);
  successCount++;
}

console.log(`\n${'='.repeat(50)}`);
console.log(`Retry done! ${successCount}/6 fixed, ${failCount} still failed.`);
