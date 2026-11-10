# mewfinance-ui

Web app for mewfinance.com.

- Domain: mewfinance.com
- Live branch: master
- Ships via: deployer key `mewfinance`
- Local dev: `npm ci --ignore-scripts && npm run dev`

## Design rules

- No borders. The Mew theme separates things with background and spacing, not lines: no
  `border: 1px solid …`, no Tailwind `border`/`border-*` classes on cards, panels, modals,
  images, chips or dividers, and no border-color hover states. Use `var(--forms-bg)` for a
  surface, spacing between items, and a `translateY(-2px)` lift or a colour change on the
  title for hover.
- No darker boxes nested inside a form or card. Content inside a `var(--forms-bg)` surface
  sits directly on it, grouped by spacing and headings.
- `border` is fine only as a drawing trick that does not read as a border: spinner rings,
  CSS arrow triangles, scrollbar thumb padding, a status colour stripe.
