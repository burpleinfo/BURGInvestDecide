/* ═══════════════════════════════════════════════
   BURG Rental Services — Global Script
═══════════════════════════════════════════════ */

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ── Mobile hamburger toggle ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ── Fade-in on scroll ──
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => observer.observe(el));
}

// ── Active nav link highlight ──
(function highlightActiveNav() {
  const links = document.querySelectorAll('.nav-link');
  const path  = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === path);
  });
})();

/* ═══════════════════════════════════════════════
   WHATSAPP FORM SUBMISSION
   All forms send details as a WhatsApp message
   to +91 8778579209
═══════════════════════════════════════════════ */

const WA_NUMBER = '918778579209';

function sendToWhatsApp(fields, formTitle) {
  let msg = `*${formTitle}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  fields.forEach(({ label, value }) => {
    if (value && value.trim() !== '') {
      msg += `*${label}:* ${value.trim()}\n`;
    }
  });
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `_Sent via BURG Website_`;
  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');
}

// ── Helper: read form field value ──
function val(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}
function selText(id) {
  const el = document.getElementById(id);
  if (!el) return '';
  return el.options[el.selectedIndex]?.text || el.value || '';
}

/* ── Main Contact Form (contact.html) ── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const enquiryType = document.getElementById('enquiry_type_input')?.value || 'General';
    const fields = [
      { label: 'Enquiry Type',   value: enquiryType },
      { label: 'Name',           value: val('c-name') },
      { label: 'Phone',          value: val('c-phone') },
      { label: 'Email',          value: val('c-email') },
      { label: 'Organisation',   value: val('c-org') },
      { label: 'City',           value: val('c-city') },
      { label: 'Service',        value: selText('c-service') },
      { label: 'Subject',        value: val('c-subject') },
      { label: 'Message',        value: val('c-message') },
    ];
    sendToWhatsApp(fields, 'BURG — Contact Enquiry');
    // Show success state
    const btn = document.getElementById('submitBtn');
    const success = document.getElementById('formSuccess');
    if (btn) { btn.textContent = 'Opening WhatsApp…'; btn.disabled = true; }
    setTimeout(() => {
      contactForm.style.display = 'none';
      if (success) success.style.display = 'block';
    }, 800);
  });
}

/* ── Partner Enquiry Form (partners.html) ── */
const partnerForm = document.querySelector('form[name="partner-enquiry"]');
if (partnerForm) {
  partnerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const fields = [
      { label: 'Name',          value: document.getElementById('p-name')?.value },
      { label: 'Company',       value: document.getElementById('p-company')?.value },
      { label: 'Email',         value: document.getElementById('p-email')?.value },
      { label: 'Phone',         value: document.getElementById('p-phone')?.value },
      { label: 'Partner Type',  value: (() => { const s = document.getElementById('p-type'); return s?.options[s.selectedIndex]?.text || ''; })() },
      { label: 'City',          value: document.getElementById('p-city')?.value },
      { label: 'Fleet / Scale', value: document.getElementById('p-fleet-size')?.value },
      { label: 'Message',       value: document.getElementById('p-message')?.value },
    ];
    sendToWhatsApp(fields, 'BURG — Partner Enquiry');
    const btn = partnerForm.querySelector('[type="submit"]');
    if (btn) { btn.textContent = 'Opening WhatsApp…'; btn.disabled = true; }
    setTimeout(() => {
      partnerForm.innerHTML = `<div style="text-align:center;padding:40px 20px;">
        <div style="font-size:2.5rem;margin-bottom:14px;">✅</div>
        <h3 style="font-family:'Syne',sans-serif;color:var(--navy);margin-bottom:10px;">Enquiry Sent!</h3>
        <p style="color:var(--text-muted);font-size:0.93rem;line-height:1.7;">Complete the WhatsApp message if it opened. Our partner team will respond within 24 hours.</p>
      </div>`;
    }, 800);
  });
}

/* ── Driver Application Form (drivers.html) ── */
const driverForm = document.querySelector('form[name="driver-application"]');
if (driverForm) {
  driverForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const licEl  = document.getElementById('d-licence');
    const expEl  = document.getElementById('d-exp');
    const vehEl  = document.getElementById('d-vehicle');
    const ownEl  = document.getElementById('d-own');
    const fields = [
      { label: 'Name',         value: document.getElementById('d-name')?.value },
      { label: 'Phone',        value: document.getElementById('d-phone')?.value },
      { label: 'Email',        value: document.getElementById('d-email')?.value },
      { label: 'City',         value: document.getElementById('d-city')?.value },
      { label: 'Licence Type', value: licEl?.options[licEl.selectedIndex]?.text || '' },
      { label: 'Experience',   value: expEl?.options[expEl.selectedIndex]?.text || '' },
      { label: 'Vehicle',      value: vehEl?.options[vehEl.selectedIndex]?.text || '' },
      { label: 'Owns Vehicle', value: ownEl?.options[ownEl.selectedIndex]?.text || '' },
      { label: 'Notes',        value: document.getElementById('d-notes')?.value },
    ];
    sendToWhatsApp(fields, 'BURG — Driver Application');
    const btn = driverForm.querySelector('[type="submit"]');
    if (btn) { btn.textContent = 'Opening WhatsApp…'; btn.disabled = true; }
    setTimeout(() => {
      driverForm.innerHTML = `<div style="text-align:center;padding:40px 20px;">
        <div style="font-size:2.5rem;margin-bottom:14px;">✅</div>
        <h3 style="font-family:'Syne',sans-serif;color:var(--navy);margin-bottom:10px;">Application Sent!</h3>
        <p style="color:var(--text-muted);font-size:0.93rem;line-height:1.7;">Complete the WhatsApp message if it opened. Our driver team will call you within 24 hours.</p>
      </div>`;
    }, 800);
  });
}

