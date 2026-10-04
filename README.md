# Claim4u — Your Housing Claims Partner
A high-converting, premium website clone and legal intake platform inspired by [HomeClaim UK](https://homeclaimuk.co.uk/), customized for **Claim4u**.

---

## 🚀 Key Features & Customizations

1. **Brand Identity & Logo:**
   - Branded as **Claim4u — YOUR HOUSING CLAIMS PARTNER**.
   - Incorporates the official Claim4u logo provided (`assets/claim4u-logo.png`).
   - Deep royal UK navy (`#041c38`) and metallic gold (`#d49b20`) color palette.

2. **Direct Contact Integration:**
   - **Dedicated Telephone Number:** `07473956657` (`tel:07473956657`) linked in top bar, sticky header, hero, call-to-action cards, and footer.
   - **WhatsApp API:** Click-to-Chat linked with UK international format (`+447473956657`) via `https://wa.me/447473956657`.
   - **Interactive WhatsApp Chat Widget:** Floating pulsing widget with quick-reply inquiry chips and direct message dispatch.

3. **Interactive 4-Step Claim Eligibility Wizard:**
   - **Step 1 (Landlord):** Local Council vs Housing Association selection + Landlord Name with autocomplete.
   - **Step 2 (Damage):** Multi-select chips for Damp & Mould, Structural Cracks, Infestations, Water Leaks, Broken Boilers, etc., plus repair cost band dropdown.
   - **Step 3 (Details & Photos):** Description textarea + real photo uploader supporting up to 8 images with live thumbnail preview and deletion.
   - **Step 4 (Contact):** Name, Email, UK phone number validation, Postcode, and Consent checkbox.
   - **Fast-Track WhatsApp Handoff:** On submission, generates a pre-formatted WhatsApp claim summary to message `07473956657` directly with one tap.

4. **Necessary APIs Included:**
   - **WhatsApp Click-to-Chat & Message API:** Pre-fills claim details into WhatsApp.
   - **UK Postcode Lookup API:** Free real-time validation and administrative district lookup via `api.postcodes.io`.
   - **Leads Database & Export API:** Stores leads in browser storage, with a Lead Management console (press `Shift + L` or click "Admin Leads Console" in the footer) to view entries and export them to CSV.
   - **Webhook API Support:** Configurable endpoint to forward submissions to CRM/Zapier/Make.

5. **Pages Included:**
   - [index.html](index.html) — Main landing page with full wizard, calculator, FAQs, and testimonials.
   - [compensation.html](compensation.html) — Comprehensive UK Compensation Guide & Payout Bands.
   - [areas.html](areas.html) — UK Regional Coverage Guide (London, Midlands, North, Housing Associations).
   - [privacy.html](privacy.html) — Full UK GDPR compliant Privacy Policy.

---

## 💻 Running the Site Locally

You can open [index.html](index.html) directly in any web browser (Chrome, Edge, Firefox, Safari) with zero setup or build steps required.

Alternatively, use any local HTTP server:
```bash
# Python
python -m http.server 8080

# Or Node npx serve
npx serve .
```
And navigate to `http://localhost:8080/`.
