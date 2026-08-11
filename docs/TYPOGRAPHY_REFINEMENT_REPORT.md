# Typography, Spacing, and Density Refinement

## Scope

This pass refines presentation only. It preserves the existing PRISM implementation, content, routes, bilingual behavior, portrait, favicon, links, dark mode, and GitHub Pages root deployment.

## Changes

- Added shared layout, typography, line-height, and spacing tokens in `src/app/globals.css`.
- Reduced the main content measure from 1240px to 1040px and retained a readable 800px long-form measure.
- Reduced the navigation to 58px with smaller brand, link, language, and theme controls.
- Rebalanced the hero around a 160px desktop portrait, 38px name, restrained subtitle/meta text, and a wider profile column that avoids unnecessary wrapping.
- Standardized section headings at 26px desktop and 23px mobile with 52px/40px section spacing.
- Reduced research card titles to 18px, body text to 14px, padding to 22-24px, card gaps to 17px, radius to 12px, and shadows to a minimal hover treatment.
- Flattened publications into divided rows with 16.5px titles and compact author, venue, description, status, and tag styling.
- Tightened experience timelines, awards, education, skills, community, news, CV prose, actions, metadata, and tags.
- Kept mobile typography compact, used 18px side margins, reduced the portrait to 128px, and preserved long-title/tag wrapping without horizontal overflow.

## Validation

- `npm ci`: passed
- `npm run lint`: passed with 0 warnings and 0 errors
- `npx tsc --noEmit`: passed
- `npm run build`: passed; 11 static pages generated and exported
- All generated routes, portrait, favicon, CV page, and CV PDF: HTTP 200
- Desktop and mobile one-page anchors: passed
- English and Chinese switching: passed
- Light, dark, and system theme cycling: passed
- Browser console warnings/errors: none
- Root-domain asset paths: passed; no PRISM or repository-name prefix
- Horizontal overflow: none at 1440x1000, 1024x900, 768x1024, or 390x844

Visual review captures are stored in `docs/visual-review/typography-refinement-*.png`.
