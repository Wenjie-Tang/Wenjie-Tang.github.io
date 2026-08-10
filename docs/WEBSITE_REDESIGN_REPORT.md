# Website Redesign Report

Date: August 11, 2026

## 1. Redesign Overview

The PRISM-based site was rebuilt as a research-first bilingual HCI portfolio. The homepage now introduces Wenjie Tang's research identity before presenting news, five selected research projects, publications and patents, research and industry experience, education, awards, methods, and service. Existing static detail routes remain available.

## 2. Source of Truth

All visible facts were updated from `Wenjie_Tang_Website_Codex_Master_Prompt_2026-08-11.md`. English and Chinese content use the same dates, advisors, sample sizes, statuses, grant amounts, authorship, education figures, and awards totals. Unsupported links or claims were not added.

## 3. Files Changed

- Updated bilingual TOML, Markdown, and BibTeX content in `content/` and `content_zh/`.
- Reworked the homepage, navigation, generic content pages, publications pipeline, metadata, shared types, and global styling under `src/`.
- Added the optimized `public/profile.webp` while preserving the original portrait and archived PDF.
- Updated `package.json` and `package-lock.json` with supported patch releases, removed the unused `svg2ico` toolchain, and refreshed transitive security patches.
- Added audit, missing-assets, report, and visual-review documentation under `docs/`.

## 4. Components Added or Modified

New reusable components include `SectionHeading`, `Tag`, `ActionLinks`, `ResearchCard`, and `PublicationCard`. `HomePageClient`, `Profile`, `About`, `News`, `CardPage`, `TextPage`, `PublicationsList`, `Navigation`, and `Footer` were adapted to the new information architecture and bilingual behavior.

## 5. Color Preservation

The original PRISM palette was preserved: `#fefffe` light background, slate text, `#d4a562` accent, and `#0f172a` dark background. The redesign changes hierarchy, spacing, density, and interaction states without replacing the established navy, gold, and white identity.

## 6. Information Architecture

The homepage order is Hero/About, Research Interests, News, Selected Research, Publications and Patents, Research Experience, Industry Experience, Education, Awards, Skills and Methods, Community and Service, and Footer. The separate research, publications, experience, education, awards, and CV routes remain statically exported.

Long Ling's site informed only high-level structural ideas: concise research positioning, dated updates, scannable research entries, explicit tags, and clear separation of research from experience. No code, assets, colors, branding, or wording were copied.

## 7. Research Card System

Five reusable research cards support affiliation, role, advisor, date, status, evidence, research-area tags, method/tool tags, optional verified links, and optional authentic imagery. Because no authentic project images were available, the cards use clearly labeled CSS-based graphic teasers rather than fabricated screenshots.

## 8. Publication Card System

BibTeX remains the source for two publications and two patents. Cards distinguish publication and patent categories, highlight Wenjie Tang in author lists, show role and conservative status text, and render only verified metadata. English and Chinese BibTeX files share the same records.

## 9. Responsive Behavior

The hero shifts from a two-column desktop composition to a single-column mobile layout. Research and publication grids collapse predictably, tags wrap, fixed-format teasers retain stable dimensions, and the mobile navigation closes after same-page anchor selection. Browser checks at 390, 768, 1024, 1280, and 1920 px found no horizontal overflow.

## 10. Accessibility Improvements

The redesign uses semantic headings, sections, articles, lists, dates, and descriptive portrait/teaser alternatives. Icon links have accessible names, external links disclose new-tab behavior, keyboard focus states are retained, color contrast works in both themes, and reduced-motion preferences are respected.

## 11. Build Results

- `npm ci`: passed.
- `npm run lint`: passed with no warnings or errors.
- `npm run build`: passed on Next.js 15.5.23, including TypeScript checking and static export of 11 pages.
- `npm audit --omit=dev --audit-level=high`: passed with 0 production vulnerabilities.
- Full development audit: 3 high-severity advisories remain in Next 15's bundled `postcss` and `sharp`; npm requires a breaking Next 16.3 upgrade to remove them. The deployed output is static and does not run a Next.js server.
- `git diff --check`: passed.
- All eight public routes and four preserved assets returned HTTP 200 locally.
- The first sandboxed build compiled successfully but Windows denied a type-check worker with `spawn EPERM`; rerunning with child-process permission completed successfully.

## 12. Deployment Status

The repository remains `Wenjie-Tang/Wenjie-Tang.github.io` on `main`. Redesign commit `c35457bb8464d1cef5f5d8dbd59ff8c8b5d2471c` was pushed normally with no history rewrite. GitHub Actions run `31426648517` completed successfully, and the Pages deployment also completed successfully. Production returned HTTP 200 for all eight routes, the optimized portrait, favicon, and archived CV at `https://wenjie-tang.github.io/`. The live homepage contains the new research content, and generated HTML contains no `/PRISM/` or repository-name path prefix.

## 13. Unresolved Items

The archived PDF predates the August 2026 source of truth and still needs a verified phone-free replacement. Authentic project teasers and authoritative publication/patent URLs are also unavailable. These are documented in `docs/MISSING_RESEARCH_ASSETS.md` and are not fabricated in the site.

## 14. Recommended Future Assets

- A current phone-free CV PDF exported from the verified HTML content.
- Authentic prototype screenshots, study photographs, system diagrams, or publication figures for the five selected projects.
- Verified DOI, paper PDF, patent, project, code, or demo URLs when public and authoritative.
