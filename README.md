# Guidance Funding — Static HTML Site

Complete static website for guidancefunding.com. Designed as an OnDeck/Bluevine-style fintech site with navy + orange palette.

## Deployment

**Upload everything** (preserve folder structure) to your web root:

- On cPanel/shared hosting: upload to `public_html/`
- On Netlify/Vercel/Cloudflare Pages: drag the whole folder
- On Nginx/Apache VPS: copy to your document root

That's it. No build step, no dependencies, no backend required.

## File structure

```
/
├── index.html              Homepage
├── apply.html              Full application form
├── products.html           All products overview
├── about.html              About page
├── contact.html            Contact page
├── sitemap.xml             For Google Search Console
├── robots.txt              Allows all crawlers
├── css/style.css           All styles (design system)
├── js/main.js              Mobile menu, FAQ, form validation
├── products/
│   ├── term-loan.html
│   ├── equipment-financing.html
│   ├── merchant-cash-advance.html
│   ├── sba-loans.html
│   ├── factoring.html
│   ├── po-financing.html
│   ├── mortgage-financing.html
│   ├── credit-card-processing.html
│   ├── payroll-hr.html
│   └── credit-education.html
└── legal/
    ├── terms.html          Template — have a lawyer review before launch
    └── privacy.html        Template — have a lawyer review before launch
```

## Important — before launch

1. **Legal pages are templates.** Have a lawyer review `legal/terms.html` and `legal/privacy.html` before publishing. The TCPA consent language on the apply form especially.

2. **Form submission is `mailto:`.** The apply and contact forms submit via email client. For production, replace the `action="mailto:..."` on each form with one of:
   - **Formspree:** `https://formspree.io/f/YOUR_FORM_ID` (free tier exists)
   - **Basin:** `https://usebasin.com/f/YOUR_FORM_ID`
   - **Your own backend** (PHP, Netlify Forms, etc.)

   Forms to update: `apply.html`, `contact.html`

3. **Google Search Console:** after launch, submit `sitemap.xml` in GSC and verify ownership.

4. **Open Graph image:** homepage references an `og:image` — you may want to add a 1200x630 branded image and update the meta tag.

5. **Favicon:** add your own `favicon.ico` at root and reference it in the `<head>` of each page:
   ```html
   <link rel="icon" type="image/x-icon" href="/favicon.ico">
   ```

## Common edits

**Change the phone number:** global find-and-replace `(213) 522-7765` and `2135227765`.

**Change the email:** global find-and-replace `admin@guidancefunding.com`.

**Change brand color:** edit `css/style.css`, lines near the top under `:root` — `--orange-500` is the main accent.

**Change the stats (5.9B, 12000, 100, 24hr):** appear on `index.html` in the `.stats-bar` section and in `about.html` in the `.info-grid`.

## SEO features built in

- FinancialService + FAQPage JSON-LD schema on homepage
- FinancialProduct + FAQPage schema on every product page
- Meta titles, descriptions, and canonical tags on every page
- Semantic HTML (header/nav/main/footer/section)
- Sitemap.xml with priorities
- robots.txt allowing all crawlers
- Mobile-responsive (down to 380px)
- Fast: no frameworks, no build step, inline SVG icons

## Tech stack

Pure HTML + CSS + vanilla JavaScript. Google Fonts (Inter + Plus Jakarta Sans). That's it.

---

Built for: guidancefunding.com
Phone: (213) 522-7765
Email: admin@guidancefunding.com
