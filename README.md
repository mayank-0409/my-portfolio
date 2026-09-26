# my-portfolio

Two static single-page portfolio websites for **Mayank Singh (Frontend/Web Developer)**, built as plain HTML, CSS and JavaScript. No build step, no framework, no dependencies — just open `index.html` in a browser.

## Contents

| Version | Description | Stack |
| --- | --- | --- |
| [`Portfolio-1/`](Portfolio-1) | Light-themed, custom-CSS portfolio | HTML5, hand-written CSS (`style.css` + `mediaqueries.css`), vanilla JS |
| [`Portfolio-2/`](Portfolio-2) | Dark-themed, animated portfolio | HTML5, Bootstrap 5.3, Font Awesome 6, Inter font, custom `styles.css`, vanilla JS |

## Portfolio-1 — Light / Custom CSS

Light UI with a red accent (`#e94560`) on navy (`#1a1a2e`), Poppins font, and a separate breakpoint file for responsive rules.

**Sections:** Profile (hero), About, Experience (frontend + backend skill grids), Projects, Contact, Footer.

**Features**
- Desktop nav that swaps to a hamburger menu below 1200px (`mediaqueries.css`)
- Navbar shadow that deepens on scroll
- Smooth-scroll anchor navigation for all `href="#..."` links
- CSS custom properties in `:root` for theming
- Skill icons from Icons8, project/profile images from Unsplash

**Files:** `index.html` · `style.css` (646 lines) · `mediaqueries.css` (177 lines) · `script.js` (30 lines)

## Portfolio-2 — Dark / Bootstrap

Dark theme (`#030712`) with an indigo primary (`#6366f1`), Bootstrap 5.3.3 grid/utilities, Font Awesome icons and the Inter typeface.

**Sections:** Hero, About, Skills, Projects, Contact, Footer, plus a back-to-top button.

**Features**
- Animated typing effect cycling roles (Web Developer, Frontend Developer, UI/UX Enthusiast, Problem Solver)
- Navbar `scrolled` state + active nav link highlighting via `IntersectionObserver`/scroll position
- Animated skill bars driven by `data-width` attributes
- Project filtering by category (All / Web App / Frontend / Full Stack)
- Scroll-triggered fade-in animations (`IntersectionObserver`)
- Contact form with simulated send state (spinner → success), no backend
- Back-to-top button, smooth scrolling that auto-closes the mobile nav
- Custom-styled scrollbar and selection highlight

**Files:** `index.html` (515 lines) · `styles.css` (534 lines) · `script.js` (214 lines)

## Getting Started

No installation required. To run locally:

```bash
# Option 1 — open directly
start Portfolio-1\index.html

# Option 2 — serve locally (recommended, avoids CDN/CORS quirks)
python -m http.server 8000
# then visit http://localhost:8000/Portfolio-1/  (or /Portfolio-2/)
```

An internet connection is needed at view time because fonts, icons and images are loaded from CDNs (Google Fonts, jsDelivr, cdnjs, Icons8, Unsplash).

## Deploy

Both versions are plain static files, so any static host works — GitHub Pages, Netlify, Vercel or Cloudflare Pages. Point the host at `Portfolio-1/` or `Portfolio-2/` (or the repo root to publish both).

## Project Structure

```
my-portfolio/
├── README.md
├── Portfolio-1/            # Version 1 — light theme, custom CSS
│   ├── index.html
│   ├── style.css
│   ├── mediaqueries.css
│   └── script.js
└── Portfolio-2/            # Version 2 — dark theme, Bootstrap 5
    ├── index.html
    ├── styles.css
    └── script.js
```

## Customizing

- **Content:** edit the text and image URLs directly in `index.html`
- **Portfolio-1 colors:** change the CSS variables in the `:root` block of `style.css`
- **Portfolio-2 colors:** change `--primary`, `--primary-dark` and `--bg-dark` in the `:root` block of `styles.css`
- **Social links / email / phone:** update the `href` values on the links in each `index.html`
- **Typing roles and project filters:** adjust the `roles` array and `data-category` / `data-filter` attributes in `script.js` and `index.html`

## Notes / Known Gaps

- The "Download CV" buttons and project "Code" / "Live" links are placeholders (`#` / no handler) and still need wiring up
- `Portfolio-1` shows a "typing-text" role but it is static text — the animation lives in `Portfolio-2`
- The contact form in `Portfolio-2` is front-end only; wire it to a service such as Formspree or a backend endpoint
- `Portfolio-1` includes a Google Fonts `@import` in CSS and a `preconnect` for `fonts.gstatic.com`, but no actual font `<link>` in the HTML head

## Tech Stack Summary

HTML5 · CSS3 (custom properties, flexbox, grid, keyframes, media queries) · Vanilla JavaScript (ES6+) · Bootstrap 5.3 · Font Awesome 6 · Google Fonts (Poppins, Inter) · Icons8 · IntersectionObserver API

## License

Released for personal portfolio use. Add your own license file if you plan to reuse it.
