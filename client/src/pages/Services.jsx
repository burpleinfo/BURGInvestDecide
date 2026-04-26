import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../widgets/Navbar/Navbar';

const Services = () => {
  const [activeService, setActiveService] = useState('ridesafe');

  // Handle fade-in animations on scroll
  useEffect(() => {
    const fadeEls = document.querySelectorAll('.fade-in');
    if (fadeEls.length) {
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
    }
  }, []);

  // Handle sticky service nav active highlight on scroll
  useEffect(() => {
    const sections = document.querySelectorAll('.service-block');
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveService(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-124px 0px -55% 0px',
        threshold: 0,
      }
    );

    sections.forEach((s) => sectionObserver.observe(s));
    return () => sectionObserver.disconnect();
  }, []);

  const services = [
    {
      id: 'ridesafe',
      icon: '🛡️',
      badge: 'Safety-as-a-Service',
      title: 'RideSafe',
      desc: 'RideSafe is BURG\'s compliance and safety layer — applied across every vehicle on the platform. For schools and corporates that carry passengers, it\'s available as a standalone subscription service that wraps your existing or BURG-assigned fleet in a full safety protocol.',
      desc2: 'From driver background verification to real-time route deviation alerts and emergency SOS — RideSafe turns a basic vehicle rental into a managed, accountable transport service.',
      features: [
        { icon: '🔍', title: 'Driver Background Verification', desc: 'Criminal record checks, licence validity, and address verification for every driver on the platform before their first trip.' },
        { icon: '📍', title: 'Live Route Monitoring', desc: 'Geofenced route corridors with automatic deviation alerts sent to admins and guardians via WhatsApp and SMS.' },
        { icon: '🆘', title: 'Emergency SOS', desc: 'One-tap driver SOS from the TONi Driver App triggers an instant alert to BURG operations and the client\'s emergency contact.' },
        { icon: '📋', title: 'Compliance Document Tracking', desc: 'Vehicle fitness, insurance, PUC, and driver licence expiry dates are monitored automatically with advance renewal reminders.' },
      ],
      idealFor: ['🏫 Schools', '🏢 Corporates', '🏥 Healthcare Orgs', '🏛️ Institutions'],
      visPanelClass: 'bg-gradient-to-br from-[#001f40] to-[#003d7a]',
      visLabel: 'RideSafe Protocol',
      visHeadline: 'Safety on Every Route',
      visChecklist: ['Driver identity verified', 'Vehicle fitness confirmed', 'Insurance active', 'GPS tracking live', 'Route corridor set', 'SOS enabled'],
      visStats: [
        { num: '100%', label: 'Verified Drivers' },
        { num: '3s', label: 'GPS Update Rate' },
        { num: '0', label: 'Unverified Trips' },
      ],
    },
    {
      id: 'corporate',
      icon: '🏢',
      badge: 'Enterprise',
      title: 'Corporate Leasing',
      desc: 'Businesses running employee transport, client shuttles, or inter-site logistics need reliability and accountability — not ad-hoc bookings. BURG\'s Corporate Leasing service delivers dedicated fleet contracts with SLA guarantees, consolidated billing, and full analytics.',
      desc2: 'We handle the fleet, the drivers, the compliance, and the reporting. Your HR and admin teams get one invoice, one dashboard, and one point of contact.',
      features: [
        { icon: '🤝', title: 'Dedicated Fleet Allocation', desc: 'Vehicles assigned exclusively to your organisation for the contract period — no sharing, no last-minute unavailability.' },
        { icon: '📈', title: 'SLA-Backed Reliability', desc: 'Contractual uptime and on-time performance commitments with defined escalation paths if standards aren\'t met.' },
        { icon: '🧾', title: 'GST-Compliant Monthly Billing', desc: 'One consolidated invoice per month covering all trips, routes, and vehicles — ready for enterprise procurement and accounting.' },
        { icon: '📊', title: 'Admin Dashboard Access', desc: 'Your transport admin gets login access to live fleet tracking, trip reports, and utilisation analytics via the TONi platform.' },
      ],
      idealFor: ['💼 IT & Tech Firms', '🏭 Manufacturers', '🏗️ Construction Cos.', '🏬 Retail Chains'],
      visPanelClass: 'bg-gradient-to-br from-[#002244] to-[#004488]',
      visLabel: 'Corporate Portal',
      visHeadline: 'Fleet Without the Headache',
      visChecklist: ['Dedicated vehicle assignment', 'SLA uptime guarantee', 'Monthly GST invoice', 'Live admin dashboard', 'Cost-per-km analytics', 'Single point of contact'],
      visStats: [
        { num: '99%', label: 'On-Time SLA' },
        { num: '1', label: 'Invoice / Month' },
        { num: '24/7', label: 'Support Access' },
      ],
    },
    {
      id: 'school',
      icon: '🏫',
      badge: 'Education',
      title: 'School Transport',
      desc: 'School transport in India is one of the most safety-critical and least regulated categories of commercial vehicle use. BURG\'s School Transport service brings structure, visibility, and accountability to every route — giving parents peace of mind and schools a defensible safety record.',
      desc2: 'Every school bus on BURG runs under the full RideSafe protocol, with live tracking visible to authorised parents and digital boarding records for every child on every trip.',
      features: [
        { icon: '📱', title: 'Parent WhatsApp Alerts', desc: 'Automated notifications when the bus departs, approaches the stop, and when the child boards or alights — no app download needed.' },
        { icon: '📋', title: 'Digital Attendance Logs', desc: 'Boarding and drop-off timestamps recorded per child per trip. Schools get a fully searchable audit trail for every route.' },
        { icon: '🛣️', title: 'Route Planning & Optimisation', desc: 'BURG\'s team maps efficient routes based on student addresses, minimising travel time and fuel costs for the school operator.' },
        { icon: '💰', title: 'Transport Fee Collection', desc: 'Schools can collect fees from parents digitally via BURG\'s integrated Razorpay payment flow — reducing cash handling and admin overhead.' },
      ],
      idealFor: ['🏫 K-12 Schools', '🎓 Colleges', '🏛️ Coaching Centres', '🏕️ Residential Schools'],
      visPanelClass: 'bg-gradient-to-br from-[#00264d] to-[#0066aa]',
      visLabel: 'School Transport',
      visHeadline: 'Every Child. Every Stop. Accounted For.',
      visChecklist: ['Enhanced driver screening', 'Parent live tracking access', 'Boarding confirmation alerts', 'Digital attendance records', 'Geofenced school zones', 'Fee collection integrated'],
      visStats: [
        { num: 'Live', label: 'Map for Parents' },
        { num: '100%', label: 'Log Coverage' },
      ],
    },
    {
      id: 'vip',
      icon: '💎',
      badge: 'Premium',
      title: 'VIP & Executive',
      desc: 'For senior executives, government officials, and high-profile guests who require a transport experience that reflects their standing. BURG\'s VIP service is discreet, punctual, and handled by trained professionals — not just a cab booking with a nicer car.',
      desc2: 'Every VIP engagement is assigned a dedicated BURG coordinator who manages the itinerary, vehicle, and driver briefing end-to-end.',
      features: [
        { icon: '🚗', title: 'Premium Vehicle Selection', desc: 'Innova Crysta, Toyota Fortuner, luxury SUVs, and executive minivans — all maintained and presented to the highest standards.' },
        { icon: '👔', title: 'Uniformed Chauffeurs', desc: 'Drivers are briefed on VIP protocols — formal dress, punctuality standards, mobile silence, and discretion in all interactions.' },
        { icon: '🔒', title: 'Confidentiality Protocols', desc: 'Trip data is access-restricted. Driver NDAs are in place for sensitive engagements involving corporate or diplomatic principals.' },
        { icon: '🧭', title: 'Multi-City Itinerary Management', desc: 'Airport pickups, hotel transfers, site visits, and inter-city legs all coordinated by one BURG VIP coordinator across the full trip.' },
      ],
      idealFor: ['👔 C-Suite Executives', '🏛️ Government Officials', '✈️ Inbound Delegations', '🎊 Special Occasions'],
      visPanelClass: 'bg-gradient-to-br from-[#1a1000] to-[#3d2800]',
      visLabel: 'VIP Service',
      visHeadline: 'White-Glove Transport, Redefined.',
      visChecklist: ['Premium vehicle, immaculate condition', 'Uniformed, briefed chauffeur', 'NDA-backed confidentiality', 'Dedicated BURG coordinator', 'Airport-to-hotel seamless', 'Last-minute changes handled'],
      visStats: [
        { num: '1', label: 'Coordinator Assigned', isVip: true },
        { num: '24/7', label: 'On-Call Support', isVip: true },
      ],
    },
  ];

  const comparisonData = [
    { feature: 'Live GPS Tracking', ridesafe: '✓', corporate: '✓', school: '✓', vip: '✓' },
    { feature: 'Driver Verification', ridesafe: '✓', corporate: '✓', school: '✓ Enhanced', vip: '✓ Premium' },
    { feature: 'Monthly GST Billing', ridesafe: 'Add-on', corporate: '✓', school: '✓', vip: '✓' },
    { feature: 'Parent / Guardian Alerts', ridesafe: 'Optional', corporate: '—', school: '✓', vip: '—' },
    { feature: 'Dedicated Coordinator', ridesafe: '—', corporate: '✓', school: '✓', vip: '✓' },
    { feature: 'Emergency SOS', ridesafe: '✓', corporate: '✓', school: '✓', vip: '✓' },
    { feature: 'Analytics Dashboard', ridesafe: 'Basic', corporate: '✓ Full', school: '✓ Full', vip: 'Trip reports' },
    { feature: 'Confidentiality / NDA', ridesafe: '—', corporate: 'On request', school: '—', vip: '✓ Standard' },
  ];

  const renderCheckMark = (value) => {
    if (value === '✓' || value.includes('✓')) {
      return <span className="text-green-400 text-lg font-bold">{value}</span>;
    } else if (value === '—') {
      return <span className="text-white/20 text-lg">—</span>;
    } else {
      return <span className="text-[#ffd166] text-sm font-semibold">{value}</span>;
    }
  };

  return (
    <div className="w-full">
      <Navbar />

      {/* ═══════════════ PAGE HERO ═══════════════ */}
      <section className="bg-[#001f40] pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-[#1a7aff] text-xs font-bold uppercase tracking-widest mb-3">Our Services</p>
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Five Verticals.<br />One Unified Standard.
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Every BURG service is backed by the same compliance engine, GPS infrastructure, and verified driver network — delivered through a vertical built for your specific need.
          </p>
        </div>
      </section>

      {/* ═══════════════ STICKY SERVICE NAV ═══════════════ */}
      <nav className="sticky top-[72px] z-50 bg-white border-b border-[#d8dfe9] shadow-sm">
        <div className="max-w-6xl mx-auto flex gap-0 overflow-x-auto scrollbar-hide px-6">
          {services.map((service) => (
            <a
              key={service.id}
              href={`#${service.id}`}
              className={`px-5 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap border-b-[3px] transition-all ${
                activeService === service.id
                  ? 'border-[#003366] text-[#003366]'
                  : 'border-transparent text-[#7a8aa0] hover:text-[#003366]'
              }`}
            >
              {service.icon} {service.title}
            </a>
          ))}
        </div>
      </nav>

      {/* ═══════════════ SERVICE BLOCKS ═══════════════ */}
      {services.map((service) => (
        <section key={service.id} id={service.id} className="service-block py-24 px-6 bg-white even:bg-[#f4f7fc]">
          <div className="max-w-6xl mx-auto">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${service.id === 'corporate' || service.id === 'vip' ? 'lg:grid-cols-2' : ''}`}>
              {/* Text Content */}
              <div className={`fade-in ${service.id === 'corporate' || service.id === 'vip' ? 'lg:order-2' : ''}`}>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 bg-blue-100 text-blue-600">
                  {service.icon} {service.badge}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">{service.title}</h2>
                <p className="text-[#5a6e84] text-base leading-relaxed mb-4">{service.desc}</p>
                <p className="text-[#5a6e84] text-base leading-relaxed mb-8">{service.desc2}</p>

                <div className="space-y-4 mb-8">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-lg bg-[#f4f7fc] border border-[#d8dfe9] flex items-center justify-center flex-shrink-0 text-lg">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#003366] mb-1">{feature.title}</h4>
                        <p className="text-sm text-[#5a6e84] leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#7a8aa0]">Ideal for</span>
                  {service.idealFor.map((item, idx) => (
                    <span key={idx} className="text-sm bg-[#eef1f7] text-[#003366] px-3 py-1 rounded-full font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Visual Panel */}
              <div className={`fade-in ${service.id === 'corporate' || service.id === 'vip' ? 'lg:order-1' : ''}`}>
                <div className={`${service.visPanelClass} rounded-3xl p-10 min-h-[400px] flex flex-col justify-between relative overflow-hidden`}>
                  {/* Grid Background */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:32px_32px]"></div>

                  {/* Header */}
                  <div className="relative z-10">
                    <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-300 bg-blue-500/25 px-3 py-1 rounded-full mb-4">
                      {service.visLabel}
                    </span>
                    <h3 className="text-2xl font-bold text-white leading-snug">{service.visHeadline}</h3>
                  </div>

                  {/* Checklist */}
                  <ul className="relative z-10 space-y-2">
                    {service.visChecklist.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-white/70">
                        <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-green-400 flex-shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Stats */}
                  <div className="flex gap-6 relative z-10">
                    {service.visStats.map((stat, idx) => (
                      <div key={idx}>
                        <span className={`block text-2xl font-bold ${stat.isVip ? 'text-[#ffd166]' : 'text-[#f0a500]'}`}>
                          {stat.num}
                        </span>
                        <span className="block text-xs text-white/45 uppercase tracking-widest mt-1">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ═══════════════ COMPARISON TABLE ═══════════════ */}
      <section className="bg-[#001f40] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 fade-in">
            <p className="text-[#f0a500] text-xs font-bold uppercase tracking-widest mb-3">Compare Services</p>
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Which Service is Right for You?</h2>
            <p className="text-white/55 text-lg">A quick reference across all four BURG verticals.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 fade-in">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-white bg-white/3 border-b border-white/10">Feature</th>
                  {services.slice(0, 4).map((service) => (
                    <th key={service.id} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-white/50 bg-white/3 border-b border-white/10 whitespace-nowrap">
                      {service.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/3 transition-colors">
                    <td className="px-6 py-4 border-b border-white/6 text-white font-semibold">{row.feature}</td>
                    <td className="px-6 py-4 border-b border-white/6 text-white/70">{renderCheckMark(row.ridesafe)}</td>
                    <td className="px-6 py-4 border-b border-white/6 text-white/70">{renderCheckMark(row.corporate)}</td>
                    <td className="px-6 py-4 border-b border-white/6 text-white/70">{renderCheckMark(row.school)}</td>
                    <td className="px-6 py-4 border-b border-white/6 text-white/70">{renderCheckMark(row.vip)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA BANNER ═══════════════ */}
      <section className="bg-[#003366] py-20 px-6 relative overflow-hidden fade-in">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 80% at 20% 50%, rgba(0,85,170,0.6) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 80% 50%, rgba(240,165,0,0.12) 0%, transparent 70%)',
        }}></div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Not Sure Which Service Fits?</h2>
          <p className="text-white/65 text-lg mb-8">Talk to our team. We'll map the right BURG solution to your exact transport requirement — no pressure, no generic pitch.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/contact"
              className="px-7 py-3 bg-[#003366] text-white border-2 border-[#003366] rounded-lg font-bold hover:bg-[#0055aa] hover:border-[#0055aa] transition-all"
            >
              Speak to Our Team
            </Link>
            <Link
              to="/platform"
              className="px-7 py-3 bg-transparent text-white border-2 border-white/60 rounded-lg font-bold hover:bg-white/15 hover:border-white transition-all"
            >
              Explore the Platform
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-[#001f40] text-white/65 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div>
            <img src="https://i.ibb.co/rKbMhMsY/BURGRENTAL-COM-BADGE-removebg-preview.png" alt="BURG" className="h-12 mb-4" />
            <p className="text-sm text-white/55 mb-2">Revolutionizing commercial vehicle rentals since 2024.</p>
            <p className="text-xs text-white/30">BURG Rental Services LLP<br />LLPIN: ACR-9256</p>
          </div>
          {[
            { title: 'Company', links: ['Home', 'Platform', 'Technology', 'Contact'] },
            { title: 'Solutions', links: ['RideSafe', 'Corporate Leasing', 'School Transport', 'VIP & Executive'] },
            { title: 'Join Us', links: ['Partner With Us', 'Drive With BURG', 'Enquire Now'] },
          ].map((col, idx) => (
            <div key={idx}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">{col.title}</h4>
              <div className="space-y-2">
                {col.links.map((link, i) => (
                  <a key={i} href="#" className="block text-sm text-white/55 hover:text-[#f0a500] transition-colors">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Contact</h4>
            <p className="text-sm mb-2">📍 Bangalore, Karnataka, India</p>
            <p className="text-sm mb-2">📧 <a href="mailto:hello@burgrental.com" className="hover:text-[#f0a500]">hello@burgrental.com</a></p>
            <p className="text-sm">📞 <a href="tel:+918778579209" className="hover:text-[#f0a500]">+91 87785 79209</a></p>
          </div>
        </div>
        <div className="border-t border-white/8 pt-6 text-center">
          <p className="text-xs text-white/35 mb-2">© 2024–2025 BURG Rental Services LLP. All rights reserved. LLPIN: ACR-9256 | Registered in India.</p>
          <p className="text-xs text-white/22">Commercial vehicle rental marketplace. All fleet partners independently verified. BURG is a facilitator, not a direct transport operator.</p>
        </div>
      </footer>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .fade-in {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default Services;
