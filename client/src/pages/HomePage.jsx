import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../widgets/Footer/Footer';
import vehicleHeroImage from '../assets/vehicle-hero.png';

export default function HomePage() {
  useEffect(() => {
    const fadeEls = document.querySelectorAll('.fade-in');
    if (fadeEls.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, 80);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      
      fadeEls.forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        @keyframes scrollAnim {
          0%   { transform: scaleY(0); transform-origin: top; }
          50%  { transform: scaleY(1); transform-origin: top; }
          51%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes loading {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
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
      
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-screen flex items-center bg-[#001f40] pt-[72px] overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(26,122,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(26,122,255,0.06)_1px,transparent_1px)] bg-[length:60px_60px]"></div>

        {/* Animated Orbs */}
        <div className="absolute top-[-100px] left-[-150px] w-[600px] h-[600px] rounded-full filter blur-[80px] pointer-events-none" style={{background: 'radial-gradient(circle, rgba(0,85,170,0.35) 0%, transparent 70%)'}}></div>
        <div className="absolute bottom-[-50px] right-[-100px] w-[500px] h-[500px] rounded-full filter blur-[80px] pointer-events-none" style={{background: 'radial-gradient(circle, rgba(240,165,0,0.15) 0%, transparent 70%)'}}></div>

        <div className="relative z-[2] max-w-[1200px] mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(340px,520px)] items-center gap-12 lg:gap-8 w-full">
          <div className="flex flex-col items-start">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.85)] font-['DM_Sans'] text-[0.85rem] font-medium px-4 py-[7px] rounded-full mb-7 animate-[fadeSlideDown_0.6s_ease_both]">
              <span className="w-2 h-2 bg-[#4ade80] rounded-full animate-[pulse_2s_infinite]"></span>
              <span>Now operating across Bangalore</span>
            </div>

            {/* Main Title */}
            <h1 className="font-['Syne'] text-[clamp(2.4rem,6vw,5rem)] font-extrabold text-white leading-[1.1] mb-6 animate-[fadeSlideDown_0.7s_0.1s_ease_both]">
              India's Intelligent<br />
              <span className="text-[#f0a500]">Commercial Vehicle</span><br />
              Rental Marketplace
            </h1>

            {/* Subtitle */}
            <p className="text-[clamp(1rem,2vw,1.2rem)] text-[rgba(255,255,255,0.65)] max-w-[580px] leading-[1.75] mb-9 animate-[fadeSlideDown_0.7s_0.2s_ease_both]">
              BURG connects businesses, schools, and individuals to a verified fleet network — powered by technology, driven by safety, built to scale.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3.5 mb-14 animate-[fadeSlideDown_0.7s_0.3s_ease_both]">
              <Link to="/services" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#003366] text-white border-2 border-[#003366] rounded-xl font-['Syne'] font-bold text-[0.95rem] tracking-[0.02em] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0055aa] hover:border-[#0055aa] hover:shadow-[0_6px_24px_rgba(0,51,102,0.14)]">
                Explore Services
              </Link>
              <Link to="/partners" className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-[#003366] border-2 border-[#003366] rounded-xl font-['Syne'] font-bold text-[0.95rem] tracking-[0.02em] transition-all duration-300 hover:bg-[#003366] hover:text-white hover:-translate-y-0.5">
                <span className="text-white border-[rgba(255,255,255,0.6)]">List Your Fleet</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 animate-[fadeSlideDown_0.7s_0.4s_ease_both]">
              <div className="text-left">
                <span className="block font-['Syne'] text-[1.6rem] font-extrabold text-[#f0a500]">B2B2C</span>
                <span className="block text-[0.78rem] text-[rgba(255,255,255,0.5)] uppercase tracking-[0.08em] mt-0.5">Marketplace Model</span>
              </div>
              <div className="text-left">
                <span className="block font-['Syne'] text-[1.6rem] font-extrabold text-[#f0a500]">4</span>
                <span className="block text-[0.78rem] text-[rgba(255,255,255,0.5)] uppercase tracking-[0.08em] mt-0.5">Service Verticals</span>
              </div>
              <div className="text-left">
                <span className="block font-['Syne'] text-[1.6rem] font-extrabold text-[#f0a500]">2024</span>
                <span className="block text-[0.78rem] text-[rgba(255,255,255,0.5)] uppercase tracking-[0.08em] mt-0.5">Founded, Bangalore</span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[540px] justify-self-center lg:justify-self-end lg:w-[150%] lg:max-w-[920px] lg:translate-x-15 lg:-translate-y-27 animate-[fadeSlideDown_0.8s_0.2s_ease_both]">
            <img
              src={vehicleHeroImage}
              alt="BURG commercial vehicle fleet"
              className="w-full h-auto object-contain drop-shadow-[0_26px_55px_rgba(0,0,0,0.4)]"
            />
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[rgba(255,255,255,0.35)] text-[0.72rem] tracking-[0.12em] uppercase font-['Syne'] animate-[fadeIn_1s_1s_ease_both]">
          <span>Scroll</span>
          <div className="w-px h-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.4),transparent)] animate-[scrollAnim_2s_1s_infinite]"></div>
        </div>
      </section>

      {/* ═══════════════ TRUSTED BY / SEGMENTS ═══════════════ */}
      <section className="bg-[#f4f7fc] border-b border-[#d8dfe9] py-5">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center gap-5 flex-wrap">
          <p className="font-['Syne'] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-[#7a8aa0] whitespace-nowrap m-0">Serving</p>
          <div className="flex gap-2.5 flex-wrap">
            {["🏢 Corporates", "🏫 Schools & Colleges", "👤 Retail Commuters", "💎 VIP & Executive", "🚛 Fleet Operators", "🏭 OEMs & Workshops"].map((segment) => (
              <span key={segment} className="inline-flex items-center gap-1.5 bg-white border border-[#d8dfe9] text-[#003366] text-[0.83rem] font-medium px-3.5 py-1.5 rounded-full transition-all duration-300 hover:border-[#0055aa] hover:text-[#0055aa] hover:shadow-[0_2px_8px_rgba(0,51,102,0.1)]">
                {segment}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ABOUT / INTRO ═══════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-[72px] items-start">
          <div className="pt-2 fade-in">
            <p className="font-['Syne'] text-[0.78rem] font-bold tracking-[0.14em] uppercase text-[#1a7aff] mb-3">Who We Are</p>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold text-[#003366] mb-4">A New Infrastructure for Commercial Mobility</h2>
            <p className="text-[1.05rem] text-[#5a6e84] mb-4 leading-[1.75]">
              BURG Rental Services LLP (LLPIN: ACR-9256) is a Bangalore-based B2B2C marketplace that aggregates verified commercial vehicles — buses, tempos, cabs, trucks, and more — and connects them to the clients who need them most.
            </p>
            <p className="text-[1.05rem] text-[#5a6e84] mb-4 leading-[1.75]">
              We don't just facilitate bookings. We layer safety compliance, real-time tracking, driver verification, and fleet analytics on top of every transaction — making vehicle rentals in India genuinely reliable for the first time.
            </p>
            <Link to="/platform" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#003366] text-white border-2 border-[#003366] rounded-xl font-['Syne'] font-bold text-[0.95rem] tracking-[0.02em] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0055aa] hover:border-[#0055aa] hover:shadow-[0_6px_24px_rgba(0,51,102,0.14)] mt-6">
              Our Platform →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 fade-in">
            {[
              { icon: '🛡️', title: 'Safety First', text: 'RideSafe compliance checks, driver background verification, and real-time route monitoring on every trip.' },
              { icon: '📡', title: 'Technology Core', text: 'TONi platform — live GPS tracking, fleet dashboards, passenger display, and analytics built in-house.' },
              { icon: '💰', title: 'Cost Efficient', text: 'Marketplace aggregation eliminates middlemen. Operators get more. Clients pay less. Everyone wins.' },
              { icon: '📈', title: 'Built to Scale', text: 'From single-trip bookings to full fleet management contracts — BURG handles any scale of mobility need.' }
            ].map((pillar) => (
              <div key={pillar.title} className="bg-[#f4f7fc] border border-[#d8dfe9] rounded-xl p-6 transition-all duration-300 hover:border-[#0055aa] hover:shadow-[0_6px_24px_rgba(0,51,102,0.14)] hover:-translate-y-[3px]">
                <div className="text-[1.8rem] mb-3">{pillar.icon}</div>
                <h3 className="text-[1rem] font-bold text-[#003366] mb-2">{pillar.title}</h3>
                <p className="text-[0.88rem] text-[#5a6e84] leading-[1.6]">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SERVICES SNAPSHOT ═══════════════ */}
      <section className="bg-[#f4f7fc] py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14 fade-in">
            <p className="font-['Syne'] text-[0.78rem] font-bold tracking-[0.14em] uppercase text-[#1a7aff] mb-3">What We Offer</p>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold text-[#003366] mb-4">End-to-End Mobility Solutions</h2>
            <p className="text-[1.1rem] text-[#5a6e84] max-w-[560px] mx-auto">Four specialised service verticals, one unified platform.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 fade-in">

            <Link to="/services" className="block relative bg-white border border-[#d8dfe9] rounded-[20px] p-8 md:px-[28px] md:py-[32px] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(0,51,102,0.18)] hover:border-transparent group before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:rounded-t-[20px] before:bg-[linear-gradient(90deg,#0055aa,#1a7aff)] before:transition-all before:duration-300">
              <div className="inline-block font-['Syne'] text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#1a7aff] bg-[rgba(26,122,255,0.07)] px-2.5 py-1 rounded mb-3.5">Safety-as-a-Service</div>
              <h3 className="font-['Syne'] text-[1.2rem] font-extrabold text-[#003366] mb-2.5 leading-tight">RideSafe</h3>
              <p className="text-[0.9rem] text-[#5a6e84] leading-[1.65] mb-5">Compliance monitoring, route alerts, and passenger safety protocols for schools and corporates.</p>
              <span className="inline-block text-[1.1rem] text-[#0055aa] transition-all duration-300 group-hover:translate-x-1.5">→</span>
            </Link>

            <Link to="/services" className="block relative bg-white border border-[#d8dfe9] rounded-[20px] p-8 md:px-[28px] md:py-[32px] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(0,51,102,0.18)] hover:border-transparent group before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:rounded-t-[20px] before:bg-[linear-gradient(90deg,#003366,#0055aa)] before:transition-all before:duration-300">
              <div className="inline-block font-['Syne'] text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#1a7aff] bg-[rgba(26,122,255,0.07)] px-2.5 py-1 rounded mb-3.5">Enterprise</div>
              <h3 className="font-['Syne'] text-[1.2rem] font-extrabold text-[#003366] mb-2.5 leading-tight">Corporate Leasing</h3>
              <p className="text-[0.9rem] text-[#5a6e84] leading-[1.65] mb-5">Dedicated fleet management, employee transport SLAs, and monthly billing for businesses.</p>
              <span className="inline-block text-[1.1rem] text-[#0055aa] transition-all duration-300 group-hover:translate-x-1.5">→</span>
            </Link>

            <Link to="/services" className="block relative bg-white border border-[#d8dfe9] rounded-[20px] p-8 md:px-[28px] md:py-[32px] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(0,51,102,0.18)] hover:border-transparent group lg:col-span-1 md:col-span-2 before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:rounded-t-[20px] before:bg-[linear-gradient(90deg,#0077cc,#00aaff)] before:transition-all before:duration-300 lg:after:hidden md:w-1/2 md:mx-auto lg:w-full">
              <div className="inline-block font-['Syne'] text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#1a7aff] bg-[rgba(26,122,255,0.07)] px-2.5 py-1 rounded mb-3.5">Education</div>
              <h3 className="font-['Syne'] text-[1.2rem] font-extrabold text-[#003366] mb-2.5 leading-tight">School Transport</h3>
              <p className="text-[0.9rem] text-[#5a6e84] leading-[1.65] mb-5">GPS-tracked school buses with parent notifications, attendance logs, and guardian alerts.</p>
              <span className="inline-block text-[1.1rem] text-[#0055aa] transition-all duration-300 group-hover:translate-x-1.5">→</span>
            </Link>

            <Link to="/services" className="block lg:col-start-1 lg:col-end-2 md:col-start-1 lg:ml-[calc(50%+10px)] relative bg-white border border-[#d8dfe9] rounded-[20px] p-8 md:px-[28px] md:py-[32px] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(0,51,102,0.18)] hover:border-transparent group before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:rounded-t-[20px] before:bg-[linear-gradient(90deg,#f0a500,#ffd166)] before:transition-all before:duration-300">
              <div className="inline-block font-['Syne'] text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#1a7aff] bg-[rgba(26,122,255,0.07)] px-2.5 py-1 rounded mb-3.5">Premium</div>
              <h3 className="font-['Syne'] text-[1.2rem] font-extrabold text-[#003366] mb-2.5 leading-tight">VIP &amp; Executive</h3>
              <p className="text-[0.9rem] text-[#5a6e84] leading-[1.65] mb-5">Chauffeur-driven luxury vehicles for senior executives, dignitaries, and special occasions.</p>
              <span className="inline-block text-[1.1rem] text-[#0055aa] transition-all duration-300 group-hover:translate-x-1.5">→</span>
            </Link>

          </div>
        </div>
      </section>

      {/* ═══════════════ IMPACT / NUMBERS ═══════════════ */}
      <section className="section bg-white py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14 fade-in">
            <p className="font-['Syne'] text-[0.78rem] font-bold tracking-[0.14em] uppercase text-[#1a7aff] mb-3">Our Impact</p>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold text-[#003366] mb-4">Moving India Forward</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in">
            <div className="border border-[#d8dfe9] rounded-[20px] p-8 md:px-8 md:py-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_24px_rgba(0,51,102,0.14)]">
              <div className="text-[2rem] mb-4">👷</div>
              <h3 className="font-['Syne'] text-base font-bold text-[#003366] mb-2 leading-tight">Jobs &amp; Livelihoods</h3>
              <p className="text-[0.88rem] text-[#5a6e84] leading-[1.6]">Creating dignified employment for drivers, fleet operators, and logistics professionals across Karnataka and beyond.</p>
            </div>
            <div className="border border-[#003366] bg-[#003366] rounded-[20px] p-8 md:px-8 md:py-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_24px_rgba(0,51,102,0.14)] text-white">
              <div className="text-[2rem] mb-4">🌱</div>
              <h3 className="font-['Syne'] text-base font-bold text-white mb-2 leading-tight">Sustainability</h3>
              <p className="text-[0.88rem] text-[rgba(255,255,255,0.7)] leading-[1.6]">Shared fleet models reduce private vehicle trips, cutting urban congestion and carbon footprints in Indian cities.</p>
            </div>
            <div className="border border-[#d8dfe9] rounded-[20px] p-8 md:px-8 md:py-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_24px_rgba(0,51,102,0.14)]">
              <div className="text-[2rem] mb-4">🔒</div>
              <h3 className="font-['Syne'] text-base font-bold text-[#003366] mb-2 leading-tight">Road Safety</h3>
              <p className="text-[0.88rem] text-[#5a6e84] leading-[1.6]">Digitising compliance — vehicle fitness, driver licensing, insurance — across a historically unorganised sector.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TECHNOLOGY TEASER ═══════════════ */}
      <section className="bg-[#f4f7fc] py-[96px]">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-[72px] items-center">
          <div className="fade-in">
            <p className="font-['Syne'] text-[0.78rem] font-bold tracking-[0.14em] uppercase text-[#1a7aff] mb-3">Proprietary Technology</p>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold text-[#003366] mb-4">Meet TONi — Transport Oriented Network Interface</h2>
            <p className="text-[1.05rem] text-[#5a6e84] mb-4 leading-[1.75]">
              BURG's in-house fleet management platform delivers real-time GPS tracking, admin dashboards, driver apps, and passenger displays — all synced live. TONi is what separates BURG from every other vehicle broker in the country.
            </p>
            <Link to="/technology" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#003366] text-white border-2 border-[#003366] rounded-xl font-['Syne'] font-bold text-[0.95rem] tracking-[0.02em] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0055aa] hover:border-[#0055aa] hover:shadow-[0_6px_24px_rgba(0,51,102,0.14)] mt-6">
              Explore Technology →
            </Link>
          </div>
          <div className="perspective-[1000px] fade-in">
            <div className="bg-[#001f40] rounded-[16px] border border-[rgba(255,255,255,0.1)] overflow-hidden shadow-[0_24px_64px_rgba(0,31,64,0.25)] transition-transform duration-[0.6s]">
              <div className="bg-[rgba(0,0,0,0.3)] px-4 py-3 flex items-center gap-2 border-b border-[rgba(255,255,255,0.05)]">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
                <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
                <span className="ml-[10px] text-[0.75rem] font-['DM_Sans'] text-[rgba(255,255,255,0.5)] tracking-[0.05em] uppercase font-bold">TONi Admin Dashboard</span>
              </div>
              <div className="p-7 flex flex-col gap-4">
                <div className="flex justify-between items-center py-2.5 border-b border-[rgba(255,255,255,0.05)]">
                  <span className="text-[0.88rem] text-[rgba(255,255,255,0.6)] font-medium">Live Fleet</span>
                  <span className="text-[0.95rem] font-bold text-[#4ade80] flex items-center gap-[6px] animate-[pulse_2s_infinite]">● 24 Active</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-[rgba(255,255,255,0.05)]">
                  <span className="text-[0.88rem] text-[rgba(255,255,255,0.6)] font-medium">Trips Today</span>
                  <span className="text-[0.95rem] font-bold text-white">138</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-[rgba(255,255,255,0.05)]">
                  <span className="text-[0.88rem] text-[rgba(255,255,255,0.6)] font-medium">Alerts</span>
                  <span className="text-[0.95rem] font-bold text-[#ffd166]">2 Pending</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-[rgba(255,255,255,0.05)]">
                  <span className="text-[0.88rem] text-[rgba(255,255,255,0.6)] font-medium">GPS Sync</span>
                  <span className="text-[0.95rem] font-bold text-[#4ade80] flex items-center gap-[6px] animate-[pulse_2s_infinite]">● 3s interval</span>
                </div>
                <div className="flex justify-between items-center py-2.5 pb-2">
                  <span className="text-[0.88rem] text-[rgba(255,255,255,0.6)] font-medium">Driver Verified</span>
                  <span className="text-[0.95rem] font-bold text-white">21 / 24</span>
                </div>
                <div className="w-full h-[6px] bg-[rgba(255,255,255,0.1)] rounded-[100px] overflow-hidden mt-1">
                  <div className="h-full bg-[linear-gradient(90deg,#1a7aff,#66b3ff)] w-[87.5%] relative after:absolute after:inset-0 after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] after:animate-[loading_2s_infinite]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA BANNER ═══════════════ */}
      <section className="relative overflow-hidden bg-[#003366] py-[80px] w-full">
        <div className="absolute inset-0 bg-[rgba(26,122,255,0.1)] Mix-blend-overlay"></div>
        <div className="relative z-[2] max-w-[800px] mx-auto text-center px-6 fade-in">
          <h2 className="font-['Syne'] text-[clamp(1.6rem,3.5vw,2.4rem)] font-extrabold text-white mb-4 leading-tight">Ready to Transform Your Fleet Operations?</h2>
          <p className="text-[1.1rem] text-[rgba(255,255,255,0.65)] mb-8 max-w-[600px] mx-auto leading-[1.6]">Whether you're a business, school, fleet owner, or driver — BURG has a place for you.</p>
          <div className="flex flex-wrap justify-center gap-[14px]">
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#f0a500] text-[#001f40] border-2 border-[#f0a500] rounded-xl font-['Syne'] font-bold text-[0.95rem] tracking-[0.02em] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ffd166] hover:shadow-[0_6px_24px_rgba(0,51,102,0.14)]">
              Get in Touch
            </Link>
            <Link to="/partners" className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-white border-2 border-[rgba(255,255,255,0.6)] rounded-xl font-['Syne'] font-bold text-[0.95rem] tracking-[0.02em] transition-all duration-300 hover:bg-[rgba(255,255,255,0.15)] hover:border-white hover:-translate-y-0.5">
              Become a Partner
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-[#001f40] pt-[72px] pb-[56px] border-t border-[rgba(255,255,255,0.08)] mt-auto w-full relative z-[10]">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-[48px] mb-16">
          <div className="pr-10">
            <Link to="/" className="inline-block text-white font-['Syne'] text-[1.8rem] font-extrabold tracking-[-0.02em] mb-4 transition-opacity duration-300 hover:opacity-80">
              BURG
            </Link>
            <p className="text-[0.95rem] text-[rgba(255,255,255,0.6)] leading-[1.7] mb-6 max-w-[320px]">
              India's first B2B2C marketplace for commercial vehicle rentals. Unifying capacity, compliance, and technology.
            </p>
            <div className="flex gap-[18px]">
              <a href="#" className="w-[38px] h-[38px] rounded-full bg-[rgba(255,255,255,0.05)] flex justify-center items-center text-white text-[1.1rem] transition-all duration-300 border border-[rgba(255,255,255,0.1)] hover:bg-[#1a7aff] hover:border-[#1a7aff] hover:-translate-y-[3px]">in</a>
              <a href="#" className="w-[38px] h-[38px] rounded-full bg-[rgba(255,255,255,0.05)] flex justify-center items-center text-white text-[1.1rem] transition-all duration-300 border border-[rgba(255,255,255,0.1)] hover:bg-[#1a7aff] hover:border-[#1a7aff] hover:-translate-y-[3px]">tw</a>
              <a href="#" className="w-[38px] h-[38px] rounded-full bg-[rgba(255,255,255,0.05)] flex justify-center items-center text-white text-[1.1rem] transition-all duration-300 border border-[rgba(255,255,255,0.1)] hover:bg-[#1a7aff] hover:border-[#1a7aff] hover:-translate-y-[3px]">ig</a>
            </div>
          </div>
          <div>
            <h4 className="font-['Syne'] text-[1.05rem] font-bold text-white mb-5">Platform</h4>
            <ul className="list-none p-0 flex flex-col gap-[14px]">
              <li><Link to="/services" className="text-[0.95rem] text-[rgba(255,255,255,0.6)] font-medium transition-all duration-300 hover:text-white hover:pl-[5px]">RideSafe</Link></li>
              <li><Link to="/services" className="text-[0.95rem] text-[rgba(255,255,255,0.6)] font-medium transition-all duration-300 hover:text-white hover:pl-[5px]">Corporate</Link></li>
              <li><Link to="/services" className="text-[0.95rem] text-[rgba(255,255,255,0.6)] font-medium transition-all duration-300 hover:text-white hover:pl-[5px]">School Transport</Link></li>
              <li><Link to="/technology" className="text-[0.95rem] text-[rgba(255,255,255,0.6)] font-medium transition-all duration-300 hover:text-white hover:pl-[5px]">TONi Tech Info</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-['Syne'] text-[1.05rem] font-bold text-white mb-5">Company</h4>
            <ul className="list-none p-0 flex flex-col gap-[14px]">
              <li><a href="#" className="text-[0.95rem] text-[rgba(255,255,255,0.6)] font-medium transition-all duration-300 hover:text-white hover:pl-[5px]">About Us</a></li>
              <li><Link to="/partners" className="text-[0.95rem] text-[rgba(255,255,255,0.6)] font-medium transition-all duration-300 hover:text-white hover:pl-[5px]">Partner with Us</Link></li>
              <li><a href="#" className="text-[0.95rem] text-[rgba(255,255,255,0.6)] font-medium transition-all duration-300 hover:text-white hover:pl-[5px]">Careers</a></li>
              <li><Link to="/contact" className="text-[0.95rem] text-[rgba(255,255,255,0.6)] font-medium transition-all duration-300 hover:text-white hover:pl-[5px]">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-['Syne'] text-[1.05rem] font-bold text-white mb-5">ContactHQ</h4>
            <p className="text-[0.95rem] text-[rgba(255,255,255,0.6)] leading-[1.6] mb-[2px]">
              Bangalore
            </p>
          </div>
          <div>
            <h4 className="font-['Syne'] text-[1.05rem] font-bold text-white mb-5">Contact HQ</h4>
            <p className="text-[0.95rem] text-[rgba(255,255,255,0.6)] leading-[1.6] mb-3">Sector 4, HSR Layout<br />Bangalore, Karnataka 560102</p>
            <p className="text-[0.95rem] text-[rgba(255,255,255,0.6)] leading-[1.6] mb-[2px]"><strong>Phone:</strong> +91 99000 XXXXX</p>
            <p className="text-[0.95rem] text-[rgba(255,255,255,0.6)] leading-[1.6]"><strong>Email:</strong> operations@burg.co.in</p>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 border-t border-[rgba(255,255,255,0.05)] pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[0.85rem] text-[rgba(255,255,255,0.4)]">
          <p>© {new Date().getFullYear()} BURG Rental Services LLP. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors duration-300">Terms of Service</a>
            <a href="#" className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors duration-300">Refund Policy</a>
          </div>
        </div>
      </footer>
    </>
  );
}
