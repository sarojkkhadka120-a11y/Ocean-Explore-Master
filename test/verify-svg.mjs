import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

console.log('--- Verifying Ocean Explore Standalone Master SVG ---');

const svgPath = path.resolve('ocean-scene.svg');
assert(fs.existsSync(svgPath), 'ocean-scene.svg does not exist!');

const content = fs.readFileSync(svgPath, 'utf8');
assert(content.length > 1000000, `ocean-scene.svg is suspiciously small: ${content.length} bytes`);

// 1. Verify ViewBox and World Dimensions
assert(content.includes('viewBox="0 0 14931 19963"'), 'Missing or incorrect viewBox (expected "0 0 14931 19963")');
assert(content.includes('width="14931"'), 'Missing or incorrect width="14931"');
assert(content.includes('height="19963"'), 'Missing or incorrect height="19963"');
console.log('✓ Master viewBox and dimensions verified: 14,931 × 19,963 px');

// 2. Verify Background Gradients
assert(content.includes('id="figma-sky"'), 'Missing figma-sky linearGradient');
assert(content.includes('id="figma-ocean"'), 'Missing figma-ocean linearGradient');
assert(content.includes('#c9ecee') && content.includes('#8ad4ef') && content.includes('#49a9e6'), 'Missing sky gradient color stops');
assert(content.includes('#34c6d3') && content.includes('#168aa0') && content.includes('#0b5874') && content.includes('#07364f') && content.includes('#031f31'), 'Missing ocean gradient color stops');
console.log('✓ Sky and Ocean userSpaceOnUse gradients verified');

// 3. Verify All 17 Exact Figma Layers and Node IDs
const EXPECTED_NODES = [
  { id: '64:677', name: 'Sky Gradient', x: '0', y: '0', w: '14931', h: '1143.313' },
  { id: '53:174', name: 'Ocean Depth Gradient', x: '-126.98', y: '1152.57', w: '15057.977', h: '18810.09' },
  { id: '67:1556', name: 'Horizon Mountains', x: '385.555', y: '932.445', w: '1931.637', h: '194.163' },
  { id: '67:1585', name: 'Horizon Ridge', x: '449.423', y: '988.169', w: '1341.351', h: '134.829' },
  { id: '64:678', name: 'Icebergs Primary', x: '94.59', y: '57.38', w: '2172', h: '724' },
  { id: '64:679', name: 'Icebergs Secondary', x: '2406.29', y: '57.38', w: '2172', h: '724' },
  { id: '67:1586', name: 'Sun Glow', x: '1201.53', y: '128.79', w: '270.699', h: '270.699' },
  { id: '63:651', name: 'Island Shoreline', x: '-303.082', y: '344.238', w: '1117', h: '838' },
  { id: '67:1592', name: 'Surface Boat Primary', x: '1346.4', y: '965.76', w: '309.07', h: '231.8' },
  { id: '67:1593', name: 'Surface Boat Secondary', x: '2405.78', y: '1003.28', w: '198.48', h: '154.879' },
  { id: '62:514', name: 'Surface Waves', x: '783.071', y: '1053.854', w: '14148', h: '456' },
  { id: '69:1600', name: 'Underwater Sunlight Rays', x: '252.891', y: '1100.141', w: '4072.752', h: '2292.141' },
  { id: '60:421', name: 'Ocean Shelf Cliff', x: '-38.008', y: '712.676', w: '13132', h: '19251' },
  { id: '71:1668', name: 'Fish School Left', x: '1097.496', y: '1282.605', w: '274', h: '343' },
  { id: '71:1766', name: 'Fish School Center', x: '1388.207', y: '1142.848', w: '274', h: '343' },
  { id: '71:1864', name: 'Fish School Right', x: '1697.09', y: '1274.203', w: '274', h: '343' },
  { id: '71:1636', name: 'Bubble Cluster', x: '976.402', y: '1086.141', w: '380', h: '213' },
  { id: '71:1964', name: 'Scuba Diver', x: '1141.39', y: '1246.89', w: '32.417', h: '48.625' },
];

for (const node of EXPECTED_NODES) {
  assert(content.includes(`data-node-id="${node.id}"`), `Missing node ID ${node.id} for ${node.name}`);
  assert(content.includes(`x="${node.x}"`), `Incorrect X coordinate for ${node.name} (expected ${node.x})`);
  assert(content.includes(`y="${node.y}"`), `Incorrect Y coordinate for ${node.name} (expected ${node.y})`);
  assert(content.includes(`width="${node.w}"`), `Incorrect width for ${node.name} (expected ${node.w})`);
  assert(content.includes(`height="${node.h}"`), `Incorrect height for ${node.name} (expected ${node.h})`);
  console.log(`✓ Layer "${node.name}" (${node.id}) verified at (${node.x}, ${node.y}) [${node.w} × ${node.h}]`);
}

// 4. Verify Correct Layer Order (Island on top of cliff and waves)
const idxWaves = content.indexOf('data-node-id="62:514"');
const idxCliff = content.indexOf('data-node-id="60:421"');
const idxIsland = content.indexOf('data-node-id="63:651"');

assert(idxCliff > idxWaves, 'Shelf Cliff must be ordered after Waves');
assert(idxIsland > idxCliff, 'Island must be ordered after Shelf Cliff so terrain slopes do not cut over the island');
assert(idxIsland > idxWaves, 'Island must be ordered after Waves so island shoreline covers the wave strip boundary');
console.log('✓ Layer z-order verified: Waves < Shelf Cliff < Island Shoreline');

// 5. Verify CSS Transforms
assert(content.includes('class="flipX interactive-element"'), 'Missing flipX class on primary boat');
assert(content.includes('class="smallBoat interactive-element"'), 'Missing smallBoat class on secondary boat');
console.log('✓ Boat orientation and angle transforms verified');

console.log('\n========================================');
console.log('ALL VERIFICATION CHECKS PASSED PERFECTLY!');
console.log('========================================\n');
