# Al Asmat Sportswear — GitHub Pages site

A minimal Jekyll site for Al Asmat Garments & Sportswear (Sialkot, Pakistan).

Pages: Home (`index.html`), Catalogue (`catalogue.html`), Contact (`contact.html`), Request a Quote (`quote.html`).

## Editing content
- **Products** – `_data/products.json` (name, category, description, image, MOQ, fabric…). Set `"featured": true` to show a product on the home page.
- **Categories** – `_data/categories.json`
- **Company details** (phone, email, WhatsApp, address) – `_config.yml` → `company`
- **Images** – `assets/images/`
- **Styles** – `assets/css/main.css` (colors are CSS variables at the top)

## Quote form
GitHub Pages is static, so by default the form opens the visitor's email app or WhatsApp
with the request pre-filled. To receive submissions directly by email, create a free form at
https://formspree.io and paste its ID into `formspree_id` in `_config.yml`.

## Deploy to GitHub Pages
1. Push this folder to a GitHub repository.
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → `main` / root.
3. If the site is served from `https://<user>.github.io/<repo>/`, set `baseurl: "/<repo>"` in `_config.yml`.
   For a custom domain (e.g. `alasmat84.com`), add a `CNAME` file containing the domain and keep `baseurl: ""`.

## Run locally
```sh
bundle install
bundle exec jekyll serve
```
Then open http://localhost:4000.
