/**
 * Ocean Explore — Master Canvas & 0–10,000 m Asset Bible Navigation Engine
 * Coordinates & Dimensions: 14,931 px × 19,963 px (Figma Master Node 53:172)
 * Strictly adhering to the Ocean Depth Asset Bible Specification.
 */

import OceanAssetManifest from './ocean-asset-manifest.js';

(function () {
  'use strict';

  // Constants & World Geometry
  const WORLD_WIDTH = OceanAssetManifest.WORLD_WIDTH_PX || 14931;
  const WORLD_HEIGHT = OceanAssetManifest.WORLD_HEIGHT_PX || 19963;
  const WATER_LINE_Y = OceanAssetManifest.WATER_LINE_Y_PX || 1152.57;
  const MAX_OCEAN_DEPTH_METERS = OceanAssetManifest.MAX_OCEAN_DEPTH_M || 10000;

  // DOM Elements
  const container = document.getElementById('exploration-container');
  const canvasWrapper = document.getElementById('canvas-wrapper');
  const svgObject = document.getElementById('ocean-svg-object');
  const oceanStage = document.getElementById('ocean-stage');

  // Layer containers (per Section 3 of Asset Bible)
  const layer10 = document.getElementById('layer-10'); // Far atmosphere
  const layer30 = document.getElementById('layer-30'); // Habitat
  const layer40 = document.getElementById('layer-40'); // Large background life
  const layer50 = document.getElementById('layer-50'); // Midground life
  const layer60 = document.getElementById('layer-60'); // Landmark / vehicle
  const layer70 = document.getElementById('layer-70'); // Foreground life
  const layer80 = document.getElementById('layer-80'); // Foreground atmosphere
  const layer90 = document.getElementById('layer-90'); // Information UI

  // Telemetry HUD Elements
  const telemetryZone = document.getElementById('telemetry-zone');
  const telemetryDepth = document.getElementById('telemetry-depth');
  const telemetryCoords = document.getElementById('telemetry-coords');
  const telemetryZoom = document.getElementById('telemetry-zoom');
  const telemetryScaleMode = document.getElementById('telemetry-scale-mode');

  // Scale Mode Switcher
  const btnScaleDisplay = document.getElementById('btn-scale-display');
  const btnScalePhysical = document.getElementById('btn-scale-physical');

  // Zone Filter
  const zoneFilterSelect = document.getElementById('zone-filter-select');

  // Zoom & Action Controls
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const btnZoomOut = document.getElementById('btn-zoom-out');
  const btnZoomReset = document.getElementById('btn-zoom-reset');
  const btnZoom100 = document.getElementById('btn-zoom-100');
  const btnToggleInspector = document.getElementById('btn-toggle-inspector');


  // Inspector Elements
  const inspectorCard = document.getElementById('inspector-card');
  const inspectorTitle = document.getElementById('inspector-title');
  const inspectorNodeId = document.getElementById('inspector-node-id');
  const inspectorBounds = document.getElementById('inspector-bounds');
  const inspectorSize = document.getElementById('inspector-size');
  const inspectorType = document.getElementById('inspector-type');

  // Specimen Detail Modal Elements
  const specimenModalBackdrop = document.getElementById('specimen-modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalZoneBadge = document.getElementById('modal-zone-badge');
  const modalSpecimenName = document.getElementById('modal-specimen-name');
  const modalScientificName = document.getElementById('modal-scientific-name');
  const modalArtImg = document.getElementById('modal-art-img');
  const modalDepthChip = document.getElementById('modal-depth-chip');
  const modalScaleBadge = document.getElementById('modal-scale-badge');
  const modalSpecimenBarLabel = document.getElementById('modal-specimen-bar-label');
  const modalSpecimenBarFill = document.getElementById('modal-specimen-bar-fill');
  const modalDisplayScale = document.getElementById('modal-display-scale');
  const modalPhysicalLength = document.getElementById('modal-physical-length');
  const modalDepthRange = document.getElementById('modal-depth-range');
  const modalDescText = document.getElementById('modal-desc-text');
  const btnFocusSpecimen = document.getElementById('btn-focus-specimen');

  // Waypoints
  const waypoints = document.querySelectorAll('.waypoint-pill');

  // State
  let currentZoom = 0.5; // Default scale factor
  const MIN_ZOOM = 0.04;
  const MAX_ZOOM = 3.0;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let scrollStartX = 0;
  let inspectorActive = false;

  let currentScaleMode = 'display'; // 'display' | 'physical'
  let activeModalSpecimen = null;

  // Base Figma Layer metadata for Inspector
  const LAYER_REGISTRY = {
    'node-64-677': { name: 'Sky Gradient', nodeId: '64:677', type: 'Background', x: 0, y: 0, w: 14931, h: 1143 },
    'node-53-174': { name: 'Ocean Depth Gradient', nodeId: '53:174', type: 'Background', x: -127, y: 1153, w: 15058, h: 18810 },
    'node-67-1556': { name: 'Horizon Mountain Range', nodeId: '67:1556', type: 'Horizon Vector', x: 386, y: 932, w: 1932, h: 194 },
    'node-67-1585': { name: 'Secondary Mountain Ridge', nodeId: '67:1585', type: 'Horizon Vector', x: 449, y: 988, w: 1341, h: 135 },
    'node-64-678': { name: 'Horizon Icebergs (Near)', nodeId: '64:678', type: 'Surface Atmosphere', x: 95, y: 57, w: 2172, h: 724 },
    'node-64-679': { name: 'Horizon Icebergs (Far)', nodeId: '64:679', type: 'Surface Atmosphere', x: 2406, y: 57, w: 2172, h: 724 },
    'node-67-1586': { name: 'Sun Glow & Core', nodeId: '67:1586', type: 'Surface Sun', x: 1202, y: 129, w: 271, h: 271 },
    'node-63-651': { name: 'Island Shoreline & Vegetation', nodeId: '63:651', type: 'Coastline Vector', x: -303, y: 344, w: 1117, h: 838 },
    'node-67-1592': { name: 'Surface Sailboat (Near)', nodeId: '67:1592', type: 'Vessel Sprite', x: 1346, y: 966, w: 309, h: 232 },
    'node-67-1593': { name: 'Surface Boat (Distant)', nodeId: '67:1593', type: 'Vessel Sprite', x: 2406, y: 1003, w: 198, h: 155 },
    'node-62-514': { name: 'Water-Surface Wave Strips', nodeId: '62:514', type: 'Surface Waveform', x: 783, y: 1054, w: 14148, h: 456 },
    'node-69-1600': { name: 'Underwater Sunlight Rays', nodeId: '69:1600', type: 'Sunlight Optics', x: 253, y: 1100, w: 4073, h: 2292 },
    'node-60-421': { name: 'Great Continental Shelf Cliff', nodeId: '60:421', type: 'Abyssal Terrain', x: -38, y: 713, w: 13132, h: 19251 },
    'node-71-1668': { name: 'Fish School (Left Cluster)', nodeId: '71:1668', type: 'Marine Life', x: 1097, y: 1283, w: 274, h: 343 },
    'node-71-1766': { name: 'Fish School (Center Cluster)', nodeId: '71:1766', type: 'Marine Life', x: 1388, y: 1143, w: 274, h: 343 },
    'node-71-1864': { name: 'Fish School (Right Cluster)', nodeId: '71:1864', type: 'Marine Life', x: 1697, y: 1274, w: 274, h: 343 },
    'node-71-1636': { name: 'Reef Bubble Column', nodeId: '71:1636', type: 'Particle Effect', x: 976, y: 1086, w: 380, h: 213 },
    'node-71-1964': { name: 'Scuba Diver Character', nodeId: '71:1964', type: 'Explorer Character', x: 1141, y: 1247, w: 32, h: 49 },
  };

  /**
   * Helper to return an appropriate emoji for a specimen
   */
  function getSpecimenEmoji(asset) {
    if (asset.id.includes('whale')) return '🐋';
    if (asset.id.includes('turtle')) return '🐢';
    if (asset.id.includes('shark')) return '🦈';
    if (asset.id.includes('squid') || asset.id.includes('octopus')) return '🦑';
    if (asset.id.includes('jelly')) return '🪼';
    if (asset.id.includes('dolphin')) return '🐬';
    if (asset.id.includes('titanic')) return '🚢';
    if (asset.id.includes('lander') || asset.id.includes('submersible') || asset.id.includes('rov')) return '🛸';
    if (asset.id.includes('vent')) return '🌋';
    if (asset.id.includes('coral') || asset.id.includes('kelp') || asset.id.includes('sponge')) return '🪸';
    return '🐟';
  }

  /**
   * Initialize and Render All 54 Asset Bible Specimens
   */
  function renderAssetBibleStage() {
    const layerMap = {
      10: layer10,
      30: layer30,
      40: layer40,
      50: layer50,
      60: layer60,
      70: layer70,
      80: layer80,
    };
    // 1. Render Marine Snow Atmospheric Effects
    const snowSparse = document.createElement('div');
    snowSparse.className = 'marine-snow-drift';
    snowSparse.style.top = `${Math.round(OceanAssetManifest.depthToWorldY(800))}px`;
    snowSparse.style.height = `${Math.round(OceanAssetManifest.depthToWorldY(10000) - OceanAssetManifest.depthToWorldY(800))}px`;
    snowSparse.style.backgroundImage = 'url("ocean/generated/effects/marine-snow-sparse.png"), url("generated/effects/marine-snow-sparse.png")';
    layer10.appendChild(snowSparse);

    const snowDense = document.createElement('div');
    snowDense.className = 'marine-snow-drift';
    snowDense.style.top = `${Math.round(OceanAssetManifest.depthToWorldY(3500))}px`;
    snowDense.style.height = `${Math.round(OceanAssetManifest.depthToWorldY(10000) - OceanAssetManifest.depthToWorldY(3500))}px`;
    snowDense.style.backgroundImage = 'url("ocean/generated/effects/marine-snow-dense.png"), url("generated/effects/marine-snow-dense.png")';
    snowDense.style.opacity = '0.7';
    layer80.appendChild(snowDense);

    // 3. Render Each Production Asset
    OceanAssetManifest.assets.forEach((asset) => {
      // Atmospheric effects already placed or tile-based
      if (asset.file === 'marine-snow-sparse.png' || asset.file === 'marine-snow-dense.png') {
        return;
      }

      const targetLayer = layerMap[asset.layer] || layer50;

      // Specimen Container
      const specimenElem = document.createElement('div');
      specimenElem.className = `ocean-specimen layer-${asset.layer}`;
      specimenElem.id = `specimen-${asset.id}`;
      specimenElem.dataset.assetId = asset.id;
      specimenElem.dataset.zone = asset.zone;
      specimenElem.dataset.category = asset.category;

      specimenElem.style.left = `${asset.worldX}px`;
      specimenElem.style.top = `${asset.worldY}px`;
      specimenElem.style.width = `${asset.worldWidth}px`;

      // Direction Mirror
      if (asset.mirror) {
        specimenElem.classList.add('flip');
      }

      // Bioluminescence
      const isBiolum = ['anglerfish', 'lanternfish-school', 'comb-jelly', 'siphonophore', 'dragonfish'].includes(asset.id);
      if (isBiolum) {
        specimenElem.classList.add('bioluminescent-pulse');
      }

      // Floating drift animation for pelagic gelatinous species
      const isDrifter = ['moon-jelly-group', 'comb-jelly', 'vampire-squid', 'dumbo-octopus', 'abyssal-sea-cucumber', 'hadal-sea-cucumber'].includes(asset.id);
      if (isDrifter) {
        specimenElem.classList.add('drifting-motion');
      }

      // Silt plume effect
      if (asset.id === 'silt-cloud') {
        specimenElem.classList.add('benthic-silt-plume');
      }

      // Submersible Searchlight Cone
      const hasHeadlight = ['scientific-rov', 'shinkai-style-submersible', 'full-depth-submersible', 'research-submersible'].includes(asset.id);
      if (hasHeadlight) {
        const headlight = document.createElement('div');
        headlight.className = 'searchlight-cone';
        specimenElem.appendChild(headlight);
      }

      // Main Artwork Image
      const img = document.createElement('img');
      img.src = asset.src;
      img.alt = asset.name;
      img.className = 'specimen-img';
      img.loading = 'lazy';
      img.onerror = () => {
        img.src = asset.fallbackSrc;
      };
      specimenElem.appendChild(img);

      // Click to open Specimen Modal
      specimenElem.addEventListener('click', (e) => {
        e.stopPropagation();
        openSpecimenModal(asset);
      });

      targetLayer.appendChild(specimenElem);
    });
  }

  /**
   * Apply Zoom & Update Canvas Scale
   */
  function applyZoom(newZoom, originX = null, originY = null) {
    const clampedZoom = Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM);
    if (Math.abs(clampedZoom - currentZoom) < 0.001) return;

    // Viewport dimensions
    const vW = container.clientWidth;
    const vH = container.clientHeight;

    // Center or anchor point in viewport
    const focusX = originX !== null ? originX : vW / 2;
    const focusY = originY !== null ? originY : vH / 2;

    // World coordinates currently under the anchor point
    const worldFocusX = (container.scrollLeft + focusX) / currentZoom;
    const worldFocusY = (container.scrollTop + focusY) / currentZoom;

    // Update zoom
    currentZoom = clampedZoom;

    // Update wrapper dimensions for native scroll container
    canvasWrapper.style.width = `${WORLD_WIDTH * currentZoom}px`;
    canvasWrapper.style.height = `${WORLD_HEIGHT * currentZoom}px`;

    // Also set transform on svg view
    svgObject.style.width = `${WORLD_WIDTH * currentZoom}px`;
    svgObject.style.height = `${WORLD_HEIGHT * currentZoom}px`;

    // Scale ocean stage overlay in sync
    if (oceanStage) {
      oceanStage.style.transform = `scale(${currentZoom})`;
    }

    // Recalculate new scroll positions to keep anchor point stationary
    const newScrollLeft = worldFocusX * currentZoom - focusX;
    const newScrollTop = worldFocusY * currentZoom - focusY;

    container.scrollLeft = Math.max(0, newScrollLeft);
    container.scrollTop = Math.max(0, newScrollTop);

    updateTelemetry();
  }

  /**
   * Calculate Depth & Ocean Zone from Y coordinate
   */
  function calculateDepthAndZone(worldY) {
    if (worldY < WATER_LINE_Y) {
      return {
        depthMeters: 0,
        zoneName: 'Surface & Atmosphere',
      };
    }

    const submergedY = worldY - WATER_LINE_Y;
    const maxSubmerged = WORLD_HEIGHT - WATER_LINE_Y;
    const depthMeters = Math.min(10000, Math.round((submergedY / maxSubmerged) * MAX_OCEAN_DEPTH_METERS));

    let zoneName = 'Epipelagic (Sunlight Zone)';
    if (depthMeters > 200 && depthMeters <= 1000) {
      zoneName = 'Mesopelagic (Twilight Zone)';
    } else if (depthMeters > 1000 && depthMeters <= 4000) {
      zoneName = 'Bathypelagic (Midnight Zone)';
    } else if (depthMeters > 4000 && depthMeters <= 6000) {
      zoneName = 'Abyssopelagic (The Abyss)';
    } else if (depthMeters > 6000) {
      zoneName = 'Hadopelagic (The Trenches)';
    }

    return { depthMeters, zoneName };
  }

  /**
   * Update Telemetry HUD
   */
  function updateTelemetry() {
    const vW = container.clientWidth;
    const vH = container.clientHeight;

    const centerWorldX = Math.round((container.scrollLeft + vW / 2) / currentZoom);
    const centerWorldY = Math.round((container.scrollTop + vH / 2) / currentZoom);

    const { depthMeters, zoneName } = calculateDepthAndZone(centerWorldY);

    telemetryZone.textContent = zoneName;
    telemetryDepth.textContent = `${depthMeters.toLocaleString()} m`;
    telemetryCoords.textContent = `X: ${centerWorldX.toLocaleString()} • Y: ${centerWorldY.toLocaleString()}`;
    telemetryZoom.textContent = `${Math.round(currentZoom * 100)}%`;
  }



  /**
   * Jump to Specific World Position
   */
  function flyToWorldPosition(targetX, targetY, targetZoom = null) {
    if (targetZoom !== null) {
      currentZoom = targetZoom;
      canvasWrapper.style.width = `${WORLD_WIDTH * currentZoom}px`;
      canvasWrapper.style.height = `${WORLD_HEIGHT * currentZoom}px`;
      svgObject.style.width = `${WORLD_WIDTH * currentZoom}px`;
      svgObject.style.height = `${WORLD_HEIGHT * currentZoom}px`;
      if (oceanStage) {
        oceanStage.style.transform = `scale(${currentZoom})`;
      }
    }

    const vW = container.clientWidth;
    const vH = container.clientHeight;

    const targetScrollLeft = targetX * currentZoom - vW / 2;
    const targetScrollTop = targetY * currentZoom - vH / 2;

    container.scrollTo({
      left: Math.max(0, targetScrollLeft),
      top: Math.max(0, targetScrollTop),
      behavior: 'smooth',
    });

    setTimeout(() => {
      updateTelemetry();
    }, 200);
  }

  /**
   * Scale Mode Switcher (Section 2 of Asset Bible)
   */
  function setScaleMode(mode) {
    currentScaleMode = mode;
    const isPhysical = mode === 'physical';

    btnScaleDisplay.classList.toggle('active', !isPhysical);
    btnScalePhysical.classList.toggle('active', isPhysical);
    document.body.classList.toggle('true-scale-active', isPhysical);

    telemetryScaleMode.textContent = isPhysical ? 'True Scale (1:1)' : 'Display Scale';
    telemetryScaleMode.style.color = isPhysical ? '#ffc83b' : '#50e3c2';

    OceanAssetManifest.assets.forEach((asset) => {
      const elem = document.getElementById(`specimen-${asset.id}`);
      if (!elem) return;

      if (isPhysical && asset.physicalWidth !== null) {
        elem.style.width = `${asset.physicalWidth}px`;
        if (asset.physicalScalePct < 0.2) {
          elem.classList.add('microscopic-true-scale');
        }
      } else {
        elem.style.width = `${asset.worldWidth}px`;
        elem.classList.remove('microscopic-true-scale');
      }
    });
  }

  btnScaleDisplay.addEventListener('click', () => setScaleMode('display'));
  btnScalePhysical.addEventListener('click', () => setScaleMode('physical'));

  /**
   * Zone Filter Selection
   */
  zoneFilterSelect.addEventListener('change', () => {
    const selected = zoneFilterSelect.value;
    let firstMatchingAsset = null;

    OceanAssetManifest.assets.forEach((asset) => {
      const elem = document.getElementById(`specimen-${asset.id}`);
      if (!elem) return;

      let match = false;
      if (selected === 'all') {
        match = true;
      } else if (selected === 'vehicles') {
        match = asset.category === 'vehicle' || asset.category === 'landmark';
      } else {
        match = asset.zone === selected;
      }

      elem.classList.toggle('dimmed', !match);
      if (match && !firstMatchingAsset) {
        firstMatchingAsset = asset;
      }
    });

    if (firstMatchingAsset) {
      flyToWorldPosition(firstMatchingAsset.worldX, firstMatchingAsset.worldY, Math.max(0.4, currentZoom));
    }
  });

  /**
   * Open Specimen Detail Modal
   */
  function openSpecimenModal(asset) {
    activeModalSpecimen = asset;

    modalZoneBadge.textContent = `${asset.zone.toUpperCase()} ZONE • DEPTH: ${asset.displayDepthM.toLocaleString()} M`;
    modalSpecimenName.textContent = asset.name;
    modalScientificName.textContent = asset.scientificName;
    modalArtImg.src = asset.src;
    modalArtImg.alt = asset.name;
    modalDepthChip.textContent = `${asset.displayDepthM.toLocaleString()} m (~${Math.round(asset.displayDepthM * 3.28084).toLocaleString()} ft)`;

    // Scale system values
    modalDisplayScale.textContent = `${asset.displayScalePct}% of Titanic`;
    modalPhysicalLength.textContent = asset.realSizeDesc;
    modalDepthRange.textContent = asset.depthRange;

    // Comparative Scale Bars
    if (asset.physicalScalePct !== null) {
      modalSpecimenBarLabel.textContent = `Specimen Real Scale (${asset.physicalScalePct}% of Titanic length):`;
      modalSpecimenBarFill.style.width = `${Math.max(0.6, Math.min(100, asset.physicalScalePct))}%`;
      modalSpecimenBarFill.textContent = `${asset.physicalScalePct}%`;
    } else {
      modalSpecimenBarLabel.textContent = `Environment Module Size (${asset.displayScalePct}% relative to Titanic):`;
      modalSpecimenBarFill.style.width = `${Math.max(1, Math.min(100, asset.displayScalePct))}%`;
      modalSpecimenBarFill.textContent = `${asset.displayScalePct}%`;
    }

    if (asset.enlargedForVisibility) {
      modalScaleBadge.textContent = `ENLARGED ${Math.round(asset.displayScalePct / asset.physicalScalePct)}× FOR VISIBILITY`;
      modalScaleBadge.style.display = 'inline-block';
    } else {
      modalScaleBadge.textContent = asset.physicalScalePct ? 'PROPORTIONAL SCALE' : 'ENVIRONMENT MODULE';
      modalScaleBadge.style.display = 'inline-block';
    }

    modalDescText.textContent = asset.description;

    specimenModalBackdrop.classList.add('active');
    specimenModalBackdrop.setAttribute('aria-hidden', 'false');
  }

  function closeSpecimenModal() {
    specimenModalBackdrop.classList.remove('active');
    specimenModalBackdrop.setAttribute('aria-hidden', 'true');
    activeModalSpecimen = null;
  }

  modalCloseBtn.addEventListener('click', closeSpecimenModal);
  specimenModalBackdrop.addEventListener('click', (e) => {
    if (e.target === specimenModalBackdrop) {
      closeSpecimenModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && specimenModalBackdrop.classList.contains('active')) {
      closeSpecimenModal();
    }
  });

  btnFocusSpecimen.addEventListener('click', () => {
    if (!activeModalSpecimen) return;
    const asset = activeModalSpecimen;
    closeSpecimenModal();
    flyToWorldPosition(asset.worldX + asset.worldWidth / 2, asset.worldY + 100, Math.max(0.55, currentZoom));
  });

  // ==========================================================================
  // Event Listeners: Container Panning & Scrolling
  // ==========================================================================

  container.addEventListener('scroll', () => {
    updateTelemetry();
  });

  // Mouse Drag to Pan
  container.addEventListener('mousedown', (e) => {
    if (e.target.closest('#hud-header') || e.target.closest('#waypoints-bar') || e.target.closest('.specimen-modal')) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    scrollStartX = container.scrollLeft;
    scrollStartY = container.scrollTop;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    container.scrollLeft = scrollStartX - dx;
    container.scrollTop = scrollStartY - dy;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Wheel Zoom (Ctrl+Wheel or Trackpad Pinch)
  container.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      applyZoom(currentZoom * zoomFactor, e.clientX, e.clientY);
    }
  }, { passive: false });

  // Touch Support
  let touchStartDist = 0;
  let touchStartZoom = 0.5;

  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      scrollStartX = container.scrollLeft;
      scrollStartY = container.scrollTop;
    } else if (e.touches.length === 2) {
      isDragging = false;
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      touchStartDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      touchStartZoom = currentZoom;
    }
  });

  container.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      container.scrollLeft = scrollStartX - dx;
      container.scrollTop = scrollStartY - dy;
    } else if (e.touches.length === 2 && touchStartDist > 0) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const ratio = dist / touchStartDist;
      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;
      applyZoom(touchStartZoom * ratio, midX, midY);
    }
  });

  container.addEventListener('touchend', () => {
    isDragging = false;
    touchStartDist = 0;
  });



  // Zoom Controls
  btnZoomIn.addEventListener('click', () => applyZoom(currentZoom * 1.35));
  btnZoomOut.addEventListener('click', () => applyZoom(currentZoom / 1.35));
  btnZoom100.addEventListener('click', () => applyZoom(1.0));

  btnZoomReset.addEventListener('click', () => {
    const fitZoom = (container.clientHeight - 40) / WORLD_HEIGHT;
    applyZoom(Math.max(MIN_ZOOM, fitZoom));
  });

  // Waypoint Buttons
  waypoints.forEach((btn) => {
    btn.addEventListener('click', () => {
      waypoints.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const x = parseFloat(btn.dataset.x);
      const y = parseFloat(btn.dataset.y);
      const zoom = parseFloat(btn.dataset.zoom);

      flyToWorldPosition(x, y, zoom);
    });
  });

  // Node Inspector Mode
  btnToggleInspector.addEventListener('click', () => {
    inspectorActive = !inspectorActive;
    btnToggleInspector.classList.toggle('active', inspectorActive);
    if (!inspectorActive) {
      inspectorCard.classList.remove('active');
    }
  });

  // Wire up SVG internal element inspector once SVG document loads
  svgObject.addEventListener('load', () => {
    const svgDoc = svgObject.contentDocument;
    if (!svgDoc) return;

    Object.entries(LAYER_REGISTRY).forEach(([id, meta]) => {
      const elem = svgDoc.getElementById(id);
      if (!elem) return;

      elem.style.cursor = 'pointer';

      elem.addEventListener('mouseenter', () => {
        if (!inspectorActive) return;
        inspectorTitle.textContent = meta.name;
        inspectorNodeId.textContent = meta.nodeId;
        inspectorBounds.textContent = `X: ${meta.x}, Y: ${meta.y}`;
        inspectorSize.textContent = `${meta.w} × ${meta.h} px`;
        inspectorType.textContent = meta.type;

        inspectorCard.classList.add('active');
      });

      elem.addEventListener('mousemove', (e) => {
        if (!inspectorActive) return;
        const offset = 18;
        inspectorCard.style.left = `${Math.min(window.innerWidth - 260, e.clientX + offset)}px`;
        inspectorCard.style.top = `${Math.min(window.innerHeight - 180, e.clientY + offset)}px`;
      });

      elem.addEventListener('mouseleave', () => {
        if (!inspectorActive) return;
        inspectorCard.classList.remove('active');
      });

      elem.addEventListener('click', () => {
        flyToWorldPosition(meta.x + meta.w / 2, meta.y + meta.h / 2, Math.max(0.4, currentZoom));
      });
    });
  });

  // Window Resize
  window.addEventListener('resize', () => {
    updateTelemetry();
  });

  // ==========================================================================
  // Initialization & Boot
  // ==========================================================================

  // 1. Render all 54 specimens and layers
  renderAssetBibleStage();

  // 2. Initialize opening frame at Surface & Diver view (X=1200, Y=800, Zoom=0.5)
  setTimeout(() => {
    applyZoom(0.5);
    flyToWorldPosition(1200, 800, 0.5);
  }, 100);

})();
