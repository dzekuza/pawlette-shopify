#!/usr/bin/env node
// Uploads background-removed dark blue letter charm images and assigns them to
// the "Dark Blue" variant of each Letter X Charm product.
// Run: node scripts/upload-dark-blue-letter-images.mjs

import { execSync } from 'child_process';
import { readFileSync, statSync, readdirSync } from 'fs';
import { join } from 'path';

const STORE = 'paws-rvycxg3u.myshopify.com';
const IMAGE_DIR = '/Users/rysardgvozdovic/Downloads/Folder (21) 3/Dark Blue Letter Charms A–Z (26 singles)/darkbl';

// File numbering is non-sequential (gap between I and J): 001-009 = A-I, then 019-035 = J-Z
const FILE_PREFIX_MAP = {
  A: '001', B: '002', C: '003', D: '004', E: '005',
  F: '006', G: '007', H: '008', I: '009',
  J: '019', K: '020', L: '021', M: '022', N: '023',
  O: '024', P: '025', Q: '026', R: '027', S: '028',
  T: '029', U: '030', V: '031', W: '032', X: '033',
  Y: '034', Z: '035',
};

// Letter → { productId, darkBlueVariantId }
const LETTERS = {
  A: { productId: 'gid://shopify/Product/15777048658294',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087525089654' },
  B: { productId: 'gid://shopify/Product/15777048691062',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087525548406' },
  C: { productId: 'gid://shopify/Product/15777048723830',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087525712246' },
  D: { productId: 'gid://shopify/Product/15777048756598',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087525876086' },
  E: { productId: 'gid://shopify/Product/15777048789366',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087526072694' },
  F: { productId: 'gid://shopify/Product/15777048822134',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087526236534' },
  G: { productId: 'gid://shopify/Product/15777048854902',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087526400374' },
  H: { productId: 'gid://shopify/Product/15777048887670',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087526564214' },
  I: { productId: 'gid://shopify/Product/15777048920438',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087526728054' },
  J: { productId: 'gid://shopify/Product/15777048953206',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087526891894' },
  K: { productId: 'gid://shopify/Product/15777048985974',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087527088502' },
  L: { productId: 'gid://shopify/Product/15777049018742',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087527252342' },
  M: { productId: 'gid://shopify/Product/15777049051510',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087527416182' },
  N: { productId: 'gid://shopify/Product/15777049084278',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087527580022' },
  O: { productId: 'gid://shopify/Product/15777049117046',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087527743862' },
  P: { productId: 'gid://shopify/Product/15777049149814',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087527940470' },
  Q: { productId: 'gid://shopify/Product/15777049182582',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087528104310' },
  R: { productId: 'gid://shopify/Product/15777049215350',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087528268150' },
  S: { productId: 'gid://shopify/Product/15777049248118',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087528431990' },
  T: { productId: 'gid://shopify/Product/15777049280886',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087528595830' },
  U: { productId: 'gid://shopify/Product/15777049313654',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087528792438' },
  V: { productId: 'gid://shopify/Product/15777049346422',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087528956278' },
  W: { productId: 'gid://shopify/Product/15777049379190',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087529120118' },
  X: { productId: 'gid://shopify/Product/15777049411958',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087529283958' },
  Y: { productId: 'gid://shopify/Product/15777049444726',  darkBlueVariantId: 'gid://shopify/ProductVariant/58087529447798' },
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

function getImagePath(letter) {
  const prefix = FILE_PREFIX_MAP[letter];
  const files = readdirSync(IMAGE_DIR);
  const match = files.find(f => f.startsWith(prefix));
  if (!match) throw new Error(`No image file found for letter ${letter} (prefix ${prefix})`);
  return join(IMAGE_DIR, match);
}

let successCount = 0;
let failCount = 0;

for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')) {
  const { productId, darkBlueVariantId } = LETTERS[letter];

  let imagePath;
  try {
    imagePath = getImagePath(letter);
  } catch (e) {
    console.log(`  ⚠ ${letter}: ${e.message}`);
    failCount++;
    continue;
  }

  const fileSize = statSync(imagePath).size;
  const filename = `dark-blue-letter-${letter.toLowerCase()}.png`;

  console.log(`\n[${letter}] ${filename} (${Math.round(fileSize / 1024)}KB)`);

  // Step 1: Stage upload
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

  // Step 2: Upload to S3
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

  // Step 3: Create media on product
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
        alt: `Letter ${letter} Charm - Dark Blue`,
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

  await sleep(1500);

  // Step 4: Assign to Dark Blue variant
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
console.log(`Done! ${successCount}/26 letters updated, ${failCount} failed.`);
