import React, { useEffect, useMemo, useState } from 'react';
import Footer from '../widgets/Footer/Footer';

const WA_NUMBER = '918778579209';

const ENQUIRY_TYPES = [
  { key: 'client', icon: '🏢', name: 'Client Enquiry', desc: 'Book transport for your organisation' },
  { key: 'partner', icon: '🚌', name: 'Fleet Partnership', desc: 'List your vehicles on BURG' },
  { key: 'driver', icon: '🚗', name: 'Driver Application', desc: 'Join BURG as a commercial driver' },
  { key: 'tech', icon: '💻', name: 'Technology / Integration', desc: 'TONi API, partnerships, demo' },
  { key: 'media', icon: '📰', name: 'Press & Media', desc: 'Interviews, coverage, PR' },
  { key: 'other', icon: '✉️', name: 'General', desc: 'Anything else' },
];

const FAQS = [
  {
    q: 'How quickly can BURG arrange a vehicle?',
    a: 'For ad-hoc bookings, we typically confirm and assign a vehicle within 2-4 hours for standard requests in Bangalore. For long-term contracts and school route setup, allow 3-5 working days for onboarding and route planning.',
  },
  {
    q: 'Do you operate outside Bangalore?',
    a: 'Currently our active fleet network is concentrated in Bangalore. We do handle outstation and intercity trip bookings from Bangalore. Expansion to other cities is on the roadmap.',
  },
  {
    q: 'Is there a minimum contract period?',
    a: 'No minimum for one-off trip bookings. For dedicated fleet contracts, agreements typically start at 3 months. Custom terms are available for large enterprise requirements.',
  },
  {
    q: 'What payment methods does BURG accept?',
    a: 'We accept UPI, NEFT/RTGS, credit and debit cards via Razorpay, and standard bank transfers. Corporate clients can opt for monthly consolidated invoicing with 15-day payment terms.',
  },
  {
    q: 'How does BURG verify fleet operators?',
    a: 'Every fleet operator goes through vehicle fitness, insurance, PUC, and driver licence verification before first trip. RideSafe compliance tracking continues post-onboarding.',
  },
  {
    q: 'Can I track my booked vehicle in real time?',
    a: 'Yes. Corporate clients and schools with active contracts get TONi dashboard access, where assigned vehicles are visible on a live map with frequent updates.',
  },
  {
    q: 'How are driver background checks conducted?',
    a: 'BURG verification includes identity checks, licence validity checks, address checks, and additional verification for school and VIP routes.',
  },
  {
    q: 'I own buses. How do I earn with BURG?',
    a: 'Submit a fleet enquiry, complete the verification call, and once compliance checks clear and drivers complete orientation, trip assignments start automatically.',
  },
];

const ContactPage = () => {
  const [selectedType, setSelectedType] = useState('client');
  const [openFaqIndex, setOpenFaqIndex] = useState(-1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    organisation: '',
    city: '',
    service: '',
    subject: '',
    message: '',
    consent: false,
  });

  const typeLabel = useMemo(() => {
    const t = ENQUIRY_TYPES.find((item) => item.key === selectedType);
    return t ? t.name : 'General';
  }, [selectedType]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fadeEls = document.querySelectorAll('.fade-in');
    if (!fadeEls.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.location.hash === '#contact-form') {
      setTimeout(() => {
        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.consent || submitting) return;

    setSubmitting(true);

    const fields = [
      { label: 'Enquiry Type', value: typeLabel },
      { label: 'Name', value: form.name },
      { label: 'Phone', value: form.phone },
      { label: 'Email', value: form.email },
      { label: 'Organisation', value: form.organisation },
      { label: 'City', value: form.city },
      { label: 'Service', value: form.service },
      { label: 'Subject', value: form.subject },
      { label: 'Message', value: form.message },
    ];

    let msg = '*BURG - Contact Enquiry*\n';
    msg += '━━━━━━━━━━━━━━━━━━━━\n';
    fields.forEach(({ label, value }) => {
      if (value && String(value).trim() !== '') {
        msg += `*${label}:* ${String(value).trim()}\n`;
      }
    });
    msg += '━━━━━━━━━━━━━━━━━━━━\n';
    msg += '_Sent via BURG Website_';

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="contact-page">
      <style>{`
        .contact-page {
          --navy:#003366; --navy-deep:#001f40; --blue:#0055aa; --blue-bright:#1a7aff; --accent:#f0a500;
          --accent-lt:#ffd166; --white:#fff; --off-white:#f4f7fc; --gray-100:#eef1f7; --gray-200:#d8dfe9;
          --gray-500:#7a8aa0; --text:#0d1a2b; --text-muted:#5a6e84; --radius-sm:6px; --radius-md:12px;
          --radius-lg:20px; --radius-xl:32px; --shadow-lg:0 16px 48px rgba(0,51,102,0.18); --transition:.3s cubic-bezier(.4,0,.2,1);
          font-family: 'DM Sans', sans-serif; background: var(--white); color: var(--text);
        }
        .contact-page * { box-sizing: border-box; }
        .container { max-width:1200px; margin:0 auto; padding:0 24px; }
        .section-eyebrow { font-family:'Syne',sans-serif; font-size:.78rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--blue-bright); margin-bottom:12px; }
        .section-title { font-size:clamp(1.8rem,3.5vw,2.8rem); font-weight:800; color:var(--navy); margin-bottom:16px; font-family:'Syne',sans-serif; }
        .section-subtitle { font-size:1.1rem; color:var(--text-muted); max-width:560px; }
        .section-header { text-align:center; margin-bottom:56px; }
        .section-header .section-subtitle { margin:0 auto; }
        .btn { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:var(--radius-md); font-family:'Syne',sans-serif; font-weight:700; font-size:.95rem; cursor:pointer; transition:var(--transition); border:2px solid transparent; text-decoration:none; }
        .btn-primary { background:var(--navy); color:var(--white); border-color:var(--navy); }
        .btn-primary:hover { background:var(--blue); border-color:var(--blue); transform:translateY(-2px); }
        .btn-outline { background:transparent; color:var(--navy); border-color:var(--navy); }
        .btn-outline:hover { background:var(--navy); color:var(--white); transform:translateY(-2px); }
        .btn-outline-light { background:transparent; color:var(--white); border-color:rgba(255,255,255,.6); }
        .btn-outline-light:hover { background:rgba(255,255,255,.15); border-color:var(--white); }
        .fade-in { opacity:0; transform:translateY(28px); transition:opacity .7s ease, transform .7s ease; }
        .fade-in.visible { opacity:1; transform:translateY(0); }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.6; transform:scale(1.3); } }
        @keyframes pinPulse { 0%,100% { box-shadow:0 0 20px rgba(240,165,0,.5); transform:scale(1); } 50% { box-shadow:0 0 32px rgba(240,165,0,.8); transform:scale(1.1); } }

        .contact-hero { background:var(--navy-deep); padding:140px 0 80px; position:relative; overflow:hidden; }
        .contact-hero-grid-bg { position:absolute; inset:0; background-image:linear-gradient(rgba(26,122,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(26,122,255,.06) 1px, transparent 1px); background-size:60px 60px; }
        .contact-hero-orb { position:absolute; width:700px; height:700px; border-radius:50%; background:radial-gradient(circle, rgba(0,85,170,.2) 0%, transparent 65%); top:-200px; right:-150px; pointer-events:none; }
        .contact-hero-inner { position:relative; z-index:2; display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; max-width:1200px; margin:0 auto; padding:0 24px; }
        .contact-hero-text h1 { font-family:'Syne',sans-serif; font-size:clamp(2.2rem,4.5vw,3.6rem); font-weight:800; color:var(--white); line-height:1.12; margin-bottom:20px; }
        .contact-hero-text h1 span { color:var(--accent); }
        .contact-hero-text p { font-size:1.05rem; color:rgba(255,255,255,.58); line-height:1.8; max-width:440px; margin-bottom:36px; }

        .quick-contacts { display:flex; flex-direction:column; gap:12px; }
        .quick-contact-card { display:flex; align-items:center; gap:16px; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); border-radius:var(--radius-md); padding:18px 20px; transition:var(--transition); text-decoration:none; }
        .quick-contact-card:hover { background:rgba(255,255,255,.09); border-color:rgba(255,255,255,.2); transform:translateX(4px); }
        .qc-icon { width:44px; height:44px; border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0; }
        .qc-icon--email { background:rgba(26,122,255,.18); } .qc-icon--phone { background:rgba(74,222,128,.12); } .qc-icon--wa { background:rgba(37,211,102,.15); } .qc-icon--office { background:rgba(240,165,0,.12); }
        .qc-label { font-family:'Syne',sans-serif; font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:rgba(255,255,255,.4); margin-bottom:3px; }
        .qc-value { font-size:.92rem; font-weight:500; color:rgba(255,255,255,.88); }
        .qc-sub { font-size:.76rem; color:rgba(255,255,255,.38); margin-top:1px; }

        .contact-form-section { background:var(--off-white); padding:96px 0; }
        .contact-form-inner { display:grid; grid-template-columns:1fr 1.5fr; gap:72px; align-items:start; }
        .contact-sidebar h2 { font-size:1.6rem; font-weight:800; color:var(--navy); margin-bottom:14px; font-family:'Syne',sans-serif; }
        .contact-sidebar p { font-size:.95rem; color:var(--text-muted); line-height:1.75; margin-bottom:1rem; }
        .enquiry-types { display:flex; flex-direction:column; gap:10px; margin-top:28px; }
        .enq-type { display:flex; align-items:center; gap:12px; padding:14px 16px; background:var(--white); border:1px solid var(--gray-200); border-radius:var(--radius-md); cursor:pointer; transition:var(--transition); text-align:left; width:100%; }
        .enq-type:hover, .enq-type.selected { border-color:var(--navy); background:var(--navy); }
        .enq-type:hover .enq-type-name, .enq-type.selected .enq-type-name { color:var(--white); }
        .enq-type:hover .enq-type-desc, .enq-type.selected .enq-type-desc { color:rgba(255,255,255,.55); }
        .enq-type-icon { width:36px; height:36px; border-radius:var(--radius-sm); background:var(--off-white); display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0; transition:var(--transition); }
        .enq-type:hover .enq-type-icon, .enq-type.selected .enq-type-icon { background:rgba(255,255,255,.1); }
        .enq-type-name { font-family:'Syne',sans-serif; font-size:.85rem; font-weight:700; color:var(--navy); transition:var(--transition); }
        .enq-type-desc { font-size:.75rem; color:var(--text-muted); margin-top:1px; transition:var(--transition); }
        .response-badge { display:flex; align-items:center; gap:10px; background:rgba(74,222,128,.08); border:1px solid rgba(74,222,128,.2); border-radius:var(--radius-md); padding:14px 16px; margin-top:28px; }
        .response-badge-dot { width:10px; height:10px; background:#4ade80; border-radius:50%; flex-shrink:0; animation:pulse 2s infinite; }
        .response-badge-text { font-size:.85rem; color:var(--text); line-height:1.5; }
        .response-badge-text strong { color:#16a34a; font-weight:700; }
        .legal-block { margin-top:28px; padding:20px; background:var(--white); border:1px solid var(--gray-200); border-radius:var(--radius-md); }
        .legal-block-title { font-family:'Syne',sans-serif; font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--navy); margin-bottom:10px; }
        .legal-block p { font-size:.8rem; color:var(--text-muted); line-height:1.7; margin-bottom:0; }

        .contact-form-box { background:var(--white); border-radius:var(--radius-xl); padding:52px 48px; box-shadow:var(--shadow-lg); border:1px solid var(--gray-200); }
        .form-section-title { font-family:'Syne',sans-serif; font-size:1.2rem; font-weight:800; color:var(--navy); margin-bottom:6px; }
        .form-section-sub { font-size:.9rem; color:var(--text-muted); margin-bottom:32px; line-height:1.6; }
        .form-type-selector { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:28px; }
        .fts-opt { padding:11px 8px; text-align:center; background:var(--off-white); border:1.5px solid var(--gray-200); border-radius:var(--radius-md); font-family:'Syne',sans-serif; font-size:.75rem; font-weight:700; color:var(--text-muted); cursor:pointer; transition:var(--transition); user-select:none; line-height:1.4; }
        .fts-opt:hover { border-color:var(--navy); color:var(--navy); }
        .fts-opt.active { background:var(--navy); border-color:var(--navy); color:var(--white); }
        .fts-icon { display:block; font-size:1.1rem; margin-bottom:4px; }
        .form-divider { border:none; border-top:1px solid var(--gray-100); margin:28px 0; }
        .form-success { text-align:center; padding:40px 20px; }
        .form-success-icon { font-size:3rem; margin-bottom:16px; }
        .form-success h3 { font-family:'Syne',sans-serif; font-size:1.4rem; font-weight:800; color:var(--navy); margin-bottom:10px; }
        .form-success p { font-size:.95rem; color:var(--text-muted); line-height:1.7; }

        .form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .form-group { margin-bottom:16px; }
        .form-group label { display:block; font-size:.82rem; font-weight:700; color:var(--navy); margin-bottom:8px; }
        .form-group input, .form-group select, .form-group textarea {
          width:100%; border:1px solid var(--gray-200); border-radius:var(--radius-md); background:var(--white);
          padding:12px 14px; font-size:.9rem; color:var(--text); outline:none; transition:var(--transition);
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color:var(--blue); box-shadow:0 0 0 3px rgba(26,122,255,.12); }

        .office-section { background:var(--white); padding:96px 0; }
        .office-inner { display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; }
        .office-details h2 { font-family:'Syne',sans-serif; font-size:1.8rem; font-weight:800; color:var(--navy); margin-bottom:20px; }
        .office-info-rows { display:flex; flex-direction:column; gap:18px; margin-bottom:32px; }
        .office-info-row { display:flex; gap:16px; align-items:flex-start; }
        .ofi-icon { width:42px; height:42px; background:var(--off-white); border:1px solid var(--gray-200); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0; }
        .ofi-label { font-family:'Syne',sans-serif; font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--gray-500); margin-bottom:3px; }
        .ofi-value { font-size:.95rem; color:var(--text); font-weight:500; }
        .ofi-value a { color:var(--blue); text-decoration:none; }
        .ofi-value a:hover { color:var(--navy); }
        .ofi-sub { font-size:.78rem; color:var(--text-muted); margin-top:2px; }

        .map-placeholder { background:var(--navy-deep); border-radius:var(--radius-xl); overflow:hidden; position:relative; min-height:380px; border:1px solid rgba(26,122,255,.15); box-shadow:var(--shadow-lg); }
        .mp-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(26,122,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(26,122,255,.06) 1px, transparent 1px); background-size:40px 40px; }
        .mp-roads { position:absolute; inset:0; }
        .mp-road { position:absolute; background:rgba(255,255,255,.07); border-radius:2px; }
        .mp-road-h1 { top:40%; left:0; right:0; height:8px; } .mp-road-h2 { top:70%; left:0; right:0; height:4px; }
        .mp-road-v1 { left:35%; top:0; bottom:0; width:6px; } .mp-road-v2 { left:65%; top:0; bottom:0; width:3px; }
        .mp-pin { position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); display:flex; flex-direction:column; align-items:center; z-index:2; }
        .mp-pin-dot { width:20px; height:20px; background:var(--accent); border-radius:50%; border:3px solid var(--white); box-shadow:0 0 20px rgba(240,165,0,.5); animation:pinPulse 2s ease-in-out infinite; }
        .mp-pin-line { width:2px; height:24px; background:linear-gradient(to bottom, var(--accent), transparent); }
        .mp-label { position:absolute; bottom:20px; left:50%; transform:translateX(-50%); background:rgba(0,10,25,.88); border:1px solid rgba(26,122,255,.2); border-radius:var(--radius-md); padding:12px 20px; text-align:center; white-space:nowrap; z-index:2; }
        .mp-label-title { font-family:'Syne',sans-serif; font-size:.82rem; font-weight:700; color:var(--white); margin-bottom:2px; }
        .mp-label-sub { font-size:.72rem; color:rgba(255,255,255,.45); }

        .faq-section { background:var(--off-white); padding:96px 0; }
        .faq-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; max-width:960px; margin:0 auto; }
        .faq-item { background:var(--white); border:1px solid var(--gray-200); border-radius:var(--radius-md); overflow:hidden; }
        .faq-q { width:100%; display:flex; align-items:center; justify-content:space-between; gap:12px; padding:20px 22px; background:none; border:none; cursor:pointer; text-align:left; font-family:'Syne',sans-serif; font-size:.9rem; font-weight:700; color:var(--navy); transition:var(--transition); }
        .faq-q:hover { background:var(--off-white); }
        .faq-chevron { font-size:.7rem; color:var(--gray-500); transition:var(--transition); }
        .faq-item.open .faq-chevron { transform:rotate(180deg); }
        .faq-a { display:none; padding:14px 22px 20px; font-size:.88rem; color:var(--text-muted); line-height:1.75; border-top:1px solid var(--gray-100); }
        .faq-item.open .faq-a { display:block; }

        .connect-strip { background:var(--navy); padding:64px 0; }
        .connect-inner { display:flex; align-items:center; justify-content:space-between; gap:40px; flex-wrap:wrap; }
        .connect-text h2 { font-family:'Syne',sans-serif; font-size:1.5rem; font-weight:800; color:var(--white); margin-bottom:6px; }
        .connect-text p { color:rgba(255,255,255,.55); font-size:.9rem; }
        .connect-channels { display:flex; gap:12px; flex-wrap:wrap; }
        .channel-btn { display:inline-flex; align-items:center; gap:8px; padding:12px 20px; border-radius:var(--radius-md); font-family:'Syne',sans-serif; font-size:.82rem; font-weight:700; transition:var(--transition); border:1.5px solid transparent; text-decoration:none; }
        .channel-btn--wa { background:rgba(37,211,102,.12); border-color:rgba(37,211,102,.25); color:#4ade80; }
        .channel-btn--wa:hover { background:rgba(37,211,102,.2); border-color:rgba(37,211,102,.4); }
        .channel-btn--email { background:rgba(26,122,255,.12); border-color:rgba(26,122,255,.25); color:#6eb3ff; }
        .channel-btn--email:hover { background:rgba(26,122,255,.2); border-color:rgba(26,122,255,.4); }
        .channel-btn--phone { background:rgba(240,165,0,.1); border-color:rgba(240,165,0,.25); color:#ffd166; }
        .channel-btn--phone:hover { background:rgba(240,165,0,.18); border-color:rgba(240,165,0,.4); }

        @media (max-width:1024px) { .contact-form-inner { grid-template-columns:1fr; gap:48px; } .contact-form-box { padding:40px 32px; } }
        @media (max-width:900px) { .contact-hero-inner { grid-template-columns:1fr; gap:48px; } .office-inner { grid-template-columns:1fr; gap:40px; } .faq-grid { grid-template-columns:1fr; } }
        @media (max-width:768px) { .form-type-selector { grid-template-columns:repeat(2,1fr); } .connect-inner { flex-direction:column; align-items:flex-start; } .form-row { grid-template-columns:1fr; } }
        @media (max-width:480px) { .contact-form-box { padding:28px 20px; } .channel-btn { font-size:.78rem; padding:10px 14px; } }
      `}</style>

      <section className="contact-hero">
        <div className="contact-hero-grid-bg" />
        <div className="contact-hero-orb" />
        <div className="contact-hero-inner">
          <div className="contact-hero-text fade-in">
            <p className="section-eyebrow">Get In Touch</p>
            <h1>
              Let's Talk
              <br />
              <span>Transport.</span>
            </h1>
            <p>
              Whether you are a business looking for fleet management, a school needing safe transport, a fleet owner wanting to grow revenue, or a driver ready to join - we want to hear from you.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="#contact-form" className="btn btn-primary">Send a Message →</a>
              <a href="tel:+918778579209" className="btn btn-outline-light">📞 Call Us Now</a>
            </div>
          </div>

          <div className="quick-contacts fade-in">
            <a href="mailto:hello@burgrental.com" className="quick-contact-card">
              <div className="qc-icon qc-icon--email">📧</div>
              <div>
                <div className="qc-label">Email</div>
                <div className="qc-value">hello@burgrental.com</div>
                <div className="qc-sub">We respond within 24 hours</div>
              </div>
            </a>
            <a href="tel:+918778579209" className="quick-contact-card">
              <div className="qc-icon qc-icon--phone">📞</div>
              <div>
                <div className="qc-label">Phone</div>
                <div className="qc-value">+91 87785 79209</div>
                <div className="qc-sub">Mon - Sat, 9 AM - 6 PM IST</div>
              </div>
            </a>
            <a href="https://wa.me/918778579209" target="_blank" rel="noopener noreferrer" className="quick-contact-card">
              <div className="qc-icon qc-icon--wa">💬</div>
              <div>
                <div className="qc-label">WhatsApp</div>
                <div className="qc-value">+91 87785 79209</div>
                <div className="qc-sub">Quickest response channel</div>
              </div>
            </a>
            <div className="quick-contact-card" style={{ cursor: 'default' }}>
              <div className="qc-icon qc-icon--office">📍</div>
              <div>
                <div className="qc-label">Registered Office</div>
                <div className="qc-value">Bangalore, Karnataka, India</div>
                <div className="qc-sub">LLPIN: ACR-9256</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-form-section" id="contact-form">
        <div className="container contact-form-inner">
          <div className="contact-sidebar fade-in">
            <h2>What Can We Help You With?</h2>
            <p>
              Select the type of enquiry that best matches your need. Our team routes messages to the right person so you get a faster, more relevant response.
            </p>

            <div className="enquiry-types">
              {ENQUIRY_TYPES.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`enq-type ${selectedType === item.key ? 'selected' : ''}`}
                  onClick={() => setSelectedType(item.key)}
                >
                  <div className="enq-type-icon">{item.icon}</div>
                  <div>
                    <div className="enq-type-name">{item.name}</div>
                    <div className="enq-type-desc">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="response-badge">
              <div className="response-badge-dot" />
              <div className="response-badge-text">
                <strong>We're actively responding.</strong> Most messages receive a reply within <strong>24 hours</strong> on business days.
              </div>
            </div>

            <div className="legal-block">
              <div className="legal-block-title">Legal & Registration</div>
              <p>
                BURG Rental Services LLP
                <br />
                LLPIN: ACR-9256
                <br />
                Registered in India under the Limited Liability Partnership Act, 2008.
                <br />
                Bangalore, Karnataka - 560 000.
              </p>
            </div>
          </div>

          <div className="contact-form-box fade-in">
            <div className="form-section-title">Send Us a Message</div>
            <p className="form-section-sub">Fill in the form below and the right person at BURG will get back to you directly.</p>

            <div className="form-type-selector">
              {ENQUIRY_TYPES.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`fts-opt ${selectedType === item.key ? 'active' : ''}`}
                  onClick={() => setSelectedType(item.key)}
                >
                  <span className="fts-icon">{item.icon}</span>
                  {item.name.split(' ')[0]}
                </button>
              ))}
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <input type="hidden" name="enquiry_type" value={selectedType} readOnly />

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="c-name">Full Name *</label>
                    <input id="c-name" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="c-phone">Phone Number *</label>
                    <input id="c-phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="c-email">Email Address *</label>
                    <input id="c-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="c-org">Organisation / Company</label>
                    <input id="c-org" name="organisation" value={form.organisation} onChange={handleChange} placeholder="Your company or school name" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="c-city">City</label>
                    <input id="c-city" name="city" value={form.city} onChange={handleChange} placeholder="e.g. Bangalore" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="c-service">Service of Interest</label>
                    <select id="c-service" name="service" value={form.service} onChange={handleChange}>
                      <option value="">Select a service</option>
                      <option value="ridesafe">RideSafe</option>
                      <option value="corporate">Corporate Leasing</option>
                      <option value="school">School Transport</option>
                      <option value="vip">VIP & Executive</option>
                      <option value="platform">Platform / Technology</option>
                      <option value="other">Other / Not Sure</option>
                    </select>
                  </div>
                </div>

                <hr className="form-divider" />

                <div className="form-group">
                  <label htmlFor="c-subject">Subject *</label>
                  <input id="c-subject" name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?" required />
                </div>

                <div className="form-group">
                  <label htmlFor="c-message">Your Message *</label>
                  <textarea
                    id="c-message"
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your transport requirement, fleet size, route, timeline, or any other details that will help us respond accurately."
                    required
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <input
                    type="checkbox"
                    id="c-consent"
                    name="consent"
                    checked={form.consent}
                    onChange={handleChange}
                    required
                    style={{ width: '16px', height: '16px', accentColor: 'var(--navy)', cursor: 'pointer' }}
                  />
                  <label htmlFor="c-consent" style={{ fontSize: '.82rem', color: 'var(--text-muted)', cursor: 'pointer', lineHeight: 1.5 }}>
                    I agree that BURG Rental Services may contact me in response to this enquiry. My details will not be shared with third parties.
                  </label>
                </div>

                <button type="submit" className="btn btn-primary form-submit" disabled={submitting}>
                  {submitting ? 'Opening WhatsApp...' : 'Send Message →'}
                </button>
              </form>
            ) : (
              <div className="form-success">
                <div className="form-success-icon">✅</div>
                <h3>Message Sent!</h3>
                <p>
                  Thanks for reaching out. A member of the BURG team will be in touch within 24 hours on business days.
                  <br />
                  <br />
                  For urgent matters, call us directly at <a href="tel:+918778579209" style={{ color: 'var(--blue)', fontWeight: 600 }}>+91 87785 79209</a>.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="office-section">
        <div className="container office-inner">
          <div className="office-details fade-in">
            <p className="section-eyebrow">Our Office</p>
            <h2>Find BURG in Bangalore</h2>
            <div className="office-info-rows">
              <div className="office-info-row">
                <div className="ofi-icon">📍</div>
                <div>
                  <div className="ofi-label">Registered Address</div>
                  <div className="ofi-value">Bangalore, Karnataka, India - 560 000</div>
                  <div className="ofi-sub">Operations across Bangalore city and suburbs</div>
                </div>
              </div>
              <div className="office-info-row">
                <div className="ofi-icon">📧</div>
                <div>
                  <div className="ofi-label">General Enquiries</div>
                  <div className="ofi-value"><a href="mailto:hello@burgrental.com">hello@burgrental.com</a></div>
                  <div className="ofi-sub">For all client, partner, and press queries</div>
                </div>
              </div>
              <div className="office-info-row">
                <div className="ofi-icon">📞</div>
                <div>
                  <div className="ofi-label">Phone & WhatsApp</div>
                  <div className="ofi-value"><a href="tel:+918778579209">+91 87785 79209</a></div>
                  <div className="ofi-sub">Mon - Sat, 9:00 AM - 6:00 PM IST</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="https://wa.me/918778579209" target="_blank" rel="noopener noreferrer" className="btn btn-primary">💬 WhatsApp Us</a>
              <a href="mailto:hello@burgrental.com" className="btn btn-outline">📧 Send Email</a>
            </div>
          </div>

          <div className="map-placeholder fade-in">
            <div className="mp-grid" />
            <div className="mp-roads">
              <div className="mp-road mp-road-h1" />
              <div className="mp-road mp-road-h2" />
              <div className="mp-road mp-road-v1" />
              <div className="mp-road mp-road-v2" />
            </div>
            <div className="mp-pin">
              <div className="mp-pin-dot" />
              <div className="mp-pin-line" />
            </div>
            <div className="mp-label">
              <div className="mp-label-title">BURG Rental Services LLP</div>
              <div className="mp-label-sub">Bangalore, Karnataka, India</div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <div className="section-header fade-in">
            <p className="section-eyebrow">FAQs</p>
            <h2 className="section-title">Common Questions</h2>
            <p className="section-subtitle">Cannot find what you need? Use the contact form above or call us directly.</p>
          </div>
          <div className="faq-grid fade-in">
            {FAQS.map((item, index) => {
              const open = openFaqIndex === index;
              return (
                <div key={item.q} className={`faq-item ${open ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="faq-q"
                    onClick={() => setOpenFaqIndex((prev) => (prev === index ? -1 : index))}
                  >
                    {item.q}
                    <span className="faq-chevron">▼</span>
                  </button>
                  <div className="faq-a">{item.a}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="connect-strip">
        <div className="container connect-inner fade-in">
          <div className="connect-text">
            <h2>Reach Us Your Way</h2>
            <p>Phone, WhatsApp, or email - we are reachable on all channels on business days.</p>
          </div>
          <div className="connect-channels">
            <a href="https://wa.me/918778579209" target="_blank" rel="noopener noreferrer" className="channel-btn channel-btn--wa">💬 WhatsApp</a>
            <a href="mailto:hello@burgrental.com" className="channel-btn channel-btn--email">📧 hello@burgrental.com</a>
            <a href="tel:+918778579209" className="channel-btn channel-btn--phone">📞 +91 87785 79209</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
