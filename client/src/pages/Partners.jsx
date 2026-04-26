import React, { useState, useEffect } from 'react';
import Footer from '../widgets/Footer/Footer';

const Partners = () => {
  const [activeTab, setActiveTab] = useState('fleet');

  useEffect(() => {
    // Fade-in animation observer
    const fadeEls = document.querySelectorAll('.fade-in');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('opacity-100', 'translate-y-0');
          e.target.classList.remove('opacity-0', 'translate-y-4');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    fadeEls.forEach(el => {
      el.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-700', 'ease-out');
      obs.observe(el);
    });

    return () => obs.disconnect();
  }, [activeTab]);

  const tabs = [
    { id: 'fleet', icon: '🚌', label: 'Fleet Owners' },
    { id: 'oem', icon: '🏭', label: 'OEMs' },
    { id: 'workshop', icon: '🔧', label: 'Workshops' },
    { id: 'insurance', icon: '🛡️', label: 'Insurance' },
    { id: 'tech', icon: '💻', label: 'Tech Partners' },
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // WhatsApp logic from script.js
    const WA_NUMBER = '918778579209';
    let text = `*New Partnership Enquiry*\n\n`;
    text += `*Name:* ${data.name}\n`;
    text += `*Company:* ${data.company}\n`;
    text += `*Email:* ${data.email}\n`;
    text += `*Phone:* ${data.phone}\n`;
    text += `*Type:* ${data.partner_type}\n`;
    text += `*City:* ${data.city}\n`;
    if (data.fleet_size) text += `*Scale:* ${data.fleet_size}\n`;
    if (data.message) text += `*Message:* ${data.message}\n`;
    
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="font-['DM_Sans'] text-gray-800">

      {/* PAGE HERO */}
      <section className="bg-[#0B1E33] text-white py-24 px-4 text-center mt-16">
        <div className="max-w-4xl mx-auto fade-in">
          <p className="text-[#E5B217] font-bold tracking-widest uppercase text-sm mb-4 font-['Syne']">Partner With BURG</p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 font-['Syne'] leading-tight">Grow With India's<br />Commercial Fleet Network</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">Whether you own vehicles, service them, insure them, or build for them — BURG has a partnership model that turns your asset or expertise into a revenue stream.</p>
        </div>
      </section>

      {/* PARTNER TYPE TABS */}
      <div className="bg-[#F5F7FB] pt-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-3 justify-start md:justify-center flex-nowrap md:flex-wrap overflow-x-auto pb-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-2 py-5 px-7 min-w-[120px] md:min-w-[140px] transition-all rounded-t-xl border border-gray-200 border-b-0 relative -bottom-px ${activeTab === tab.id ? 'bg-white shadow-sm border-b-white z-10' : 'bg-white/50 hover:bg-white'}`}
              >
                <span className="text-2xl">{tab.icon}</span>
                <span className={`font-['Syne'] text-xs font-bold uppercase tracking-widest ${activeTab === tab.id ? 'text-[#0B1E33]' : 'text-gray-500'}`}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PARTNER PANELS */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          
          {/* FLEET OWNERS */}
          {activeTab === 'fleet' && (
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
              <div className="fade-in">
                <p className="text-[#E5B217] font-bold tracking-widest uppercase text-sm mb-4 font-['Syne']">Fleet Owners</p>
                <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B1E33] mb-6 font-['Syne'] leading-tight">Your Vehicles.<br />Our Clients.<br />Steady Revenue.</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">If you own buses, tempos, cabs, or trucks sitting idle between contracts, BURG turns that downtime into income. We connect your fleet to a consistent pipeline of corporate clients, schools, and logistics customers — with no sales effort required from you.</p>
                <p className="text-gray-600 mb-6 leading-relaxed">You focus on maintaining your vehicles and keeping drivers ready. BURG handles bookings, billing, compliance tracking, and client relationships.</p>

                <div className="bg-[#0B1E33] rounded-2xl p-8 mt-8">
                  <div className="text-[#E5B217] font-bold tracking-widest uppercase text-[11px] mb-4 font-['Syne']">What You Get</div>
                  <div className="flex flex-col gap-3">
                    {["Guaranteed trip assignments — no cold-calling for clients", "Transparent payout per trip with monthly settlement", "Compliance document tracking and renewal reminders", "TONi Driver App for your drivers — GPS and trip management", "BURG brand backing — clients trust the platform, not just you"].map((item, i) => (
                      <div key={i} className="flex gap-3 text-sm text-white/80 items-start">
                        <span className="text-[#E5B217] font-bold shrink-0">→</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="fade-in grid gap-0">
                <p className="text-[#E5B217] font-bold tracking-widest uppercase text-sm mb-6 font-['Syne']">Onboarding Process</p>
                {[
                  { title: "Submit Your Fleet Details", desc: "Fill in the partner enquiry form below with your vehicle count, types, and operating area. Takes under 5 minutes." },
                  { title: "Verification Call", desc: "A BURG partner manager will call within 24 hours to understand your fleet and discuss the agreement terms." },
                  { title: "Document Submission", desc: "Upload vehicle fitness certificates, insurance documents, and driver licences via our onboarding portal. We verify within 48 hours." },
                  { title: "Install TONi & Go Live", desc: "Your drivers install the TONi Driver App, complete a 30-minute orientation, and your fleet appears on the BURG network." },
                  { title: "Start Earning", desc: "Trips are assigned automatically. You accept, driver executes, BURG settles your payout by the agreed date each month." }
                ].map((step, i) => (
                  <div key={i} className={`flex gap-5 items-start py-5 ${i !== 4 ? 'border-b border-gray-100' : ''}`}>
                    <div className="w-9 h-9 rounded-full bg-[#0B1E33] text-white font-['Syne'] font-extrabold text-sm flex items-center justify-center shrink-0 mt-1">{i + 1}</div>
                    <div>
                      <h4 className="text-[#0B1E33] font-bold mb-1">{step.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OEMS */}
          {activeTab === 'oem' && (
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
              <div className="fade-in">
                <p className="text-[#E5B217] font-bold tracking-widest uppercase text-sm mb-4 font-['Syne']">OEM Partners</p>
                <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B1E33] mb-6 font-['Syne'] leading-tight">Put Your Vehicles<br />in Front of<br />Real Fleet Buyers.</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">BURG works with bus and commercial vehicle manufacturers to integrate their product specifications into our fleet recommendation engine — so when a client needs a 35-seater or a 1-tonne tempo, your vehicles are surfaced first to verified fleet operators looking to invest.</p>
                <p className="text-gray-600 mb-6 leading-relaxed">For OEMs with their own fleet management portals, BURG offers API integration so your telematics data can feed directly into the TONi platform — giving your customers a unified experience.</p>

                <div className="bg-[#0B1E33] rounded-2xl p-8 mt-8">
                  <div className="text-[#E5B217] font-bold tracking-widest uppercase text-[11px] mb-4 font-['Syne']">Partnership Benefits</div>
                  <div className="flex flex-col gap-3">
                    {["Direct access to BURG's growing operator network", "Vehicle spec pages on the BURG platform with operator reach", "Telematics API integration with TONi (Eicher Fleet API supported)", "Co-branded fleet financing conversations with operators", "Data on actual usage patterns to inform product development"].map((item, i) => (
                      <div key={i} className="flex gap-3 text-sm text-white/80 items-start">
                        <span className="text-[#E5B217] font-bold shrink-0">→</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="fade-in grid gap-0">
                <p className="text-[#E5B217] font-bold tracking-widest uppercase text-sm mb-6 font-['Syne']">Integration Path</p>
                {[
                  { title: "Partnership Discussion", desc: "Connect with the BURG founding team to align on integration depth — from vehicle listings to full API telematics." },
                  { title: "Technical Scoping", desc: "Our tech team maps your existing telematics or fleet API to the TONi integration layer. We support REST and fleet-standard protocols." },
                  { title: "Pilot with Existing Operators", desc: "Run a pilot with 3–5 BURG fleet operators who already use your vehicles to validate the integrated experience." },
                  { title: "Full Network Rollout", desc: "Launch the integration across the full BURG platform with co-announced operator outreach." }
                ].map((step, i) => (
                  <div key={i} className={`flex gap-5 items-start py-5 ${i !== 3 ? 'border-b border-gray-100' : ''}`}>
                    <div className="w-9 h-9 rounded-full bg-[#0B1E33] text-white font-['Syne'] font-extrabold text-sm flex items-center justify-center shrink-0 mt-1">{i + 1}</div>
                    <div>
                      <h4 className="text-[#0B1E33] font-bold mb-1">{step.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WORKSHOPS */}
          {activeTab === 'workshop' && (
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
              <div className="fade-in">
                <p className="text-[#E5B217] font-bold tracking-widest uppercase text-sm mb-4 font-['Syne']">Workshop Partners</p>
                <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B1E33] mb-6 font-['Syne'] leading-tight">Service the Fleet.<br />Grow Your Bay<br />Utilisation.</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">BURG's compliance engine tracks vehicle fitness certificate expiry, tyre replacement intervals, and scheduled maintenance windows for every vehicle in the network. We refer operators to our verified workshop partners when service is due — delivering a steady stream of commercial vehicle work to your bay.</p>
                
                <div className="bg-[#0B1E33] rounded-2xl p-8 mt-8">
                  <div className="text-[#E5B217] font-bold tracking-widest uppercase text-[11px] mb-4 font-['Syne']">What Workshop Partners Get</div>
                  <div className="flex flex-col gap-3">
                    {["Scheduled service referrals from BURG's fleet compliance engine", '"BURG Certified Workshop" badge for your facility', "Multi-vehicle annual maintenance contract opportunities", "Digital job card system integrated with BURG's platform", "Priority listing in BURG's operator-facing partner directory"].map((item, i) => (
                      <div key={i} className="flex gap-3 text-sm text-white/80 items-start">
                        <span className="text-[#E5B217] font-bold shrink-0">→</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="fade-in grid gap-0">
                <p className="text-[#E5B217] font-bold tracking-widest uppercase text-sm mb-6 font-['Syne']">Certification Process</p>
                {[
                  { title: "Workshop Audit", desc: "BURG's partner team visits your facility to verify bay capacity, equipment, and mechanic certifications for commercial vehicles." },
                  { title: "Rate Card Agreement", desc: "Agree on standardised labour and parts rates for common service items — giving BURG operators pricing transparency." },
                  { title: "Certification & Listing", desc: "Receive your BURG Certified Workshop badge, get listed on the operator-facing platform, and start receiving referrals." },
                  { title: "Annual Re-certification", desc: "Annual audit to maintain standards. Workshops with top operator ratings receive premium placement in the directory." }
                ].map((step, i) => (
                  <div key={i} className={`flex gap-5 items-start py-5 ${i !== 3 ? 'border-b border-gray-100' : ''}`}>
                    <div className="w-9 h-9 rounded-full bg-[#0B1E33] text-white font-['Syne'] font-extrabold text-sm flex items-center justify-center shrink-0 mt-1">{i + 1}</div>
                    <div>
                      <h4 className="text-[#0B1E33] font-bold mb-1">{step.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INSURANCE */}
          {activeTab === 'insurance' && (
             <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start flex-1 fade-in">
               <div className="fade-in">
                <p className="text-[#E5B217] font-bold tracking-widest uppercase text-sm mb-4 font-['Syne']">Insurance Partners</p>
                <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B1E33] mb-6 font-['Syne'] leading-tight">Cover a Verified,<br />Compliant Fleet<br />at Scale.</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">Every vehicle on BURG has a documented compliance profile — fitness certificate, driver history, GPS tracking record, and trip data. For insurance providers, this is exactly the kind of verified, low-opacity risk that enables better underwriting and lower claim rates.</p>

                <div className="bg-[#0B1E33] rounded-2xl p-8 mt-8">
                  <div className="text-[#E5B217] font-bold tracking-widest uppercase text-[11px] mb-4 font-['Syne']">Partnership Advantages</div>
                  <div className="flex flex-col gap-3">
                    {["Access to a verified, GPS-tracked fleet with clean compliance records", "In-platform insurance renewal triggers at policy expiry", "Telematics data available to support usage-based insurance models", "Co-branded fleet insurance products for BURG operators", "Reduced fraud risk — every vehicle and driver pre-verified by BURG"].map((item, i) => (
                      <div key={i} className="flex gap-3 text-sm text-white/80 items-start">
                        <span className="text-[#E5B217] font-bold shrink-0">→</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

               <div className="fade-in grid gap-0">
                <p className="text-[#E5B217] font-bold tracking-widest uppercase text-sm mb-6 font-['Syne']">How It Works</p>
                {[
                  { title: "MoU & Data Sharing Agreement", desc: "Formalise the partnership with a data sharing framework that complies with IRDAI norms for telematics-based insurance." },
                  { title: "Product Design", desc: "Co-design a fleet insurance product (or adapt an existing one) suited to BURG's operator profile — commercial vehicles, verified drivers." },
                  { title: "In-Platform Integration", desc: "Renewal prompts appear in operator dashboards when policies near expiry, linking directly to the insurer's quote flow." },
                  { title: "Claims Support Channel", desc: "BURG's trip data and GPS logs are available to the insurer as supporting evidence for claims — accelerating resolution for operators." }
                ].map((step, i) => (
                  <div key={i} className={`flex gap-5 items-start py-5 ${i !== 3 ? 'border-b border-gray-100' : ''}`}>
                    <div className="w-9 h-9 rounded-full bg-[#0B1E33] text-white font-['Syne'] font-extrabold text-sm flex items-center justify-center shrink-0 mt-1">{i + 1}</div>
                    <div>
                      <h4 className="text-[#0B1E33] font-bold mb-1">{step.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
             </div>
          )}

          {/* TECH PARTNERS */}
          {activeTab === 'tech' && (
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
              <div className="fade-in">
                <p className="text-[#E5B217] font-bold tracking-widest uppercase text-sm mb-4 font-['Syne']">Technology Partners</p>
                <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B1E33] mb-6 font-['Syne'] leading-tight">Build On or<br />Integrate With<br />the BURG Stack.</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">BURG's technology infrastructure — TONi fleet management, GPS tracking, compliance engine, and booking platform — is designed for integration. If you build software for logistics, fleet management, HR, or payments, there's a meaningful integration opportunity here.</p>

                <div className="bg-[#0B1E33] rounded-2xl p-8 mt-8">
                  <div className="text-[#E5B217] font-bold tracking-widest uppercase text-[11px] mb-4 font-['Syne']">Integration Opportunities</div>
                  <div className="flex flex-col gap-3">
                    {["GPS & telematics API integration (BURG supports Eicher Fleet API)", "Payments integration — Razorpay and other PG partners", "HRMS / payroll integration for driver earnings management", "Route optimisation engine integration into TONi dispatch", "Passenger app or display system integration with TONi"].map((item, i) => (
                      <div key={i} className="flex gap-3 text-sm text-white/80 items-start">
                        <span className="text-[#E5B217] font-bold shrink-0">→</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

               <div className="fade-in grid gap-0">
                <p className="text-[#E5B217] font-bold tracking-widest uppercase text-sm mb-6 font-['Syne']">Integration Process</p>
                {[
                  { title: "Technical Discovery", desc: "Share your API documentation or product spec. Our tech team evaluates fit with BURG's current stack within a week." },
                  { title: "Sandbox Integration", desc: "Build and test the integration in BURG's staging environment before any production deployment." },
                  { title: "Pilot Deployment", desc: "Roll out to a subset of BURG's fleet or clients to validate real-world performance and gather feedback." },
                  { title: "Production Launch", desc: "Full integration goes live across the platform. Co-announce the partnership to operators and clients as relevant." }
                ].map((step, i) => (
                  <div key={i} className={`flex gap-5 items-start py-5 ${i !== 3 ? 'border-b border-gray-100' : ''}`}>
                    <div className="w-9 h-9 rounded-full bg-[#0B1E33] text-white font-['Syne'] font-extrabold text-sm flex items-center justify-center shrink-0 mt-1">{i + 1}</div>
                    <div>
                      <h4 className="text-[#0B1E33] font-bold mb-1">{step.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* WHY PARTNER */}
      <section className="bg-[#0B1E33] py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 fade-in">
            <p className="text-[#E5B217] font-bold tracking-widest uppercase text-sm mb-4 font-['Syne']">Why BURG</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 font-['Syne']">The Smartest Place to Park Your Partnership</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">BURG isn't just another aggregator. We're building infrastructure that every partner in the commercial fleet ecosystem benefits from.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 fade-in">
            {[
              { icon: "📈", title: "Growing Transaction Volume", desc: "Every new corporate client or school BURG signs drives more trip volume through the partner network — more business for everyone in the ecosystem." },
              { icon: "🔐", title: "Verified, Trusted Network", desc: "BURG's compliance-first onboarding means every operator, driver, and vehicle in the ecosystem has been checked. You're not listed alongside unvetted operators." },
              { icon: "📡", title: "Technology Backbone", desc: "TONi provides real data — GPS logs, trip records, compliance status — that partners can use to underwrite, service, or sell to fleet operators more effectively." },
              { icon: "🤝", title: "Founder-Level Access", desc: "BURG is early-stage. Partners get direct access to the founding team — faster decisions, co-design opportunities, and a voice in how the platform evolves." },
              { icon: "🌱", title: "First-Mover Positioning", desc: "India's commercial fleet sector is consolidating fast. Partnering with BURG now means anchored positioning as the market matures over the next 3–5 years." },
              { icon: "🏙️", title: "Bangalore-First, India-Scale", desc: "Starting concentrated in Bangalore means deep relationships and real market presence — not thin coverage across too many cities too soon." }
            ].map((card, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="text-white font-bold mb-3">{card.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ECOSYSTEM MAP */}
      <section className="bg-[#F5F7FB] py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 fade-in">
            <p className="text-[#E5B217] font-bold tracking-widest uppercase text-sm mb-4 font-['Syne']">The Ecosystem</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B1E33] mb-6 font-['Syne']">BURG at the Centre of Commercial Fleet</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Five partner categories. One unified platform. Every stakeholder wins.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 fade-in relative">
            {[
              { icon: "🚌", title: "Fleet Owners", desc: "Steady trip revenue, compliance support, and TONi driver tools", center: false },
              { icon: "🏭", title: "OEMs", desc: "Operator reach, telematics integration, and usage data", center: false },
              { icon: "⚡", title: "BURG Platform", desc: "The network layer connecting every stakeholder", center: true },
              { icon: "🔧", title: "Workshops", desc: "Certified referrals, fleet contracts, and digital job cards", center: false },
              { icon: "🛡️", title: "Insurers", desc: "Verified fleet, telematics data, and in-platform renewals", center: false }
            ].map((eco, i) => (
              <div key={i} className={`rounded-2xl p-6 text-center border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${eco.center ? 'bg-[#0B1E33] border-[#0B1E33]' : 'bg-white border-gray-200 hover:border-[#1A4B82]'}`}>
                <div className="text-3xl mb-3">{eco.icon}</div>
                <h3 className={`font-bold text-sm mb-2 ${eco.center ? 'text-white' : 'text-[#0B1E33]'}`}>{eco.title}</h3>
                <p className={`text-xs leading-relaxed ${eco.center ? 'text-white/60' : 'text-gray-500'}`}>{eco.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="bg-[#F5F7FB] py-24 px-4" id="partner-enquiry">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14 fade-in">
            <p className="text-[#E5B217] font-bold tracking-widest uppercase text-sm mb-4 font-['Syne']">Get Started</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B1E33] mb-6 font-['Syne']">Register Your Interest</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Fill in the form below and a BURG partner manager will be in touch within 24 hours.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10 fade-in">
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#0B1E33] mb-2" htmlFor="name">Your Name</label>
                  <input required type="text" id="name" name="name" placeholder="Full name" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A4B82] focus:ring-1 focus:ring-[#1A4B82]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0B1E33] mb-2" htmlFor="company">Company / Entity Name</label>
                  <input required type="text" id="company" name="company" placeholder="Business name" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A4B82] focus:ring-1 focus:ring-[#1A4B82]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0B1E33] mb-2" htmlFor="email">Email Address</label>
                  <input required type="email" id="email" name="email" placeholder="you@company.com" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A4B82] focus:ring-1 focus:ring-[#1A4B82]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0B1E33] mb-2" htmlFor="phone">Phone Number</label>
                  <input required type="tel" id="phone" name="phone" placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A4B82] focus:ring-1 focus:ring-[#1A4B82]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0B1E33] mb-2" htmlFor="partner_type">Partner Type</label>
                  <select required id="partner_type" name="partner_type" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A4B82] focus:ring-1 focus:ring-[#1A4B82] bg-white">
                    <option value="" disabled selected>Select your category</option>
                    <option value="Fleet Owner / Operator">Fleet Owner / Operator</option>
                    <option value="OEM / Manufacturer">OEM / Manufacturer</option>
                    <option value="Workshop / Service Centre">Workshop / Service Centre</option>
                    <option value="Insurance Provider">Insurance Provider</option>
                    <option value="Technology Partner">Technology Partner</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0B1E33] mb-2" htmlFor="city">Operating City</label>
                  <input required type="text" id="city" name="city" placeholder="e.g. Bangalore" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A4B82] focus:ring-1 focus:ring-[#1A4B82]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B1E33] mb-2" htmlFor="fleet_size">Fleet Size or Business Scale <span className="font-normal text-gray-500">(optional)</span></label>
                <input type="text" id="fleet_size" name="fleet_size" placeholder="e.g. 12 buses, 3 bays, ₹5Cr GWP" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A4B82] focus:ring-1 focus:ring-[#1A4B82]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B1E33] mb-2" htmlFor="message">Tell Us About Your Partnership Interest</label>
                <textarea id="message" name="message" placeholder="What kind of partnership are you looking for? What does your business currently do?" rows="5" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A4B82] focus:ring-1 focus:ring-[#1A4B82]"></textarea>
              </div>
              <button type="submit" className="w-full sm:w-auto bg-[#E5B217] hover:bg-[#d4a215] text-[#0B1E33] font-bold font-['Syne'] py-4 px-8 rounded-lg transition-colors">Submit Partnership Enquiry →</button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partners;
