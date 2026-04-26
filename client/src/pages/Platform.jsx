import React, { useState, useEffect } from 'react';
import Navbar from '../widgets/Navbar/Navbar';

const Platform = () => {
  const [activeSegment, setActiveSegment] = useState('corporate');
  const [fadeInElements, setFadeInElements] = useState({});
  const [navbarScrolled, setNavbarScrolled] = useState(false);

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

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setNavbarScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const segmentPanels = {
    corporate: [
      { icon: '📋', title: 'Dedicated Fleet Contracts', desc: 'Monthly or annual agreements with assigned vehicles, SLA-backed reliability, and a single point of contact for all transport needs.' },
      { icon: '📊', title: 'Usage Analytics Dashboard', desc: 'Cost-per-employee, route utilisation, and monthly spend reports delivered automatically to your finance and admin teams.' },
      { icon: '🧾', title: 'Consolidated GST Billing', desc: 'One invoice per month covering all trips, fully GST-compliant, and integrated with standard enterprise procurement workflows.' },
      { icon: '🛡️', title: 'RideSafe Compliance', desc: 'All corporate fleet vehicles undergo BURG\'s RideSafe audit — driver background checks, vehicle fitness, and live trip monitoring included.' },
    ],
    school: [
      { icon: '📍', title: 'Live Route Tracking', desc: 'Parents and school administrators see every bus live on a map. Arrival estimates are pushed via WhatsApp notifications automatically.' },
      { icon: '📋', title: 'Digital Attendance Logs', desc: 'Student boarding and alighting is recorded per trip, giving schools a fully auditable attendance trail for every route.' },
      { icon: '🔐', title: 'Verified Drivers Only', desc: 'Every driver assigned to school routes completes BURG\'s enhanced background verification and RideSafe driver safety training.' },
      { icon: '💰', title: 'Fee Collection & Billing', desc: 'Schools can collect transport fees from parents digitally through BURG\'s integrated payment system — reducing admin overhead significantly.' },
    ],
    retail: [
      { icon: '📱', title: 'On-Demand Booking', desc: 'Individual commuters and small groups can book verified vehicles for outstation trips, events, or regular point-to-point routes without a long-term contract.' },
      { icon: '💸', title: 'Transparent Pricing', desc: 'No hidden charges. Distance-based pricing slabs are displayed upfront. Clients pay only for what they use — no surge pricing surprises.' },
      { icon: '🛡️', title: 'Safety Assurance', desc: 'Even single-trip retail bookings are covered by BURG\'s compliance checks — every vehicle is verified before it reaches you.' },
      { icon: '📞', title: 'Human Support', desc: 'Our team is reachable by phone and WhatsApp. Retail clients always have a real person to speak to for bookings, changes, or issues.' },
    ],
    vip: [
      { icon: '🚗', title: 'Curated Luxury Fleet', desc: 'Sedan and SUV options from BURG\'s premium fleet pool — Innova Crysta, Fortuner, and executive minivans — maintained to the highest standards.' },
      { icon: '👔', title: 'Professional Chauffeurs', desc: 'Uniformed, briefed, and background-verified drivers trained specifically in executive hospitality and discretion protocols.' },
      { icon: '🔒', title: 'Privacy & Confidentiality', desc: 'Trip data for VIP clients is handled with strict access controls. Driver NDAs are in place for high-profile and diplomatic engagements.' },
      { icon: '🎯', title: 'Concierge Coordination', desc: 'Airport pickups, hotel transfers, multi-city itineraries, and last-minute changes are handled by a dedicated VIP coordination team.' },
    ],
  };

  return (
    <div className="w-full">
      <Navbar />

      {/* ═══════════════ PAGE HERO ═══════════════ */}
      <section className="bg-[#001f40] pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <p className="text-[#1a7aff] text-xs font-bold uppercase tracking-widest mb-3">The BURG Platform</p>
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-6 leading-tight">
            One Platform.<br />Every Vehicle. Every Need.
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Fleet aggregation, intelligent booking, compliance automation, and real-time analytics — unified into a single B2B2C marketplace for commercial mobility in India.
          </p>
        </div>
      </section>

      {/* ═══════════════ PLATFORM OVERVIEW ═══════════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in">
            <p className="text-[#1a7aff] text-xs font-bold uppercase tracking-widest mb-2">What The Platform Does</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">Four Pillars of the BURG Marketplace</h2>
            <p className="text-[#5a6e84] text-lg max-w-2xl mx-auto">
              Every feature is designed to solve a real problem in India's unorganised commercial transport sector.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#d8dfe9] border-2 border-[#d8dfe9] rounded-2xl overflow-hidden fade-in">
            {[
              { icon: '🔗', title: 'Fleet Aggregation', desc: 'We onboard and verify buses, tempos, cabs, trucks, and specialised vehicles from independent operators across cities — creating a single, reliable supply pool.' },
              { icon: '📅', title: 'Intelligent Booking', desc: 'Clients book via web portal or direct account managers. Smart matching surfaces the best-fit vehicles based on route, capacity, compliance status, and price.' },
              { icon: '✅', title: 'Compliance Engine', desc: 'Vehicle fitness certificates, driver licences, insurance validity, and pollution checks are tracked and auto-flagged — keeping every trip legally sound.' },
              { icon: '📊', title: 'Analytics & Reporting', desc: 'Corporate clients get monthly utilisation reports, cost-per-km breakdowns, and safety scorecards. Fleet partners see earnings, trip history, and performance data.' },
              { icon: '📡', title: 'Live GPS Tracking', desc: 'Every active vehicle broadcasts real-time location via TONi — our proprietary fleet management system — updating every 3 seconds with route deviation alerts.' },
              { icon: '💳', title: 'Payments & Billing', desc: 'Automated invoicing, digital payments via Razorpay, and monthly consolidated billing for corporate accounts. Transparent, auditable, and GST-compliant.' },
            ].map((feat, idx) => (
              <div
                key={idx}
                className="bg-white p-9 hover:bg-[#003366] transition-all duration-300 cursor-pointer group"
              >
                <div className="text-2xl mb-3 group-hover:filter group-hover:grayscale-0 group-hover:brightness-200 transition-all">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-[#003366] mb-2 group-hover:text-white transition-colors">
                  {feat.title}
                </h3>
                <p className="text-sm text-[#5a6e84] leading-relaxed group-hover:text-white transition-colors">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="py-24 px-6 bg-[#f4f7fc]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in">
            <p className="text-[#1a7aff] text-xs font-bold uppercase tracking-widest mb-2">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">From Enquiry to Trip — Seamlessly</h2>
            <p className="text-[#5a6e84] text-lg">A streamlined workflow for clients and fleet partners alike.</p>
          </div>

          <div className="max-w-2xl mx-auto fade-in" style={{ position: 'relative' }}>
            <style>{`
              .stepper::before {
                content: '';
                position: absolute;
                left: 28px;
                top: 48px;
                bottom: 48px;
                width: 2px;
                background: linear-gradient(to bottom, #0055aa, rgba(0,85,170,0.1));
              }
              @media (max-width: 768px) {
                .stepper::before {
                  left: 22px;
                }
              }
            `}</style>
            <div className="stepper relative">
              {[
                { num: 1, tag: 'Client', title: 'Submit Your Requirement', desc: 'A corporate, school, or individual client submits their transport requirement — route, date, vehicle type, and passenger count — via our web portal or by contacting our account team directly.' },
                { num: 2, tag: 'Platform', title: 'Smart Fleet Matching', desc: 'BURG\'s platform scans the verified fleet pool, filters for compliance status, checks availability, and surfaces the best-fit options with transparent pricing — within minutes.' },
                { num: 3, tag: 'Client', title: 'Confirm & Pay', desc: 'The client confirms the booking and pays via our secure Razorpay-integrated payment gateway. Corporate accounts can opt for monthly consolidated invoicing instead.' },
                { num: 4, tag: 'Fleet Partner', title: 'Trip Assigned to Driver', desc: 'The assigned fleet operator receives trip details instantly. The driver is notified via the TONi Driver App, confirms with a trip code, and the vehicle is en route.' },
                { num: 5, tag: 'Live', title: 'Real-Time Monitoring', desc: 'Throughout the journey, TONi tracks the vehicle live. Clients and administrators can view the bus on a live map. Route deviations or SOS events trigger instant alerts.' },
                { num: 6, tag: 'Post-Trip', title: 'Report, Pay Out & Rate', desc: 'On trip completion, the platform auto-generates a trip report. Fleet partners receive their payout per agreed terms. Clients can rate the trip to maintain quality standards.' },
              ].map((step) => (
                <div key={step.num} className="flex gap-7 mb-12 relative group" style={{ paddingBottom: step.num === 6 ? 0 : 48 }}>
                  <div
                    className="w-14 h-14 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold text-lg flex-shrink-0 relative z-10 transition-all group-hover:bg-[#0055aa]"
                    style={{
                      boxShadow: '0 0 0 4px white, 0 0 0 6px rgba(0,51,102,0.2)',
                    }}
                  >
                    {step.num}
                  </div>
                  <div className="pt-3">
                    <span className="inline-block text-[#1a7aff] text-xs font-bold uppercase tracking-widest bg-[rgba(26,122,255,0.08)] px-2 py-1 rounded mb-2">
                      {step.tag}
                    </span>
                    <h3 className="text-lg font-bold text-[#003366] mb-2">{step.title}</h3>
                    <p className="text-[#5a6e84] text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ USER SEGMENTS ═══════════════ */}
      <section className="py-24 px-6 bg-[#f4f7fc]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 fade-in">
            <p className="text-[#1a7aff] text-xs font-bold uppercase tracking-widest mb-2">Who Uses BURG</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">Built for Every Mobility Stakeholder</h2>
            <p className="text-[#5a6e84] text-lg">From large enterprises to daily commuters — explore how each user type benefits.</p>
          </div>

          <div className="flex gap-2 justify-center flex-wrap mb-12 fade-in">
            {[
              { key: 'corporate', label: '🏢 Corporates' },
              { key: 'school', label: '🏫 Schools' },
              { key: 'retail', label: '👤 Retail' },
              { key: 'vip', label: '💎 VIP' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveSegment(tab.key)}
                className={`px-5 py-2 rounded-full border-2 font-bold text-sm transition-all ${
                  activeSegment === tab.key
                    ? 'bg-[#003366] text-white border-[#003366]'
                    : 'bg-white text-[#003366] border-[#d8dfe9] hover:bg-[#003366] hover:text-white hover:border-[#003366]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="fade-in">
            {Object.entries(segmentPanels).map(([key, cards]) => (
              <div
                key={key}
                className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
                  activeSegment === key ? 'block' : 'hidden'
                }`}
              >
                {cards.map((card, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-[#d8dfe9] rounded-2xl p-7 flex gap-4 hover:shadow-md hover:translate-y-[-3px] transition-all"
                  >
                    <div className="text-2xl flex-shrink-0 w-13 h-13 bg-[#f4f7fc] rounded-lg flex items-center justify-center">
                      {card.icon}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#003366] mb-1">{card.title}</h4>
                      <p className="text-sm text-[#5a6e84] leading-relaxed">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ COMPLIANCE ═══════════════ */}
      <section className="py-24 px-6 bg-[#003366] relative overflow-hidden fade-in">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <p className="text-[#f0a500] text-xs font-bold uppercase tracking-widest mb-3">Compliance</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Every Vehicle. Every Trip.<br />Fully Verified.
            </h2>
            <p className="text-white/60 leading-relaxed">
              India's commercial transport sector is plagued by unverified operators and ignored regulations. BURG's compliance engine changes this — tracking every required document and flagging expiries automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '📄', label: 'Vehicle Fitness Certificate' },
              { icon: '🪪', label: 'Driver Licence Verification' },
              { icon: '🛡️', label: 'Third-Party Insurance' },
              { icon: '🌫️', label: 'Pollution Under Control' },
              { icon: '🔍', label: 'Background Check' },
              { icon: '📍', label: 'GPS Device Verified' },
            ].map((badge, idx) => (
              <div
                key={idx}
                className="bg-white/6 border border-white/12 rounded-lg p-5 text-center hover:bg-white/10 hover:border-white/25 transition-all"
              >
                <div className="text-2xl mb-2">{badge.icon}</div>
                <span className="text-xs font-bold text-white/75 leading-relaxed">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ANALYTICS ═══════════════ */}
      <section className="py-24 px-6 bg-[#f4f7fc]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="fade-in">
            <p className="text-[#1a7aff] text-xs font-bold uppercase tracking-widest mb-3">Data & Analytics</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">Decisions Powered by Real Data</h2>
            <p className="text-[#5a6e84] text-lg leading-relaxed mb-6">
              Corporate clients and fleet partners both have access to live dashboards and monthly reports. No more guessing — track every rupee, every kilometre, and every trip in one place.
            </p>
            <ul className="space-y-3">
              {[
                'Fleet utilisation rates by vehicle type and route',
                'Cost-per-kilometre trends across billing periods',
                'Driver performance and safety incident logs',
                'Compliance expiry calendars with auto-reminders',
                'Partner earnings breakdowns and payout history',
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3 items-start text-sm text-[#5a6e84]">
                  <span className="text-[#1a7aff] font-bold flex-shrink-0">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="fade-in grid grid-cols-2 gap-3">
            <div className="col-span-2 bg-[#003366] rounded-lg p-5 text-white">
              <div className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Fleet Utilisation — Current Month</div>
              <div className="text-3xl font-bold text-[#f0a500] mb-2">87.5%</div>
              <div className="text-xs text-white/45 mb-3">↑ 6.2% vs last month</div>
              <div className="h-1 bg-white/20 rounded overflow-hidden">
                <div className="h-full w-[87.5%] bg-gradient-to-r from-[#0055aa] to-[#1a7aff]"></div>
              </div>
            </div>

            {[
              { label: 'Trips Completed', value: '138', sub: 'This month', width: '72%' },
              { label: 'Compliance Rate', value: '96%', sub: 'Verified fleet', width: '96%' },
              { label: 'Active Partners', value: '24', sub: 'Onboarded operators', width: '60%' },
              { label: 'Avg. Trip Rating', value: '4.7', sub: 'Out of 5.0', width: '94%' },
            ].map((metric, idx) => (
              <div key={idx} className="bg-white border border-[#d8dfe9] rounded-lg p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-[#7a8aa0] mb-2">{metric.label}</div>
                <div className="text-2xl font-bold text-[#003366] mb-1">{metric.value}</div>
                <div className="text-xs text-[#5a6e84] mb-2">{metric.sub}</div>
                <div className="h-1 bg-[#eef1f7] rounded overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#0055aa] to-[#1a7aff]" style={{ width: metric.width }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA BANNER ═══════════════ */}
      <section className="py-20 px-6 bg-[#003366] relative overflow-hidden text-center fade-in">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 80% at 20% 50%, rgba(0,85,170,0.6) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 80% 50%, rgba(240,165,0,0.12) 0%, transparent 70%)',
        }}></div>
        <div className="max-w-2xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Put Your Fleet on BURG?</h2>
          <p className="text-white/65 text-lg mb-8">Join as a fleet partner or register your organisation as a client — setup takes less than a day.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/contact"
              className="px-7 py-3 bg-[#f0a500] text-[#001f40] font-bold rounded-lg hover:bg-[#ffd166] transition-all"
            >
              Register Your Organisation
            </a>
            <a
              href="/partners"
              className="px-7 py-3 bg-transparent text-white border-2 border-white/60 font-bold rounded-lg hover:bg-white/15 hover:border-white transition-all"
            >
              Partner With Us
            </a>
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

export default Platform;
