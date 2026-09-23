import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import manifest from '../ocean-asset-manifest.js';

console.log('=== Verifying Ocean Depth Asset Bible & Manifest Implementation ===');

// 1. Total Asset Count
assert.strictEqual(manifest.assets.length, 54, `Expected exactly 54 production assets, found ${manifest.assets.length}`);
console.log('✓ Exactly 54 production assets verified in manifest');

// 2. Physical File Existence on Disk
let missingFiles = 0;
for (const asset of manifest.assets) {
  const filePath = path.resolve(asset.fallbackSrc);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing file on disk: ${filePath}`);
    missingFiles++;
  }
}
assert.strictEqual(missingFiles, 0, `${missingFiles} asset files missing from disk`);
console.log('✓ All 54 asset PNG files verified on disk with valid paths');

// 3. AI Implementation Contract Fields
for (const asset of manifest.assets) {
  assert(typeof asset.src === 'string' && asset.src.length > 0, `Missing or invalid src for ${asset.id}`);
  assert(typeof asset.displayDepthM === 'number' && asset.displayDepthM >= 0 && asset.displayDepthM <= 10000, `Invalid displayDepthM for ${asset.id}`);
  assert(asset.physicalScalePct === null || typeof asset.physicalScalePct === 'number', `Invalid physicalScalePct for ${asset.id}`);
  assert(typeof asset.displayScalePct === 'number' && asset.displayScalePct > 0 && asset.displayScalePct <= 100, `Invalid displayScalePct for ${asset.id}`);
  assert([10, 30, 40, 50, 60, 80].includes(asset.layer), `Invalid layer ${asset.layer} for ${asset.id}`);
  assert(typeof asset.mirrorSafe === 'boolean', `Missing mirrorSafe boolean for ${asset.id}`);
}
console.log('✓ AI Implementation Contract strictly validated on all 54 assets');

// 4. Scale Hierarchy Check (Section 6)
const titanic = manifest.assets.find(a => a.file === 'titanic-wreck.png');
assert(titanic, 'Missing titanic-wreck.png');
assert.strictEqual(titanic.displayScalePct, 100, 'Titanic must be exactly 100% display scale');

for (const asset of manifest.assets) {
  assert(asset.displayScalePct <= 100, `${asset.id} displayScalePct (${asset.displayScalePct}) exceeds Titanic (100)`);
}

const expectedHierarchy = [
  { file: 'titanic-wreck.png', pct: 100 },
  { file: 'trench-floor-habitat.png', pct: 32 },
  { file: 'titanic-debris.png', pct: 28 },
  { file: 'abyssal-rock-cluster.png', pct: 26 },
  { file: 'coral-reef-ledge.png', pct: 24 },
  { file: 'hydrothermal-vent-habitat.png', pct: 23 },
  { file: 'blue-whale.png', pct: 18 },
  { file: 'kelp-cluster.png', pct: 17 },
  { file: 'siphonophore.png', pct: 16 },
  { file: 'whale-fall.png', pct: 16 },
  { file: 'sperm-whale.png', pct: 15 },
];

for (const expected of expectedHierarchy) {
  const item = manifest.assets.find(a => a.file === expected.file);
  assert(item, `Missing hierarchy item: ${expected.file}`);
  assert.strictEqual(item.displayScalePct, expected.pct, `Incorrect scale for ${expected.file}: expected ${expected.pct}, got ${item.displayScalePct}`);
  console.log(`✓ Scale check passed: ${expected.file} = ${item.displayScalePct}%`);
}

// 5. Sorting Check (displayDepthM ascending, then layer ascending)
for (let i = 1; i < manifest.assets.length; i++) {
  const prev = manifest.assets[i - 1];
  const curr = manifest.assets[i];
  if (curr.displayDepthM < prev.displayDepthM) {
    assert.fail(`Sorting error at index ${i}: ${curr.id} (${curr.displayDepthM}m) came after ${prev.id} (${prev.displayDepthM}m)`);
  } else if (curr.displayDepthM === prev.displayDepthM) {
    assert(curr.layer >= prev.layer, `Layer sorting error at index ${i}: layer ${curr.layer} came after layer ${prev.layer}`);
  }
}
console.log('✓ Sorting order verified: sorted by displayDepthM ascending, then layer ascending');

// 6. Legibility & Enlarged Flags
for (const asset of manifest.assets) {
  assert(asset.worldWidth >= 56, `${asset.id} width ${asset.worldWidth} is below the 56px minimum legibility clamp`);
  if (asset.category === 'creature' && asset.physicalScalePct !== null && asset.physicalScalePct < 2.0) {
    assert.strictEqual(asset.enlargedForVisibility, true, `${asset.id} should have enlargedForVisibility = true`);
  }
}
console.log('✓ Minimum legibility clamp (>= 56px) and "enlarged for visibility" badges verified');

console.log('\n=============================================================');
console.log('ALL 54 ASSET BIBLE VERIFICATION CHECKS PASSED WITH 100% ACCURACY!');
console.log('=============================================================\n');
