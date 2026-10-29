/**
 * Claim4u - Client Runtime Configuration & Advertising Settings
 * -------------------------------------------------------------
 * Edit this file to update contact numbers, WhatsApp, CRM webhooks,
 * Google Ads, and Meta (Facebook/Instagram) advertising pixels.
 */
window.APP_CONFIG = {
  // Brand & Legal Identity
  brandName: 'Claim4u',
  brandTagline: 'YOUR HOUSING CLAIMS PARTNER',
  siteUrl: 'https://claim4u-uk.co',

  // Contact Details
  phoneDisplay: '07473956657',
  phoneTel: 'tel:07473956657',
  whatsappNumber: '447473956657',
  whatsappBaseUrl: 'https://wa.me/447473956657',
  email: 'info@claim4u.co.uk',
  officeHours: 'Monday – Friday: 9:00am – 6:00pm',

  // UK Postcode Validation & District Lookup API
  postcodeApiUrl: 'https://api.postcodes.io/postcodes/',

  // CRM / Webhook Endpoint (Zapier, Make, HubSpot, ActiveCampaign, etc.)
  // Automatically posts leads as JSON payload when submitted:
  webhookEndpoint: '',

  // =========================================================================
  // Advertising & Conversion Tracking Configuration (Google Ads & Meta)
  // =========================================================================
  advertising: {
    // 1. Google Ads Configuration
    googleAdsId: 'AW-18344158870',                      // Google Ads Tag ID
    googleAdsConversionLabel: 'o8fFCJqoz4kdEJbN1qtE',   // Submit Lead Form Conversion Label
    googleAdsContactLabel: 'dgzOCOGJ4pQdEJbNlqtE',      // Phone Call & WhatsApp Conversion Label
    googleAdsCurrency: 'GBP',                           // UK Sterling (£)
    googleAdsDefaultValue: 1.0,

    // 2. Google Analytics 4 (Optional - enter Measurement ID e.g. 'G-XXXXXXXXXX')
    googleAnalyticsId: '',

    // 3. Meta Pixel (Facebook & Instagram Ads - enter Pixel ID e.g. '123456789012345')
    metaPixelId: '',

    // 4. Google Tag Manager (Optional - e.g. 'GTM-XXXXXXX')
    googleTagManagerId: ''
  }
};
