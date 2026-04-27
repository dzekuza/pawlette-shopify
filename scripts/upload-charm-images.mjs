#!/usr/bin/env node
// Uploads charm images from /Users/rysardgvozdovic/Desktop/projects/dog/public/charms
// to matching Shopify charm products via staged uploads.
// Uses cached `shopify store auth` — no token needed.

import { execSync } from 'child_process';
import { readFileSync, statSync } from 'fs';
import { basename } from 'path';
// FormData and Blob are global in Node 18+

const STORE = 'floria-lt.myshopify.com';
const CHARMS_DIR = '/Users/rysardgvozdovic/Desktop/projects/dog/public/charms';

// handle → image filename (from original data.ts mapping)
const CHARM_IMAGES = {
  'letter-t-charm':        '009_A_soft_light_blue_rounded_letter_T_is_UOMVagIa Background Removed.png',
  'letter-d-charm':        '003_A_soft_purple_letter_D_is_presented_on_a_plain_cTsglZyk Background Removed.png',
  'blue-paw-charm':        '010_A_stylized_blue_paw_print_is_centrally_positioned_l1z-Lcyk Background Removed.png',
  'green-star-charm':      '001_In_a_3D_render_style_a_large_rounded_light_rJitw6c9 Background Removed.png',
  'letter-k-charm':        '006_A_soft_muted_green_lowercase_letter_k_floats_VUpysPf Background Removed.png',
  'letter-o-charm':        '008_A_soft_matte_lavender_letter_O_is_centered_on_9kzmsGFR Background Removed.png',
  'letter-b-charm':        '002_A_soft_plush_pink_letter_B_is_centrally_iHYYGQpJ Background Removed.png',
  'sage-leaf-charm':       '001_In_a_minimalist_style_a_single_matte_sage_green_er7Mx31d Background Removed.png',
  'lavender-flower-charm': '005_A_smooth_matte_lavender_flower-shaped_object_is_VsK9Nys5 Background Removed.png',
  'pink-heart-charm':      '003_A_soft_pink_heart-shaped_object_is_presented_with_TtBIxLMs Background Removed.png',
  'mini-heart-charm':      '009_A_smooth_matte_pink_heart_shape_is_centered_X6r9CPGM Background Removed.png',
  'letter-g-charm':        '003_A_single_oversized_three-dimensional_letter_G_ISlrl-QI Background Removed.png',
  'pink-bow-charm':        '005_In_a_minimalist_3D_render_style_a_soft_pink_uQlhzSdQ Background Removed.png',
  'sage-sun-charm':        '008_In_a_minimalist_style_a_smooth_matte_sage_green_oqryxWtd Background Removed.png',
  'letter-s-charm':        '006_A_soft_matte_yellow_letter_S_stands_against_a_s0lt4jH Background Removed.png',
  'letter-l-charm':        '005_A_soft_blue_rounded_letter_L_is_centrally_BYREvDc Background Removed.png',
  'yellow-star-charm':     '002_A_pale_yellow_star-shaped_object_floats_against_-1rXjWFC Background Removed.png',
  'letter-c-charm':        '001_The_letter_C_is_rendered_in_a_soft_pastel_XpEQ8qyU Background Removed.png',
  'letter-r-charm':        '007_A_large_rounded_pink_letter_R_is_presented_0sIURIE7 Background Removed.png',
  'light-paw-charm':       '004_A_light_blue_paw_print_shaped_object_is_centrally_0i_pOMaJ Background Removed.png',
  'blue-drop-charm':       '004_In_a_3D_rendering_style_a_soft_light_blue_ybSe5ekF Background Removed.png',
  'letter-n-charm':        '007_A_soft_rounded_pale_yellow_letter_N_is_Ji0FDBaj Background Removed.png',
  'letter-m-charm':        '004_A_smooth_rounded_letter_M_in_a_pale_green_hue_eS51RxOA Background Removed.png',
  'butterfly-charm':       '010_A_smooth_matte_lavender_butterfly_shape_is_FjmwAp0n Background Removed.png',
  'pink-mushroom-charm':   '002_In_a_3D_rendered_style_a_soft_rounded_zSoOXavu Background Removed.png',
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

// Step 1: get all charm product IDs
console.log('Fetching charm products...');
const productsData = gql(`query {
  products(first: 50, query: "product_type:charm") {
    edges { node { id handle } }
  }
}`);
const products = productsData.products.edges.map(e => e.node);
console.log(`Found ${products.length} charm products\n`);

// Step 2: upload each image
for (const { id: productId, handle } of products) {
  const imageFile = CHARM_IMAGES[handle];
  if (!imageFile) { console.log(`⚠ No image mapped for ${handle}`); continue; }

  const filePath = `${CHARMS_DIR}/${imageFile}`;
  let fileSize;
  try { fileSize = statSync(filePath).size; } catch { console.log(`⚠ File not found: ${imageFile}`); continue; }

  const filename = basename(filePath);

  // Stage the upload
  const stageData = gql(`
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

  const target = stageData.stagedUploadsCreate.stagedTargets[0];
  if (!target) { console.log(`⚠ Stage failed for ${handle}`); continue; }

  // Upload file to staged URL
  const form = new FormData();
  for (const { name, value } of target.parameters) form.append(name, value);
  const fileBytes = readFileSync(filePath);
  form.append('file', new Blob([fileBytes], { type: 'image/png' }), filename);

  const uploadRes = await fetch(target.url, { method: 'POST', body: form });
  if (!uploadRes.ok) { console.log(`⚠ Upload failed for ${handle}: ${uploadRes.status}`); continue; }

  // Attach media to product
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
      alt: handle.replace(/-/g, ' '),
    }],
  });

  const errs = mediaData.productCreateMedia?.mediaUserErrors;
  if (errs?.length) { console.log(`⚠ Media attach failed for ${handle}: ${errs[0].message}`); continue; }

  console.log(`✓ ${handle}`);
}

console.log('\nDone! Images attached to all charm products.');
