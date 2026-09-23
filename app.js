/**
 * Ocean Explore — Master Canvas Interactive 2D Navigation Engine
 * Coordinates & Dimensions: 14,931 px × 19,963 px (Figma Master Node 53:172)
 */

(function () {
  'use strict';

  // Constants & World Geometry
  const WORLD_WIDTH = 14931;
  const WORLD_HEIGHT = 19963;
  const WATER_LINE_Y = 1152.57;
  const MAX_OCEAN_DEPTH_METERS = 10928; // Challenger Deep

  // DOM Elements
  const container = document.getElementById('exploration-container');
  const canvasWrapper = document.getElementById('canvas-wrapper');
  const svgObject = document.getElementById('ocean-svg-object');

  // Telemetry HUD Elements
  const telemetryZone = document.getElementById('telemetry-zone');
  const telemetryDepth = document.getElementById('telemetry-depth');
  const telemetryCoords = document.getElementById('telemetry-coords');
  const telemetryZoom = document.getElementById('telemetry-zoom');

  // Controls
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const btnZoomOut = document.getElementById('btn-zoom-out');
  const btnZoomReset = document.getElementById('btn-zoom-reset');
  const btnZoom100 = document.getElementById('btn-zoom-100');
  const btnToggleInspector = document.getElementById('btn-toggle-inspector');

  // Minimap Elements
  const minimapContainer = document.getElementById('minimap-container');
  const minimapLens = document.getElementById('minimap-lens');
  const minimapCoords = document.getElementById('minimap-coords');

  // Inspector Elements
  const inspectorCard = document.getElementById('inspector-card');
  const inspectorTitle = document.getElementById('inspector-title');
  const inspectorNodeId = document.getElementById('inspector-node-id');
  const inspectorBounds = document.getElementById('inspector-bounds');
  const inspectorSize = document.getElementById('inspector-size');
  const inspectorType = document.getElementById('inspector-type');

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
  let scrollStartY = 0;
  let isMinimapDragging = false;
  let inspectorActive = false;

  // Layer metadata for Inspector
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

    // Recalculate new scroll positions to keep anchor point stationary
    const newScrollLeft = worldFocusX * currentZoom - focusX;
    const newScrollTop = worldFocusY * currentZoom - focusY;

    container.scrollLeft = Math.max(0, newScrollLeft);
    container.scrollTop = Math.max(0, newScrollTop);

    updateTelemetry();
    updateMinimap();
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
    const depthMeters = Math.round((submergedY / maxSubmerged) * MAX_OCEAN_DEPTH_METERS);

    let zoneName = 'Epipelagic (Sunlight Zone)';
    if (depthMeters > 200 && depthMeters <= 1000) {
      zoneName = 'Mesopelagic (Twilight Zone)';
    } else if (depthMeters > 1000 && depthMeters <= 4000) {
      zoneName = 'Bathypelagic (Midnight Zone)';
    } else if (depthMeters > 4000 && depthMeters <= 6000) {
      zoneName = 'Abyssopelagic (The Abyss)';
    } else if (depthMeters > 6000) {
      zoneName = 'Hadopelagic (Ocean Trenches)';
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
   * Update Minimap Radar Lens
   */
  function updateMinimap() {
    const vW = container.clientWidth;
    const vH = container.clientHeight;

    const miniW = minimapContainer.clientWidth;
    const miniH = minimapContainer.clientHeight;

    // Visible world rectangle
    const visibleWorldX = container.scrollLeft / currentZoom;
    const visibleWorldY = container.scrollTop / currentZoom;
    const visibleWorldW = vW / currentZoom;
    const visibleWorldH = vH / currentZoom;

    // Ratio onto minimap
    const lensX = (visibleWorldX / WORLD_WIDTH) * miniW;
    const lensY = (visibleWorldY / WORLD_HEIGHT) * miniH;
    const lensW = Math.max(6, (visibleWorldW / WORLD_WIDTH) * miniW);
    const lensH = Math.max(6, (visibleWorldH / WORLD_HEIGHT) * miniH);

    minimapLens.style.left = `${Math.max(0, Math.min(lensX, miniW - lensW))}px`;
    minimapLens.style.top = `${Math.max(0, Math.min(lensY, miniH - lensH))}px`;
    minimapLens.style.width = `${Math.min(lensW, miniW)}px`;
    minimapLens.style.height = `${Math.min(lensH, miniH)}px`;

    minimapCoords.textContent = `${Math.round(visibleWorldX)}, ${Math.round(visibleWorldY)}`;
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
      updateMinimap();
    }, 200);
  }

  /**
   * Navigate via Minimap Click/Drag
   */
  function handleMinimapInteraction(e) {
    const rect = minimapContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetWorldX = (clickX / rect.width) * WORLD_WIDTH;
    const targetWorldY = (clickY / rect.height) * WORLD_HEIGHT;

    flyToWorldPosition(targetWorldX, targetWorldY);
  }

  // ==========================================================================
  // Event Listeners: Container Panning & Scrolling
  // ==========================================================================

  container.addEventListener('scroll', () => {
    updateTelemetry();
    updateMinimap();
  });

  // Mouse Drag to Pan
  container.addEventListener('mousedown', (e) => {
    if (e.target.closest('#hud-header') || e.target.closest('#radar-minimap') || e.target.closest('#waypoints-bar')) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    scrollStartX = container.scrollLeft;
    scrollStartY = container.scrollTop;
  });

  window.addEventListener('mousemove', (e) => {
    if (isMinimapDragging) {
      handleMinimapInteraction(e);
      return;
    }

    if (!isDragging) return;
    e.preventDefault();

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    container.scrollLeft = scrollStartX - dx;
    container.scrollTop = scrollStartY - dy;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    isMinimapDragging = false;
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

  // ==========================================================================
  // Minimap Interaction Listeners
  // ==========================================================================

  minimapContainer.addEventListener('mousedown', (e) => {
    isMinimapDragging = true;
    handleMinimapInteraction(e);
  });

  // ==========================================================================
  // Zoom Controls
  // ==========================================================================

  btnZoomIn.addEventListener('click', () => applyZoom(currentZoom * 1.35));
  btnZoomOut.addEventListener('click', () => applyZoom(currentZoom / 1.35));
  btnZoom100.addEventListener('click', () => applyZoom(1.0));

  btnZoomReset.addEventListener('click', () => {
    // Fit canvas height to container
    const fitZoom = (container.clientHeight - 40) / WORLD_HEIGHT;
    applyZoom(Math.max(MIN_ZOOM, fitZoom));
  });

  // ==========================================================================
  // Waypoint Buttons
  // ==========================================================================

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

  // ==========================================================================
  // Node Inspector Mode
  // ==========================================================================

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

      elem.addEventListener('mouseenter', (e) => {
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

      // Quick click to jump / inspect
      elem.addEventListener('click', () => {
        flyToWorldPosition(meta.x + meta.w / 2, meta.y + meta.h / 2, Math.max(0.4, currentZoom));
      });
    });
  });

  // ==========================================================================
  // Initialization
  // ==========================================================================

  window.addEventListener('resize', () => {
    updateTelemetry();
    updateMinimap();
  });

  // Initialize at opening frame (Surface & Diver view: X=1200, Y=800, Zoom=0.5)
  setTimeout(() => {
    applyZoom(0.5);
    flyToWorldPosition(1200, 800, 0.5);
  }, 100);

})();
