# AVA — See the Change. Trace the Signals. Understand the Story.

A responsive, interactive **React + Vite** project built from the *First Video.pdf* concept script for **Team Vantara Lumina**.

> **Important:** AVA is a front-end educational **concept demo**. All time-series values, risk-pattern index values, confidence labels and sensor drawings in this repository are **illustrative, hand-authored placeholders**. They are **not real NASA measurements, scientific validation, disaster forecasts or evidence for an actual event**. The original PDF describes the desired NASA processing pipeline; that backend/data science pipeline is **not implemented** here.

## What works

- Three selectable environmental scenarios (Langtang as described in the pitch, plus two explicitly fictional examples)
- Search/filter of the available demo events (not live geographic search)
- Before → During → After interactive **7-frame replay**, with Play / Pause / Previous / Next / direct frame selection
- Responsive **illustrative terrain visualization** with Optical, Radar and Auto selection; cloudy frames automatically demonstrate radar fallback
- Rainfall, temperature, snow / soil moisture and cloud-status indicators
- Interactive **Precursor Signal Score** demo, chart and caveats
- **Evidence Library** with source family, date, confidence category, explanation and uncertainty; filterable by confidence level
- Cause chain that expressly marks unverified relationships **NOT ESTABLISHED**
- Methodology page distinguishing the planned science workflow from implemented UI features
- Team page using the six names and roles in the provided PDF
- Keyboard-friendly navigation, responsive layouts, shareable event URL, downloadable scenario JSON
- Unit tests, Vite production build and GitHub Pages auto-deployment workflow

## Quick start

**Requirements:** Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local address printed by Vite (usually `http://localhost:5173`).

```bash
npm test       # Validate event data and replay helpers
npm run build  # Create production files in dist/
npm run preview
```

## Put it on GitHub

1. Create a new **empty** repository on GitHub, for example `ava-earth-explorer`.
2. From this project directory:

```bash
git init
git add .
git commit -m "Build AVA Earth observation demo"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ava-earth-explorer.git
git push -u origin main
```

3. GitHub → repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Under the **Actions** tab, the `Publish AVA to GitHub Pages` workflow will build and deploy. The public address will usually be `https://YOUR_USERNAME.github.io/ava-earth-explorer/` (only after successful deployment).

The workflow triggers after each push to `main`. The Vite configuration uses relative assets so GitHub Pages project paths are supported.

## Alternative: Vercel live link

1. Go to [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account, import the AVA repository, select **Vite** (automatically detected).
3. Keep **Build command** `npm run build`, **Output directory** `dist`.
4. Click **Deploy**. After a successful build, Vercel will provide an actual `*.vercel.app` URL.

No API keys or environment variables are required for this offline concept demo.

## Project layout

```
├─ .github/workflows/deploy.yml   # GitHub Pages CI/CD
├─ public/favicon.svg
├─ src/
│  ├─ components/TerrainMap.jsx    # Vector scene and optical/radar demo
│  ├─ data/events.js               # Clearly illustrative scenario content
│  ├─ lib/analysis.js              # Small replay/export helpers
│  ├─ lib/analysis.test.js         # Node built-in tests
│  ├─ App.jsx                      # Main pages and components
│  ├─ main.jsx                     # React entry point
│  └─ styles.css                   # Complete responsive design
├─ index.html
├─ package.json
├─ vercel.json
└─ vite.config.js
```

## What a NASA-backed production version would require

- Explicit source acquisition (NASA Earthdata or services like GPM, USGS Landsat, MODIS, SMAP and terrain data; verify individual product licensing and access)
- Reliable location-based Earth observation discovery and verified event inventory
- Spatial co-registration, cloud masks, temporal normalization, resolution checks and no-data handling
- Historical baselines using 20+ years **where coverage is suitable**, plus data-quality metadata
- Scientifically defined precursor index, calibrated uncertainties, expert-reviewed attribution and backtesting
- Appropriate **radar acquisitions** actually covering the same place/time (radar is not universally available)
- Traceable dataset links, provenance, confidence calculations and careful safeguarding against hazard-prediction claims
- An API/backend and precomputed geospatial tiles/rasters to deliver genuine analyzed products efficiently

The prototype makes none of those production claims.

## Source

*First Video.pdf*, five-page AVA concept/presentation script provided with the assignment. The narrative, user journey, NASA data source categories, evidence-first communication and Team Vantara Lumina roster follow that document.
