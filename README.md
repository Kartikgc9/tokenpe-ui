# TokenPe landing page

A static, dependency-free site for TokenPe: crypto payments and global payouts for business.
Plain HTML, CSS, and JavaScript. No framework and no package install.

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | Home page markup, section by section |
| `legal/` | Terms, privacy, cookie, AML, acceptable use, risk, complaints and gaming operator pages |
| `css/home.css` | Home page styles: white theme, frosted pill nav, cards, pinned developer story, responsive and reduced-motion rules |
| `css/styles.css` | Styles for the legal pages |
| `js/app.js` | Content data, rendering, menus, forms, modals, drawer, networks explorer, FAQ, cookie consent |
| `js/motion.js` | Hero entrance, word-by-word headline reveal, and the scroll-pinned developer story |
| `js/flow.js` | Looping product demos (hero phone, payout widget, bento panels, webhook events) |
| `js/globe.js` | Rotating cobe globe beside the supported networks list (port of the 21st.dev Globe component) |
| `assets/rampay/` | Engraving assets from the RampPay brand kit (skyline, institution, guilloche, filigree, frieze, vine, Medusa, meander), used as blue masks in the hero, the compliance card and the closing note |
| `js/vendor/` | Vendored [cobe](https://github.com/shuding/cobe) 0.6.5 and its dependency phenomenon (MIT) |
| `js/footer.js` | Footer with the glyph wordmark, shutter letter, and product-updates form (also used on legal pages) |
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

The sales / Get started, Fiat-to-Crypto waitlist and footer sign-up forms post to Netlify Forms
(`sales`, `waitlist`, `newsletter`; static copies are at the bottom of `index.html`). Turn on form
detection and email notifications in the Netlify dashboard. Turn off the "Powered by Netlify" badge
under Project configuration → General.
