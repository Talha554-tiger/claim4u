/**
 * Claim4u - Your Housing Claims Partner
 * Main Application & API Integration Script
 * Phone & WhatsApp: 07473956657 (+447473956657)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Brand & Contact Configuration (merged with window.APP_CONFIG if defined)
  const appCfg = window.APP_CONFIG || {};
  const CONFIG = {
    brandName: appCfg.brandName || 'Claim4u',
    brandTagline: appCfg.brandTagline || 'YOUR HOUSING CLAIMS PARTNER',
    phoneDisplay: appCfg.phoneDisplay || '07473956657',
    phoneTel: appCfg.phoneTel || 'tel:07473956657',
    whatsappNumber: appCfg.whatsappNumber || '447473956657',
    whatsappBaseUrl: appCfg.whatsappBaseUrl || 'https://wa.me/447473956657',
    email: appCfg.email || 'info@claim4u.co.uk',
    postcodeApiUrl: appCfg.postcodeApiUrl || 'https://api.postcodes.io/postcodes/',
    webhookEndpoint: appCfg.webhookEndpoint || localStorage.getItem('claim4u_webhook_url') || ''
  };

  // State Management
  const claimData = {
    landlord_type: '',
    landlord_name: '',
    damage_types: [],
    estimated_cost_band: '',
    description: '',
    photos: [],
    full_name: '',
    email: '',
    phone: '',
    postcode: '',
    consent: false,
    submitted_at: null
  };

  let currentStep = 0;
  const totalSteps = 4;
  const stepTitles = [
    'Your landlord',
    'The damage',
    'Details & photos',
    'Your contact details'
  ];

  // DOM Elements
  const wizardCard = document.getElementById('claimWizard');
  const wizardProgressTitle = document.getElementById('wizardProgressTitle');
  const wizardStepNumber = document.getElementById('wizardStepNumber');
  const wizardProgressBar = document.getElementById('wizardProgressBar');
  const wizardForm = document.getElementById('wizardForm');
  const btnNext = document.getElementById('btnNext');
  const btnPrev = document.getElementById('btnPrev');
  const wizardSuccess = document.getElementById('wizardSuccess');

  // Common England & Wales Landlords for Autocomplete / Quick Pick
  const commonLandlords = [
    'Lambeth Council', 'Southwark Council', 'Peabody', 'Clarion Housing',
    'Birmingham City Council', 'Manchester City Council', 'Leeds City Council',
    'Cardiff Council', 'Swansea Council', 'Newport City Council', 'Wrexham County Borough',
    'Pobl Group', 'Wales & West Housing', 'Hafod Housing', 'Linc Cymru',
    'Hyde Housing', 'Places for People', 'Sanctuary Housing', 'L&Q Housing',
    'Newham Council', 'Hackney Council', 'Bristol City Council', 'Liverpool City Council',
    'Nottingham City Council', 'Sheffield City Council', 'Barking & Dagenham Council',
    'Salford City Council', 'Newcastle City Council', 'Leicester City Council'
  ];

  /* ==========================================================================
     1. Multi-Step Wizard Engine
     ========================================================================== */
  function updateWizardUI() {
    // Update step visibility
    for (let i = 0; i < totalSteps; i++) {
      const stepEl = document.getElementById(`step-${i}`);
      if (stepEl) {
        if (i === currentStep) {
          stepEl.classList.add('active');
        } else {
          stepEl.classList.remove('active');
        }
      }
    }

    // Update progress header
    if (wizardProgressTitle) wizardProgressTitle.textContent = stepTitles[currentStep];
    if (wizardStepNumber) wizardStepNumber.textContent = `Step ${currentStep + 1} of ${totalSteps}`;
    
    // Update progress bar
    if (wizardProgressBar) {
      const pct = Math.round(((currentStep + 1) / totalSteps) * 100);
      wizardProgressBar.style.width = `${pct}%`;
    }

    // Update Back button
    if (btnPrev) {
      if (currentStep === 0) {
        btnPrev.style.display = 'none';
      } else {
        btnPrev.style.display = 'inline-flex';
      }
    }

    // Update Next / Submit button text
    if (btnNext) {
      if (currentStep === totalSteps - 1) {
        btnNext.innerHTML = 'Check if I qualify →';
      } else {
        btnNext.innerHTML = 'Continue →';
      }
    }

    // Auto-scroll into view if on mobile
    if (currentStep > 0 && wizardCard) {
      const rect = wizardCard.getBoundingClientRect();
      if (rect.top < 0 || rect.top > window.innerHeight * 0.4) {
        wizardCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  // Step 1: Landlord Type Selection
  const landlordTypeBtns = document.querySelectorAll('.landlord-type-btn');
  landlordTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      landlordTypeBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      claimData.landlord_type = btn.dataset.type;
      clearFieldError('landlord_type');
    });
  });

  // Step 1: Open Text Input for Council / Housing Association Name (Tenant writes directly)
  const landlordInput = document.getElementById('landlord_name');
  if (landlordInput) {
    // Attach autocomplete datalist populated with England & Wales councils & associations
    if (!document.getElementById('landlord-suggestions')) {
      const datalist = document.createElement('datalist');
      datalist.id = 'landlord-suggestions';
      commonLandlords.forEach(landlord => {
        const opt = document.createElement('option');
        opt.value = landlord;
        datalist.appendChild(opt);
      });
      document.body.appendChild(datalist);
      landlordInput.setAttribute('list', 'landlord-suggestions');
    }

    landlordInput.addEventListener('input', (e) => {
      claimData.landlord_name = e.target.value;
      clearFieldError('landlord_name');
    });
  }

  // Step 2: Damage Types Multi-select Chips
  const damageChips = document.querySelectorAll('.damage-chip');
  damageChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.dataset.damage;
      chip.classList.toggle('selected');
      
      if (chip.classList.contains('selected')) {
        if (!claimData.damage_types.includes(val)) {
          claimData.damage_types.push(val);
        }
      } else {
        claimData.damage_types = claimData.damage_types.filter(item => item !== val);
      }
      clearFieldError('damage_types');
    });
  });

  // Step 2: Estimated Cost Band
  const costBandSelect = document.getElementById('estimated_cost_band');
  if (costBandSelect) {
    costBandSelect.addEventListener('change', (e) => {
      claimData.estimated_cost_band = e.target.value;
      clearFieldError('estimated_cost_band');
    });
  }

  // Step 3: Damage Description
  const descTextarea = document.getElementById('description');
  if (descTextarea) {
    descTextarea.addEventListener('input', (e) => {
      claimData.description = e.target.value;
    });
  }

  // Step 3: Photo Upload with Live Thumbnail Preview
  const photoInput = document.getElementById('photoInput');
  const photoPreviewContainer = document.getElementById('photoPreviewContainer');
  const photoUploadText = document.getElementById('photoUploadText');

  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      const remainingSlots = 8 - claimData.photos.length;
      const filesToProcess = files.slice(0, remainingSlots);

      filesToProcess.forEach(file => {
        if (!file.type.startsWith('image/')) return;
        if (file.size > 8 * 1024 * 1024) {
          showToast('Image exceeds 8MB limit', 'warning');
          return;
        }

        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          claimData.photos.push({
            name: file.name,
            dataUrl: loadEvt.target.result,
            size: file.size
          });
          renderPhotoThumbnails();
        };
        reader.readAsDataURL(file);
      });
    });
  }

  function renderPhotoThumbnails() {
    if (!photoPreviewContainer) return;
    photoPreviewContainer.innerHTML = '';

    claimData.photos.forEach((photo, idx) => {
      const thumb = document.createElement('div');
      thumb.className = 'photo-thumb';
      thumb.innerHTML = `
        <img src="${photo.dataUrl}" alt="Damage upload ${idx + 1}" />
        <button type="button" class="photo-thumb-remove" data-index="${idx}" title="Remove photo">&times;</button>
      `;
      photoPreviewContainer.appendChild(thumb);
    });

    // Attach remove handlers
    const removeBtns = photoPreviewContainer.querySelectorAll('.photo-thumb-remove');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const removeIndex = parseInt(btn.dataset.index, 10);
        claimData.photos.splice(removeIndex, 1);
        renderPhotoThumbnails();
      });
    });

    if (photoUploadText) {
      if (claimData.photos.length > 0) {
        photoUploadText.textContent = `${claimData.photos.length} photo${claimData.photos.length === 1 ? '' : 's'} added (Max 8)`;
      } else {
        photoUploadText.textContent = 'Tap to choose photos (JPG/PNG, max 8MB each)';
      }
    }
  }

  // Step 4: Contact Details Inputs
  ['full_name', 'email', 'phone', 'postcode'].forEach(fieldId => {
    const el = document.getElementById(fieldId);
    if (el) {
      el.addEventListener('input', (e) => {
        claimData[fieldId] = e.target.value.trim();
        clearFieldError(fieldId);

        // Instant validation for UK Postcode API
        if (fieldId === 'postcode' && claimData.postcode.length >= 5) {
          verifyUkPostcode(claimData.postcode);
        }
      });
    }
  });

  // Step 4: Consent Checkbox
  const consentCheckbox = document.getElementById('consent');
  if (consentCheckbox) {
    consentCheckbox.addEventListener('change', (e) => {
      claimData.consent = e.target.checked;
      clearFieldError('consent');
    });
  }

  /* ==========================================================================
     2. Form Validation Engine
     ========================================================================== */
  function validateCurrentStep() {
    let isValid = true;

    if (currentStep === 0) {
      if (!claimData.landlord_type) {
        setFieldError('landlord_type', 'Please select whether your landlord is a Council or Housing Association');
        isValid = false;
      }
      if (!claimData.landlord_name || claimData.landlord_name.length < 2) {
        setFieldError('landlord_name', 'Please enter your council or housing association name');
        isValid = false;
      }
    } else if (currentStep === 1) {
      if (claimData.damage_types.length === 0) {
        setFieldError('damage_types', 'Please select at least one type of damage');
        isValid = false;
      }
      if (!claimData.estimated_cost_band) {
        setFieldError('estimated_cost_band', 'Please select an estimated cost band');
        isValid = false;
      }
    } else if (currentStep === 2) {
      // Step 3 is optional (description & photos)
      isValid = true;
    } else if (currentStep === 3) {
      if (!claimData.full_name || claimData.full_name.length < 2) {
        setFieldError('full_name', 'Please enter your full name');
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!claimData.email || !emailRegex.test(claimData.email)) {
        setFieldError('email', 'Please enter a valid email address');
        isValid = false;
      }

      const cleanPhone = claimData.phone.replace(/[\s\-\(\)]/g, '');
      const phoneRegex = /^(?:(?:\+44)|(?:0))(?:\d{9,11})$/;
      if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
        setFieldError('phone', 'Please enter a valid UK contact number (e.g. 07473956657)');
        isValid = false;
      }

      if (!claimData.consent) {
        setFieldError('consent', 'You must agree to be contacted to proceed');
        isValid = false;
      }
    }

    return isValid;
  }

  function setFieldError(fieldId, message) {
    const errorEl = document.getElementById(`error-${fieldId}`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'flex';
    }
    const inputEl = document.getElementById(fieldId);
    if (inputEl) inputEl.classList.add('error');
  }

  function clearFieldError(fieldId) {
    const errorEl = document.getElementById(`error-${fieldId}`);
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
    const inputEl = document.getElementById(fieldId);
    if (inputEl) inputEl.classList.remove('error');
  }

  // Wizard Navigation Triggers
  if (btnNext) {
    btnNext.addEventListener('click', (e) => {
      e.preventDefault();
      if (!validateCurrentStep()) return;

      if (currentStep < totalSteps - 1) {
        currentStep++;
        updateWizardUI();
      } else {
        submitClaim();
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentStep > 0) {
        currentStep--;
        updateWizardUI();
      }
    });
  }

  /* ==========================================================================
     3. UK Postcode Validation API Integration
     ========================================================================== */
  let postcodeDebounceTimeout;
  function verifyUkPostcode(postcode) {
    clearTimeout(postcodeDebounceTimeout);
    const cleanPostcode = postcode.trim().replace(/\s+/g, '');
    const feedbackEl = document.getElementById('postcode-lookup-feedback');

    postcodeDebounceTimeout = setTimeout(async () => {
      try {
        const response = await fetch(`${CONFIG.postcodeApiUrl}${encodeURIComponent(cleanPostcode)}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.result) {
            const district = data.result.admin_district || data.result.parish || 'UK Area';
            if (feedbackEl) {
              feedbackEl.innerHTML = `<span style="color: #10b981;">✓ Valid UK Postcode: ${district}</span>`;
            }
          }
        } else {
          if (feedbackEl) feedbackEl.innerHTML = '';
        }
      } catch (err) {
        console.warn('Postcode lookup service non-blocking warning:', err);
      }
    }, 450);
  }

  /* ==========================================================================
     4. Claim Submission, WhatsApp API & Leads Storage
     ========================================================================== */
  async function submitClaim() {
    btnNext.disabled = true;
    btnNext.innerHTML = `
      <svg class="animate-spin" style="width:18px;height:18px;animation:spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
      </svg> Submitting Claim...
    `;

    claimData.submitted_at = new Date().toISOString();

    // 1. Gather Advertising & Campaign Attribution
    const attribution = (typeof window.getClaimAttribution === 'function') 
      ? window.getClaimAttribution() 
      : { channel: 'Direct / Organic', source: 'Direct', campaign: 'None' };

    const leadRecord = {
      id: 'CLM-' + Date.now().toString().slice(-6),
      ...claimData,
      attribution: attribution,
      ad_channel: attribution.channel || 'Direct',
      ad_source: attribution.source || 'Direct',
      ad_campaign: attribution.campaign || 'None',
      gclid: attribution.gclid || '',
      fbclid: attribution.fbclid || '',
      status: 'New'
    };

    // Save lead to LocalStorage Leads Database
    try {
      const existingLeads = JSON.parse(localStorage.getItem('claim4u_leads') || '[]');
      existingLeads.unshift(leadRecord);
      localStorage.setItem('claim4u_leads', JSON.stringify(existingLeads));
      localStorage.setItem('claim4u_last_lead', JSON.stringify(leadRecord));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    // 2. Dispatch Advertising Conversions (Google Ads + Meta Pixel + GA4)
    try {
      window.dispatchEvent(new CustomEvent('claim4u_lead_submitted', { detail: leadRecord }));
      if (typeof window.trackAdConversion === 'function') {
        window.trackAdConversion('lead_form_submitted', {
          landlord_type: claimData.landlord_type,
          landlord: claimData.landlord_name,
          value: 1.0,
          currency: 'GBP'
        });
      } else if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-18344158870/o8fFCJqoz4kdEJbN1qtE',
          'value': 1.0,
          'currency': 'GBP'
        });
      }
    } catch (e) {
      console.warn('Analytics / Advertising conversion trigger error:', e);
    }

    // 3. Optional Webhook dispatch (Zapier / CRM / Make / Email API)
    if (CONFIG.webhookEndpoint) {
      try {
        fetch(CONFIG.webhookEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadRecord)
        }).catch(err => console.warn('Webhook post:', err));
      } catch (e) {}
    }

    // 4. Generate Pre-formatted WhatsApp Message for instant handoff
    const damageLabels = claimData.damage_types.join(', ');
    const waText = encodeURIComponent(
      `*New Housing Disrepair Claim Inquiry*\n` +
      `--------------------------------\n` +
      `*Name:* ${claimData.full_name}\n` +
      `*Phone:* ${claimData.phone}\n` +
      `*Landlord:* ${claimData.landlord_name} (${claimData.landlord_type})\n` +
      `*Damage:* ${damageLabels}\n` +
      `*Estimated Cost:* ${claimData.estimated_cost_band}\n` +
      `*Postcode:* ${claimData.postcode || 'N/A'}\n` +
      `*Details:* ${claimData.description || 'No additional note'}\n\n` +
      `Please review my case with a Claim4u housing solicitor.`
    );
    const directWaUrl = `${CONFIG.whatsappBaseUrl}?text=${waText}`;

    // 5. Store lead for Thank-You page personalization & Render Success Screen
    try {
      sessionStorage.setItem('claim4u_submitted_lead', JSON.stringify({
        fullName: claimData.full_name,
        phone: claimData.phone,
        waUrl: directWaUrl
      }));
    } catch (e) {}

    setTimeout(() => {
      wizardForm.style.display = 'none';
      if (wizardSuccess) {
        wizardSuccess.innerHTML = `
          <div class="wizard-success-card">
            <div class="success-icon-badge">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <h3 class="success-title">Claim Check Received!</h3>
            <p class="success-desc">
              Thank you <strong>${escapeHtml(claimData.full_name)}</strong>. Redirecting you to confirmation...
            </p>
          </div>
        `;
        wizardSuccess.style.display = 'block';
      }
      showToast('Eligibility check submitted successfully!', 'success');
      
      // Redirect to Google Ads Conversion Page
      setTimeout(() => {
        window.location.href = 'thank-you.html';
      }, 400);
    }, 600);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  /* ==========================================================================
     5. Interactive Compensation Calculator
     ========================================================================== */
  const sliderDuration = document.getElementById('calcDuration');
  const sliderRent = document.getElementById('calcRent');
  const sliderSeverity = document.getElementById('calcSeverity');
  const calcOutputDuration = document.getElementById('calcOutputDuration');
  const calcOutputRent = document.getElementById('calcOutputRent');
  const calcOutputSeverity = document.getElementById('calcOutputSeverity');
  const calcEstimatedPayout = document.getElementById('calcEstimatedPayout');
  const calcApplyBtn = document.getElementById('calcApplyBtn');

  function calculateCompensation() {
    if (!sliderDuration || !sliderRent || !sliderSeverity || !calcEstimatedPayout) return;

    const months = parseInt(sliderDuration.value, 10);
    const weeklyRent = parseInt(sliderRent.value, 10);
    const severityIdx = parseInt(sliderSeverity.value, 10); // 1 = Low, 2 = Medium, 3 = Severe

    // Text descriptions
    if (calcOutputDuration) {
      calcOutputDuration.textContent = months < 12 ? `${months} months` : `${(months / 12).toFixed(1)} years`;
    }
    if (calcOutputRent) {
      calcOutputRent.textContent = `£${weeklyRent}/week`;
    }
    if (calcOutputSeverity) {
      const severityNames = ['Minor disrepair', 'Moderate disrepair', 'Severe / Multiple rooms + Health impact'];
      calcOutputSeverity.textContent = severityNames[severityIdx - 1];
    }

    // Default target: £6,000 for standard tenancy (12 months, £160/wk, moderate disrepair)
    if (months === 12 && weeklyRent === 160 && severityIdx === 2) {
      calcEstimatedPayout.textContent = '£6,000';
      return;
    }

    // Dynamic compensation calculation anchored to £6,000 baseline
    const durationMultiplier = months / 12;
    const rentMultiplier = weeklyRent / 160;
    const severityMultiplier = severityIdx === 1 ? 0.7 : severityIdx === 2 ? 1.0 : 1.45;

    const baseAmount = 6000;
    const estimatedTotal = Math.round((baseAmount * (0.45 * durationMultiplier + 0.3 * rentMultiplier + 0.25 * severityMultiplier)) / 100) * 100;
    const finalAmount = Math.max(1500, estimatedTotal);

    calcEstimatedPayout.textContent = `£${finalAmount.toLocaleString()}`;
  }

  if (sliderDuration) sliderDuration.addEventListener('input', calculateCompensation);
  if (sliderRent) sliderRent.addEventListener('input', calculateCompensation);
  if (sliderSeverity) sliderSeverity.addEventListener('input', calculateCompensation);

  if (calcApplyBtn) {
    calcApplyBtn.addEventListener('click', () => {
      // Scroll to wizard and pre-select cost band
      if (wizardCard) {
        wizardCard.scrollIntoView({ behavior: 'smooth' });
        if (costBandSelect) {
          costBandSelect.value = '5k_10k';
          claimData.estimated_cost_band = '5k_10k';
        }
      }
    });
  }

  // Initial calculation
  calculateCompensation();

  /* ==========================================================================
     6. Floating WhatsApp Interactive Chat Widget
     ========================================================================== */
  const floatWhatsappBtn = document.getElementById('floatWhatsappBtn');
  const whatsappChatPopup = document.getElementById('whatsappChatPopup');
  const whatsappCloseBtn = document.getElementById('whatsappCloseBtn');
  const whatsappCustomInput = document.getElementById('whatsappCustomInput');
  const whatsappSendCustomBtn = document.getElementById('whatsappSendCustomBtn');
  const quickReplyBtns = document.querySelectorAll('.whatsapp-quick-reply-btn');

  if (floatWhatsappBtn && whatsappChatPopup) {
    floatWhatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();
      whatsappChatPopup.classList.toggle('active');
    });
  }

  if (whatsappCloseBtn && whatsappChatPopup) {
    whatsappCloseBtn.addEventListener('click', () => {
      whatsappChatPopup.classList.remove('active');
    });
  }

  // Quick replies
  quickReplyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const promptText = btn.dataset.msg;
      sendToWhatsApp(promptText);
    });
  });

  if (whatsappSendCustomBtn && whatsappCustomInput) {
    whatsappSendCustomBtn.addEventListener('click', () => {
      const msg = whatsappCustomInput.value.trim();
      if (msg) sendToWhatsApp(msg);
    });

    whatsappCustomInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const msg = whatsappCustomInput.value.trim();
        if (msg) sendToWhatsApp(msg);
      }
    });
  }

  function sendToWhatsApp(message) {
    const fullText = encodeURIComponent(`Hello Claim4u: ${message}`);
    const targetUrl = `${CONFIG.whatsappBaseUrl}?text=${fullText}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    if (whatsappChatPopup) whatsappChatPopup.classList.remove('active');
  }

  /* ==========================================================================
     7. Mobile Navigation Drawer
     ========================================================================== */
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (mobileDrawer) mobileDrawer.classList.add('active');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMobileMenu);
  if (mobileDrawerClose) mobileDrawerClose.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ==========================================================================
     8. Modals: Privacy Policy, Compensation Details, Leads Admin
     ========================================================================== */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContainer = document.getElementById('modalContainer');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function openModal(title, htmlContent) {
    if (!modalOverlay || !modalTitle || !modalBody) return;
    modalTitle.textContent = title;
    modalBody.innerHTML = htmlContent;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Trigger Privacy Policy Modal
  const privacyLinks = document.querySelectorAll('.privacy-link');
  privacyLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('Claim4u Privacy Policy', `
        <p><strong>Last Updated: 2026</strong></p>
        <p>At Claim4u ("we", "our", or "us"), we are committed to safeguarding the privacy and personal information of tenants inquiring about housing disrepair compensation.</p>
        
        <h3>1. Information We Collect</h3>
        <p>When you complete our 60-second eligibility check or communicate with us via phone (07473956657) or WhatsApp, we collect:</p>
        <ul>
          <li>Full name, contact telephone number, and email address</li>
          <li>Details of your tenancy (council or housing association landlord)</li>
          <li>Property disrepair information, timeline, and photographs you provide</li>
          <li>Postcode and regional location details</li>
        </ul>

        <h3>2. How We Use Your Data</h3>
        <p>Your details are processed strictly under the UK General Data Protection Regulation (UK GDPR) for:</p>
        <ul>
          <li>Assessing the legal eligibility of your housing disrepair claim</li>
          <li>Connecting you with an SRA-regulated solicitor or housing claims legal expert</li>
          <li>Communicating case updates and advice on No Win, No Fee arrangements</li>
        </ul>

        <h3>3. Confidentiality & Legal Protection</h3>
        <p>We do NOT sell your data to non-relevant third parties. Making a legitimate claim is protected under UK tenant protection laws against retaliatory eviction.</p>

        <h3>4. Contact Our Data Protection Team</h3>
        <p>If you have any questions or wish to request data erasure, contact us at <strong>${CONFIG.phoneDisplay}</strong> or email <strong>${CONFIG.email}</strong>.</p>
      `);
    });
  });

  // Leads Admin Drawer (Secret shortcut: Shift + L, or click footer admin link)
  const adminLeadsLink = document.getElementById('adminLeadsLink');
  function openLeadsAdmin() {
    const leads = JSON.parse(localStorage.getItem('claim4u_leads') || '[]');
    let leadsHtml = `
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <span style="font-weight: 800; font-size: 1.1rem; color: #041c38;">Total Enquiries: ${leads.length}</span>
          <div style="font-size: 0.8rem; color: #64748b;">Includes Google Ads &amp; Meta Pixel conversions</div>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button id="exportCsvBtn" class="btn btn-navy" style="font-size: 0.8rem; padding: 0.5rem 0.9rem;">Export CSV</button>
          <button id="clearLeadsBtn" class="btn btn-ghost" style="font-size: 0.8rem; padding: 0.5rem 0.9rem; color: #ef4444;">Clear</button>
        </div>
      </div>

      <!-- Ad Campaign Link Generator Tool -->
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
        <h4 style="font-size: 0.92rem; color: #041c38; font-weight: 700; margin-bottom: 0.5rem;">
          🚀 Meta &amp; Google Ads URL Campaign Builder
        </h4>
        <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 0.75rem;">
          Generate tracked links for your Facebook, Instagram, or Google Ads campaigns. Leads from these URLs are automatically tagged.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.5rem; margin-bottom: 0.75rem;">
          <div>
            <label style="font-size: 0.75rem; font-weight: 700; color: #475569;">Platform</label>
            <select id="adGenPlatform" class="form-select" style="font-size: 0.82rem; padding: 6px;">
              <option value="meta">Meta (Facebook &amp; Instagram)</option>
              <option value="google">Google Ads</option>
              <option value="tiktok">TikTok Ads</option>
            </select>
          </div>
          <div>
            <label style="font-size: 0.75rem; font-weight: 700; color: #475569;">Campaign Focus</label>
            <select id="adGenCampaign" class="form-select" style="font-size: 0.82rem; padding: 6px;">
              <option value="mould_damp">Damp &amp; Mould Claims (HDR)</option>
              <option value="council_housing">Council Tenant Repairs (HDR)</option>
              <option value="boiler_heating">Broken Boilers / Heating</option>
              <option value="rta_car_accident">Road Traffic Accident (RTA England &amp; Wales)</option>
              <option value="rta_credit_hire">Non-Fault Credit Hire Car</option>
              <option value="rta_whiplash">Whiplash Injury Compensation</option>
              <option value="general_disrepair">General Housing Disrepair</option>
            </select>
          </div>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <input type="text" id="adGenResult" readonly class="form-input" style="font-size: 0.8rem; padding: 6px 10px; background: #ffffff;" value="https://claim4u-uk.co/?utm_source=meta&utm_medium=paid_social&utm_campaign=mould_damp" />
          <button type="button" id="adGenCopyBtn" class="btn btn-navy" style="font-size: 0.8rem; padding: 6px 12px; white-space: nowrap;">Copy Link</button>
        </div>
      </div>
    `;

    if (leads.length === 0) {
      leadsHtml += `<p style="text-align: center; color: #64748b; padding: 2rem 0;">No leads captured in local database yet. Submit the form to see entries here.</p>`;
    } else {
      leadsHtml += `<div style="overflow-x: auto; max-height: 400px;"><table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left;">
        <thead>
          <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
            <th style="padding: 8px;">Date</th>
            <th style="padding: 8px;">Type</th>
            <th style="padding: 8px;">Name</th>
            <th style="padding: 8px;">Phone</th>
            <th style="padding: 8px;">Location / Landlord</th>
            <th style="padding: 8px;">Damages / Injury</th>
            <th style="padding: 8px;">Ad Source</th>
            <th style="padding: 8px;">Action</th>
          </tr>
        </thead>
        <tbody>
      `;

      leads.forEach((lead) => {
        const dateStr = lead.submitted_at ? new Date(lead.submitted_at).toLocaleDateString('en-GB') : 'Recent';
        const channelLabel = lead.ad_channel || (lead.attribution && lead.attribution.channel) || 'Direct';
        const channelColor = channelLabel.includes('Google') ? '#2563eb' : channelLabel.includes('Meta') ? '#0284c7' : '#64748b';
        
        const typeBadge = lead.claim_type === 'RTA'
          ? '<span style="background: #e0f2fe; color: #0369a1; font-weight: 800; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem;">🚗 RTA</span>'
          : '<span style="background: #fef3c7; color: #92400e; font-weight: 800; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem;">🏠 Housing</span>';

        const detailsStr = lead.claim_type === 'RTA'
          ? `${escapeHtml(lead.country || 'England/Wales')} · ${escapeHtml(lead.role || 'Driver')}`
          : escapeHtml(lead.landlord_name || 'Social Landlord');

        const damagesStr = lead.claim_type === 'RTA'
          ? escapeHtml((lead.injuries || []).join(', ') || 'Whiplash / Trauma')
          : escapeHtml((lead.damage_types || []).join(', ') || 'Disrepair');

        leadsHtml += `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px;">${dateStr}</td>
            <td style="padding: 8px;">${typeBadge}</td>
            <td style="padding: 8px; font-weight: 700;">${escapeHtml(lead.full_name)}</td>
            <td style="padding: 8px;"><a href="tel:${lead.phone}" style="color: #07254a;">${escapeHtml(lead.phone)}</a></td>
            <td style="padding: 8px;">${detailsStr}</td>
            <td style="padding: 8px;">${damagesStr}</td>
            <td style="padding: 8px;">
              <span style="display: inline-block; font-size: 0.72rem; font-weight: 700; color: #ffffff; background: ${channelColor}; padding: 2px 7px; border-radius: 4px;">
                ${escapeHtml(channelLabel)}
              </span>
            </td>
            <td style="padding: 8px;">
              <a href="https://wa.me/447473956657?text=${encodeURIComponent('Following up on claim for ' + lead.full_name)}" target="_blank" style="color: #10b981; font-weight: 700;">WhatsApp</a>
            </td>
          </tr>
        `;
      });
      leadsHtml += `</tbody></table></div>`;
    }

    openModal('Claim4u Lead Management & Ads Console', leadsHtml);

    // Event handlers inside modal
    setTimeout(() => {
      // Export CSV
      const exportBtn = document.getElementById('exportCsvBtn');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          exportLeadsToCsv(leads);
        });
      }

      // Clear Leads
      const clearBtn = document.getElementById('clearLeadsBtn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (confirm('Clear all stored leads?')) {
            localStorage.removeItem('claim4u_leads');
            closeModal();
            showToast('Leads database cleared', 'info');
          }
        });
      }

      // Ad URL Generator
      const selPlatform = document.getElementById('adGenPlatform');
      const selCampaign = document.getElementById('adGenCampaign');
      const inputResult = document.getElementById('adGenResult');
      const btnCopy = document.getElementById('adGenCopyBtn');

      function updateAdUrl() {
        if (!selPlatform || !selCampaign || !inputResult) return;
        const p = selPlatform.value;
        const c = selCampaign.value;
        const medium = p === 'meta' || p === 'tiktok' ? 'paid_social' : 'cpc';
        const url = `https://claim4u-uk.co/?utm_source=${p}&utm_medium=${medium}&utm_campaign=${c}`;
        inputResult.value = url;
      }

      if (selPlatform) selPlatform.addEventListener('change', updateAdUrl);
      if (selCampaign) selCampaign.addEventListener('change', updateAdUrl);

      if (btnCopy && inputResult) {
        btnCopy.addEventListener('click', () => {
          navigator.clipboard.writeText(inputResult.value).then(() => {
            showToast('Tracked Ad URL copied to clipboard!', 'success');
          }).catch(() => {
            inputResult.select();
            document.execCommand('copy');
            showToast('Tracked Ad URL copied!', 'success');
          });
        });
      }
    }, 100);
  }

  if (adminLeadsLink) {
    adminLeadsLink.addEventListener('click', (e) => {
      e.preventDefault();
      openLeadsAdmin();
    });
  }

  // Keyboard shortcut: Shift + L for Admin
  window.addEventListener('keydown', (e) => {
    if (e.shiftKey && (e.key === 'L' || e.key === 'l')) {
      openLeadsAdmin();
    }
  });

  function exportLeadsToCsv(leads) {
    if (!leads || !leads.length) {
      showToast('No leads to export', 'warning');
      return;
    }
    const headers = ['ID', 'Date', 'Claim Type', 'Full Name', 'Phone', 'Email', 'Country', 'Role / Landlord Type', 'Landlord / Location', 'Damages / Injuries', 'Cost Band', 'Postcode', 'Ad Channel', 'UTM Source', 'UTM Campaign', 'GCLID', 'FBCLID'];
    const rows = leads.map(l => {
      const attr = l.attribution || {};
      const isRta = l.claim_type === 'RTA';
      const damages = isRta ? (l.injuries || []).join('; ') : (l.damage_types || []).join('; ');
      return [
        l.id || '',
        l.submitted_at || '',
        `"${isRta ? 'RTA' : 'Housing'}"`,
        `"${(l.full_name || '').replace(/"/g, '""')}"`,
        `"${l.phone || ''}"`,
        `"${l.email || ''}"`,
        `"${l.country || 'England & Wales'}"`,
        `"${isRta ? (l.role || '') : (l.landlord_type || '')}"`,
        `"${((isRta ? l.acc_location : l.landlord_name) || '').replace(/"/g, '""')}"`,
        `"${damages.replace(/"/g, '""')}"`,
        `"${l.estimated_cost_band || ''}"`,
        `"${l.postcode || ''}"`,
        `"${l.ad_channel || attr.channel || 'Direct'}"`,
        `"${l.ad_source || attr.source || ''}"`,
        `"${l.ad_campaign || attr.campaign || ''}"`,
        `"${l.gclid || attr.gclid || ''}"`,
        `"${l.fbclid || attr.fbclid || ''}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `claim4u_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV downloaded successfully with Ad Attribution!', 'success');
  }

  /* ==========================================================================
     Reviews Filter Tabs
     ========================================================================== */
  const reviewFilterBtns = document.querySelectorAll('.review-filter-btn');
  const reviewCards = document.querySelectorAll('.review-card');

  if (reviewFilterBtns.length && reviewCards.length) {
    reviewFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        reviewFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        reviewCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==========================================================================
     9. Global Toast Notification System
     ========================================================================== */
  function showToast(message, type = 'info') {
    let toast = document.getElementById('globalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalToast';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, 3800);
  }

  // Initialize Wizard UI
  updateWizardUI();
});
