## Goal

Repaint the portal's color basal tone to match the reference site (Shanghai Academy of Development & Reform):

- Deep navy blue (`#0A2A5E` ~ `hsl(217 80% 20%)`) as the primary brand surface
- Bright sky blue (`hsl(210 100% 55%)`) as the accent / CTA
- White text on the navy hero / nav / footer
- Clean white cards with light blue accents in the body
- Hero image switches from green factory to a **Shanghai skyline + Huangpu river** photo (Bund / Pudong)

Affects only the **portal** (`/portal`, `/portal/green-mfg`, `/portal/scenarios`, `/portal/news`). Government and Enterprise backends are unchanged.

## Scope

### 1. Portal token rewrite — `src/styles/portal.css`
Rewrite the `.portal-theme { … }` HSL tokens:
- `--background` → very light cool gray `210 25% 98%`
- `--foreground` → near-black navy `217 35% 15%`
- `--primary` → deep navy `217 80% 22%` (was deep green)
- `--primary-glow` → bright sky `210 100% 55%`
- `--accent` → soft blue `210 60% 95%`
- `--accent-foreground` → primary navy
- `--ring`, `--border`, `--muted` → cool gray-blue tones
- Portal-specific:
  - `--portal-gradient-hero` → `linear-gradient(135deg, hsl(217 80% 22%), hsl(210 90% 45%))`
  - `--portal-gradient-card-blue/green` → unified navy→sky-blue
  - `--portal-shadow-*` → tinted with navy instead of green
- `.portal-footer-dark` → keep dark, but switch base to navy: `linear-gradient(180deg, hsl(217 60% 12%) 0%, hsl(217 70% 7%) 100%)`
- `.portal-hero-overlay` → navy-tinted dark gradient (not green)
- `.portal-icon-badge` → light blue background, navy icon
- Footer hover green accents (`hsl(150 ...)`) → swapped to bright blue (`hsl(210 100% 65%)`)

### 2. Hero image regeneration
Replace `src/assets/portal/hero-green.jpg` with a **Shanghai skyline at golden hour** photo (Bund + Pudong, Oriental Pearl Tower, Huangpu river) generated via Gemini image model, then update `HeroBanner.tsx`:
- Rename import to `hero-shanghai.jpg`
- Hero gradient text: emerald gradient → bright sky-blue gradient (`from-sky-200 to-sky-400`)
- Subtitle copy unchanged

### 3. Module hero gradients (sub-pages)
In `PortalGreenMfg.tsx`, `PortalScenarios.tsx`, `PortalNews.tsx`:
- Change inline `bg-gradient-to-br from-[hsl(160_55%_28%)] to-[hsl(150_60%_40%)]` → `from-[hsl(217_80%_22%)] to-[hsl(210_85%_45%)]`

### 4. Footer accents — `PortalFooter.tsx`
- Leaf icon container: keep dark, but icon color becomes bright blue
- Hover link color: green → bright blue (`hsl(210 100% 65%)`)
- Brand text & layout unchanged

### 5. Header — `PortalHeader.tsx`
- No structural changes. Because tokens change, the solid header automatically picks up navy primary; transparent header still uses white-on-image. Login button uses `bg-primary` → now navy, which matches reference.

### 6. Stats bar / Agent grid / Business functions / News carousel
No code changes — they consume `--primary`, `--accent`, `--card`, etc. Re-tinting tokens is enough. Hover and icon badges automatically become blue.

### 7. Optional asset re-tint check
Existing portal photos (factory, supply chain, news) are real-world photography and remain visually compatible with a blue theme — no regeneration needed. Only the hero is regenerated because it's the dominant brand surface.

## Result

- Portal home: navy + bright-blue hero of Shanghai skyline, white "上海市工业和通信业能碳数智空间" headline, blue CTA
- Solid sub-page headers: navy gradient banners
- Cards / sections: white background, blue accent dividers and icon badges
- Footer: deep navy dark surface with blue hover accents
- Backends (gov / ent): completely untouched
