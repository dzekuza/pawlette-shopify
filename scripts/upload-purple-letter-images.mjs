#!/usr/bin/env node
// Uploads background-removed purple letter charm images and assigns them to:
//   - Each "Letter X Charm" product (as a product image)
//   - The "Purple" variant of that product
// Run: node scripts/upload-purple-letter-images.mjs

import { execSync } from 'child_process';
import { readFileSync, statSync, readdirSync } from 'fs';
import { join } from 'path';

const STORE = 'paws-rvycxg3u.myshopify.com';
const IMAGE_DIR = '/Users/rysardgvozdovic/Downloads/Folder (21) 2/Purple Letter Charms A–Z (26 singles)/purple letter';
const LETTER_ORDER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Letter → { productId, purpleVariantId }
const LETTERS = {
  A: { productId: 'gid://shopify/Product/15777048658294',  purpleVariantId: 'gid://shopify/ProductVariant/58087525122422' },
  B: { productId: 'gid://shopify/Product/15777048691062',  purpleVariantId: 'gid://shopify/ProductVariant/58087525581174' },
  C: { productId: 'gid://shopify/Product/15777048723830',  purpleVariantId: 'gid://shopify/ProductVariant/58087525745014' },
  D: { productId: 'gid://shopify/Product/15777048756598',  purpleVariantId: 'gid://shopify/ProductVariant/58087525908854' },
  E: { productId: 'gid://shopify/Product/15777048789366',  purpleVariantId: 'gid://shopify/ProductVariant/58087526105462' },
  F: { productId: 'gid://shopify/Product/15777048822134',  purpleVariantId: 'gid://shopify/ProductVariant/58087526269302' },
  G: { productId: 'gid://shopify/Product/15777048854902',  purpleVariantId: 'gid://shopify/ProductVariant/58087526433142' },
  H: { productId: 'gid://shopify/Product/15777048887670',  purpleVariantId: 'gid://shopify/ProductVariant/58087526596982' },
  I: { productId: 'gid://shopify/Product/15777048920438',  purpleVariantId: 'gid://shopify/ProductVariant/58087526760822' },
  J: { productId: 'gid://shopify/Product/15777048953206',  purpleVariantId: 'gid://shopify/ProductVariant/58087526924662' },
  K: { productId: 'gid://shopify/Product/15777048985974',  purpleVariantId: 'gid://shopify/ProductVariant/58087527121270' },
  L: { productId: 'gid://shopify/Product/15777049018742',  purpleVariantId: 'gid://shopify/ProductVariant/58087527285110' },
  M: { productId: 'gid://shopify/Product/15777049051510',  purpleVariantId: 'gid://shopify/ProductVariant/58087527448950' },
  N: { productId: 'gid://shopify/Product/15777049084278',  purpleVariantId: 'gid://shopify/ProductVariant/58087527612790' },
  O: { productId: 'gid://shopify/Product/15777049117046',  purpleVariantId: 'gid://shopify/ProductVariant/58087527776630' },
  P: { productId: 'gid://shopify/Product/15777049149814',  purpleVariantId: 'gid://shopify/ProductVariant/58087527973238' },
  Q: { productId: 'gid://shopify/Product/15777049182582',  purpleVariantId: 'gid://shopify/ProductVariant/58087528137078' },
  R: { productId: 'gid://shopify/Product/15777049215350',  purpleVariantId: 'gid://shopify/ProductVariant/58087528300918' },
  S: { productId: 'gid://shopify/Product/15777049248118',  purpleVariantId: 'gid://shopify/ProductVariant/58087528464758' },
  T: { productId: 'gid://shopify/Product/15777049280886',  purpleVariantId: 'gid://shopify/ProductVariant/58087528628598' },
  U: { productId: 'gid://shopify/Product/15777049313654',  purpleVariantId: 'gid://shopify/ProductVariant/58087528825206' },
  V: { productId: 'gid://shopify/Product/15777049346422',  purpleVariantId: 'gid://shopify/ProductVariant/58087528989046' },
  W: { productId: 'gid://shopify/Product/15777049379190',  purpleVariantId: 'gid://shopify/ProductVariant/58087529152886' },
  X: { productId: 'gid://shopify/Product/15777049411958',  purpleVariantId: 'gid://shopify/ProductVariant/58087529316726' },
  Y: { productId: 'gid://shopify/Product/15777049444726',  purpleVariantId: 'gid://shopify/ProductVariant/58087529480566' },
  Z: { productId: 'gid://shopify/Product/15777049477494',  purpleVariantId: 'gid://shopify/ProductVariant/58087529644406' },
};

// All inputs to gql() are hardcoded GraphQL strings and serialized JSON —
// no runtime user input is interpolated into the shell command.
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

// Files are named 001_... = A, 002_... = B, ..., 026_... = Z
function getImagePath(letter) {
  const idx = LETTER_ORDER.indexOf(letter);
  const prefix = String(idx + 1).padStart(3, '0');
  const files = readdirSync(IMAGE_DIR);
  const match = files.find(f => f.startsWith(prefix));
  if (!match) throw new Error(`No image file found for letter ${letter} (prefix ${prefix})`);
  return join(IMAGE_DIR, match);
}

let successCount = 0;
let failCount = 0;

for (const letter of LETTER_ORDER) {
  const { productId, purpleVariantId } = LETTERS[letter];

  let imagePath;
  try {
    imagePath = getImagePath(letter);
  } catch (e) {
    console.log(`  ⚠ ${letter}: ${e.message}`);
    failCount++;
    continue;
  }

  const fileSize = statSync(imagePath).size;
  const filename = `purple-letter-${letter.toLowerCase()}.png`;

  console.log(`\n[${letter}] ${filename} (${Math.round(fileSize / 1024)}KB)`);

  // Step 1: Stage the upload
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
  if (!target) {
    console.log(`  ⚠ No stage target returned`);
    failCount++;
    continue;
  }

  // Step 2: Upload file to staged URL (S3)
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

  // Step 3: Create media on the product
  let mediaData;
  try {
    mediaData = gql(`
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
        alt: `Letter ${letter} Charm - Purple`,
      }],
    });
  } catch (e) {
    console.log(`  ⚠ Create media failed: ${e.message}`);
    failCount++;
    continue;
  }

  const mediaErrors = mediaData.productCreateMedia?.mediaUserErrors;
  if (mediaErrors?.length) {
    console.log(`  ⚠ Media errors: ${mediaErrors[0].message}`);
    failCount++;
    continue;
  }

  const mediaId = mediaData.productCreateMedia?.media?.[0]?.id;
  if (!mediaId) {
    console.log(`  ⚠ No media ID returned`);
    failCount++;
    continue;
  }
  console.log(`  ✓ Media created on product`);

  // Wait for Shopify to finish processing the image before assigning to variant
  await sleep(1500);

  // Step 4: Assign media to Purple variant
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
      variantMedia: [{ variantId: purpleVariantId, mediaIds: [mediaId] }],
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

  console.log(`  ✓ Assigned to Purple variant`);
  successCount++;
}

console.log(`\n${'='.repeat(50)}`);
console.log(`Done! ${successCount}/26 letters updated, ${failCount} failed.`);
