import fs from 'node:fs';
import path from 'node:path';

const ASSETS_DIR = path.resolve('assets/figma-exact');
const OUTPUT_FILE = path.resolve('assets/ocean-scene.svg');
const ROOT_OUTPUT_FILE = path.resolve('ocean-scene.svg');
const MODULAR_FILE = path.resolve('assets/ocean-scene-modular.svg');

// Helper to convert file to base64
function getBase64(filename, mimeType) {
  const filePath = path.join(ASSETS_DIR, filename);
  const data = fs.readFileSync(filePath);
  return `data:${mimeType};base64,${data.toString('base64')}`;
}

const boatBase64 = getBase64('boat.png', 'image/png');
const icebergsBase64 = getBase64('icebergs.png', 'image/png');
const sunBase64 = getBase64('sun.png', 'image/png');
const diverBase64 = getBase64('diver.png', 'image/png');

// Helper for SVG assets
function getSvgDataUri(filename) {
  const filePath = path.join(ASSETS_DIR, filename);
  const data = fs.readFileSync(filePath, 'utf8');
  return `data:image/svg+xml;utf8,${encodeURIComponent(data)}`;
}

const mountainsUri = getSvgDataUri('mountains.svg');
const horizonRidgeUri = getSvgDataUri('vector-67-1585.svg');
const surfaceWavesUri = getSvgDataUri('surface-waves.svg');
const sunRaysUri = getSvgDataUri('sun-rays.svg');
const cliffUri = getSvgDataUri('cliff.svg');
const fishSchoolUri = getSvgDataUri('fish-school.svg');
const bubblesUri = getSvgDataUri('bubbles.svg');
const islandUri = getSvgDataUri('island.svg');

function buildSvg(useDataUris = true) {
  const boatSrc = useDataUris ? boatBase64 : 'figma-exact/boat.png';
  const icebergsSrc = useDataUris ? icebergsBase64 : 'figma-exact/icebergs.png';
  const sunSrc = useDataUris ? sunBase64 : 'figma-exact/sun.png';
  const diverSrc = useDataUris ? diverBase64 : 'figma-exact/diver.png';

  const mountainsSrc = useDataUris ? mountainsUri : 'figma-exact/mountains.svg';
  const horizonRidgeSrc = useDataUris ? horizonRidgeUri : 'figma-exact/vector-67-1585.svg';
  const surfaceWavesSrc = useDataUris ? surfaceWavesUri : 'figma-exact/surface-waves.svg';
  const sunRaysSrc = useDataUris ? sunRaysUri : 'figma-exact/sun-rays.svg';
  const cliffSrc = useDataUris ? cliffUri : 'figma-exact/cliff.svg';
  const fishSchoolSrc = useDataUris ? fishSchoolUri : 'figma-exact/fish-school.svg';
  const bubblesSrc = useDataUris ? bubblesUri : 'figma-exact/bubbles.svg';
  const islandSrc = useDataUris ? islandUri : 'figma-exact/island.svg';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 14931 19963" width="14931" height="19963"
     id="ocean-explore-master" data-node-id="53:172"
     style="background-color: #031f31; display: block; overflow: visible;">
  <defs>
    <style>
      .flipX {
        transform-box: fill-box;
        transform-origin: center;
        transform: scaleX(-1);
      }
      .smallBoat {
        transform-box: fill-box;
        transform-origin: center;
        transform: rotate(4.18deg) scaleX(-1);
      }
      .interactive-element {
        cursor: pointer;
        transition: filter 0.2s ease;
      }
      .interactive-element:hover {
        filter: drop-shadow(0 0 12px rgba(0, 232, 255, 0.8));
      }
    </style>

    <!-- Sky Gradient: 64:677 -->
    <linearGradient id="figma-sky" x1="7465.5" y1="1143" x2="7465.5" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0.006165" stop-color="#c9ecee" />
      <stop offset="0.7352" stop-color="#8ad4ef" />
      <stop offset="0.99727" stop-color="#49a9e6" />
    </linearGradient>

    <!-- Ocean Depth Gradient: 53:174 -->
    <linearGradient id="figma-ocean" x1="7402" y1="1152.57" x2="7402" y2="19962.66" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#34c6d3" />
      <stop offset="7.6139%" stop-color="#168aa0" />
      <stop offset="40.478%" stop-color="#0b5874" />
      <stop offset="58.677%" stop-color="#07364f" />
      <stop offset="98.962%" stop-color="#031f31" />
    </linearGradient>
  </defs>

  <!-- ================= 1. BACKGROUND GRADIENTS ================= -->
  <!-- Sky Background (Node 64:677) -->
  <rect id="node-64-677" data-node-id="64:677" data-name="Sky Gradient"
        x="0" y="0" width="14931" height="1143.313" fill="url(#figma-sky)" />

  <!-- Ocean Depth Background (Node 53:174) -->
  <rect id="node-53-174" data-node-id="53:174" data-name="Ocean Gradient"
        x="-126.98" y="1152.57" width="15057.977" height="18810.09" fill="url(#figma-ocean)" />

  <!-- ================= 2. HORIZON MOUNTAINS & RIDGES ================= -->
  <!-- Distant Mountains (Node 67:1556) -->
  <image id="node-67-1556" data-node-id="67:1556" data-name="Horizon Mountains"
         href="${mountainsSrc}"
         x="385.555" y="932.445" width="1931.637" height="194.163" />

  <!-- Secondary Horizon Ridge (Node 67:1585) -->
  <image id="node-67-1585" data-node-id="67:1585" data-name="Horizon Ridge"
         href="${horizonRidgeSrc}"
         x="449.423" y="988.169" width="1341.351" height="134.829" />

  <!-- ================= 3. SURFACE BOATS ================= -->
  <!-- Surface Boat Primary (Node 67:1592) -->
  <image id="node-67-1592" data-node-id="67:1592" data-name="Surface Boat Primary"
         class="flipX interactive-element"
         href="${boatSrc}"
         x="1346.4" y="965.76" width="309.07" height="231.8" />

  <!-- Surface Boat Secondary (Node 67:1593) -->
  <image id="node-67-1593" data-node-id="67:1593" data-name="Surface Boat Secondary"
         class="smallBoat interactive-element"
         href="${boatSrc}"
         x="2405.78" y="1003.28" width="198.48" height="154.879" />

  <!-- ================= 4. SURFACE WAVES ================= -->
  <!-- Surface Waves Strip (Node 62:514) -->
  <image id="node-62-514" data-node-id="62:514" data-name="Surface Waves"
         href="${surfaceWavesSrc}"
         x="783.071" y="1053.854" width="14148" height="456" />

  <!-- ================= 5. UNDERWATER ENVIRONMENT & CLIFF ================= -->
  <!-- Underwater Sunlight Rays (Node 69:1600) -->
  <image id="node-69-1600" data-node-id="69:1600" data-name="Underwater Sunlight Rays"
         href="${sunRaysSrc}"
         x="252.891" y="1100.141" width="4072.752" height="2292.141" />

  <!-- Continental Shelf Cliff (Node 60:421) -->
  <image id="node-60-421" data-node-id="60:421" data-name="Ocean Shelf Cliff"
         href="${cliffSrc}"
         x="-38.008" y="712.676" width="13132" height="19251" />

  <!-- ================= 6. MARINE LIFE & BUBBLES ================= -->
  <!-- Fish School Left (Node 71:1668) -->
  <image id="node-71-1668" data-node-id="71:1668" data-name="Fish School Left"
         class="interactive-element"
         href="${fishSchoolSrc}"
         x="1097.496" y="1282.605" width="274" height="343" />

  <!-- Fish School Center (Node 71:1766) -->
  <image id="node-71-1766" data-node-id="71:1766" data-name="Fish School Center"
         class="interactive-element"
         href="${fishSchoolSrc}"
         x="1388.207" y="1142.848" width="274" height="343" />

  <!-- Fish School Right (Node 71:1864) -->
  <image id="node-71-1864" data-node-id="71:1864" data-name="Fish School Right"
         class="interactive-element"
         href="${fishSchoolSrc}"
         x="1697.09" y="1274.203" width="274" height="343" />

  <!-- Underwater Bubbles (Node 71:1636) -->
  <image id="node-71-1636" data-node-id="71:1636" data-name="Bubble Cluster"
         href="${bubblesSrc}"
         x="976.402" y="1086.141" width="380" height="213" />

  <!-- ================= 7. FOREGROUND ISLAND, ICEBERGS, SUN & DIVER ================= -->
  <!-- Shore Island (Node 63:651) — sits on top of cliff base and wave line -->
  <image id="node-63-651" data-node-id="63:651" data-name="Island Shoreline"
         href="${islandSrc}"
         x="-303.082" y="344.238" width="1117" height="838" />

  <!-- Distant Icebergs Near (Node 64:678) -->
  <image id="node-64-678" data-node-id="64:678" data-name="Icebergs Primary"
         href="${icebergsSrc}"
         x="94.59" y="57.38" width="2172" height="724" />

  <!-- Distant Icebergs Far (Node 64:679) -->
  <image id="node-64-679" data-node-id="64:679" data-name="Icebergs Secondary"
         href="${icebergsSrc}"
         x="2406.29" y="57.38" width="2172" height="724" />

  <!-- Surface Sun Glow (Node 67:1586) -->
  <image id="node-67-1586" data-node-id="67:1586" data-name="Sun Glow"
         href="${sunSrc}"
         x="1201.53" y="128.79" width="270.699" height="270.699" />

  <!-- Scuba Diver (Node 71:1964) -->
  <image id="node-71-1964" data-node-id="71:1964" data-name="Scuba Diver"
         class="interactive-element"
         href="${diverSrc}"
         x="1141.39" y="1246.89" width="32.417" height="48.625" />
</svg>
`;
}

// Generate standalone self-contained SVG
const standaloneSvg = buildSvg(true);
fs.writeFileSync(OUTPUT_FILE, standaloneSvg, 'utf8');
fs.writeFileSync(ROOT_OUTPUT_FILE, standaloneSvg, 'utf8');
console.log(`Generated standalone SVG: ${OUTPUT_FILE} (${(standaloneSvg.length / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`Copied standalone SVG to root: ${ROOT_OUTPUT_FILE}`);

// Generate modular relative SVG
const modularSvg = buildSvg(false);
fs.writeFileSync(MODULAR_FILE, modularSvg, 'utf8');
console.log(`Generated modular SVG: ${MODULAR_FILE} (${(modularSvg.length / 1024).toFixed(2)} KB)`);
