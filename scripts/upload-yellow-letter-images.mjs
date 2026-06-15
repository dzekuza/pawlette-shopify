#!/usr/bin/env node
// Uploads background-removed yellow letter charm images and assigns them to
// the "Yellow" variant of each Letter X Charm product.
// Run: node scripts/upload-yellow-letter-images.mjs

import { execSync } from 'child_process';
import { readFileSync, statSync, readdirSync } from 'fs';
import { join } from 'path';

const STORE = 'paws-rvycxg3u.myshopify.com';
const IMAGE_DIR = '/Users/rysardgvozdovic/Downloads/Folder (21) 4/Yellow Letter Charms A–Z (26 singles)/yel';
const LETTER_ORDER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const LETTERS = {
  A: { productId: 'gid://shopify/Product/15777048658294',  yellowVariantId: 'gid://shopify/ProductVariant/58087525187958' },
  B: { productId: 'gid://shopify/Product/15777048691062',  yellowVariantId: 'gid://shopify/ProductVariant/58087525646710' },
  C: { productId: 'gid://shopify/Product/15777048723830',  yellowVariantId: 'gid://shopify/ProductVariant/58087525810550' },
  D: { productId: 'gid://shopify/Product/15777048756598',  yellowVariantId: 'gid://shopify/ProductVariant/58087525974390' },
  E: { productId: 'gid://shopify/Product/15777048789366',  yellowVariantId: 'gid://shopify/ProductVariant/58087526170998' },
  F: { productId: 'gid://shopify/Product/15777048822134',  yellowVariantId: 'gid://shopify/ProductVariant/58087526334838' },
  G: { productId: 'gid://shopify/Product/15777048854902',  yellowVariantId: 'gid://shopify/ProductVariant/58087526498678' },
  H: { productId: 'gid://shopify/Product/15777048887670',  yellowVariantId: 'gid://shopify/ProductVariant/58087526662518' },
  I: { productId: 'gid://shopify/Product/15777048920438',  yellowVariantId: 'gid://shopify/ProductVariant/58087526826358' },
  J: { productId: 'gid://shopify/Product/15777048953206',  yellowVariantId: 'gid://shopify/ProductVariant/58087526990198' },
  K: { productId: 'gid://shopify/Product/15777048985974',  yellowVariantId: 'gid://shopify/ProductVariant/58087527186806' },
  L: { productId: 'gid://shopify/Product/15777049018742',  yellowVariantId: 'gid://shopify/ProductVariant/58087527350646' },
  M: { productId: 'gid://shopify/Product/15777049051510',  yellowVariantId: 'gid://shopify/ProductVariant/58087527514486' },
  N: { productId: 'gid://shopify/Product/15777049084278',  yellowVariantId: 'gid://shopify/ProductVariant/58087527678326' },
  O: { productId: 'gid://shopify/Product/15777049117046',  yellowVariantId: 'gid://shopify/ProductVariant/58087527842166' },
  P: { productId: 'gid://shopify/Product/15777049149814',  yellowVariantId: 'gid://shopify/ProductVariant/58087528038774' },
  Q: { productId: 'gid://shopify/Product/15777049182582',  yellowVariantId: 'gid://shopify/ProductVariant/58087528202614' },
  R: { productId: 'gid://shopify/Product/15777049215350',  yellowVariantId: 'gid://shopify/ProductVariant/58087528366454' },
  S: { productId: 'gid://shopify/Product/15777049248118',  yellowVariantId: 'gid://shopify/ProductVariant/58087528530294' },
  T: { productId: 'gid://shopify/Product/15777049280886',  yellowVariantId: 'gid://shopify/ProductVariant/58087528694134' },
  U: { productId: 'gid://shopify/Product/15777049313654',  yellowVariantId: 'gid://shopify/ProductVariant/58087528890742' },
  V: { productId: 'gid://shopify/Product/15777049346422',  yellowVariantId: 'gid://shopify/ProductVariant/58087529054582' },
  W: { productId: 'gid://shopify/Product/15777049379190',  yellowVariantId: 'gid://shopify/ProductVariant/58087529218422' },
  X: { productId: 'gid://shopify/Product/15777049411958',  yellowVariantId: 'gid://shopify/ProductVariant/58087529382262' },
  Y: { productId: 'gid://shopify/Product/15777049444726',  yellowVariantId: 'gid://shopify/ProductVariant/58087529546102' },
  Z: { productId: 'gid://shopify/Product/15777049477494',  yellowVariantId: 'gid://shopify/ProductVariant/58087529709942' },
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

function getImagePath(letter) {
  const idx = LETTER_ORDER.indexOf(letter);
  const prefix = String(idx + 1).padStart(3, '0');
  const files = readdirSync(IMAGE_DIR);
  const match = files.find(f => f.startsWith(prefix));
  if (!match) throw new Error(`No image file found for letter ${letter} (prefix ${prefix})`);
  return join(IMAGE_DIR, match);
}

// Retry assign with polling for media READY status
async function assignWithRetry(productId, variantId, mediaId, letter, maxWaitMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const poll = gql(`
      query PollMedia($id: ID!) {
        product(id: $id) {
          media(first: 30) { edges { node { ... on MediaImage { id status } } } }
        }
      }
    `, { id: productId });

    const mediaList = poll.product?.media?.edges ?? [];
    const found = mediaList.find(e => e.node.id === mediaId);
    if (found?.node?.status === 'READY') break;
    await sleep(2000);
  }

  const appendData = gql(`
    mutation AppendMedia($productId: ID!, $variantMedia: [ProductVariantAppendMediaInput!]!) {
      productVariantAppendMedia(productId: $productId, variantMedia: $variantMedia) {
        product { id }
        userErrors { field message }
      }
    }
  `, { productId, variantMedia: [{ variantId, mediaIds: [mediaId] }] });

  const errors = appendData.productVariantAppendMedia?.userErrors;
  if (errors?.length) throw new Error(errors[0].message);
}

let successCount = 0;
let failCount = 0;

for (const letter of LETTER_ORDER) {
  const { productId, yellowVariantId } = LETTERS[letter];

  let imagePath;
  try {
    imagePath = getImagePath(letter);
  } catch (e) {
    console.log(`  ⚠ ${letter}: ${e.message}`);
    failCount++;
    continue;
  }

  const fileSize = statSync(imagePath).size;
  const filename = `yellow-letter-${letter.toLowerCase()}.png`;
  console.log(`\n[${letter}] ${filename} (${Math.round(fileSize / 1024)}KB)`);

  // Stage upload
  let stageData;
  try {
    stageData = gql(`
      mutation StageUpload($input: [StagedUploadInput!]!) {
        stagedUploadsCreate(input: $input) {
          stagedTargets { url resourceUrl parameters { name value } }
          userErrors { field message }
        }
      }
    `, {
      input: [{
        filename,
        mimeType: 'image/png',
        resource: 'PRODUCT_IMAGE',
        fileSize: String(fileSize),
        httpMethod: 'POST',
      }],
    });
  } catch (e) {
    console.log(`  ⚠ Stage failed: ${e.message}`);
    failCount++;
    continue;
  }

  const stageErrors = stageData.stagedUploadsCreate?.userErrors;
  if (stageErrors?.length) {
    console.log(`  ⚠ Stage errors: ${stageErrors[0].message}`);
    failCount++;
    continue;
  }

  const target = stageData.stagedUploadsCreate?.stagedTargets?.[0];
  if (!target) { console.log(`  ⚠ No stage target`); failCount++; continue; }

  // Upload to S3
  const form = new FormData();
  for (const { name, value } of target.parameters) form.append(name, value);
  const fileBytes = readFileSync(imagePath);
  form.append('file', new Blob([fileBytes], { type: 'image/png' }), filename);

  const uploadRes = await fetch(target.url, { method: 'POST', body: form });
  if (!uploadRes.ok) {
    console.log(`  ⚠ S3 upload failed: HTTP ${uploadRes.status}`);
    failCount++;
    continue;
  }
  console.log(`  ✓ Uploaded to Shopify`);

  await sleep(800);

  // Create media on product
  let mediaId;
  try {
    const mediaData = gql(`
      mutation CreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
        productCreateMedia(productId: $productId, media: $media) {
          media { ... on MediaImage { id status } }
          mediaUserErrors { field message }
        }
      }
    `, {
      productId,
      media: [{
        originalSource: target.resourceUrl,
        mediaContentType: 'IMAGE',
        alt: `Letter ${letter} Charm - Yellow`,
      }],
    });

    const mediaErrors = mediaData.productCreateMedia?.mediaUserErrors;
    if (mediaErrors?.length) throw new Error(mediaErrors[0].message);
    mediaId = mediaData.productCreateMedia?.media?.[0]?.id;
    if (!mediaId) throw new Error('No media ID returned');
  } catch (e) {
    console.log(`  ⚠ Create media failed: ${e.message}`);
    failCount++;
    continue;
  }
  console.log(`  ✓ Media created on product`);

  // Assign to Yellow variant (with polling retry built-in)
  try {
    await assignWithRetry(productId, yellowVariantId, mediaId, letter);
  } catch (e) {
    console.log(`  ⚠ Assign failed: ${e.message}`);
    failCount++;
    continue;
  }

  console.log(`  ✓ Assigned to Yellow variant`);
  successCount++;
}

console.log(`\n${'='.repeat(50)}`);
console.log(`Done! ${successCount}/26 letters updated, ${failCount} failed.`);
