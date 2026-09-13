# Tutorial website

A single static page: `index.html` and `styles.css`. No build step.

Placeholder text is wrapped in `<span class="ph">…</span>` and shown with a
dashed underline. Replace the text and drop the span as each piece becomes
real. Remove the `noindex` meta tag in `index.html` once the content is final,
so search engines can index the site.

Deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to
`main`.
