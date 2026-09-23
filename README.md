# Ocean Explore — Standalone SVG & 2D Exploration Viewer

> Pixel-perfect implementation of the **Ocean Explore Master Scene** from Figma:
> **File:** `fUIT7yG4ZwYUvszbqGfr2y` | **Node:** `53-172` (`Scene / Ocean Depth — Master`)  
> **Master Dimensions:** `14,931 px` width &times; `19,963 px` height

🌐 **Live Demo:** [http://chitikka.me/Ocean-Explore-Master/](http://chitikka.me/Ocean-Explore-Master/)  
📦 **GitHub Repository:** [https://github.com/sarojkkhadka120-a11y/Ocean-Explore-Master](https://github.com/sarojkkhadka120-a11y/Ocean-Explore-Master)

---

## 🌟 Highlights

1. **100% Standalone Master SVG (`ocean-scene.svg`)**:
   - Zero external dependencies. All raster assets (boats, icebergs, glowing sun, scuba diver) and vector layers are fully embedded into a single, portable SVG.
   - Exact `viewBox="0 0 14931 19963"` preserving every subpixel coordinate, transform, and userSpaceOnUse gradient from the Figma design system.
   - Ready to open directly in any web browser, Adobe Illustrator, Inkscape, or Figma.

2. **2D Horizontal & Vertical Exploration Web Application (`index.html`)**:
   - **Full 2D Navigation:** Scroll or click-and-drag freely horizontally and vertically across the entire 14,931 &times; 19,963 px ocean world.
   - **Zoom Controls:** Zoom smoothly from the entire world overview (0.04x) up to extreme close-up (3.0x) on the scuba diver and marine life.
   - **Interactive Radar Minimap:** Picture-in-picture radar showing the whole ocean; drag or click anywhere to jump immediately to that region.
   - **Dynamic Depth & Coordinate HUD:** Displays real-time depth (0 m at surface down to 10,928 m Challenger Deep) and exact Figma `(X, Y)` position.
   - **Quick-Jump Waypoints:** One-click travel to key ocean zones:
     - ☀️ *Surface & Sky* (0 m)
     - 🤿 *Diver & Coral Shallows* (35 m)
     - 🌊 *Sunlight Zone* (150 m)
     - 🧗 *The Continental Shelf Cliff* (850 m)
     - 🌑 *Midnight Trench* (3,200 m)
     - 🌌 *Abyssal Plain* (5,800 m)
     - 🕳️ *Ocean Floor / Trench Bed* (10,000+ m)
   - **Layer Inspector:** Toggle inspector mode to hover and inspect any scene element, revealing its Figma Node ID, dimensions, and world coordinates.

---

## 📐 Figma Layer Inventory & Exact Coordinates

| Layer Name | Figma Node ID | Type | Bounds $(X, Y)$ | Dimensions $(W \times H)$ |
| :--- | :--- | :--- | :--- | :--- |
| **Sky Gradient** | `64:677` | Background Rect | $(0, 0)$ | $14,931 \times 1,143.31$ px |
| **Ocean Depth Gradient** | `53:174` | Background Rect | $(-126.98, 1152.57)$ | $15,057.98 \times 18,810.09$ px |
| **Horizon Mountain Range** | `67:1556` | Vector Silhouette | $(385.56, 932.45)$ | $1,931.64 \times 194.16$ px |
| **Secondary Mountain Ridge** | `67:1585` | Vector Silhouette | $(449.42, 988.17)$ | $1,341.35 \times 134.83$ px |
| **Horizon Icebergs (Near)** | `64:678` | Raster PNG | $(94.59, 57.38)$ | $2,172 \times 724$ px |
| **Horizon Icebergs (Far)** | `64:679` | Raster PNG | $(2406.29, 57.38)$ | $2,172 \times 724$ px |
| **Sun Glow & Core** | `67:1586` | Raster PNG | $(1201.53, 128.79)$ | $270.70 \times 270.70$ px |
| **Island Shoreline & Vegetation**| `63:651` | Vector Group | $(-303.08, 344.24)$ | $1,117 \times 838$ px |
| **Surface Sailboat (Near)** | `67:1592` | Raster PNG (flipX) | $(1346.40, 965.76)$ | $309.07 \times 231.80$ px |
| **Surface Boat (Distant)** | `67:1593` | Raster PNG (rotate) | $(2405.78, 1003.28)$ | $198.48 \times 154.88$ px |
| **Surface Wave Strips** | `62:514` | Vector Waveform | $(783.07, 1053.85)$ | $14,148 \times 456$ px |
| **Underwater Sunlight Rays** | `69:1600` | Vector Optics | $(252.89, 1100.14)$ | $4,072.75 \times 2,292.14$ px |
| **Continental Shelf Cliff** | `60:421` | Vector Terrain | $(-38.01, 712.68)$ | $13,132 \times 19,251$ px |
| **Fish School (Left Cluster)** | `71:1668` | Vector Marine Life | $(1097.50, 1282.61)$ | $274 \times 343$ px |
| **Fish School (Center Cluster)** | `71:1766` | Vector Marine Life | $(1388.21, 1142.85)$ | $274 \times 343$ px |
| **Fish School (Right Cluster)** | `71:1864` | Vector Marine Life | $(1697.09, 1274.20)$ | $274 \times 343$ px |
| **Reef Bubble Column** | `71:1636` | Vector Effect | $(976.40, 1086.14)$ | $380 \times 213$ px |
| **Scuba Diver Explorer** | `71:1964` | Raster Character | $(1141.39, 1246.89)$ | $32.42 \times 48.63$ px |

---

## 🚀 Getting Started

### 1. Launch the 2D Exploration Viewer

Start the local server:
```bash
npm start
# or: python3 -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 2. Verify Exact SVG Positioning & Geometry

Run the automated test suite:
```bash
npm test
```

### 3. Rebuild Standalone Master SVG

If you ever update the source assets in `assets/figma-exact/`, regenerate the standalone SVG with:
```bash
npm run build:svg
```
This produces:
- `ocean-scene.svg` (Root, self-contained standalone master SVG)
- `assets/ocean-scene.svg` (Asset copy)
- `assets/ocean-scene-modular.svg` (Modular version with relative asset links)
