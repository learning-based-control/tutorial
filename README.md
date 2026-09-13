# Tutorial website

A single static page: `index.html` and `styles.css`. No build step.

Placeholder text is wrapped in `<span class="ph">…</span>` and shown with a
dashed underline. Replace the text and drop the span as each piece becomes
real. Remove the `noindex` meta tag in `index.html` once the content is final,
so search engines can index the site.

GitHub Pages serves the `gh-pages` branch. `.github/workflows/deploy.yml` mirrors
`main` onto it on every push, so only `main` is ever edited by hand.
