#!/usr/bin/env node
// Restructures 25 individual charm products → 1 "Charms" product with 25 variants.
// Migrates images and metafields, publishes to headless channel, deletes old products.
// Run: node scripts/restructure-charms.mjs

import { execSync } from 'child_process';

const STORE = 'floria-lt.myshopify.com';
const HEADLESS_PUBLICATION_ID = 'gid://shopify/Publication/308380041596';

const CHARMS = [
  { handle: 'letter-t-charm',        title: 'Letter T Charm',        bg: '#B8D8F4', category: 'letter', imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/009_A_soft_light_blue_rounded_letter_T_is_UOMVagIa_Background_Removed.png?v=1777303107' },
  { handle: 'letter-d-charm',        title: 'Letter D Charm',        bg: '#D4B8F4', category: 'letter', imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/003_A_soft_purple_letter_D_is_presented_on_a_plain_cTsglZyk_Background_Removed.png?v=1777303112' },
  { handle: 'blue-paw-charm',        title: 'Blue Paw Charm',        bg: '#B8D8F4', category: 'icon',   imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/010_A_stylized_blue_paw_print_is_centrally_positioned_l1z-Lcyk_Background_Removed.png?v=1777303118' },
  { handle: 'green-star-charm',      title: 'Green Star Charm',      bg: '#A8D5A2', category: 'icon',   imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/001_In_a_3D_render_style_a_large_rounded_light_rJitw6c9_Background_Removed.png?v=1777303123' },
  { handle: 'letter-k-charm',        title: 'Letter K Charm',        bg: '#A8D5A2', category: 'letter', imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/006_A_soft_muted_green_lowercase_letter_k_floats_VUpysPf_Background_Removed.png?v=1777303129' },
  { handle: 'letter-o-charm',        title: 'Letter O Charm',        bg: '#D4B8F4', category: 'letter', imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/008_A_soft_matte_lavender_letter_O_is_centered_on_9kzmsGFR_Background_Removed.png?v=1777303134' },
  { handle: 'letter-b-charm',        title: 'Letter B Charm',        bg: '#F4B5C0', category: 'letter', imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/002_A_soft_plush_pink_letter_B_is_centrally_iHYYGQpJ_Background_Removed.png?v=1777303139' },
  { handle: 'sage-leaf-charm',       title: 'Sage Leaf Charm',       bg: '#A8D5A2', category: 'icon',   imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/001_In_a_minimalist_style_a_single_matte_sage_green_er7Mx31d_Background_Removed.png?v=1777303148' },
  { handle: 'lavender-flower-charm', title: 'Lavender Flower Charm', bg: '#D4B8F4', category: 'icon',   imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/005_A_smooth_matte_lavender_flower-shaped_object_is_VsK9Nys5_Background_Removed.png?v=1777303149' },
  { handle: 'pink-heart-charm',      title: 'Pink Heart Charm',      bg: '#F4B5C0', category: 'icon',   imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/003_A_soft_pink_heart-shaped_object_is_presented_with_TtBIxLMs_Background_Removed.png?v=1777303154' },
  { handle: 'mini-heart-charm',      title: 'Mini Heart Charm',      bg: '#F4B5C0', category: 'icon',   imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/009_A_smooth_matte_pink_heart_shape_is_centered_X6r9CPGM_Background_Removed.png?v=1777303160' },
  { handle: 'letter-g-charm',        title: 'Letter G Charm',        bg: '#D4B8F4', category: 'letter', imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/003_A_single_oversized_three-dimensional_letter_G_ISlrl-QI_Background_Removed.png?v=1777303166' },
  { handle: 'pink-bow-charm',        title: 'Pink Bow Charm',        bg: '#F4B5C0', category: 'icon',   imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/005_In_a_minimalist_3D_render_style_a_soft_pink_uQlhzSdQ_Background_Removed.png?v=1777303172' },
  { handle: 'sage-sun-charm',        title: 'Sage Sun Charm',        bg: '#A8D5A2', category: 'icon',   imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/008_In_a_minimalist_style_a_smooth_matte_sage_green_oqryxWtd_Background_Removed.png?v=1777303177' },
  { handle: 'letter-s-charm',        title: 'Letter S Charm',        bg: '#F9E4A0', category: 'letter', imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/006_A_soft_matte_yellow_letter_S_stands_against_a_s0lt4jH_Background_Removed.png?v=1777303182' },
  { handle: 'letter-l-charm',        title: 'Letter L Charm',        bg: '#B8D8F4', category: 'letter', imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/005_A_soft_blue_rounded_letter_L_is_centrally_BYREvDc_Background_Removed.png?v=1777303186' },
  { handle: 'yellow-star-charm',     title: 'Yellow Star Charm',     bg: '#F9E4A0', category: 'icon',   imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/002_A_pale_yellow_star-shaped_object_floats_against_-1rXjWFC_Background_Removed.png?v=1777303192' },
  { handle: 'letter-c-charm',        title: 'Letter C Charm',        bg: '#B8D8F4', category: 'letter', imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/001_The_letter_C_is_rendered_in_a_soft_pastel_XpEQ8qyU_Background_Removed.png?v=1777303199' },
  { handle: 'letter-r-charm',        title: 'Letter R Charm',        bg: '#F4B5C0', category: 'letter', imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/007_A_large_rounded_pink_letter_R_is_presented_0sIURIE7_Background_Removed.png?v=1777303205' },
  { handle: 'light-paw-charm',       title: 'Light Paw Charm',       bg: '#B8D8F4', category: 'icon',   imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/004_A_light_blue_paw_print_shaped_object_is_centrally_0i_pOMaJ_Background_Removed.png?v=1777303210' },
  { handle: 'blue-drop-charm',       title: 'Blue Drop Charm',       bg: '#B8D8F4', category: 'icon',   imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/004_In_a_3D_rendering_style_a_soft_light_blue_ybSe5ekF_Background_Removed.png?v=1777303216' },
  { handle: 'letter-n-charm',        title: 'Letter N Charm',        bg: '#F9E4A0', category: 'letter', imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/007_A_soft_rounded_pale_yellow_letter_N_is_Ji0FDBaj_Background_Removed.png?v=1777303222' },
  { handle: 'letter-m-charm',        title: 'Letter M Charm',        bg: '#A8D5A2', category: 'letter', imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/004_A_smooth_rounded_letter_M_in_a_pale_green_hue_eS51RxOA_Background_Removed.png?v=1777303226' },
  { handle: 'butterfly-charm',       title: 'Butterfly Charm',       bg: '#D4B8F4', category: 'icon',   imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/010_A_smooth_matte_lavender_butterfly_shape_is_FjmwAp0n_Background_Removed.png?v=1777303232' },
  { handle: 'pink-mushroom-charm',   title: 'Pink Mushroom Charm',   bg: '#F4B5C0', category: 'icon',   imageUrl: 'https://cdn.shopify.com/s/files/1/0952/6722/5980/files/002_In_a_3D_rendered_style_a_soft_rounded_zSoOXavu_Background_Removed.png?v=1777303238' },
];

const OLD_CHARM_IDS = [
  'gid://shopify/Product/15969414480252',
  'gid://shopify/Product/15969414545788',
  'gid://shopify/Product/15969414644092',
  'gid://shopify/Product/15969414676860',
  'gid://shopify/Product/15969414709628',
  'gid://shopify/Product/15969414775164',
  'gid://shopify/Product/15969414807932',
  'gid://shopify/Product/15969414873468',
  'gid://shopify/Product/15969414971772',
  'gid://shopify/Product/15969415037308',
  'gid://shopify/Product/15969415070076',
  'gid://shopify/Product/15969415102844',
  'gid://shopify/Product/15969415135612',
  'gid://shopify/Product/15969415168380',
  'gid://shopify/Product/15969415233916',
  'gid://shopify/Product/15969415266684',
  'gid://shopify/Product/15969415332220',
  'gid://shopify/Product/15969415364988',
  'gid://shopify/Product/15969415397756',
  'gid://shopify/Product/15969415430524',
  'gid://shopify/Product/15969415496060',
  'gid://shopify/Product/15969415528828',
  'gid://shopify/Product/15969415594364',
  'gid://shopify/Product/15969415659900',
  'gid://shopify/Product/15969415725436',
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

// ── Step 1: Create "Charms" product shell ────────────────────────────────────
console.log('Step 1: Creating "Charms" product...');
const createResult = gql(`
  mutation CreateProduct($product: ProductCreateInput!) {
    productCreate(product: $product) {
      product { id }
      userErrors { field message }
    }
  }
`, { product: { title: 'Charms', productType: 'charm', status: 'ACTIVE' } });

if (createResult.productCreate?.userErrors?.length)
  throw new Error(`productCreate failed: ${createResult.productCreate.userErrors.map(e => e.message).join(', ')}`);
const productId = createResult.productCreate.product.id;
console.log(`✓ Product created: ${productId}`);

// ── Step 2: Add "Type" option and auto-create variants ────────────────────────
console.log('Step 2: Creating option "Type" with 25 values...');
const optionsResult = gql(`
  mutation CreateOptions($productId: ID!, $options: [OptionCreateInput!]!, $variantStrategy: ProductOptionCreateVariantStrategy) {
    productOptionsCreate(productId: $productId, options: $options, variantStrategy: $variantStrategy) {
      product {
        options { id name values }
        variants(first: 100) { nodes { id selectedOptions { name value } } }
      }
      userErrors { field message }
    }
  }
`, {
  productId,
  variantStrategy: 'CREATE',
  options: [{
    name: 'Type',
    values: CHARMS.map(c => ({ name: c.title })),
  }],
});

if (optionsResult.productOptionsCreate?.userErrors?.length)
  throw new Error(`productOptionsCreate failed: ${optionsResult.productOptionsCreate.userErrors.map(e => e.message).join(', ')}`);

const allVariants = optionsResult.productOptionsCreate.product.variants.nodes;
// Filter to only charm variants (exclude the default "Default Title" variant if present)
const charmVariants = allVariants.filter(v =>
  v.selectedOptions.some(o => o.name === 'Type' && CHARMS.find(c => c.title === o.value))
);
console.log(`✓ Created ${charmVariants.length} variants`);

// Build title → variantId map
const titleToVariantId = {};
for (const v of charmVariants) {
  const typeOpt = v.selectedOptions.find(o => o.name === 'Type');
  if (typeOpt) titleToVariantId[typeOpt.value] = v.id;
}

// Build sku → variantId using CHARMS title lookup
const skuToVariantId = {};
for (const charm of CHARMS) {
  skuToVariantId[charm.handle] = titleToVariantId[charm.title];
}

// ── Step 2b: Set prices via productVariantsBulkUpdate ────────────────────────
console.log('Step 2b: Setting prices...');
const priceUpdates = CHARMS.map(c => ({
  id: titleToVariantId[c.title],
  price: '6.00',
})).filter(v => v.id);

const priceResult = gql(`
  mutation BulkUpdatePrice($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      userErrors { field message }
    }
  }
`, { productId, variants: priceUpdates });
if (priceResult.productVariantsBulkUpdate?.userErrors?.length) {
  console.warn('  Price warnings:', priceResult.productVariantsBulkUpdate.userErrors);
}
console.log('✓ Prices set');

// ── Step 3: Set variant metafields (bg + category) ───────────────────────────
console.log('Setting variant metafields...');
const metafields = [];
for (const charm of CHARMS) {
  const variantId = titleToVariantId[charm.title];
  if (!variantId) continue;
  metafields.push(
    { ownerId: variantId, namespace: 'pawlette', key: 'bg',       type: 'single_line_text_field', value: charm.bg },
    { ownerId: variantId, namespace: 'pawlette', key: 'category', type: 'single_line_text_field', value: charm.category }
  );
}
const metaResult = gql(`
  mutation SetMetafields($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      userErrors { field message }
    }
  }
`, { metafields });
if (metaResult.metafieldsSet?.userErrors?.length) {
  console.warn('  Metafield warnings:', metaResult.metafieldsSet.userErrors);
}
console.log('✓ Variant metafields set');

// ── Step 4: Assign images to variants ────────────────────────────────────────
console.log('Assigning images to variants...');
for (const charm of CHARMS) {
  const variantId = titleToVariantId[charm.title];
  if (!variantId) continue;

  // Create media on the product from the CDN URL
  const mediaResult = gql(`
    mutation CreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
      productCreateMedia(productId: $productId, media: $media) {
        media { ... on MediaImage { id status } }
        mediaUserErrors { field message }
      }
    }
  `, {
    productId,
    media: [{ originalSource: charm.imageUrl, mediaContentType: 'IMAGE', alt: charm.title }],
  });

  const mediaId = mediaResult.productCreateMedia?.media?.[0]?.id;
  if (!mediaId) { console.warn(`  ⚠ No mediaId for ${charm.handle}`); continue; }

  // Append media to variant
  gql(`
    mutation AppendMedia($productId: ID!, $variantMedia: [ProductVariantAppendMediaInput!]!) {
      productVariantAppendMedia(productId: $productId, variantMedia: $variantMedia) {
        userErrors { field message }
      }
    }
  `, { productId, variantMedia: [{ variantId, mediaIds: [mediaId] }] });

  process.stdout.write('.');
}
console.log('\n✓ Images assigned to variants');

// ── Step 5: Publish to headless channel ──────────────────────────────────────
console.log('Publishing to headless channel...');
gql(`
  mutation Publish($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      userErrors { field message }
    }
  }
`, { id: productId, input: [{ publicationId: HEADLESS_PUBLICATION_ID }] });
console.log('✓ Published');

// ── Step 6: Delete old charm products ────────────────────────────────────────
console.log(`\nDeleting ${OLD_CHARM_IDS.length} old charm products...`);
for (const id of OLD_CHARM_IDS) {
  const result = gql(`
    mutation DeleteProduct($id: ID!) {
      productDelete(input: { id: $id }) {
        userErrors { field message }
      }
    }
  `, { id });
  const deleteErrs = result.productDelete?.userErrors;
  if (deleteErrs?.length) {
    console.warn(`  ⚠ Delete failed for ${id}: ${deleteErrs[0].message}`);
  } else {
    process.stdout.write('.');
  }
}
console.log('\n✓ Old charm products deleted');

console.log('\n✅ Done! "Charms" product now has 25 variants at floria-lt.myshopify.com');
console.log(`   Product ID: ${productId}`);
console.log('   Variant IDs by handle:');
for (const charm of CHARMS) {
  console.log(`     ${charm.handle}: ${skuToVariantId[charm.handle]}`);
}
