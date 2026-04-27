#!/usr/bin/env node
// Adds 26 letters × 4 colors = 104 color variants to the Charms product.
// Deletes the existing 12 colorless letter variants first.
// Uses cached `shopify store auth` — no token needed.
// Run: node scripts/add-letter-color-variants.mjs

import { execSync } from 'child_process';
import { readFileSync, statSync } from 'fs';

const STORE = 'floria-lt.myshopify.com';
const PRODUCT_ID = 'gid://shopify/Product/15969498956156';

// SVG filename → letter
const FILE_TO_LETTER = {
  'Vector.svg':    'W',
  'Vector-1.svg':  'Q',
  'Vector-2.svg':  'M',
  'Vector-3.svg':  'O',
  'Vector-4.svg':  'D',
  'Vector-5.svg':  'B',
  'Vector-6.svg':  'N',
  'Vector-7.svg':  'R',
  'Vector-8.svg':  'G',
  'Vector-9.svg':  'H',
  'Vector-10.svg': 'E',
  'Vector-11.svg': 'K',
  'Vector-12.svg': 'Z',
  'Vector-13.svg': 'P',
  'Vector-14.svg': 'S',
  'Vector-15.svg': 'A',
  'Vector-16.svg': 'U',
  'Vector-17.svg': 'C',
  'Vector-18.svg': 'X',
  'Vector-19.svg': 'V',
  'Vector-20.svg': 'F',
  'Vector-21.svg': 'Y',
  'Vector-22.svg': 'T',
  'Vector-23.svg': 'L',
  'Vector-24.svg': 'J',
  'Vector-25.svg': 'I',
};

const COLORS = {
  Blue:   '/Users/rysardgvozdovic/Downloads/Chaar/bluecharms',
  Green:  '/Users/rysardgvozdovic/Downloads/Chaar/green',
  Red:    '/Users/rysardgvozdovic/Downloads/Chaar/red ',
  Yellow: '/Users/rysardgvozdovic/Downloads/Chaar/yello letters charms',
};

// Existing letter variant IDs to delete (will be replaced by color versions)
const EXISTING_LETTER_VARIANT_IDS = [
  'gid://shopify/ProductVariant/56688215196028', // Letter T
  'gid://shopify/ProductVariant/56688215228796', // Letter D
  'gid://shopify/ProductVariant/56688215327100', // Letter K
  'gid://shopify/ProductVariant/56688215359868', // Letter O
  'gid://shopify/ProductVariant/56688215392636', // Letter B
  'gid://shopify/ProductVariant/56688215556476', // Letter G
  'gid://shopify/ProductVariant/56688215654780', // Letter S
  'gid://shopify/ProductVariant/56688215687548', // Letter L
  'gid://shopify/ProductVariant/56688215753084', // Letter C
  'gid://shopify/ProductVariant/56688215785852', // Letter R
  'gid://shopify/ProductVariant/56688215884156', // Letter N
  'gid://shopify/ProductVariant/56688215916924', // Letter M
];

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

// --- Step 1: Delete existing colorless letter variants ---
console.log('Step 1: Deleting existing colorless letter variants...');
const deleteResult = gql(`
  mutation DeleteVariants($productId: ID!, $variantsIds: [ID!]!) {
    productVariantsBulkDelete(productId: $productId, variantsIds: $variantsIds) {
      product { id }
      userErrors { field message }
    }
  }
`, {
  productId: PRODUCT_ID,
  variantsIds: EXISTING_LETTER_VARIANT_IDS,
});

const deleteErrors = deleteResult.productVariantsBulkDelete?.userErrors;
if (deleteErrors?.length) {
  console.error('Delete errors:', deleteErrors);
  process.exit(1);
}
console.log(`✓ Deleted ${EXISTING_LETTER_VARIANT_IDS.length} colorless letter variants\n`);

// --- Step 2: Get current option ID for "Type" ---
console.log('Step 2: Fetching product options...');
const optionsData = gql(`
  query {
    product(id: "${PRODUCT_ID}") {
      options { id name values }
    }
  }
`);
const typeOption = optionsData.product.options.find(o => o.name === 'Type');
if (!typeOption) {
  console.error('Could not find "Type" option on product');
  process.exit(1);
}
console.log(`✓ Found option: ${typeOption.name} (${typeOption.id})\n`);

// --- Step 3: Build all 104 new variants ---
// We'll create them in batches of 25 (Shopify bulk limit)
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const COLOR_NAMES = ['Blue', 'Green', 'Red', 'Yellow'];

// Map letter → svg filename
const LETTER_TO_FILE = {};
for (const [file, letter] of Object.entries(FILE_TO_LETTER)) {
  LETTER_TO_FILE[letter] = file;
}

const allVariants = [];
for (const letter of LETTERS) {
  for (const color of COLOR_NAMES) {
    allVariants.push({
      letter,
      color,
      optionValue: `Letter ${letter} - ${color}`,
      svgFile: LETTER_TO_FILE[letter],
      svgPath: `${COLORS[color]}/${LETTER_TO_FILE[letter]}`,
    });
  }
}

console.log(`Step 3: Creating ${allVariants.length} color variants in batches...`);

const BATCH_SIZE = 25;
const createdVariantIds = {}; // "Letter X - Color" → variantId

for (let i = 0; i < allVariants.length; i += BATCH_SIZE) {
  const batch = allVariants.slice(i, i + BATCH_SIZE);
  const variantsInput = batch.map(v => ({
    optionValues: [{ optionId: typeOption.id, name: v.optionValue }],
    price: '6.00',
  }));

  const createResult = gql(`
    mutation BulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkCreate(productId: $productId, variants: $variants) {
        productVariants { id title }
        userErrors { field message }
      }
    }
  `, { productId: PRODUCT_ID, variants: variantsInput });

  const errors = createResult.productVariantsBulkCreate?.userErrors;
  if (errors?.length) {
    console.error(`Batch ${Math.floor(i/BATCH_SIZE)+1} errors:`, errors);
    process.exit(1);
  }

  for (const v of createResult.productVariantsBulkCreate.productVariants) {
    createdVariantIds[v.title] = v.id;
  }
  console.log(`  ✓ Batch ${Math.floor(i/BATCH_SIZE)+1}: created variants ${i+1}–${Math.min(i+BATCH_SIZE, allVariants.length)}`);
}
console.log(`✓ All ${allVariants.length} variants created\n`);

// --- Step 4: Upload images + assign to variants ---
console.log('Step 4: Uploading SVG images and assigning to variants...');

let successCount = 0;
let failCount = 0;

for (const variant of allVariants) {
  const variantTitle = variant.optionValue;
  const variantId = createdVariantIds[variantTitle];
  if (!variantId) {
    console.log(`  ⚠ No variant ID for "${variantTitle}"`);
    failCount++;
    continue;
  }

  const svgPath = variant.svgPath;
  let fileSize;
  try {
    fileSize = statSync(svgPath).size;
  } catch {
    console.log(`  ⚠ SVG not found: ${svgPath}`);
    failCount++;
    continue;
  }

  const filename = `letter-${variant.letter.toLowerCase()}-${variant.color.toLowerCase()}.svg`;

  // Stage the upload
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
        mimeType: 'image/svg+xml',
        resource: 'PRODUCT_IMAGE',
        fileSize: String(fileSize),
        httpMethod: 'POST',
      }],
    });
  } catch (e) {
    console.log(`  ⚠ Stage failed for ${variantTitle}: ${e.message}`);
    failCount++;
    continue;
  }

  const target = stageData.stagedUploadsCreate?.stagedTargets?.[0];
  if (!target) {
    console.log(`  ⚠ No stage target for ${variantTitle}`);
    failCount++;
    continue;
  }

  // Upload file to staged URL
  const form = new FormData();
  for (const { name, value } of target.parameters) form.append(name, value);
  const fileBytes = readFileSync(svgPath);
  form.append('file', new Blob([fileBytes], { type: 'image/svg+xml' }), filename);

  const uploadRes = await fetch(target.url, { method: 'POST', body: form });
  if (!uploadRes.ok) {
    console.log(`  ⚠ Upload failed for ${variantTitle}: HTTP ${uploadRes.status}`);
    failCount++;
    continue;
  }

  // Wait for Shopify to process the upload
  await sleep(500);

  // Attach media to product
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
      productId: PRODUCT_ID,
      media: [{
        originalSource: target.resourceUrl,
        mediaContentType: 'IMAGE',
        alt: variantTitle,
      }],
    });
  } catch (e) {
    console.log(`  ⚠ Media create failed for ${variantTitle}: ${e.message}`);
    failCount++;
    continue;
  }

  const mediaErrors = mediaData.productCreateMedia?.mediaUserErrors;
  if (mediaErrors?.length) {
    console.log(`  ⚠ Media errors for ${variantTitle}: ${mediaErrors[0].message}`);
    failCount++;
    continue;
  }

  const mediaId = mediaData.productCreateMedia?.media?.[0]?.id;
  if (!mediaId) {
    console.log(`  ⚠ No media ID returned for ${variantTitle}`);
    failCount++;
    continue;
  }

  // Wait for media to be processed
  await sleep(1000);

  // Assign media to variant
  try {
    const appendData = gql(`
      mutation AppendMedia($productId: ID!, $variantMedia: [ProductVariantAppendMediaInput!]!) {
        productVariantAppendMedia(productId: $productId, variantMedia: $variantMedia) {
          product { id }
          userErrors { field message }
        }
      }
    `, {
      productId: PRODUCT_ID,
      variantMedia: [{ variantId, mediaIds: [mediaId] }],
    });

    const appendErrors = appendData.productVariantAppendMedia?.userErrors;
    if (appendErrors?.length) {
      console.log(`  ⚠ Append errors for ${variantTitle}: ${appendErrors[0].message}`);
      failCount++;
      continue;
    }
  } catch (e) {
    console.log(`  ⚠ Append failed for ${variantTitle}: ${e.message}`);
    failCount++;
    continue;
  }

  console.log(`  ✓ ${variantTitle}`);
  successCount++;
}

console.log(`\nDone! ${successCount} variants updated, ${failCount} failed.`);
