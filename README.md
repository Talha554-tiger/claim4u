# Claim4u — Your Housing Claims Partner
A high-converting, professional UK legal intake platform and claims verification website customized for **Claim4u**.

---

## 🚀 Key Features & Upgrades

### 1. Brand Identity & Professional Design
- **Brand Identity:** Deep British navy (`#041c38`) and metallic gold (`#d49b20`) design system with the official Claim4u logo.
- **Trust Stats Counter Bar:** Above-the-fold social proof displaying **£4.2M+ Won**, **3,800+ Repairs Legally Enforced**, **98% Win Rate**, and **24h Legal Review**.
- **Interactive Comparison Matrix:** Side-by-side comparison ("Claiming with Claim4u vs Waiting on Landlord Alone") showing speed of action, legal backing, surveyor evaluations, and £0 financial risk.
- **Mobile Sticky Ad-Conversion Bar:** Fixed bottom bar on mobile screens with one-tap Call (`07473956657`), WhatsApp, and Claim Eligibility Check buttons to maximize conversion rates from paid traffic.

### 2. Verified Human Reviews & Success Stories
- **Real Client Case Studies:** 6 authentic, detailed reviews from UK council and housing association tenants (Birmingham, Southwark/London, Manchester, Leeds, Hackney, Newham) detailing real compensation amounts (£3,800 – £7,100+) and repair results.
- **Interactive Filter Bar:** Tenants can filter reviews by damage type: *All Reviews*, *Damp & Mould*, *Leaks & Floods*, *Heating & Boilers*, *Structural & Windows*, and *Pest Infestations*.
- **Review Rating Pill:** Trust score badge highlighting **4.9 / 5.0 Stars based on 487+ Verified UK Reviews**.
- **Schema.org Rich Snippets:** Structured JSON-LD `AggregateRating` and `Review` items allowing Google to show gold review stars in search results!

### 3. SEO & High-Authority Backlinks to Push Rankings
- **Technical On-Page SEO:**
  - Optimized title tags, meta descriptions, and keywords across all pages.
  - Canonical tags (`<link rel="canonical" href="https://claim4u-uk.co/...">`).
  - Open Graph (`og:*`) & Twitter Cards (`twitter:*`) for rich social and ad previews.
  - Semantic HTML5 heading hierarchy (`h1`, `h2`, `h3`) and localized UK geotagging.
  - Structured Data (JSON-LD) for `LegalService`, `AggregateRating`, `Review`, `FAQPage`, `BreadcrumbList`, and `Article`.
  - XML Sitemap (`sitemap.xml`) and search-engine friendly `robots.txt`.
- **Authority Outbound Backlinks & Statutory Citations:**
  - External links to high-authority UK government and legal bodies satisfying Google **E-E-A-T** (Experience, Expertise, Authoritativeness, Trustworthiness):
    - [Legislation.gov.uk - Landlord and Tenant Act 1985 (Section 11)](https://www.legislation.gov.uk/ukpga/1985/70/section/11)
    - [GOV.UK - Homes (Fitness for Human Habitation) Act 2018 & Awaab's Law](https://www.gov.uk/government/publications/homes-fitness-for-human-habitation-act-2018)
    - [The Housing Ombudsman Service](https://www.housing-ombudsman.org.uk/)
    - [Shelter UK - Housing Advice & Disrepair Rights](https://www.shelter.org.uk/)
    - [Citizens Advice - Repairs in Rented Housing](https://www.citizensadvice.org.uk/housing/repairs-in-rented-housing/)
    - [Solicitors Regulation Authority (SRA)](https://www.sra.org.uk/)
- **Internal Cross-Linking Architecture:** Contextual navigation linking damage types to the [Compensation Guide](compensation.html) and [Areas We Cover](areas.html).

### 4. Meta Ads & Google Ads Tracking Suite (`js/tracking.js`)
- **Ready for Paid Traffic:**
  - Centralized setup in `js/config.js` (`window.APP_CONFIG.advertising`).
  - Pre-configured Google Tag / Google Ads (`AW-18344158870`) with UK currency `'GBP'` (fixed from PKR).
  - Meta Pixel (Facebook & Instagram Ads) dynamic loader and event dispatcher.
- **Automatic Conversion Tracking:**
  - `lead_form_submitted` fires both Google Ads conversion and Meta `Lead` event upon wizard completion.
  - Auto-tracks every phone call (`tel:`) and WhatsApp click (`wa.me`) as a Google Ads & Meta conversion!
  - `start_wizard` event fires Meta `InitiateCheckout`.
  - `thank-you.html` fires confirmed `Lead` conversion tags.
- **UTM & Ad Attribution Engine:**
  - Automatically captures `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid` (Google Click ID), and `fbclid` (Facebook Click ID).
  - Persists parameters and attaches them to stored leads, CSV exports, and Webhook payloads.
- **Ad Campaign URL Builder:**
  - Press `Shift + L` or click **Admin Leads Console** in the footer to access the built-in **Ad Campaign URL Builder** to generate tracked Meta & Google Ads links with one click.

---

## 📁 Project Structure

```
├── index.html            # Main landing page with 4-step wizard, reviews & authority backlinks
├── compensation.html     # UK Compensation Payout Guide & Judicial College brackets
├── areas.html            # Regional coverage (London, Midlands, North, Housing Associations)
├── privacy.html          # UK GDPR & Data Protection Act 2018 compliant policy
├── thank-you.html        # Conversion confirmation page with Google Ads & Meta Pixel tracking
├── robots.txt            # Search engine crawler directives & sitemap reference
├── sitemap.xml           # Full XML sitemap for Google & Bing indexing
├── css/
│   └── styles.css        # Responsive styling, trust stats, reviews grid, mobile sticky bar
├── js/
│   ├── config.js         # Phone, WhatsApp, Webhooks, Google Ads & Meta Pixel settings
│   ├── tracking.js       # Ad tracking engine (Google Ads, Meta Pixel, UTM attribution)
│   └── main.js           # Multi-step wizard, review filters, calculator, leads admin
└── assets/               # Brand logos, photography & legal trust artwork
```

---

## 💻 Running the Site Locally

Open `index.html` directly in any web browser, or use a local HTTP server:

```bash
# Python
python -m http.server 8080

# Or Node npx serve
npx serve .
```
Navigate to `http://localhost:8080/`.
