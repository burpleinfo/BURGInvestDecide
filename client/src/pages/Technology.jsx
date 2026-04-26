import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../widgets/Footer/Footer';

const portals = [
  {
    title: 'TONi Admin Dashboard',
    tag: 'Web App - Admin',
    icon: '🖥️',
    cardClass: 'from-[#001228] to-[#001e3d] border-[#2b4a6a]',
    tagClass: 'bg-[#0f3158] text-[#8fc6ff]',
    dotClass: 'bg-[#8fc6ff]',
    desc: 'The operations nerve centre. BURG fleet managers and client administrators monitor active vehicles, dispatch trips, and track compliance from one web interface.',
    features: [
      'Live map with all active vehicle positions',
      'Trip assignment and driver dispatch',
      'Fleet compliance document status',
      'Trip history and analytics export',
      'SOS alert management and escalation',
    ],
  },
  {
    title: 'TONi Driver App',
    tag: 'PWA - Driver',
    icon: '📱',
    cardClass: 'from-[#001a0d] to-[#002d18] border-[#25553a]',
    tagClass: 'bg-[#103a1f] text-[#7ceaac]',
    dotClass: 'bg-[#7ceaac]',
    desc: 'A Progressive Web App installable from Chrome on Android. Drivers get navigation, trip codes, GPS broadcast, and one-tap SOS without app-store dependency.',
    features: [
      'GPS location broadcast every 3 seconds',
      'Trip code verification on boarding',
      'Google Maps navigation integration',
      'One-tap emergency SOS to BURG ops',
      'Offline-capable PWA install flow',
    ],
  },
  {
    title: 'Passenger Display System',
    tag: 'Display - Passenger',
    icon: '📺',
    cardClass: 'from-[#1a1000] to-[#2d1e00] border-[#5f4a1e]',
    tagClass: 'bg-[#3d2d08] text-[#ffd166]',
    dotClass: 'bg-[#ffd166]',
    desc: 'Mounted in vehicles or bays, the Passenger Display shows live route information, stop ETAs, driver details, and announcements synced from Firebase in real time.',
    features: [
      'Live route and next-stop ETA display',
      'Driver name and vehicle number visibility',
      'Runs on tablet, monitor, or TV',
      'Ad-slot support for future monetization',
      'Auto-refresh from live Firebase feed',
    ],
  },
];

const stackGroups = [
  {
    title: 'Frontend',
    icon: '🖥️',
    rows: [
      ['Framework', 'React + Vite'],
      ['Styling', 'Tailwind CSS v4'],
      ['Maps', 'Google Maps JS API v3'],
      ['PWA support', 'Manifest + service worker'],
      ['Output', 'Optimized SPA build'],
    ],
  },
  {
    title: 'Firebase',
    icon: '🔥',
    rows: [
      ['Database', 'Realtime Database (NoSQL)'],
      ['Hosting', 'Firebase Hosting + CDN'],
      ['Auth', 'Firebase Auth (PIN-based)'],
      ['Project ID', 'burgtoni-560c1'],
      ['Live domain', 'toni.burgrental.com'],
    ],
  },
  {
    title: 'Integrations',
    icon: '🔌',
    rows: [
      ['GPS primary', 'Chrome Geolocation API'],
      ['GPS fallback', 'Eicher Fleet Telematics API'],
      ['Payments', 'Razorpay Payment Gateway'],
      ['Notifications', 'WhatsApp API alerts'],
      ['Identity (upcoming)', 'DigiLocker OTP verification'],
    ],
  },
  {
    title: 'Deployment & Ops',
    icon: '⚙️',
    rows: [
      ['CI / Deploy', 'Firebase CLI'],
      ['DNS', 'Custom domain via Firebase'],
      ['SSL', 'Auto-provisioned (Firebase)'],
      ['GPS sync rate', '3,000ms interval'],
      ['Infrastructure', 'Serverless architecture'],
    ],
  },
];

const roadmap = [
  {
    status: 'Shipped',
    period: 'Q3 2024',
    title: 'TONi v1 - Core Platform',
    desc: 'Admin dashboard, Driver PWA, and Passenger display with Firebase realtime sync and Google Maps tracking.',
    align: 'left',
  },
  {
    status: 'Shipped',
    period: 'Q4 2024',
    title: 'RideSafe Compliance Engine',
    desc: 'Document tracking, expiry alerts, and trip blocking for non-compliant vehicles with WhatsApp operator alerts.',
    align: 'right',
  },
  {
    status: 'Live',
    period: 'Q1 2025',
    title: 'Eicher Fleet API + SOS',
    desc: 'Hardware GPS fallback via telematics, plus emergency SOS routing and trip-code verification.',
    align: 'left',
  },
  {
    status: 'Up Next',
    period: 'Q2 2025',
    title: 'DigiLocker Verification',
    desc: 'OTP-based Aadhaar/licence verification to reduce onboarding friction and remove manual document loops.',
    align: 'right',
  },
  {
    status: 'Planned',
    period: 'Q4 2025',
    title: 'Passenger WiFi + Ad Platform',
    desc: '4G captive-portal WiFi and in-vehicle ad monetization on passenger displays.',
    align: 'left',
  },
];

const Technology = () => {
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

  return (
    <div className="bg-white text-[#0d1a2b]">
      <style>{`
        .fade-in { opacity: 0; transform: translateY(24px); transition: opacity .7s ease, transform .7s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        .tech-grid {
          background-image:
            linear-gradient(rgba(26,122,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,122,255,0.08) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .map-grid {
          background-image:
            linear-gradient(rgba(26,122,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,122,255,0.07) 1px, transparent 1px);
          background-size: 36px 36px;
        }
        .route-pulse { animation: routePulse 4s ease-in-out infinite; }
        .vehicle-move { animation: vehicleMove 8s ease-in-out infinite; }
        .line-anim { animation: lineIn .3s ease forwards; opacity: 0; }
        .line-anim:nth-child(1) { animation-delay: .3s; }
        .line-anim:nth-child(2) { animation-delay: .6s; }
        .line-anim:nth-child(3) { animation-delay: .9s; }
        .line-anim:nth-child(4) { animation-delay: 1.2s; }
        .line-anim:nth-child(5) { animation-delay: 1.5s; }
        .line-anim:nth-child(6) { animation-delay: 1.8s; }
        .line-anim:nth-child(7) { animation-delay: 2.1s; }
        .line-anim:nth-child(8) { animation-delay: 2.4s; }
        .line-anim:nth-child(9) { animation-delay: 2.7s; }
        .line-anim:nth-child(10){ animation-delay: 3.0s; }
        @keyframes routePulse {
          0%,100% { border-color: rgba(26,122,255,0.4); }
          50% { border-color: rgba(26,122,255,0.8); }
        }
        @keyframes vehicleMove {
          0%   { top: 30%; left: 20%; }
          25%  { top: 20%; left: 55%; }
          50%  { top: 45%; left: 75%; }
          75%  { top: 65%; left: 40%; }
          100% { top: 30%; left: 20%; }
        }
        @keyframes lineIn {
          from { opacity: 0; transform: translateX(-6px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <section className="relative min-h-screen overflow-hidden bg-[#010d1a] px-6 pb-20 pt-32 text-white">
        <div className="tech-grid absolute inset-0" />
        <div className="pointer-events-none absolute left-[60%] top-1/2 h-180 w-180 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,85,170,0.25)_0%,transparent_65%)]" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="fade-in">
            <p className="mb-5 inline-flex items-center gap-2 rounded border border-[#2b5a88] bg-[#10243f] px-3 py-1 font-mono text-xs uppercase tracking-widest text-[#66b3ff]">
              ▶ BURG Proprietary Technology
            </p>
            <h1 className="mb-2 text-5xl font-black tracking-tight sm:text-7xl">TONi</h1>
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-[#66b3ff] sm:text-sm">
              Transport Oriented Network Interface
            </p>
            <p className="mb-8 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
              India's commercial fleet sector still runs on calls and paper logs. TONi replaces that with a three-portal system synced in real time, built for production use in Indian road conditions.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#portals" className="rounded-xl border-2 border-[#003366] bg-[#003366] px-6 py-3 font-bold transition hover:-translate-y-0.5 hover:bg-[#0055aa]">Explore TONi →</a>
              <Link to="/contact" className="rounded-xl border-2 border-white/60 px-6 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10">Request a Demo</Link>
            </div>
          </div>

          <div className="fade-in rounded-2xl border border-[#1c3e66] bg-[#0a0f1a] shadow-[0_24px_48px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 font-mono text-xs tracking-wide text-white/40">toni - fleet-manager v2.1.0</span>
            </div>
            <div className="space-y-1 p-5 font-mono text-xs sm:text-sm">
              {[
                '$ toni init --env production',
                '  Connecting to Firebase Realtime DB...',
                '  ✓ Database connection established',
                '  Loading fleet registry...',
                '  ✓ 24 active vehicles loaded',
                '  Syncing GPS streams...',
                '  ✓ GPS sync active — 3s interval',
                '  Starting compliance monitor...',
                '  ⚠ 2 vehicles: insurance expiring in 14d',
                '  ✓ Alert queue dispatched via WhatsApp',
              ].map((line) => (
                <div key={line} className="line-anim text-white/80">{line}</div>
              ))}
              <div className="line-anim text-[#ffd166]">  ━━━ TONi is live. All systems operational ━━━</div>
              <div className="line-anim text-[#66b3ff]">$ <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse bg-[#66b3ff] align-middle" /></div>
            </div>
          </div>
        </div>
      </section>

      <section id="portals" className="bg-[#001f40] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="fade-in mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#f0a500]">System Architecture</p>
            <h2 className="mb-4 text-3xl font-black text-white sm:text-5xl">Three Portals. One Sync.</h2>
            <p className="mx-auto max-w-3xl text-white/55">TONi ships as Admin, Driver, and Passenger interfaces, all synchronized in real time through Firebase Realtime Database.</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {portals.map((portal) => (
              <article key={portal.title} className={`fade-in rounded-3xl border bg-linear-to-br p-6 text-white transition hover:-translate-y-1 ${portal.cardClass}`}>
                <div className="mb-5 flex items-center gap-2 border-b border-white/10 pb-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-auto text-2xl">{portal.icon}</span>
                </div>
                <span className={`inline-block rounded px-2 py-1 font-mono text-[11px] uppercase tracking-widest ${portal.tagClass}`}>
                  {portal.tag}
                </span>
                <h3 className="mt-3 text-2xl font-black">{portal.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/65">{portal.desc}</p>
                <ul className="mt-5 space-y-2">
                  {portal.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-white/80">
                      <span className={`mt-2 h-1.5 w-1.5 rounded-full ${portal.dotClass}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4f7fc] px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div className="fade-in">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#1a7aff]">Technical Architecture</p>
            <h2 className="mb-4 text-3xl font-black text-[#003366] sm:text-5xl">How TONi Is Built</h2>
            <p className="mb-4 text-[#5a6e84]">TONi is designed for realtime visibility with minimal infrastructure overhead. GPS updates stream from drivers into Firebase and propagate instantly across all portals.</p>
            <p className="mb-4 text-[#5a6e84]">The same architecture supports compliance alerts, route monitoring, and fleet operations without heavy backend management.</p>
            <p className="text-[#5a6e84]">Hosting sits on Firebase Hosting with CDN delivery and custom domain setup for low-latency national access.</p>
          </div>

          <div className="fade-in rounded-3xl border border-[#16416f] bg-[#010d1a] p-7 shadow-[0_16px_48px_rgba(0,51,102,0.18)]">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.16em] text-[#66b3ff]">// TONi System Architecture</p>
            <div className="space-y-2">
              {[
                ['Client Layer', 'Admin Web · Driver PWA · Passenger Display', 'HTML / JS'],
                ['API + Integration', 'Google Maps · Eicher Fleet · Razorpay · WhatsApp', 'REST / SDK'],
                ['Firebase Core', 'Realtime DB · Hosting · Auth', 'Firebase'],
                ['Data Layer', 'Fleet registry · Trip logs · Compliance records', 'JSON / NoSQL'],
                ['Hosting + CDN', 'Firebase Hosting · Custom domain', 'toni.burgrental.com'],
              ].map(([name, desc, badge]) => (
                <div key={name} className="rounded-xl border border-[#1f4f7f] bg-[#0c1b2f] px-4 py-3 text-white transition hover:translate-x-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold">{name}</p>
                      <p className="font-mono text-xs text-white/45">{desc}</p>
                    </div>
                    <span className="rounded bg-[#15365c] px-2 py-1 font-mono text-[11px] text-[#86c5ff]">{badge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#001f40] px-6 py-24 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="fade-in">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#f0a500]">Live Tracking</p>
            <h2 className="mb-5 text-3xl font-black sm:text-5xl">GPS That Works in Indian Conditions</h2>
            <p className="mb-3 text-white/65">Primary tracking is sourced from the Driver App through browser geolocation at 3-second intervals. Hardware telematics can be used as fallback through Eicher Fleet API.</p>
            <div className="mt-6 space-y-3">
              {[
                ['📡', '3-Second GPS Update Rate'],
                ['🔄', 'Eicher Fleet API Fallback'],
                ['🗺️', 'Google Maps Routing Integration'],
                ['⚠️', 'Route Deviation Alerts'],
              ].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#113457] text-lg">{icon}</span>
                  <span className="text-sm text-white/85">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-in relative min-h-95 overflow-hidden rounded-3xl border border-[#2a5f90] bg-[#0d1f35]">
            <div className="map-grid absolute inset-0" />
            <div className="absolute left-0 right-0 top-[35%] h-1.5 rounded bg-white/10" />
            <div className="absolute left-0 right-0 top-[65%] h-1 rounded bg-white/10" />
            <div className="absolute bottom-0 left-[30%] top-0 w-1 rounded bg-white/10" />
            <div className="absolute bottom-0 left-[70%] top-0 w-1 rounded bg-white/10" />
            <div className="route-pulse absolute left-[15%] top-[22%] h-[55%] w-[70%] rounded-[40%_60%_50%_40%/40%_40%_60%_50%] border-2 border-dashed" />
            <div className="vehicle-move absolute h-3.5 w-3.5 rounded-full border-2 border-white bg-[#4ade80] shadow-[0_0_14px_rgba(74,222,128,0.7)]" />
            <div className="absolute left-[18%] top-[28%] h-2.5 w-2.5 rounded-full border-2 border-white bg-[#f0a500]" />
            <div className="absolute left-[72%] top-[65%] h-2.5 w-2.5 rounded-full border-2 border-white bg-[#f0a500]" />
            <div className="absolute bottom-4 left-4 rounded-xl border border-[#2c5e8a] bg-[#000a19d9] px-4 py-3 font-mono text-xs">
              <p className="mb-1 flex justify-between gap-8 text-white/60"><span>Status</span><span className="text-[#4ade80]">● Live</span></p>
              <p className="mb-1 flex justify-between gap-8 text-white/60"><span>Last ping</span><span className="text-[#4ade80]">2s ago</span></p>
              <p className="mb-1 flex justify-between gap-8 text-white/60"><span>Speed</span><span className="text-[#4ade80]">38 km/h</span></p>
              <p className="flex justify-between gap-8 text-white/60"><span>ETA</span><span className="text-[#4ade80]">7 min</span></p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="fade-in mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#1a7aff]">Tech Stack</p>
            <h2 className="mb-4 text-3xl font-black text-[#003366] sm:text-5xl">What TONi Runs On</h2>
            <p className="mx-auto max-w-2xl text-[#5a6e84]">Minimal, deliberate, and production-focused. Every dependency has a clear operational reason.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {stackGroups.map((group) => (
              <article key={group.title} className="fade-in overflow-hidden rounded-2xl border border-[#d8dfe9] bg-[#f4f7fc]">
                <header className="flex items-center gap-2 bg-[#003366] px-5 py-4 text-white">
                  <span>{group.icon}</span>
                  <h3 className="text-sm font-bold uppercase tracking-widest">{group.title}</h3>
                </header>
                <div>
                  {group.rows.map(([key, val]) => (
                    <div key={key} className="grid grid-cols-2 gap-3 border-b border-[#d8dfe9] px-5 py-3 text-sm last:border-b-0">
                      <span className="font-mono text-xs text-[#5a6e84]">{key}</span>
                      <span className="font-semibold text-[#003366]">{val}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4f7fc] px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="fade-in">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#1a7aff]">RideSafe Technology</p>
            <h2 className="mb-4 text-3xl font-black text-[#003366] sm:text-5xl">How the Compliance Engine Works</h2>
            <p className="mb-6 text-[#5a6e84]">RideSafe runs as a continuous automated loop across every active vehicle, surfacing risk before it becomes an operational incident.</p>

            <div className="space-y-4">
              {[
                ['📥', 'Document Ingestion', 'Fitness, insurance, PUC, and driver records are uploaded and indexed with expiry timelines.'],
                ['🔍', 'Continuous Monitoring', 'The system checks expiries daily and escalates alerts at 30, 14, and 7 day thresholds.'],
                ['📲', 'Automated Alerts', 'WhatsApp alerts notify operators, while BURG ops receives mirrored notifications for follow-up.'],
                ['🚫', 'Trip Blocking', 'Vehicles with expired critical documents are blocked from dispatch until resolved.'],
                ['✅', 'Reinstatement', 'Once renewed documents are verified, the vehicle returns to the active assignment pool automatically.'],
              ].map(([icon, title, desc]) => (
                <div key={title} className="rounded-xl border border-[#d8dfe9] bg-white p-4">
                  <p className="mb-1 font-bold text-[#003366]">{icon} {title}</p>
                  <p className="text-sm text-[#5a6e84]">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-in space-y-3">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1a7aff]">What Gets Tracked</p>
            {[
              ['📄', 'Vehicle Fitness Certificate (FC)'],
              ['🛡️', 'Third-Party Insurance'],
              ['🌫️', 'Pollution Under Control (PUC)'],
              ['🪪', 'Driver Licence Validity'],
              ['🔍', 'Driver Background Verification'],
              ['📡', 'GPS Device Uptime'],
            ].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-[#d8dfe9] bg-white px-4 py-3">
                <span className="text-xl">{icon}</span>
                <span className="text-sm font-semibold text-[#003366]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="fade-in mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#1a7aff]">Product Roadmap</p>
            <h2 className="mb-4 text-3xl font-black text-[#003366] sm:text-5xl">Where TONi Is Going</h2>
            <p className="text-[#5a6e84]">Built fast, evolving faster. Shipped milestones and next releases in one timeline.</p>
          </div>

          <div className="space-y-5">
            {roadmap.map((item) => (
              <div key={item.title} className={`fade-in rounded-2xl border border-[#d8dfe9] bg-[#f4f7fc] p-5 ${item.align === 'right' ? 'lg:ml-20' : 'lg:mr-20'}`}>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#1a7aff]">{item.status}</p>
                <p className="mb-2 font-mono text-xs text-[#0055aa]">// {item.period}</p>
                <h3 className="mb-1 text-lg font-bold text-[#003366]">{item.title}</h3>
                <p className="text-sm text-[#5a6e84]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#123f67] bg-[#010d1a] px-6 py-14 text-white">
        <div className="fade-in mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="mb-2 text-2xl font-black">Building on Top of TONi?</h2>
            <p className="text-white/60">If you're an OEM, insurer, or SaaS team with complementary products, BURG is open to technical integration partnerships and pilot deployments.</p>
          </div>
          <div className="space-y-3 text-right">
            <div className="rounded-lg border border-[#2f628f] bg-[#10243f] px-4 py-3 font-mono text-xs text-[#86c5ff]">GET /toni/fleet/live → GPS positions</div>
            <Link to="/contact" className="inline-block rounded-xl border-2 border-[#f0a500] bg-[#f0a500] px-5 py-2 font-bold text-[#001f40] transition hover:-translate-y-0.5 hover:bg-[#ffd166]">Discuss Integration →</Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#003366] px-6 py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_20%_50%,rgba(0,85,170,0.6)_0%,transparent_70%),radial-gradient(ellipse_40%_60%_at_80%_50%,rgba(240,165,0,0.12)_0%,transparent_70%)]" />
        <div className="fade-in relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="mb-3 text-3xl font-black sm:text-4xl">Want to See TONi in Action?</h2>
          <p className="mb-8 text-white/70">Request a live walkthrough of the admin dashboard, driver app, and passenger display running together in real time.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="rounded-xl border-2 border-[#f0a500] bg-[#f0a500] px-6 py-3 font-bold text-[#001f40] transition hover:-translate-y-0.5 hover:bg-[#ffd166]">Request a Demo</Link>
            <Link to="/partners" className="rounded-xl border-2 border-white/60 px-6 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10">Explore Partnerships</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Technology;
