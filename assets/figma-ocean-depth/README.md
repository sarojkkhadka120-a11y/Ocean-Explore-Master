# Ocean Depth Figma exports

Development-ready assets exported from the `08 — Graphics Library` page in the **Deep Compare — Design System** Figma file.

## Folder structure

- `vectors/` — reusable SVG environment, effect, and creature artwork
- `raster/` — rendered PNG artwork for bitmap-based scene elements
- `reference/ocean-depth-master.png` — downscaled visual reference for implementation QA
- `manifest.json` — Figma node IDs, original bounds, export dimensions, CSS gradients, and reuse notes

## Implementation notes

- Build the sky and ocean backgrounds with the CSS gradients in `manifest.json`.
- Reuse `fish-school.svg` for the three fish-school instances.
- Reuse `boat.png` and `icebergs.png` for their repeated transformed instances.
- Treat the master PNG as a visual reference, not a production background.
- Preserve SVG aspect ratios; some SVGs use cropped content bounds while their original placement is recorded under `figmaBounds`.
