#!/usr/bin/env node
// Uploads background-removed pink letter charm images and assigns them to
// the "Pink" variant of each Letter X Charm product.
// Run: node scripts/upload-pink-letter-images.mjs

import { execSync } from 'child_process';
import { readFileSync, statSync, readdirSync } from 'fs';
import { join } from 'path';

const STORE = 'paws-rvycxg3u.myshopify.com';
const IMAGE_DIR = '/Users/rysardgvozdovic/Downloads/Folder (21) 6/Pink Letter Charms A–Z (26 singles)/pink';
const LETTER_ORDER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const LETTERS = {
  A: { productId: 'gid://shopify/Product/15777048658294',  pinkVariantId: 'gid://shopify/ProductVariant/58087525155190' },
  B: { productId: 'gid://shopify/Product/15777048691062',  pinkVariantId: 'gid://shopify/ProductVariant/58087525613942' },
  C: { productId: 'gid://shopify/Product/15777048723830',  pinkVariantId: 'gid://shopify/ProductVariant/58087525777782' },
  D: { productId: 'gid://shopify/Product/15777048756598',  pinkVariantId: 'gid://shopify/ProductVariant/58087525941622' },
  E: { productId: 'gid://shopify/Product/15777048789366',  pinkVariantId: 'gid://shopify/ProductVariant/58087526138230' },
  F: { productId: 'gid://shopify/Product/15777048822134',  pinkVariantId: 'gid://shopify/ProductVariant/58087526302070' },
  G: { productId: 'gid://shopify/Product/15777048854902',  pinkVariantId: 'gid://shopify/ProductVariant/58087526465910' },
  H: { productId: 'gid://shopify/Product/15777048887670',  pinkVariantId: 'gid://shopify/ProductVariant/58087526629750' },
  I: { productId: 'gid://shopify/Product/15777048920438',  pinkVariantId: 'gid://shopify/ProductVariant/58087526793590' },
  J: { productId: 'gid://shopify/Product/15777048953206',  pinkVariantId: 'gid://shopify/ProductVariant/58087526957430' },
  K: { productId: 'gid://shopify/Product/15777048985974',  pinkVariantId: 'gid://shopify/ProductVariant/58087527154038' },
  L: { productId: 'gid://shopify/Product/15777049018742',  pinkVariantId: 'gid://shopify/ProductVariant/58087527317878' },
  M: { productId: 'gid://shopify/Product/15777049051510',  pinkVariantId: 'gid://shopify/ProductVariant/58087527481718' },
  N: { productId: 'gid://shopify/Product/15777049084278',  pinkVariantId: 'gid://shopify/ProductVariant/58087527645558' },
  O: { productId: 'gid://shopify/Product/15777049117046',  pinkVariantId: 'gid://shopify/ProductVariant/58087527809398' },
  P: { productId: 'gid://shopify/Product/15777049149814',  pinkVariantId: 'gid://shopify/ProductVariant/58087528006006' },
  Q: { productId: 'gid://shopify/Product/15777049182582',  pinkVariantId: 'gid://shopify/ProductVariant/58087528169846' },
  R: { productId: 'gid://shopify/Product/15777049215350',  pinkVariantId: 'gid://shopify/ProductVariant/58087528333686' },
  S: { productId: 'gid://shopify/Product/15777049248118',  pinkVariantId: 'gid://shopify/ProductVariant/58087528497526' },
  T: { productId: 'gid://shopify/Product/15777049280886',  pinkVariantId: 'gid://shopify/ProductVariant/58087528661366' },
  U: { productId: 'gid://shopify/Product/15777049313654',  pinkVariantId: 'gid://shopify/ProductVariant/58087528857974' },
  V: { productId: 'gid://shopify/Product/15777049346422',  pinkVariantId: 'gid://shopify/ProductVariant/58087529021814' },
  W: { productId: 'gid://shopify/Product/15777049379190',  pinkVariantId: 'gid://shopify/ProductVariant/58087529185654' },
  X: { productId: 'gid://shopify/Product/15777049411958',  pinkVariantId: 'gid://shopify/ProductVariant/58087529349494' },
  Y: { productId: 'gid://shopify/Product/15777049444726',  pinkVariantId: 'gid://shopify/ProductVariant/58087529513334' },
  Z: { productId: 'gid://shopify/Product/15777049477494',  pinkVariantId: 'gid://shopify/ProductVariant/58087529677174' },
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
  const { productId, pinkVariantId } = LETTERS[letter];

  let imagePath;
  try {
    imagePath = getImagePath(letter);
  } catch (e) {
    console.log(`  ⚠ ${letter}: ${e.message}`);
    failCount++;
    continue;
  }

  const fileSize = statSync(imagePath).size;
  const filename = `pink-letter-${letter.toLowerCase()}.png`;
  console.log(`\n[${letter}] ${filename} (${Math.round(fileSize / 1024)}KB)`);

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
        alt: `Letter ${letter} Charm - Pink`,
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

  try {
    await assignWithRetry(productId, pinkVariantId, mediaId, letter);
  } catch (e) {
    console.log(`  ⚠ Assign failed: ${e.message}`);
    failCount++;
    continue;
  }

  console.log(`  ✓ Assigned to Pink variant`);
  successCount++;
}

console.log(`\n${'='.repeat(50)}`);
console.log(`Done! ${successCount}/26 letters updated, ${failCount} failed.`);
