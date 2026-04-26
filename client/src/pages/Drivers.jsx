import React, { useState, useEffect } from 'react';
import Footer from '../widgets/Footer/Footer';

const Drivers = () => {
  const [trips, setTrips] = useState(22);
  const [km, setKm] = useState(45);
  const [veh, setVeh] = useState(2);
  const [earnings, setEarnings] = useState(0);

  const vehLabels = { 1: 'Cab / Car', 2: 'Bus / Tempo', 3: 'Truck / HMV' };
  const vehRates = { 1: 18, 2: 22, 3: 28 }; // ₹ per km approx driver share

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
  }, []);

  useEffect(() => {
    const rate = vehRates[veh];
    const est = trips * km * rate;
    setEarnings(est);
  }, [trips, km, veh]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // WhatsApp logic from script.js
    const WA_NUMBER = '918778579209';
    let text = `*New Driver Application*\n\n`;
    text += `*Name:* ${data.name}\n`;
    text += `*Phone:* ${data.phone}\n`;
    if (data.email) text += `*Email:* ${data.email}\n`;
    text += `*City:* ${data.city}\n`;
    text += `*Licence:* ${data.licence_type}\n`;
    text += `*Experience:* ${data.experience}\n`;
    text += `*Vehicle Type:* ${data.vehicle_type}\n`;
    if (data.owns_vehicle) text += `*Owns Vehicle:* ${data.owns_vehicle}\n`;
    if (data.notes) text += `*Notes:* ${data.notes}\n`;
    
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleScrollToApply = (e) => {
    e.preventDefault();
    document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToEarnings = (e) => {
    e.preventDefault();
    document.getElementById('earnings').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="font-['DM_Sans'] text-gray-800">
      {/* DRIVER HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#0a1523] pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_80%_50%,_rgba(240,165,0,0.12)_0%,_transparent_65%),radial-gradient(ellipse_60%_80%_at_10%_60%,_rgba(0,85,170,0.3)_0%,_transparent_70%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(26,122,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(26,122,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#f0a500]/15 border border-[#f0a500]/30 text-[#f0a500] font-['Syne'] font-bold text-sm tracking-widest uppercase py-2 px-4 rounded-full mb-6">
              🚗 Now Hiring Drivers in Bangalore
            </div>
            <h1 className="text-white text-5xl md:text-7xl font-extrabold font-['Syne'] leading-tight mb-5">
              Drive With <span className="text-[#E5B217]">BURG</span>.<br />
              Earn More.<br />
              Work Smarter.
            </h1>
            <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-md mb-9">
              Join a professional network of commercial vehicle drivers backed by technology, training, and a company that treats you as a partner — not just a seat behind the wheel.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#apply" onClick={handleScrollToApply} className="bg-[#E5B217] hover:bg-[#d4a215] text-[#0B1E33] font-bold font-['Syne'] py-3.5 px-8 rounded-lg transition-colors w-full sm:w-auto text-center">Apply to Drive →</a>
              <a href="#earnings" onClick={handleScrollToEarnings} className="bg-transparent hover:bg-white/10 text-white font-bold font-['Syne'] py-3.5 px-8 rounded-lg border border-white/20 transition-colors w-full sm:w-auto text-center">See Earnings</a>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col">
            <div className="text-[#E5B217] font-bold font-['Syne'] text-xs tracking-[0.14em] uppercase mb-6">At a Glance — BURG Drivers</div>
            {[
              { label: 'Minimum Guaranteed Trips', val: '18 / month', highlight: true },
              { label: 'Average Monthly Earnings', val: '₹22,000+', highlight: true },
              { label: 'Payout Cycle', val: 'Weekly', highlight: false },
              { label: 'Training Duration', val: '2 Days', highlight: false },
              { label: 'App Required', val: 'TONi Driver App', highlight: false },
              { label: 'Licence Requirement', val: 'Commercial (HMV/LMV)', highlight: false },
              { label: 'Current Openings', val: 'Open', highlight: true }
            ].map((stat, i) => (
              <div key={i} className={`flex items-center justify-between gap-4 py-4 ${i !== 6 ? 'border-b border-white/10' : ''}`}>
                <span className="text-white/50 text-sm">{stat.label}</span>
                <span className={`text-white font-['Syne'] font-extrabold text-lg text-right ${stat.highlight ? 'text-[#E5B217]' : ''}`}>{stat.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY DRIVE WITH BURG */}
      <section className="bg-[#F5F7FB] py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 fade-in">
            <p className="text-[#E5B217] font-bold tracking-widest uppercase text-sm mb-4 font-['Syne']">Why Drive With BURG</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B1E33] mb-6 font-['Syne']">A Better Deal for Every Driver</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">BURG is built on the belief that drivers who are treated well, paid fairly, and given the right tools perform better — for themselves and for clients.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 fade-in">
            {[
              { icon: "💰", title: "Steady, Predictable Income", desc: "BURG guarantees a minimum number of trip assignments per month — so you're never left waiting for work. Weekly payouts mean money in your account every 7 days.", highlight: true },
              { icon: "📱", title: "TONi Driver App", desc: "All trip assignments, navigation, trip codes, and SOS come through the BURG TONi Driver App — free to install, simple to use, and built specifically for commercial drivers.", highlight: false },
              { icon: "🎓", title: "Paid Training Programme", desc: "Every BURG driver completes our 2-day paid training covering safety protocols, TONi app usage, client communication standards, and emergency procedures.", highlight: false },
              { icon: "📈", title: "Performance Incentives", desc: "Top-rated drivers unlock higher trip allocations, bonus payouts, and tier upgrades — the better you drive, the more you earn. No cap on monthly bonuses.", highlight: false },
              { icon: "🛡️", title: "Safety Net & Support", desc: "BURG tracks your route live. If something goes wrong, the SOS button connects you to our operations team instantly. You're never alone on the road.", highlight: false },
              { icon: "🤝", title: "Respect & Recognition", desc: "BURG publicly celebrates top-performing drivers. Monthly recognition, referral bonuses, and a driver community you actually want to be part of.", highlight: false }
            ].map((card, i) => (
              <div key={i} className={`rounded-xl p-9 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group border ${card.highlight ? 'bg-[#0B1E33] border-[#0B1E33]' : 'bg-white border-gray-200'}`}>
                <div className={`absolute bottom-0 left-0 right-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${card.highlight ? 'bg-[#E5B217]' : 'bg-gradient-to-r from-[#0B1E33] to-[#1a7aff]'}`}></div>
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className={`font-bold text-lg mb-3 ${card.highlight ? 'text-white' : 'text-[#0B1E33]'}`}>{card.title}</h3>
                <p className={`text-sm leading-relaxed ${card.highlight ? 'text-white/65' : 'text-gray-500'}`}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EARNINGS CALCULATOR */}
      <section className="bg-white py-24 px-4" id="earnings">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="fade-in">
            <p className="text-[#E5B217] font-bold tracking-widest uppercase text-sm mb-4 font-['Syne']">Earnings</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B1E33] mb-6 font-['Syne'] leading-tight">See What You Could<br />Earn With BURG</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">Your income depends on the number of trips you complete, your vehicle type, and your performance tier. Use the calculator to get an estimate based on your situation.</p>
            <p className="text-gray-600 mb-8 leading-relaxed">BURG pays weekly — every Friday — with no deductions for platform use. Earnings are fully transparent and itemised per trip in the TONi Driver App.</p>
            
            <div className="flex flex-col gap-3">
              {[
                "Per-trip rate set transparently in your driver agreement",
                "Bonus for 5-star ratings, zero cancellations, and punctuality",
                "Referral bonus for bringing other verified drivers to the platform",
                "Festival bonuses during Diwali, Dussehra, and major holidays"
              ].map((item, i) => (
                <div key={i} className="flex gap-3 text-sm text-gray-500 items-start">
                  <span className="text-[#1a7aff] font-bold shrink-0">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#F5F7FB] border border-gray-200 rounded-2xl p-8 md:p-10 fade-in shadow-sm">
            <div className="font-['Syne'] text-base font-bold text-[#0B1E33] mb-7 flex items-center gap-2.5">
              <span>🧮</span> Earnings Estimator
            </div>

            <div className="mb-6">
              <div className="flex justify-between font-['Syne'] text-xs font-bold uppercase tracking-wider text-[#0B1E33] mb-2.5">
                <span>Trips per month</span>
                <span className="font-['DM_Sans'] normal-case tracking-normal text-[#1a7aff] text-sm">{trips}</span>
              </div>
              <input type="range" className="w-full h-1.5 rounded-full bg-gray-200 appearance-none cursor-pointer accent-[#0B1E33]" min="10" max="40" value={trips} onChange={(e) => setTrips(parseInt(e.target.value))} />
            </div>

            <div className="mb-6">
              <div className="flex justify-between font-['Syne'] text-xs font-bold uppercase tracking-wider text-[#0B1E33] mb-2.5">
                <span>Avg. km per trip</span>
                <span className="font-['DM_Sans'] normal-case tracking-normal text-[#1a7aff] text-sm">{km} km</span>
              </div>
              <input type="range" className="w-full h-1.5 rounded-full bg-gray-200 appearance-none cursor-pointer accent-[#0B1E33]" min="15" max="120" value={km} onChange={(e) => setKm(parseInt(e.target.value))} />
            </div>

            <div className="mb-6">
              <div className="flex justify-between font-['Syne'] text-xs font-bold uppercase tracking-wider text-[#0B1E33] mb-2.5">
                <span>Vehicle type</span>
                <span className="font-['DM_Sans'] normal-case tracking-normal text-[#1a7aff] text-sm">{vehLabels[veh]}</span>
              </div>
              <input type="range" className="w-full h-1.5 rounded-full bg-gray-200 appearance-none cursor-pointer accent-[#0B1E33]" min="1" max="3" step="1" value={veh} onChange={(e) => setVeh(parseInt(e.target.value))} />
            </div>

            <div className="bg-[#0B1E33] rounded-xl p-6 mt-8 flex justify-between items-center flex-wrap gap-4">
              <div>
                <div className="text-white/50 text-[13px]">Estimated Monthly Earnings</div>
                <div className="text-white/35 text-xs mt-1">Before incentive bonuses</div>
              </div>
              <div className="font-['Syne'] font-extrabold text-3xl md:text-4xl text-[#E5B217]">
                ₹{earnings.toLocaleString('en-IN')}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed">* Estimate only. Actual earnings depend on vehicle type, trip length, rating, and applicable bonuses. Fuel and maintenance costs vary by operator arrangement.</p>
          </div>
        </div>
      </section>

      {/* INCENTIVES */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 fade-in">
            <p className="text-[#E5B217] font-bold tracking-widest uppercase text-sm mb-4 font-['Syne']">Incentives</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B1E33] mb-6 font-['Syne']">The More You Drive, The More You Earn</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">BURG's performance tier system rewards consistency, safety, and client satisfaction.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12 fade-in">
            {[
              { icon: '⭐', bg: 'bg-[#F5F7FB]', border: 'border-gray-200', val: '5-Star', label: 'Rating bonus: ₹200 per perfect-rated trip' },
              { icon: '🎯', bg: 'bg-[#003366]/[0.04]', border: 'border-[#003366]/10', val: 'Zero Cancel', label: '₹1,000 monthly bonus for no cancellations' },
              { icon: '🤝', bg: 'bg-[#f0a500]/5', border: 'border-[#f0a500]/20', val: '₹500', label: 'Per referred driver who completes 5 trips' },
              { icon: '🎉', bg: 'bg-[#1a7aff]/5', border: 'border-[#1a7aff]/15', val: 'Festival', label: 'Seasonal bonuses during major holidays' }
            ].map((inc, i) => (
              <div key={i} className={`${inc.bg} border ${inc.border} rounded-xl p-5 sm:p-7 text-center transition-transform hover:-translate-y-1 hover:shadow-md`}>
                <div className="text-3xl mb-3">{inc.icon}</div>
                <div className="font-['Syne'] font-extrabold text-2xl text-[#0B1E33] mb-1">{inc.val}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{inc.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-[#F5F7FB] border border-gray-200 rounded-2xl p-6 md:p-9 fade-in">
            <div className="font-['Syne'] font-bold text-xs uppercase tracking-widest text-[#0B1E33] mb-5">Driver Performance Tiers</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 items-center py-3 font-['Syne'] text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <div>Tier</div>
              <div>Trips / Month</div>
              <div className="hidden md:block">Monthly Bonus</div>
              <div className="hidden md:block">Status</div>
            </div>
            {[
              { name: '🟢 Standard', trips: '10 – 17', bonus: '—', statusBadge: 'Base rate', badgeColor: 'bg-gray-100 text-gray-500' },
              { name: '🥇 Gold', trips: '18 – 24', bonus: '+₹1,500', statusBadge: 'Preferred', badgeColor: 'bg-[#f0a500]/10 text-[#a07000]' },
              { name: '💎 Platinum', trips: '25 – 32', bonus: '+₹3,000', statusBadge: 'Priority routes', badgeColor: 'bg-[#003366]/10 text-[#0B1E33]' },
              { name: '🚀 Elite', trips: '33+', bonus: '+₹5,000', statusBadge: 'VIP eligible', badgeColor: 'bg-[#1a7aff]/10 text-[#1a7aff]' }
            ].map((tier, i) => (
              <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 items-center py-3 border-t border-gray-200 text-[13px] md:text-sm">
                <div className="font-bold text-[#0B1E33] flex items-center gap-1.5">{tier.name}</div>
                <div className="text-gray-500">{tier.trips}</div>
                <div className="hidden md:block font-bold text-[#1a7aff]">{tier.bonus}</div>
                <div className="hidden md:block">
                  <span className={`text-[11px] font-bold py-1 px-2.5 rounded ${tier.badgeColor}`}>{tier.statusBadge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAINING PROGRAMME */}
      <section className="bg-[#F5F7FB] py-24 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div className="fade-in">
            <p className="text-[#E5B217] font-bold tracking-widest uppercase text-sm mb-4 font-['Syne']">Training Programme</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B1E33] mb-6 font-['Syne'] leading-tight">Two Days That Make You a BURG Driver</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">Every driver on the BURG platform — regardless of experience — completes our 2-day induction programme before their first trip. Training is paid at ₹500/day and conducted at our Bangalore operations centre.</p>
            <p className="text-gray-600 mb-8 leading-relaxed">Drivers who complete advanced training modules unlock access to VIP and school route assignments, which carry higher per-trip rates.</p>

            <div className="flex flex-col gap-4">
              {[
                { num: "M1", title: "BURG Platform & TONi App Orientation", desc: "Trip acceptance, navigation, SOS usage, trip codes, and fare visibility in the TONi Driver App.", dur: "3 hrs" },
                { num: "M2", title: "RideSafe Driver Protocol", desc: "BURG's safety standards — pre-trip vehicle checks, route adherence, passenger conduct, and emergency procedures.", dur: "2.5 hrs" },
                { num: "M3", title: "Client Communication Standards", desc: "How to interact with corporate clients, school staff, and VIP passengers — tone, punctuality, and escalation paths.", dur: "2 hrs" },
                { num: "M4", title: "Compliance & Documentation", desc: "How to maintain and upload required documents — licence, medical fitness, and address proof — via the TONi portal.", dur: "1.5 hrs" },
                { num: "M5", title: "Advanced: VIP & School Routes", desc: "Optional advanced module for drivers seeking VIP or school route assignments. Covers enhanced protocols and uniform standards.", dur: "3 hrs" },
              ].map((mod, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 flex gap-4 items-start hover:border-[#1a7aff] hover:shadow-sm transition-all">
                  <span className="font-['Syne'] text-xs font-extrabold text-[#1a7aff] bg-[#1a7aff]/10 rounded px-2 py-1 shrink-0 mt-0.5">{mod.num}</span>
                  <div>
                    <h4 className="font-bold text-[#0B1E33] text-[15px] mb-1">{mod.title}</h4>
                    <p className="text-[#64748b] text-[13px] leading-relaxed">{mod.desc}</p>
                  </div>
                  <span className="font-['Syne'] text-[11px] font-bold text-gray-400 whitespace-nowrap pt-1 ml-auto shrink-0">{mod.dur}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-in grid gap-5">
            <div className="bg-[#0B1E33] rounded-2xl p-9 md:p-10 text-center">
              <div className="text-5xl mb-4">🏅</div>
              <h3 className="font-['Syne'] text-2xl font-extrabold text-white mb-3">BURG Certified Driver</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">Completing the induction programme earns you the BURG Certified Driver credential — recognised across the full partner fleet network and displayed on your TONi driver profile.</p>
              <div className="flex flex-col gap-2.5 mb-7">
                {[
                  "Digital certificate issued via TONi profile",
                  "Visible to fleet operators assigning trips",
                  "Priority access to high-value route assignments",
                  "Renewal annual — keeps your profile active",
                  "Training paid at ₹500/day during induction"
                ].map((item, i) => (
                  <div key={i} className="flex gap-2.5 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-left">
                    <span className="text-[#4ade80] font-bold shrink-0">✓</span>
                    <span className="text-white/80 text-[13.5px]">{item}</span>
                  </div>
                ))}
              </div>
              <a href="#apply" onClick={handleScrollToApply} className="bg-[#E5B217] hover:bg-[#d4a215] text-[#0B1E33] font-bold font-['Syne'] py-3.5 px-8 rounded-lg transition-colors w-full block text-center">Apply & Start Training →</a>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-7">
              <div className="font-['Syne'] text-xs font-bold uppercase tracking-widest text-[#0B1E33] mb-3.5">Training Schedule</div>
              <div className="flex flex-col">
                 <div className="flex justify-between text-[14px] text-gray-500 py-2 border-b border-gray-100">
                    <span>Day 1 — Classroom (M1–M3)</span>
                    <span className="text-[#0B1E33] font-semibold">9 AM – 5 PM</span>
                 </div>
                 <div className="flex justify-between text-[14px] text-gray-500 py-2 border-b border-gray-100">
                    <span>Day 2 — Practical & App (M4–M5)</span>
                    <span className="text-[#0B1E33] font-semibold">9 AM – 5 PM</span>
                 </div>
                 <div className="flex justify-between text-[14px] text-gray-500 pt-2">
                    <span>Certification & First Trip Assignment</span>
                    <span className="text-[#1a7aff] font-semibold">Day 3 onward</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ELIGIBILITY */}
      <section className="bg-[#F5F7FB] py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14 fade-in">
            <p className="text-[#E5B217] font-bold tracking-widest uppercase text-sm mb-4 font-['Syne']">Eligibility</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B1E33] mb-6 font-['Syne']">Do You Qualify?</h2>
            <p className="text-gray-500 text-lg">Here's what we need from every driver before onboarding.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 fade-in">
            <div>
              <h3 className="text-lg font-bold text-[#0B1E33] mb-4 pb-3 border-b-2 border-gray-200">✅ Requirements</h3>
              <div className="flex flex-col gap-3">
                {[
                  "Valid commercial driving licence (HMV or LMV-Transport)",
                  "Minimum 2 years of commercial driving experience",
                  "Clean driving record — no major traffic violations in past 3 years",
                  "Valid Aadhaar and PAN for background verification",
                  "Medical fitness certificate (can be arranged through BURG)",
                  "Smartphone running Android 9.0 or above to install TONi Driver App",
                  "Willingness to complete the 2-day induction programme"
                ].map((req, i) => (
                  <div key={i} className="flex gap-3 text-sm text-gray-500 items-start leading-relaxed">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 bg-[#4ade80]/15 text-[#16a34a]">✓</div>
                    {req}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-[#0B1E33] mb-4 pb-3 border-b-2 border-gray-200">❌ Disqualifiers</h3>
              <div className="flex flex-col gap-3 mb-6">
                {[
                  "Licence suspension in the past 5 years",
                  "Criminal record involving assault, theft, or substance offences",
                  "Inability to communicate in basic Kannada or English with clients",
                  "Failure to pass the background verification check",
                  "Licence class not valid for the vehicle type being operated",
                  "Unable to complete or attend the 2-day induction programme"
                ].map((req, i) => (
                  <div key={i} className="flex gap-3 text-sm text-gray-500 items-start leading-relaxed">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 bg-red-400/15 text-red-600">✗</div>
                    {req}
                  </div>
                ))}
              </div>
              <div className="bg-[#1a7aff]/5 border border-[#1a7aff]/15 rounded-md p-4 text-[13.5px] text-gray-500 leading-relaxed">
                <strong className="text-[#0B1E33]">Not sure if you qualify?</strong> Apply anyway — our team reviews each application individually and will tell you exactly what's needed.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APPLY FORM */}
      <section className="bg-white py-24 px-4" id="apply">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14 fade-in">
            <p className="text-[#E5B217] font-bold tracking-widest uppercase text-sm mb-4 font-['Syne']">Apply Now</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B1E33] mb-6 font-['Syne']">Start Your BURG Driver Application</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Takes less than 3 minutes. Our team will contact you within 24 hours to schedule a verification call.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10 fade-in">
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#0B1E33] mb-2" htmlFor="name">Full Name</label>
                  <input required type="text" id="name" name="name" placeholder="As on your driving licence" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A4B82] focus:ring-1 focus:ring-[#1A4B82]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0B1E33] mb-2" htmlFor="phone">Mobile Number</label>
                  <input required type="tel" id="phone" name="phone" placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A4B82] focus:ring-1 focus:ring-[#1A4B82]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0B1E33] mb-2" htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A4B82] focus:ring-1 focus:ring-[#1A4B82]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0B1E33] mb-2" htmlFor="city">Current City</label>
                  <input required type="text" id="city" name="city" placeholder="e.g. Bangalore" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A4B82] focus:ring-1 focus:ring-[#1A4B82]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0B1E33] mb-2" htmlFor="licence_type">Licence Type</label>
                  <select required id="licence_type" name="licence_type" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A4B82] focus:ring-1 focus:ring-[#1A4B82] bg-white">
                    <option value="" disabled selected>Select licence class</option>
                    <option value="HMV">HMV — Heavy Motor Vehicle</option>
                    <option value="LMV-Transport">LMV-Transport</option>
                    <option value="MCWG">MCWG</option>
                    <option value="Other">Other (specify in notes)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0B1E33] mb-2" htmlFor="experience">Years of Experience</label>
                  <select required id="experience" name="experience" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A4B82] focus:ring-1 focus:ring-[#1A4B82] bg-white">
                    <option value="" disabled selected>Select experience</option>
                    <option value="2-3 years">2 – 3 years</option>
                    <option value="4-6 years">4 – 6 years</option>
                    <option value="7-10 years">7 – 10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0B1E33] mb-2" htmlFor="vehicle_type">Vehicle You Can Drive</label>
                  <select required id="vehicle_type" name="vehicle_type" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A4B82] focus:ring-1 focus:ring-[#1A4B82] bg-white">
                    <option value="" disabled selected>Select vehicle type</option>
                    <option value="Bus">Bus (30+ seater)</option>
                    <option value="Mini Bus / Tempo">Mini Bus / Tempo Traveller</option>
                    <option value="Cab / Car">Car / Cab</option>
                    <option value="Truck">Truck / Goods Vehicle</option>
                    <option value="Multiple">Multiple types</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0B1E33] mb-2" htmlFor="owns_vehicle">Do You Own a Vehicle?</label>
                  <select id="owns_vehicle" name="owns_vehicle" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A4B82] focus:ring-1 focus:ring-[#1A4B82] bg-white">
                    <option value="" disabled selected>Select</option>
                    <option value="Yes">Yes — I own a vehicle</option>
                    <option value="No">No — I drive for an operator</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B1E33] mb-2" htmlFor="notes">Anything Else We Should Know? <span className="font-normal text-gray-500">(optional)</span></label>
                <textarea id="notes" name="notes" placeholder="Previous employers, route experience, special licences, languages spoken..." rows="4" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A4B82] focus:ring-1 focus:ring-[#1A4B82]"></textarea>
              </div>
              <button type="submit" className="w-full sm:w-auto bg-[#E5B217] hover:bg-[#d4a215] text-[#0B1E33] font-bold font-['Syne'] py-4 px-8 rounded-lg transition-colors text-center">Submit My Application →</button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-[#0B1E33] py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 fade-in">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 font-['Syne']">Questions Before Applying?</h2>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">Call or WhatsApp our driver support team directly. We're happy to walk you through eligibility and the onboarding process.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+918778579209" className="bg-[#E5B217] hover:bg-[#d4a215] text-[#0B1E33] font-bold font-['Syne'] py-3.5 px-8 rounded-lg transition-colors">📞 Call +91 87785 79209</a>
            <a href="/contact" className="bg-transparent hover:bg-white/10 text-white font-bold font-['Syne'] py-3.5 px-8 rounded-lg border border-white/20 transition-colors">Send a Message</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Assuming you want Footer included but you might want to switch this based on your previous edit where we removed Navbar from Partners */}
    </div>
  );
};

export default Drivers;