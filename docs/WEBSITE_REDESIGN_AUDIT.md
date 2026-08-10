# Website Redesign Audit

Date: August 11, 2026

## Repository and Deployment

- Production repository: `Wenjie-Tang/Wenjie-Tang.github.io`
- Production URL: `https://wenjie-tang.github.io/`
- Current branch: `main` at `81d01dd`
- Safety branch: `backup-before-prism-migration` at `4c84e07`, present locally and on `origin`
- Worktree status before redesign: clean
- History policy: normal commits only; no force push or history rewrite
- Deployment: `.github/workflows/deploy.yml` uses the official GitHub Pages artifact and deployment actions
- Build target: Next.js static export to `out/`, served at the root user-site URL with no `basePath`

## Architecture

- Framework: Next.js 15.5.23 App Router, React 19, TypeScript 5
- Styling: Tailwind CSS 4 plus CSS custom properties in `src/app/globals.css`
- Content: English TOML, Markdown, and BibTeX in `content/`; matching Chinese content in `content_zh/`
- Content loading: server-side filesystem readers in `src/lib/content.ts` and TOML parsing with `smol-toml`
- Publications: BibTeX parsed through `src/lib/bibtexParser.ts`
- Internationalization: client locale store with English as the default and an exposed English/Chinese switcher
- Theme: client theme store and `next-themes`; light, dark, and system modes are exposed
- Routes: `/`, `/research-experience/`, `/research/`, `/publications/`, `/experience/`, `/awards/`, and `/cv/`
- Package manager: npm, with a committed `package-lock.json`; Node.js 22 is used locally and in Actions

## Reusable Components

- `Profile`: portrait, identity, social links, and research interests
- `About`, `News`, and `SelectedPublications`: homepage sections
- `CardPage`: generic card-backed content pages
- `PublicationsList`: BibTeX-backed publications with filtering and expandable details
- `Navigation`, `Footer`, language switcher, and theme switcher
- Framer Motion is already installed and can support restrained reveal and hover motion
- Heroicons and Lucide are already installed; no new icon dependency is needed

## Visual System

- Light background: `#fefffe`
- Light primary text: `#1e293b`; foreground: `#0f172a`
- Accent: `#d4a562` with light/dark variants
- Neutral scale: Slate 50-900
- Dark background: `#0f172a`; dark foreground: `#f8fafc`
- Typography: Inter/system sans for body copy and Georgia/system serif for headings
- Existing cards use white/dark slate surfaces, subtle neutral borders, rounded corners, and restrained shadows
- The redesign will preserve these exact tokens and type pairing while improving hierarchy, spacing, focus states, and card density

## Existing Assets

- `public/profile.png`: authentic 1773 x 2254 portrait, SHA-256 identical to the user-provided portrait in Downloads
- `public/profile.webp`: optimized 1200 x 1526 web derivative used by the site; the original PNG remains preserved
- `public/Wenjie-Tang-CV.pdf`: one-page CV dated before the latest July/August 2026 updates
- `public/favicon.svg`: current site favicon
- No authentic research teaser images, paper PDFs, posters, demos, or publication thumbnails are currently present

## CV Status

The repository PDF is useful as a historical asset but is not the latest CV. It contains a public telephone number and stale facts, including GPA 87.55/100, ranking 23/148, the old CityU dates, the old DDI advisor, the phrase `multi-agent system`, the old awards count, and a missing patent co-inventor. It must remain in the repository until a replacement is supplied, but the redesigned HTML must not repeat these stale facts or expose the phone number.

## Content Inconsistencies

- CityU is shown as May 2026-Present instead of Apr. 2026-July 2026
- FIT-AWE Lab and Safe Passage are absent
- Personalized AI Writing is absent
- The CityU study lacks the 28-designer sample and current conservative paper status
- DDI lists Prof. Xiaowen Xu instead of Prof. Simian Liu and Zhenxiao Zhang
- The intergenerational project is incorrectly described as a multi-agent system
- The design patent omits Zhengyang Wang
- Awards still report 10 provincial awards rather than 15
- Education lacks the updated GPA 87.74/100 and ranking 22/147
- Manulife and the three community-service entries are absent
- English and Chinese content repeat the same stale facts
- Metadata does not yet include a canonical production URL or the updated HCI research description

## Risks

- A one-page research portfolio must not break the existing static detail routes
- English and Chinese content can drift unless both are updated from the same schema and checked together
- Static export requires absolute root-relative asset paths and unoptimized local images
- The large portrait can affect performance if responsive sizes and eager loading are not controlled
- Publication/patent claims must remain conservative because verified DOI/PDF links are not present
- Missing project visuals must not be replaced with fabricated screenshots or misleading imagery
- The current PDF download can conflict with the new HTML facts until the user provides a current file

## Reference-Site Findings

`long-ling.com` was reviewed only for information architecture. Useful structural ideas are: a concise research identity, dated news, visually scannable research/publication entries, explicit research tags and action links, and clear separation among research, experience, education, and awards. No code, colors, assets, branding, or wording will be copied.

## Planned Modifications

1. Keep PRISM's static-export, bilingual content, navigation, theme, and palette foundations.
2. Enable a research-first homepage with hero/about, interests, news, selected research, publications and patents, research experience, industry experience, education, awards, methods, and community service.
3. Extend the card schema for status, affiliation, role/advisor metadata, research tags, method/technology tags, optional authentic images, and verified action links.
4. Add reusable section-heading, tag, action-link, research-card, publication-card, and compact timeline/list presentation components.
5. Separate publications from patents while retaining BibTeX as the publication source.
6. Update all English and Chinese content from the August 2026 master prompt.
7. Add honest CSS-only research teasers until authentic project images are supplied.
8. Improve canonical/Open Graph metadata, focus states, reduced motion, responsive layouts, and semantic heading structure.
9. Preserve all current assets and document unresolved asset needs.
