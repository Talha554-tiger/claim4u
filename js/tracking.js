/**
 * Claim4u - Digital Marketing & Advertising Tracking Engine
 * Supports: Meta Pixel (Facebook & Instagram Ads), Google Ads (Gtag), GA4, GTM
 * Features: Automatic UTM capture, Ad Click ID tracking (gclid, fbclid), conversion dispatching,
 * click-to-call & click-to-WhatsApp auto-tracking, and lead attribution.
 */

(function () {
  'use strict';

  // 1. Read Advertising Configuration
  const appCfg = window.APP_CONFIG || {};
  const adCfg = (appCfg.advertising) || {};

  const GOOGLE_ADS_ID = adCfg.googleAdsId || 'AW-18344158870';
  const GOOGLE_ADS_LEAD_LABEL = adCfg.googleAdsConversionLabel || 'o8fFCJqoz4kdEJbN1qtE';
  const GOOGLE_ADS_CONTACT_LABEL = adCfg.googleAdsContactLabel || 'dgzOCOGJ4pQdEJbNlqtE';
  const GOOGLE_ADS_CURRENCY = adCfg.googleAdsCurrency || 'GBP';
  const GOOGLE_ANALYTICS_ID = adCfg.googleAnalyticsId || '';
  const META_PIXEL_ID = adCfg.metaPixelId || '';
  const GTM_ID = adCfg.googleTagManagerId || '';

  // 2. Capture and Persist UTM Parameters & Ad Click IDs
  function captureCampaignParameters() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const trackingKeys = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'gclid',     // Google Ads Click ID
        'fbclid',    // Meta / Facebook Click ID
        'msclkid',   // Microsoft Ads Click ID
        'ttclid'     // TikTok Ads Click ID
      ];

      let captured = {};
      let hasParams = false;

      trackingKeys.forEach(key => {
        if (urlParams.has(key)) {
          captured[key] = urlParams.get(key);
          hasParams = true;
        }
      });

      if (hasParams) {
        // Save current session source
        sessionStorage.setItem('claim4u_ad_attribution', JSON.stringify(captured));
        // Also keep first-touch source in localStorage if not already set
        if (!localStorage.getItem('claim4u_first_touch_attribution')) {
          localStorage.setItem('claim4u_first_touch_attribution', JSON.stringify({
            ...captured,
            first_touch_date: new Date().toISOString(),
            first_touch_page: window.location.pathname
          }));
        }
      }
    } catch (e) {
      console.warn('[Claim4u Ads] Failed to capture URL parameters:', e);
    }
  }

  // Retrieve current attribution object
  window.getClaimAttribution = function () {
    try {
      const sessionAttr = JSON.parse(sessionStorage.getItem('claim4u_ad_attribution') || '{}');
      const firstTouch = JSON.parse(localStorage.getItem('claim4u_first_touch_attribution') || '{}');
      return {
        source: sessionAttr.utm_source || firstTouch.utm_source || (document.referrer ? new URL(document.referrer).hostname : 'Direct'),
        medium: sessionAttr.utm_medium || firstTouch.utm_medium || 'organic',
        campaign: sessionAttr.utm_campaign || firstTouch.utm_campaign || 'default',
        content: sessionAttr.utm_content || firstTouch.utm_content || '',
        term: sessionAttr.utm_term || firstTouch.utm_term || '',
        gclid: sessionAttr.gclid || firstTouch.gclid || '',
        fbclid: sessionAttr.fbclid || firstTouch.fbclid || '',
        channel: (sessionAttr.gclid || sessionAttr.utm_source === 'google') ? 'Google Ads' :
                 (sessionAttr.fbclid || sessionAttr.utm_source === 'meta' || sessionAttr.utm_source === 'facebook' || sessionAttr.utm_source === 'instagram') ? 'Meta Ads' : 'Direct / Organic'
      };
    } catch (e) {
      return { source: 'Direct', medium: 'none', campaign: 'none', channel: 'Direct' };
    }
  };

  // 3. Initialize Meta Pixel (Facebook / Instagram Ads)
  function initMetaPixel() {
    if (!META_PIXEL_ID || META_PIXEL_ID === 'YOUR_META_PIXEL_ID') {
      // Create stub so calls won't fail if ID is added later
      if (!window.fbq) {
        window.fbq = function () {
          window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
        };
        window.fbq.push = window.fbq;
        window.fbq.loaded = true;
        window.fbq.version = '2.0';
        window.fbq.queue = [];
      }
      return;
    }

    if (!window.fbq) {
      /* Facebook Pixel Code */
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

      window.fbq('init', META_PIXEL_ID);
      window.fbq('track', 'PageView');
    }
  }

  // 4. Initialize Google Analytics 4 (if configured)
  function initGoogleAnalytics() {
    if (GOOGLE_ANALYTICS_ID && !window.ga4Loaded) {
      window.ga4Loaded = true;
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag === 'function') {
        window.gtag('config', GOOGLE_ANALYTICS_ID);
      }
    }
  }

  // 5. Centralized Event Dispatcher (Google Ads + Meta Pixel + GA4)
  window.trackAdConversion = function (eventType, customParams = {}) {
    const attribution = window.getClaimAttribution();
    const eventPayload = {
      ...attribution,
      ...customParams,
      timestamp: new Date().toISOString()
    };

    console.log(`[Claim4u Ads Tracking] Event: ${eventType}`, eventPayload);

    // Track on Google Tag (gtag)
    if (typeof window.gtag === 'function') {
      if (eventType === 'lead_form_submitted') {
        // Send Google Ads Form Lead Conversion
        window.gtag('event', 'conversion', {
          send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}`,
          value: customParams.value || 1.0,
          currency: GOOGLE_ADS_CURRENCY
        });
        window.gtag('event', 'generate_lead', {
          event_category: 'housing_claim',
          event_label: customParams.landlord || 'Council / Housing Association'
        });
      } else if (eventType === 'contact_click') {
        // Send Google Ads Phone / WhatsApp Click Conversion
        window.gtag('event', 'conversion', {
          send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONTACT_LABEL}`,
          event_category: 'engagement',
          event_label: customParams.method || 'Phone / WhatsApp'
        });
        window.gtag('event', 'contact', {
          method: customParams.method || 'Phone / WhatsApp'
        });
      } else if (eventType === 'start_wizard') {
        window.gtag('event', 'begin_checkout', {
          event_category: 'wizard',
          event_label: 'Step 1 Landlord'
        });
      }
    }

    // Track on Meta Pixel (fbq)
    if (typeof window.fbq === 'function') {
      try {
        if (eventType === 'lead_form_submitted') {
          window.fbq('track', 'Lead', {
            content_name: 'Housing Disrepair Claim Check',
            content_category: customParams.landlord_type || 'Council/HA',
            currency: 'GBP',
            value: customParams.value || 1.0
          });
        } else if (eventType === 'contact_click') {
          window.fbq('track', 'Contact', {
            content_name: customParams.method || 'Phone / WhatsApp Click',
            currency: 'GBP'
          });
        } else if (eventType === 'start_wizard') {
          window.fbq('track', 'InitiateCheckout', {
            content_name: 'Started 60-Second Eligibility Check'
          });
        } else if (eventType === 'calculator_used') {
          window.fbq('track', 'ViewContent', {
            content_name: 'Compensation Calculator',
            value: customParams.estimatedValue || 6000,
            currency: 'GBP'
          });
        }
      } catch (err) {
        console.warn('[Claim4u Meta Pixel] Dispatch error:', err);
      }
    }

    // Custom browser DOM event for other listeners
    window.dispatchEvent(new CustomEvent('claim4u_ad_event', {
      detail: { type: eventType, data: eventPayload }
    }));
  };

  // 6. Automatic Click-to-Call & Click-to-WhatsApp Conversion Listeners
  function attachAutoTrackingListeners() {
    document.addEventListener('click', function (e) {
      const target = e.target.closest('a');
      if (!target) return;

      const href = target.getAttribute('href') || '';

      // Phone call clicks
      if (href.startsWith('tel:')) {
        window.trackAdConversion('contact_click', {
          method: 'Telephone',
          phoneNumber: href.replace('tel:', ''),
          linkText: target.textContent.trim()
        });
      }

      // WhatsApp clicks
      if (href.includes('wa.me') || href.includes('whatsapp.com')) {
        window.trackAdConversion('contact_click', {
          method: 'WhatsApp',
          destination: href,
          linkText: target.textContent.trim()
        });
      }

      // Wizard start buttons
      if (href === '#claim' || target.id === 'calcApplyBtn' || target.classList.contains('header-cta-btn')) {
        window.trackAdConversion('start_wizard', {
          trigger: target.id || 'CTA Button'
        });
      }
    });
  }

  // Execute on load
  captureCampaignParameters();
  initMetaPixel();
  initGoogleAnalytics();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachAutoTrackingListeners);
  } else {
    attachAutoTrackingListeners();
  }

})();

