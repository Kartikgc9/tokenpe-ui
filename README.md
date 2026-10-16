# TokenPe landing page

A static, dependency-free landing page for TokenPe: on-ramps, off-ramps, checkout, and payouts.
Plain HTML, CSS, and JavaScript. No framework and no package install.

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | Page markup, section by section |
| `css/styles.css` | All styles, including responsive and reduced-motion rules |
| `js/hero.js` | Hero intro sequence (horizon rim wipe, copy fade-in) |
| `js/app.js` | Content data, rendering, menus, modals, drawer, tabs, accordions |
| `js/sim.js` | "Customer pays → treasury → withdraw" payment simulation |
| `js/flow.js` | Looping product demos (widget phone, bento cards, payouts, industries) |
| `js/branching.js` | "Three ways onto the rail" branching chat demo |
| `js/footer.js` | Footer with the glyph wordmark, shutter letter, and newsletter form |
| `21stcomps/` | Original React component references the vanilla JS was ported from (not deployed) |
| `scripts/build.mjs` | Copies the public files into `dist/` for deployment |

## Run locally

Any static server works:

```sh
npx http-server -p 5173 -c-1
```

Then open http://localhost:5173.

## Deploy

Netlify builds from `netlify.toml`: `node scripts/build.mjs`, publishing `dist/`.
Pushing to `main` on GitHub triggers a production deploy.
