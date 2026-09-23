# Ocean Depth Asset Bible

This document is the source of truth for generating, naming, placing, scaling, and layering visual assets in the 0–10,000 m ocean experience.

## 1. Art direction

Use `/public/ocean/figma-exact/diver.png` as the visual reference for every generated raster asset.

Begin each generation prompt with:

> Create the image in a stylized premium 2D illustrated game-art style matching the provided scuba-diver character reference. Use a clean, polished, semi-cartoon / indie-game visual language with soft controlled shading, smooth painted surfaces, simplified forms, rounded appealing shapes, subtle glow and atmospheric depth, clear silhouettes, slightly exaggerated cute proportions, and elegant layered color separation. No photorealism, messy texture, heavy realism, sketch lines, or rough painterly strokes. The image should feel like a high-quality game asset or animated-film concept illustration. Keep the rendering polished, readable, and clean, with a teal / cyan / navy dominant palette and soft accent lighting. Use a dark, ocean-friendly color mood when underwater and preserve the same overall visual identity as the scuba-diver reference.

Append this block to isolated assets:

> Show exactly one complete subject or one explicitly requested group. Keep every part fully visible with generous transparent padding. Use a clean side-profile or subtle three-quarter view suitable for horizontal scene movement. Create a genuinely transparent background with clean edges and preserved alpha. Do not include an environment, seabed, frame, label, text, watermark, cast shadow, or unrelated creatures.

Use one asset-generation request per row in the inventory. Do not ask one generation to create a sprite sheet of unrelated subjects.

## 2. Scale system

`Titanic = 100%` refers to the illustrated width of the Titanic wreck asset.

Titanic is the master size reference because its historical full length was approximately 269 m. The generated artwork depicts the recognizable bow section, so `100%` is a scene-layout reference—not a claim that every visible pixel represents the complete 269 m hull.

- **Physical scale** is the approximate real-world length divided by Titanic's 269 m length. It is useful for educational comparisons.
- **Display scale** is the recommended visible width relative to Titanic. Tiny animals are intentionally enlarged so visitors can recognize them.
- Physical percentages use a representative adult or object length, not the largest specimen ever recorded; group percentages marked `each` apply to one member.
- Use physical scale only inside a dedicated true-scale comparison mode.
- Use display scale in the ordinary scrolling scene.
- Never imply that display scale is scientifically exact. Labels can state “enlarged for visibility” for creatures below 2% physical scale.
- Group assets use the overall group composition width, not the length of one individual.

Recommended rendered width:

```text
renderedWidth = titanicRenderedWidth * (displayScale / 100)
```

At desktop size, start with Titanic at roughly 42–48% of the open-water viewport width. Clamp small recognizable creatures to a practical minimum of approximately 56 px.

## 3. Layer hierarchy

| Layer | z-index | Purpose |
|---|---:|---|
| Water background | 0 | CSS ocean gradient and darkness progression |
| Far atmosphere | 10 | haze, distant silhouettes, very faint marine snow |
| Terrain rear | 20 | persistent cliff, trench walls, distant seabed |
| Habitat | 30 | coral, kelp, vents, rocks, whale fall |
| Large background life | 40 | blue whale, sperm whale, whale shark, large squid |
| Midground life | 50 | most creatures and schools |
| Landmark / vehicle | 60 | Titanic, ROVs, landers, crewed submersibles |
| Foreground life | 70 | occasional close creatures used for parallax |
| Foreground atmosphere | 80 | bubbles, silt, particles, glow overlays |
| Information UI | 90 | labels, leaders, comparisons, zone titles |
| Persistent depth UI | 100 | depth gauge and accessibility controls |

Within a layer, sort by `displayDepthM`; deeper assets appear later in document order. Never let generated artwork cover the persistent depth gauge.

## 4. Folder structure

```text
public/ocean/generated/
├── sunlight/       # 0–200 m
├── twilight/       # 200–1,000 m
├── midnight/       # 1,000–4,000 m
├── abyssal/        # 4,000–6,000 m
├── hadal/          # 6,000–10,000 m
├── vehicles/       # movable craft shared across zones
├── wrecks/         # Titanic and debris
├── habitats/       # large modular environment clusters
└── effects/        # reusable transparent atmospheric overlays
```

File names use lowercase kebab-case. Preserve final alpha. PNG is the master format; optimized WebP derivatives may be added later without deleting the PNG masters.

Routing rule: creatures go in their depth-zone folder; reusable environment clusters go in `habitats/`; movable craft go in `vehicles/`; Titanic assets go in `wrecks/`; atmospheric overlays go in `effects/`.

### AI implementation contract

For every inventory row, the implementing AI must derive and preserve these fields:

```ts
type OceanAssetPlacement = {
  src: string;             // canonical /ocean/generated/<folder>/<file>.png path
  displayDepthM: number;   // exact depth listed below
  physicalScalePct: number | null;
  displayScalePct: number; // width relative to Titanic = 100
  layer: 10 | 30 | 40 | 50 | 60 | 80;
  mirrorSafe: boolean;     // false for Titanic and asymmetric vehicles
};
```

Implementation order:

1. Resolve the canonical folder using the routing rule above.
2. Sort assets by `displayDepthM` from shallowest to deepest.
3. Within the same depth region, render lower layer numbers first.
4. Calculate width from `displayScalePct`; do not use the source PNG dimensions as scene scale.
5. Clamp small subjects for legibility, but mark creatures below 2% physical scale as enlarged in informative UI.
6. Keep Titanic at 100 and never allow another subject to exceed it in ordinary display scale.
7. Use `physicalScalePct` only in a clearly labeled true-scale comparison mode.

## 5. Production inventory

The listed depth is the recommended narrative placement in this particular 0–10,000 m journey. It is not a claim that the species exists only at that exact depth or that the value is its maximum diving/occurrence depth. Educational detail panels should present broader observed ranges when that information is available.

### Sunlight zone — 0–200 m

| ID / file | Depth | Physical % | Display % | Layer | Generation direction |
|---|---:|---:|---:|---:|---|
| `green-sea-turtle.png` | 25 m | 0.6 | 6 | 50 | One adult turtle, right-facing relaxed swim, clear four-flipper silhouette |
| `blue-whale.png` | 80 m | 11.2 | 18 | 40 | One blue whale, right-facing, long streamlined body, restrained cyan rim light |
| `dolphin-pod.png` | 20 m | 1.5 each | 12 | 40 | Three bottlenose dolphins in one loose pod, all silhouettes separated |
| `manta-ray.png` | 45 m | 2.6 | 9 | 50 | One oceanic manta, slight underside three-quarter view, broad readable wings |
| `reef-shark.png` | 55 m | 0.9 | 7 | 50 | One gray reef shark, calm swimming pose, accurate fins, approachable styling |
| `whale-shark.png` | 95 m | 6.7 | 13 | 40 | One whale shark with simplified spot pattern and broad head |
| `tuna-school.png` | 120 m | 0.7 each | 10 | 50 | Seven tuna in a directional school, varied spacing, no merged silhouettes |
| `moon-jelly-group.png` | 165 m | 0.1 each | 8 | 50 | Five translucent moon jellies, subtle cyan glow, elegant tentacles |
| `coral-reef-ledge.png` | 35 m | — | 24 | 30 | Modular reef ledge cluster, broad shapes, restrained coral colors, transparent cutout |
| `kelp-cluster.png` | 28 m | — | 17 | 30 | One modular kelp cluster with five to seven broad fronds, readable silhouette |

### Twilight zone — 200–1,000 m

| ID / file | Depth | Physical % | Display % | Layer | Generation direction |
|---|---:|---:|---:|---:|---|
| `lanternfish-school.png` | 350 m | 0.1 each | 8 | 50 | Nine lanternfish with restrained dotted bioluminescence |
| `barreleye-fish.png` | 560 m | 0.06 | 5 | 50 | One recognizable barreleye with transparent dome and upward-looking eyes |
| `vampire-squid.png` | 720 m | 0.1 | 6 | 50 | One vampire squid, cloak-like webbing, cute mysterious expression |
| `giant-squid.png` | 850 m | 4.8 | 13 | 40 | One giant squid in horizontal swimming pose, arms grouped into a clean silhouette |
| `oarfish.png` | 520 m | 3.0 | 11 | 40 | One long ribbon-like oarfish with simplified red dorsal crest |
| `siphonophore.png` | 690 m | 14.9 max | 16 | 40 | One elegant colony chain, readable repeating bells, soft blue glow |
| `comb-jelly.png` | 430 m | 0.1 | 5 | 50 | One rounded comb jelly with limited cyan/rainbow light bands |
| `sperm-whale.png` | 920 m | 7.4 | 15 | 40 | One descending sperm whale, recognizable block-shaped head |
| `twilight-sponge-cluster.png` | 900 m | — | 13 | 30 | Sparse cliff-attached sponge and soft-coral cluster, transparent modular cutout |

### Midnight zone — 1,000–4,000 m

| ID / file | Depth | Physical % | Display % | Layer | Generation direction |
|---|---:|---:|---:|---:|---|
| `anglerfish.png` | 1,200 m | 0.1 | 6 | 50 | One rounded female anglerfish with a single luminous lure |
| `gulper-eel.png` | 1,450 m | 0.4 | 6 | 50 | One gulper eel, readable oversized mouth and long tapering tail |
| `fangtooth-fish.png` | 1,650 m | 0.06 | 5 | 50 | One fangtooth, simplified limited teeth, cute rather than grotesque |
| `giant-isopod.png` | 1,900 m | 0.2 | 6 | 50 | One giant isopod, segmented armored body, clean readable legs |
| `bigfin-squid.png` | 2,450 m | 2.6 | 11 | 40 | One bigfin squid, elbowed arms and very long filaments fully visible |
| `dumbo-octopus.png` | 2,250 m | 0.2 | 7 | 50 | One dumbo octopus with rounded fins and compact webbed arms |
| `dragonfish.png` | 1,850 m | 0.1 | 5 | 50 | One deep-sea dragonfish with restrained photophores and slender body |
| `frilled-shark.png` | 1,550 m | 0.7 | 7 | 50 | One frilled shark with eel-like body and simplified gill frills |
| `grenadier-fish.png` | 2,850 m | 0.4 | 7 | 50 | One rattail grenadier, large head and long tapered tail |
| `whale-fall.png` | 3,150 m | 9.3 | 16 | 30 | One modular whale skeleton ecosystem on a small sediment base |
| `titanic-wreck.png` | 3,800 m | 100 | 100 | 60 | Titanic bow/wreck in respectful side three-quarter view, recognizable but simplified |
| `titanic-debris.png` | 3,850 m | — | 28 | 30 | Sparse debris-field cluster, no bodies or sensational elements |
| `scientific-rov.png` | 2,150 m | 1.1 | 8 | 60 | Compact unmanned ROV with camera, lights, tether stub, and two manipulators |
| `deep-sea-lander.png` | 3,050 m | 0.8 | 7 | 60 | Instrument lander with frame, camera, lights, weights, and short legs |

### Abyssal zone — 4,000–6,000 m

| ID / file | Depth | Physical % | Display % | Layer | Generation direction |
|---|---:|---:|---:|---:|---|
| `tripod-fish.png` | 4,200 m | 0.15 | 5 | 50 | One tripod fish standing on elongated fin rays, full silhouette visible |
| `sea-pig-group.png` | 4,450 m | 0.1 each | 7 | 50 | Three sea pigs on a tiny sediment patch, rounded translucent forms |
| `abyssal-sea-cucumber.png` | 4,700 m | 0.2 | 6 | 50 | One swimming sea cucumber with soft wing-like lobes |
| `brittle-star-cluster.png` | 4,850 m | — | 8 | 30 | Five brittle stars with separated arms on minimal transparent sediment |
| `glass-sponge.png` | 5,050 m | 0.4 | 7 | 30 | One delicate but simplified glass sponge cluster |
| `xenophyophore-cluster.png` | 5,300 m | — | 6 | 30 | Small pale branching xenophyophore cluster, readable broad structure |
| `hydrothermal-vent-habitat.png` | 4,350 m | — | 23 | 30 | Black-smoker chimney with tubeworm base, separated shapes and no full background |
| `abyssal-rock-cluster.png` | 5,650 m | — | 26 | 30 | Low sediment-and-rock foreground cluster, broad layered shapes |
| `shinkai-style-submersible.png` | 5,850 m | 3.6 | 9 | 60 | Original non-branded 6,500 m-class crewed research submersible |

### Hadal zone — 6,000–10,000 m

| ID / file | Depth | Physical % | Display % | Layer | Generation direction |
|---|---:|---:|---:|---:|---|
| `hadal-snailfish.png` | 7,000 m | 0.1 | 6 | 50 | One pale translucent hadal snailfish with soft rounded body |
| `amphipod-swarm.png` | 7,450 m | 0.02 each | 6 | 50 | Seven pale amphipods with clean separated silhouettes |
| `hadal-sea-cucumber.png` | 7,850 m | 0.2 | 6 | 50 | One translucent hadal sea cucumber with subtle lavender-cyan accents |
| `polychaete-worm.png` | 8,250 m | 0.05 | 5 | 50 | One swimming polychaete with simplified lateral bristles |
| `trench-floor-habitat.png` | 9,000 m | — | 32 | 30 | Modular trench wall and sediment floor corner, spacious and minimally detailed |
| `hadal-lander.png` | 9,300 m | 0.8 | 8 | 60 | Full-ocean-depth lander with pressure housings, camera, lights, and weights |
| `full-depth-submersible.png` | 9,800 m | 1.7 | 9 | 60 | Original non-branded full-ocean-depth crewed submersible, compact and robust |

### Reusable effects

| ID / file | Depth range | Display % | Layer | Generation direction |
|---|---:|---:|---:|---|
| `marine-snow-sparse.png` | 800–10,000 m | 100 tile | 10/80 | Seamless transparent sparse organic particles, no background color |
| `marine-snow-dense.png` | 3,000–10,000 m | 100 tile | 10/80 | Seamless transparent denser marine snow, varied soft particle sizes |
| `distant-fish-silhouettes.png` | 100–2,500 m | 35 | 10 | Faint group of distant fish silhouettes, low contrast, transparent |
| `silt-cloud.png` | 3,000–10,000 m | 22 | 80 | Soft localized seabed silt cloud, transparent edges, no solid backdrop |

### Approved alternate vehicle

| ID / file | Suggested depth | Physical % | Display % | Layer | Use |
|---|---:|---:|---:|---:|---|
| `research-submersible.png` | 1,250 m | 1.9 | 9 | 60 | Friendly generic crewed research submersible retained from the approved style-test batch; use only if another crewed-craft milestone is needed |

## 6. Existing and generated totals

- Existing Figma/source assets: surface sun, clouds, waves, mountains, island, cliff, rays, bubbles, generic fish schools, diver, boats, and icebergs.
- Generated v1 production assets in this guide: **53**, plus **1 approved alternate vehicle**.
- Code-native effects: ocean gradient, darkness, ordinary bubbles, small particles, glow, searchlight cones, parallax, mirroring, and movement.

Generation status: **complete and re-audited as of 2026-09-23**. All 54 PNG masters were checked for successful decoding, nonempty visible pixels, genuine transparent pixels, valid dimensions, canonical lowercase kebab-case names, and documentation parity.

### Scale hierarchy summary

The ordinary scene should read in this descending visual order:

1. `titanic-wreck.png` — 100%, master reference.
2. `trench-floor-habitat.png` — 32%, environment module.
3. `titanic-debris.png` — 28%, companion environment module.
4. `abyssal-rock-cluster.png` — 26%, environment module.
5. `coral-reef-ledge.png` — 24%, environment module.
6. `hydrothermal-vent-habitat.png` — 23%, environment module.
7. `blue-whale.png` — 18%, largest ordinary animal presentation.
8. `kelp-cluster.png` — 17%, environment module.
9. `siphonophore.png` and `whale-fall.png` — 16%.
10. `sperm-whale.png` — 15%.

All remaining assets use the per-row display percentages below. Source pixel dimensions must never determine this hierarchy.

## 7. Composition rules

1. Keep the left cliff visually dominant but reserve the right 60–70% for life, landmarks, and labels.
2. Do not place two hero-scale subjects at the same depth. Maintain at least 250–400 m of visual separation.
3. Alternate subject direction after placement by mirroring safe assets in CSS. Do not mirror Titanic or recognizable asymmetric vehicles.
4. Large animals belong mostly in layer 40 so labels and smaller midground life remain legible.
5. Titanic is the primary scale landmark and should not be visually competed with by another large asset within ±500 m.
6. Use habitat clusters near the cliff or seabed edge; keep open-water animals away from the rock silhouette.
7. Use a maximum of one foreground creature per viewport to avoid visual clutter.
8. Below 1,000 m, reduce saturation and let bioluminescent accents supply focal contrast.
9. Below 4,000 m, increase marine snow slowly; do not cover creature faces or label anchors.
10. Treat generated glow as part of the asset silhouette, but add pulsing and intensity changes in CSS rather than generating duplicate glow variants.

## 8. Accessibility and labeling

- Decorative duplicates use empty alternative text.
- The first informative instance uses a concise accessible name.
- Labels must state the creature/object name and approximate display depth.
- When display scale differs strongly from physical scale, include “enlarged for visibility” in the detail panel.
- Titanic content must remain educational and respectful; avoid sensational presentation.

## 9. Scientific anchors and source policy

The structural values in this guide use these authoritative anchors:

- NOAA defines the sunlight zone as 0–200 m, twilight as 200–1,000 m, midnight as 1,000–4,000 m, abyssal as 4,000–6,000 m, and hadal as 6,000 m and deeper: [NOAA — How far does light travel in the ocean?](https://oceanservice.noaa.gov/facts/light_travel.html)
- NOAA describes the hadal zone as extending roughly 6,000–11,000 m; this website intentionally ends at 10,000 m: [NOAA Ocean Exploration — The Hadal Zone](https://oceanexplorer.noaa.gov/expedition-feature/okeanos-ex2102-features-hadalzone/)
- NOAA gives the Titanic wreck depth as approximately 3,800 m: [NOAA Ocean Exploration — Titanic Bow](https://oceanexplorer.noaa.gov/multimedia/daily-image-media-20210415/)
- Woods Hole Oceanographic Institution gives Titanic's historical full length as 883 ft, approximately 269 m: [WHOI — History of RMS Titanic](https://www.whoi.edu/ocean-learning-hub/ocean-topics/ocean-human-lives/underwater-archaeology/rms-titanic/history-of-rms-titanic/)

Individual species occur across ranges rather than at a single depth. Before publishing detailed biological copy, fact-check each species range against NOAA, MBARI, Smithsonian, a museum collection, or peer-reviewed literature. Do not reinterpret the narrative `displayDepthM` value as the species' complete observed range.
