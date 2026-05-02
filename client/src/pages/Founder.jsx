import { useEffect } from 'react';

const founderStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
:root{
  --red:#C0392B;--red-d:#7b241c;--red-l:#e74c3c;
  --black:#060608;--white:#fafaf8;--gray:#9a9a9a;
}
body{font-family:'DM Sans',sans-serif;background:var(--black);color:var(--white);overflow-x:hidden;line-height:1.6}

.founder-page{position:relative;background:var(--black);color:var(--white);overflow:hidden}

/* MORPH BG */
.morph-bg{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none}
.blob{position:absolute;border-radius:50%;filter:blur(90px);opacity:0.16;animation:blobM 14s ease-in-out infinite}
.b1{width:700px;height:700px;background:var(--red);top:-220px;left:-180px;animation-delay:0s}
.b2{width:520px;height:520px;background:#8b0000;top:25%;right:-160px;animation-delay:-5s}
.b3{width:420px;height:420px;background:#c0392b;bottom:-120px;left:25%;animation-delay:-9s}
.b4{width:280px;height:280px;background:#ff5f3f;top:55%;left:8%;animation-delay:-2s;opacity:0.09}
@keyframes blobM{
  0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;transform:translate(0,0) scale(1)}
  25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%;transform:translate(30px,-25px) scale(1.06)}
  50%{border-radius:50% 40% 60% 30%/40% 70% 50% 60%;transform:translate(-20px,30px) scale(0.95)}
  75%{border-radius:40% 60% 40% 60%/60% 40% 60% 40%;transform:translate(18px,10px) scale(1.03)}
}

/* BUS LANE */
.bus-lane{
  position:fixed;bottom:0;left:0;right:0;height:54px;z-index:100;
  background:rgba(6,6,8,0.88);
  backdrop-filter:blur(16px);
  border-top:1px solid rgba(192,57,43,0.28);
  overflow:hidden;
}
.bus-road-line{position:absolute;bottom:16px;left:0;right:0;height:1px;background:rgba(192,57,43,0.25)}
.bus-lane-tag{
  position:absolute;right:18px;top:50%;transform:translateY(-50%);
  font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.14em;
  color:rgba(255,255,255,0.18);text-transform:uppercase;z-index:2;white-space:nowrap;
}
.track{position:absolute;display:flex;white-space:nowrap;align-items:center}
.track.t1{bottom:18px;animation:drive 20s linear infinite}
.track.t2{bottom:30px;animation:drive 30s linear infinite;animation-delay:-12s}
@keyframes drive{from{transform:translateX(-110%)}to{transform:translateX(220vw)}}
.bus-w{display:inline-block;margin-right:130px;filter:drop-shadow(0 0 5px rgba(192,57,43,0.45))}

/* GLASS UTIL */
.glass{
  background:rgba(255,255,255,0.06);
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  border:1px solid rgba(255,255,255,0.11);border-radius:16px;
}

/* HERO */
.hero{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;position:relative;z-index:1;padding-bottom:54px}
.hero-left{display:flex;flex-direction:column;justify-content:center;padding:80px 60px 80px 80px;position:relative;z-index:2}
.hero-right{position:relative;overflow:hidden;display:flex;align-items:flex-end;justify-content:center}
.photo-frame{width:100%;height:100%;position:relative;min-height:600px}
.founder-photo{
  width:100%;height:100%;object-fit:cover;object-position:center top;display:block;
  mask-image:linear-gradient(to bottom,black 55%,transparent 100%);
  -webkit-mask-image:linear-gradient(to bottom,black 55%,transparent 100%);
  filter:contrast(1.06) saturate(0.88);transition:filter 0.6s ease;
}
.founder-photo:hover{filter:contrast(1.1) saturate(1.1)}
.logo-badge{
  position:absolute;top:30px;right:30px;width:86px;height:86px;
  background:rgba(255,255,255,0.95);border-radius:50%;padding:8px;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 0 0 1px rgba(192,57,43,0.25),0 8px 32px rgba(192,57,43,0.2);
  animation:logoF 5s ease-in-out infinite;
}
@keyframes logoF{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.logo-badge img{width:100%;height:100%;object-fit:contain}

.eyebrow{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:var(--red-l);margin-bottom:20px;display:flex;align-items:center;gap:12px}
.eyebrow::before{content:'';display:block;width:28px;height:1px;background:var(--red-l)}
.hero-name{font-family:'Playfair Display',serif;font-size:clamp(50px,5vw,84px);font-weight:900;line-height:1;color:var(--white);margin-bottom:8px}
.hero-name span{color:var(--red-l);display:block}
.hero-title{font-size:13px;color:var(--gray);margin-bottom:36px;letter-spacing:0.05em}
.hero-tagline{
  font-size:16px;font-weight:300;color:rgba(250,250,248,0.72);line-height:1.8;max-width:400px;margin-bottom:40px;
  padding:18px 20px 18px 22px;
  background:rgba(192,57,43,0.09);
  border-left:2px solid var(--red);border-radius:0 10px 10px 0;
  backdrop-filter:blur(10px);border:1px solid rgba(192,57,43,0.15);border-left:2px solid var(--red);
}
.contact-row{display:flex;flex-direction:column;gap:10px;margin-bottom:38px}
.contact-item{display:flex;align-items:center;gap:12px;font-size:14px;color:var(--gray);text-decoration:none;transition:color 0.2s}
.contact-item:hover{color:var(--white)}
.ci{width:34px;height:34px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;backdrop-filter:blur(8px);transition:border-color 0.2s,background 0.2s}
.contact-item:hover .ci{border-color:rgba(192,57,43,0.5);background:rgba(192,57,43,0.1)}
.cta-group{display:flex;gap:14px;flex-wrap:wrap}
.btn-p{background:var(--red);color:white;padding:14px 26px;border-radius:8px;font-size:14px;font-weight:500;text-decoration:none;letter-spacing:0.03em;border:none;cursor:pointer;display:inline-block;transition:background 0.2s,transform 0.15s,box-shadow 0.2s;box-shadow:0 4px 20px rgba(192,57,43,0.35)}
.btn-p:hover{background:var(--red-d);transform:translateY(-2px);box-shadow:0 8px 28px rgba(192,57,43,0.5)}
.btn-g{background:rgba(255,255,255,0.07);color:var(--white);padding:14px 26px;border-radius:8px;font-size:14px;font-weight:500;text-decoration:none;letter-spacing:0.03em;border:1px solid rgba(255,255,255,0.14);backdrop-filter:blur(12px);cursor:pointer;display:inline-block;transition:background 0.2s,border-color 0.2s}
.btn-g:hover{background:rgba(255,255,255,0.12);border-color:rgba(255,255,255,0.28)}

/* STATS */
.stats-bar{
  position:relative;z-index:2;
  background:rgba(192,57,43,0.82);backdrop-filter:blur(20px);
  border-top:1px solid rgba(255,255,255,0.08);border-bottom:1px solid rgba(255,255,255,0.07);
  display:grid;grid-template-columns:repeat(4,1fr);
}
.si{padding:26px 36px;border-right:1px solid rgba(255,255,255,0.12)}
.si:last-child{border-right:none}
.sn{font-family:'Playfair Display',serif;font-size:32px;font-weight:900;color:white;display:block;line-height:1;margin-bottom:4px}
.sl{font-size:11px;color:rgba(255,255,255,0.62);letter-spacing:0.06em;text-transform:uppercase}

/* SECTIONS */
section{padding:96px 80px;position:relative;z-index:1}
.ey{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:var(--red-l);margin-bottom:14px}
.st{font-family:'Playfair Display',serif;font-size:clamp(30px,3.5vw,50px);font-weight:700;line-height:1.1;margin-bottom:44px;color:var(--white)}

/* ABOUT */
.about-sec{background:rgba(8,8,10,0.72);display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
.ab{font-size:15px;color:rgba(250,250,248,0.63);line-height:1.85;margin-bottom:18px}
.tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:26px}
.tag{padding:6px 16px;border-radius:100px;font-size:11px;font-weight:500;letter-spacing:0.04em;border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.52);background:rgba(255,255,255,0.04);backdrop-filter:blur(8px);transition:all 0.25s;cursor:default}
.tag:hover{border-color:rgba(192,57,43,0.55);color:var(--red-l);background:rgba(192,57,43,0.08)}
.tl{position:relative}
.tl::before{content:'';position:absolute;left:12px;top:0;bottom:0;width:1px;background:rgba(255,255,255,0.08)}
.tli{display:flex;gap:24px;padding:0 0 34px;position:relative}
.tld{width:25px;height:25px;flex-shrink:0;border-radius:50%;background:rgba(192,57,43,0.14);border:1.5px solid var(--red);display:flex;align-items:center;justify-content:center;margin-top:2px;position:relative;z-index:1;backdrop-filter:blur(8px)}
.tldi{width:7px;height:7px;border-radius:50%;background:var(--red)}
.tly{font-family:'DM Mono',monospace;font-size:10px;color:var(--red-l);margin-bottom:4px;letter-spacing:0.1em}
.tlt{font-size:14px;font-weight:500;color:var(--white);margin-bottom:4px}
.tld2{font-size:13px;color:var(--gray);line-height:1.6}

/* VENTURES */
.vent-sec{background:transparent}
.vgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.vc{
  background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  border:1px solid rgba(255,255,255,0.09);border-radius:16px;padding:30px 24px;
  transition:all 0.32s ease;cursor:default;position:relative;overflow:hidden;
}
.vc::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 30% 30%,rgba(192,57,43,0.12),transparent 60%);opacity:0;transition:opacity 0.32s}
.vc:hover{border-color:rgba(192,57,43,0.38);transform:translateY(-6px);background:rgba(255,255,255,0.07);box-shadow:0 20px 60px rgba(0,0,0,0.45),0 0 0 1px rgba(192,57,43,0.18)}
.vc:hover::before{opacity:1}
.vi{font-size:24px;margin-bottom:16px;display:block}
.vn{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--white);margin-bottom:5px}
.vr{font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:var(--red-l);margin-bottom:13px}
.vd{font-size:13px;color:var(--gray);line-height:1.7}

/* RIDESAFE */
.rs-sec{background:rgba(244,238,226,0.96);backdrop-filter:blur(20px);color:#111;position:relative;overflow:hidden}
.rs-sec::after{content:'RIDESAFE';position:absolute;font-family:'Playfair Display',serif;font-size:170px;font-weight:900;color:rgba(192,57,43,0.05);top:-10px;right:-20px;line-height:1;pointer-events:none;white-space:nowrap}
.rs-inner{display:grid;grid-template-columns:1fr 1fr;gap:70px;align-items:start}
.rs-sec .st{color:#111}.rs-sec .ey{color:var(--red)}
.rsd{font-size:15px;color:rgba(13,13,13,0.58);line-height:1.85;margin-bottom:26px}
.rsf{display:grid;grid-template-columns:1fr 1fr;gap:13px}
.rsfi{background:rgba(255,255,255,0.72);backdrop-filter:blur(12px);border-radius:10px;padding:16px;border-left:3px solid var(--red);border-top:1px solid rgba(255,255,255,0.9);transition:transform 0.2s,box-shadow 0.2s}
.rsfi:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(0,0,0,0.1)}
.rsfn{font-size:13px;font-weight:600;color:#111;margin-bottom:3px}
.rsfd{font-size:11px;color:#666}
.rs-ctag{display:flex;gap:12px;margin-top:26px;flex-wrap:wrap}
.rs-mock{background:rgba(6,6,8,0.9);backdrop-filter:blur(24px);border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.09);box-shadow:0 40px 100px rgba(0,0,0,0.3)}
.rs-mb{background:var(--red);padding:13px 18px;display:flex;align-items:center;gap:10px}
.rs-ml{width:26px;height:26px;background:white;border-radius:6px;display:flex;align-items:center;justify-content:center}
.rs-mld{width:13px;height:13px;background:var(--red);border-radius:50%}
.rs-mt{font-size:13px;font-weight:500;color:white}
.rs-ms{font-size:10px;color:rgba(255,255,255,0.55)}
.rs-body{padding:18px}
.rs-sr{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-bottom:13px}
.rs-s{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:11px;text-align:center;backdrop-filter:blur(8px)}
.rs-sn{font-family:'Playfair Display',serif;font-size:21px;font-weight:700;color:var(--white)}
.rs-sl{font-size:9px;color:rgba(255,255,255,0.33);letter-spacing:0.06em}
.rs-rl{display:flex;flex-direction:column;gap:7px}
.rs-r{background:rgba(255,255,255,0.04);border-radius:8px;padding:9px 12px;display:flex;align-items:center;justify-content:space-between;border:1px solid rgba(255,255,255,0.06);transition:border-color 0.3s}
.rs-r:hover{border-color:rgba(192,57,43,0.25)}
.rs-rn{font-size:12px;color:rgba(255,255,255,0.62)}
.rs-rb{font-size:10px;padding:3px 8px;border-radius:100px;font-family:'DM Mono',monospace}
.ba{background:rgba(39,174,96,0.18);color:#2ecc71}
.be{background:rgba(231,76,60,0.18);color:#e74c3c}
.bi{background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.33)}

/* TEAM */
.team-sec{background:rgba(6,6,8,0.82)}
.tgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.tc{background:rgba(255,255,255,0.04);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:24px 16px;text-align:center;transition:border-color 0.25s,transform 0.25s,background 0.25s}
.tc:hover{border-color:rgba(192,57,43,0.32);transform:translateY(-4px);background:rgba(255,255,255,0.07)}
.tav{width:56px;height:56px;border-radius:50%;background:rgba(192,57,43,0.75);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:white;margin:0 auto 13px;border:1.5px solid rgba(255,255,255,0.13);backdrop-filter:blur(8px)}
.tn{font-size:14px;font-weight:500;color:var(--white);margin-bottom:3px}
.tr{font-size:11px;color:var(--gray)}

/* CONTACT */
.cta-sec{text-align:center;background:rgba(192,57,43,0.88);backdrop-filter:blur(24px);padding:78px 80px;position:relative;overflow:hidden}
.cta-sec::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(255,255,255,0.07),transparent 70%);pointer-events:none}
.cta-sec h2{font-family:'Playfair Display',serif;font-size:clamp(32px,4vw,58px);font-weight:900;color:white;margin-bottom:13px}
.cta-sec p{font-size:16px;color:rgba(255,255,255,0.7);margin-bottom:42px}
.cc-wrap{display:flex;justify-content:center;gap:18px;flex-wrap:wrap;margin-bottom:40px}
.cc{background:rgba(255,255,255,0.1);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.18);border-radius:12px;padding:18px 26px;min-width:180px;text-align:left;text-decoration:none;transition:background 0.2s,transform 0.2s;display:block}
.cc:hover{background:rgba(255,255,255,0.18);transform:translateY(-2px)}
.ccl{font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.52);margin-bottom:5px}
.ccv{font-size:15px;font-weight:500;color:white}
.btn-w{background:white;color:var(--red);padding:16px 34px;border-radius:8px;font-size:15px;font-weight:600;text-decoration:none;display:inline-block;transition:transform 0.15s,box-shadow 0.2s;letter-spacing:0.03em;cursor:pointer;border:none;box-shadow:0 4px 18px rgba(0,0,0,0.14)}
.btn-w:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,0,0,0.22)}

/* FOOTER */
footer{background:rgba(4,4,6,0.96);backdrop-filter:blur(20px);padding:26px 80px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.06);position:relative;z-index:10;margin-bottom:54px}
.fl{display:flex;align-items:center;gap:12px}
.fl img{width:36px;height:36px;object-fit:contain;background:white;border-radius:50%;padding:3px}
.fb{font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:var(--white)}
.fb span{display:block;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:400;color:var(--gray)}
.fc{font-size:11px;color:rgba(255,255,255,0.2)}
.fp{font-family:'DM Mono',monospace;font-size:10px;color:rgba(255,255,255,0.16)}

/* FADE */
.fade{opacity:0;transform:translateY(26px);transition:opacity 0.72s ease,transform 0.72s ease}
.fade.on{opacity:1;transform:translateY(0)}

@media(max-width:900px){
  .hero{grid-template-columns:1fr}.hero-left{padding:56px 28px}.hero-right{min-height:48vh}
  .about-sec,.rs-inner{grid-template-columns:1fr;gap:44px}
  section{padding:56px 24px}
  .stats-bar{grid-template-columns:repeat(2,1fr)}
  .vgrid{grid-template-columns:1fr}.tgrid{grid-template-columns:repeat(2,1fr)}
  footer{flex-direction:column;gap:12px;text-align:center;padding:24px}
}
`;

function Founder() {
  useEffect(() => {
    document.title = 'Akash Rajaraman — Founder, BURG Rental Services';

    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('on');
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll('.fade').forEach((element) => fadeObserver.observe(element));

    const animateCount = (element, target) => {
      let value = 0;
      const step = target / 45;
      const intervalId = window.setInterval(() => {
        value += step;
        if (value >= target) {
          element.textContent = String(target);
          window.clearInterval(intervalId);
          return;
        }
        element.textContent = String(Math.floor(value));
      }, 28);
    };

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = Number.parseInt(entry.target.dataset.target || '', 10);
          if (!Number.isNaN(target)) animateCount(entry.target, target);
          countObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.5 },
    );

    document.querySelectorAll('[data-target]').forEach((element) => countObserver.observe(element));

    const vehicleElement = document.getElementById('rsV');
    const studentElement = document.getElementById('rsS');
    const vehicleInterval = vehicleElement
      ? window.setInterval(() => {
          vehicleElement.textContent = String(22 + Math.floor(Math.random() * 5));
          if (studentElement) studentElement.textContent = String(830 + Math.floor(Math.random() * 30));
        }, 3200)
      : undefined;

    const badges = document.querySelectorAll('.rs-rb');
    const states = [
      ['Active', 'ba'],
      ['En Route', 'be'],
      ['Idle', 'bi'],
    ];
    const badgeInterval = badges.length
      ? window.setInterval(() => {
          badges.forEach((badge) => {
            if (Math.random() < 0.3) {
              const nextState = states[Math.floor(Math.random() * states.length)];
              badge.textContent = nextState[0];
              badge.className = `rs-rb ${nextState[1]}`;
            }
          });
        }, 2800)
      : undefined;

    return () => {
      fadeObserver.disconnect();
      countObserver.disconnect();
      if (vehicleInterval) window.clearInterval(vehicleInterval);
      if (badgeInterval) window.clearInterval(badgeInterval);
    };
  }, []);

  return (
    <div className="founder-page">
      <style>{founderStyles}</style>

      <div className="morph-bg" aria-hidden="true">
        <div className="blob b1"></div>
        <div className="blob b2"></div>
        <div className="blob b3"></div>
        <div className="blob b4"></div>
      </div>

      <div className="bus-lane" aria-hidden="true">
        <div className="bus-road-line"></div>
        <div className="bus-lane-tag">BURG Fleet · Live Routes</div>
        <div className="track t1">
          <div className="bus-w"><svg width="58" height="26" viewBox="0 0 58 26" fill="none"><rect x="1" y="3" width="50" height="17" rx="3" fill="#C0392B"/><rect x="3" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.5)"/><rect x="14" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.45)"/><rect x="25" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.5)"/><rect x="36" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.35)"/><rect x="3" y="14" width="46" height="3" rx="1" fill="#922b21"/><circle cx="11" cy="23" r="3.5" fill="#1a1a1a"/><circle cx="11" cy="23" r="1.8" fill="#444"/><circle cx="42" cy="23" r="3.5" fill="#1a1a1a"/><circle cx="42" cy="23" r="1.8" fill="#444"/><rect x="50" y="6" width="6" height="4" rx="1" fill="rgba(255,210,0,0.85)"/></svg></div>
          <div className="bus-w"><svg width="58" height="26" viewBox="0 0 58 26" fill="none"><rect x="1" y="3" width="50" height="17" rx="3" fill="#8b0000"/><rect x="3" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.4)"/><rect x="14" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.5)"/><rect x="25" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.38)"/><rect x="36" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.48)"/><rect x="3" y="14" width="46" height="3" rx="1" fill="#600000"/><circle cx="11" cy="23" r="3.5" fill="#1a1a1a"/><circle cx="11" cy="23" r="1.8" fill="#444"/><circle cx="42" cy="23" r="3.5" fill="#1a1a1a"/><circle cx="42" cy="23" r="1.8" fill="#444"/><rect x="50" y="6" width="6" height="4" rx="1" fill="rgba(255,210,0,0.85)"/></svg></div>
          <div className="bus-w"><svg width="58" height="26" viewBox="0 0 58 26" fill="none"><rect x="1" y="3" width="50" height="17" rx="3" fill="#e74c3c"/><rect x="3" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.55)"/><rect x="14" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.3)"/><rect x="25" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.55)"/><rect x="36" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.45)"/><rect x="3" y="14" width="46" height="3" rx="1" fill="#C0392B"/><circle cx="11" cy="23" r="3.5" fill="#1a1a1a"/><circle cx="11" cy="23" r="1.8" fill="#444"/><circle cx="42" cy="23" r="3.5" fill="#1a1a1a"/><circle cx="42" cy="23" r="1.8" fill="#444"/><rect x="50" y="6" width="6" height="4" rx="1" fill="rgba(255,210,0,0.85)"/></svg></div>
          <div className="bus-w"><svg width="58" height="26" viewBox="0 0 58 26" fill="none"><rect x="1" y="3" width="50" height="17" rx="3" fill="#C0392B"/><rect x="3" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.42)"/><rect x="14" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.52)"/><rect x="25" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.42)"/><rect x="36" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.6)"/><rect x="3" y="14" width="46" height="3" rx="1" fill="#922b21"/><circle cx="11" cy="23" r="3.5" fill="#1a1a1a"/><circle cx="11" cy="23" r="1.8" fill="#444"/><circle cx="42" cy="23" r="3.5" fill="#1a1a1a"/><circle cx="42" cy="23" r="1.8" fill="#444"/><rect x="50" y="6" width="6" height="4" rx="1" fill="rgba(255,210,0,0.85)"/></svg></div>
        </div>
        <div className="track t2">
          <div className="bus-w"><svg width="58" height="26" viewBox="0 0 58 26" fill="none"><rect x="1" y="3" width="50" height="17" rx="3" fill="#7b241c"/><rect x="3" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.35)"/><rect x="14" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.5)"/><rect x="25" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.38)"/><rect x="36" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.5)"/><rect x="3" y="14" width="46" height="3" rx="1" fill="#5a1a14"/><circle cx="11" cy="23" r="3.5" fill="#1a1a1a"/><circle cx="11" cy="23" r="1.8" fill="#444"/><circle cx="42" cy="23" r="3.5" fill="#1a1a1a"/><circle cx="42" cy="23" r="1.8" fill="#444"/><rect x="50" y="6" width="6" height="4" rx="1" fill="rgba(255,210,0,0.85)"/></svg></div>
          <div className="bus-w"><svg width="58" height="26" viewBox="0 0 58 26" fill="none"><rect x="1" y="3" width="50" height="17" rx="3" fill="#C0392B"/><rect x="3" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.5)"/><rect x="14" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.3)"/><rect x="25" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.58)"/><rect x="36" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.4)"/><rect x="3" y="14" width="46" height="3" rx="1" fill="#922b21"/><circle cx="11" cy="23" r="3.5" fill="#1a1a1a"/><circle cx="11" cy="23" r="1.8" fill="#444"/><circle cx="42" cy="23" r="3.5" fill="#1a1a1a"/><circle cx="42" cy="23" r="1.8" fill="#444"/><rect x="50" y="6" width="6" height="4" rx="1" fill="rgba(255,210,0,0.85)"/></svg></div>
          <div className="bus-w"><svg width="58" height="26" viewBox="0 0 58 26" fill="none"><rect x="1" y="3" width="50" height="17" rx="3" fill="#8b0000"/><rect x="3" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.45)"/><rect x="14" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.55)"/><rect x="25" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.42)"/><rect x="36" y="5" width="9" height="7" rx="1" fill="rgba(255,255,255,0.35)"/><rect x="3" y="14" width="46" height="3" rx="1" fill="#600000"/><circle cx="11" cy="23" r="3.5" fill="#1a1a1a"/><circle cx="11" cy="23" r="1.8" fill="#444"/><circle cx="42" cy="23" r="3.5" fill="#1a1a1a"/><circle cx="42" cy="23" r="1.8" fill="#444"/><rect x="50" y="6" width="6" height="4" rx="1" fill="rgba(255,210,0,0.85)"/></svg></div>
        </div>
      </div>

      <section className="hero">
        <div className="hero-left">
          <p className="eyebrow">Meet the Founder</p>
          <h1 className="hero-name">Akash<span>Rajaraman</span></h1>
          <p className="hero-title">Co-Founder & Director · BURG Rental Services LLP · LLPIN: ACR-9256</p>
          <p className="hero-tagline">Building the infrastructure layer for commercial transport in India — one verified route, one trusted vehicle, one partner at a time.</p>
          <div className="contact-row">
            <a href="https://wa.me/918778579209" target="_blank" rel="noreferrer" className="contact-item"><span className="ci">📞</span>+91 87785 79209</a>
            <a href="mailto:akash@burgrental.com" className="contact-item"><span className="ci">✉</span>akash@burgrental.com</a>
            <span className="contact-item"><span className="ci">📍</span>Bengaluru, Karnataka, India</span>
          </div>
          <div className="cta-group">
            <a href="https://wa.me/918778579209?text=Hi%20Akash%2C%20I%20found%20your%20profile%20and%20would%20like%20to%20connect%20about%20BURG." target="_blank" rel="noreferrer" className="btn-p">Connect on WhatsApp</a>
            <a href="#ridesafe" className="btn-g">Explore RideSafe →</a>
          </div>
        </div>
        <div className="hero-right">
          <div className="photo-frame">
            <img src="https://i.ibb.co/mrHmcpjW/Akashformal.jpg" alt="Akash Rajaraman" className="founder-photo" />
          </div>
          <div className="logo-badge">
            <img src="https://i.ibb.co/rKbMhMsY/BURGRENTAL-COM-BADGE-removebg-preview.png" alt="BURG Logo" />
          </div>
        </div>
      </section>

      <div className="stats-bar fade">
        <div className="si"><span className="sn" data-target="2">0</span><span className="sl">Ventures Founded</span></div>
        <div className="si"><span className="sn">₹5L</span><span className="sl">Initial Capital</span></div>
        <div className="si"><span className="sn">B2B2C</span><span className="sl">Market Model</span></div>
        <div className="si"><span className="sn">19</span><span className="sl">Years Old</span></div>
      </div>

      <section className="about-sec fade">
        <div>
          <p className="ey">About Akash</p>
          <h2 className="st">The story behind the builder.</h2>
          <p className="ab">At 19, Akash Rajaraman is not waiting for a degree to start building. He is currently pursuing a BCom (International Accounting & Finance, Honours) at Christ University, Bengaluru — and running a registered LLP simultaneously.</p>
          <p className="ab">Akash co-founded BURG Rental Services LLP with a clear thesis: India's commercial vehicle space is fragmented, unverified, and underserved by technology. BURG is his answer — a B2B2C aggregation and SaaS platform bridging fleet vendors with institutional clients.</p>
          <p className="ab">His approach is methodical: validate before building, unit economics before features, trust before scale. He is a realist who moves fast where it matters and pauses before committing to anything permanent.</p>
          <div className="tags">
            <span className="tag">Pragmatic Realist</span><span className="tag">Long-term Planner</span>
            <span className="tag">Collaborative Leader</span><span className="tag">Calm Under Pressure</span>
            <span className="tag">Instinct + Data</span><span className="tag">Systems Thinker</span>
            <span className="tag">Christ University</span><span className="tag">Bengaluru</span>
          </div>
        </div>
        <div>
          <p className="ey" style={{ marginBottom: '26px' }}>Journey</p>
          <div className="tl">
            <div className="tli"><div className="tld"><div className="tldi"></div></div><div><p className="tly">2024</p><p className="tlt">BURG Rental Services LLP Incorporated</p><p className="tld2">Registered B2B2C commercial vehicle marketplace. Built founding team across operations, tech, and finance with advisor Kandakatla Sathwik.</p></div></div>
            <div className="tli"><div className="tld"><div className="tldi"></div></div><div><p className="tly">2024</p><p className="tlt">TONi — Transport Oriented Network Interface</p><p className="tld2">Built and deployed real-time fleet management with admin, driver PWA, and passenger display via Firebase. Live at toni.burgrental.com.</p></div></div>
            <div className="tli"><div className="tld"><div className="tldi"></div></div><div><p className="tly">2025</p><p className="tlt">BURG RideSafe — School & Corporate SaaS</p><p className="tld2">Launched BURG's flagship SaaS: transport management for schools, universities, and corporates. Razorpay, Google Maps, DigiLocker integrated.</p></div></div>
            <div className="tli"><div className="tld"><div className="tldi"></div></div><div><p className="tly">2025</p><p className="tlt">Christ Route Pilot</p><p className="tld2">Capturing Christ University bus routes during June admissions — BURG's most immediately executable captive route business.</p></div></div>
          </div>
        </div>
      </section>

      <section className="vent-sec fade">
        <p className="ey">Ventures</p>
        <h2 className="st">What Akash is building.</h2>
        <div className="vgrid">
          <div className="vc"><span className="vi">🚌</span><p className="vn">BURG Aggregation</p><p className="vr">Co-Founder & Director</p><p className="vd">Verified B2B2C marketplace connecting fleet vendors with schools, corporates, and travel operators. Standardised pricing, background-checked drivers, SLA-backed ops.</p></div>
          <div className="vc"><span className="vi">🛡️</span><p className="vn">BURG RideSafe</p><p className="vr">Product Lead</p><p className="vd">School and commercial transport management SaaS. Real-time tracking, route management, enrollment flows, Razorpay payments, DigiLocker driver verification.</p></div>
          <div className="vc"><span className="vi">📡</span><p className="vn">TONi by BURG</p><p className="vr">Builder & Architect</p><p className="vd">Transport Oriented Network Interface — live fleet management with cross-device sync via Firebase Realtime Database. Live at toni.burgrental.com.</p></div>
          <div className="vc"><span className="vi">🌐</span><p className="vn">BURG Hosted Pages</p><p className="vr">Product Designer</p><p className="vd">White-label vendor websites for fleet operators. Sri Varalakshmi Travels and Suja Travels already live on the BURG ecosystem as sub-brand pages.</p></div>
          <div className="vc"><span className="vi">🎓</span><p className="vn">Christ Route Pilot</p><p className="vr">Route Strategist</p><p className="vd">Capturing Christ University bus routes during June admissions as a captive route business — BURG's most immediately executable growth play.</p></div>
          <div className="vc"><span className="vi">🔐</span><p className="vn">BURG Interviewer</p><p className="vr">Internal Tooling</p><p className="vd">PIN-locked recruiter dashboard for BURG's hiring process with live scorecard, pre-interview form, and session export — built in-house.</p></div>
        </div>
      </section>

      <section className="rs-sec fade" id="ridesafe">
        <div className="rs-inner">
          <div>
            <p className="ey">Flagship Product</p>
            <h2 className="st">BURG RideSafe — Transport, Managed.</h2>
            <p className="rsd">RideSafe is BURG's SaaS platform for institutions that need transport they can trust. Schools, universities, and corporates get a complete system — from route planning to real-time tracking to verified, background-checked drivers.</p>
            <div className="rsf">
              <div className="rsfi"><p className="rsfn">School Enrollment</p><p className="rsfd">End-to-end student transport enrollment with route assignment</p></div>
              <div className="rsfi"><p className="rsfn">Corporate Shuttles</p><p className="rsfd">Employee shuttle management with shift scheduling</p></div>
              <div className="rsfi"><p className="rsfn">Real-time Tracking</p><p className="rsfd">Google Maps Distance Matrix API — live, accurate routes</p></div>
              <div className="rsfi"><p className="rsfn">Distance Pricing</p><p className="rsfd">Official BURG rate card by distance slab — transparent billing</p></div>
              <div className="rsfi"><p className="rsfn">Driver Verification</p><p className="rsfd">DigiLocker OTP authentication for every driver on the network</p></div>
              <div className="rsfi"><p className="rsfn">Instant Payments</p><p className="rsfd">Razorpay-integrated collection, invoicing, and reconciliation</p></div>
            </div>
            <div className="rs-ctag">
              <a href="https://wa.me/918778579209?text=Hi%20Akash%2C%20I%20would%20like%20to%20enquire%20about%20BURG%20RideSafe%20for%20my%20institution." target="_blank" rel="noreferrer" className="btn-p">Enquire on WhatsApp</a>
              <a href="https://burgrental.com" target="_blank" rel="noreferrer" className="btn-g" style={{ color: '#111', borderColor: 'rgba(0,0,0,0.14)', background: 'rgba(0,0,0,0.05)' }}>Visit BURG →</a>
            </div>
          </div>
          <div>
            <div className="rs-mock">
              <div className="rs-mb"><div className="rs-ml"><div className="rs-mld"></div></div><div><p className="rs-mt">BURG RideSafe — Admin</p><p className="rs-ms">Live Dashboard</p></div></div>
              <div className="rs-body">
                <div className="rs-sr">
                  <div className="rs-s"><div className="rs-sn" id="rsV">24</div><div className="rs-sl">Vehicles</div></div>
                  <div className="rs-s"><div className="rs-sn" id="rsS">847</div><div className="rs-sl">Students</div></div>
                  <div className="rs-s"><div className="rs-sn" id="rsR">18</div><div className="rs-sl">Routes</div></div>
                </div>
                <div className="rs-rl">
                  <div className="rs-r"><span className="rs-rn">Whitefield → Christ University</span><span className="rs-rb ba">Active</span></div>
                  <div className="rs-r"><span className="rs-rn">Koramangala → Electronic City</span><span className="rs-rb be">En Route</span></div>
                  <div className="rs-r"><span className="rs-rn">Banashankari → Bellandur</span><span className="rs-rb ba">Active</span></div>
                  <div className="rs-r"><span className="rs-rn">Hebbal → MG Road</span><span className="rs-rb bi">Idle</span></div>
                  <div className="rs-r"><span className="rs-rn">JP Nagar → Marathahalli</span><span className="rs-rb be">En Route</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="team-sec fade">
        <p className="ey">The Team</p>
        <h2 className="st">Built with the right people.</h2>
        <div className="tgrid">
          <div className="tc"><div className="tav">AR</div><p className="tn">Akash Rajaraman</p><p className="tr">Co-Founder & Director</p></div>
          <div className="tc"><div className="tav">AB</div><p className="tn">Alankar Bezbaruah</p><p className="tr">Co-Founder</p></div>
          <div className="tc"><div className="tav">AN</div><p className="tn">Anushree</p><p className="tr">Core Team</p></div>
          <div className="tc"><div className="tav">SK</div><p className="tn">Sujith Kumar</p><p className="tr">Core Team</p></div>
          <div className="tc"><div className="tav">SS</div><p className="tn">Sharanya Srinivas</p><p className="tr">Core Team</p></div>
          <div className="tc" style={{ borderColor: 'rgba(44,62,80,0.45)' }}><div className="tav" style={{ background: 'rgba(44,62,80,0.75)' }}>KS</div><p className="tn">Kandakatla Sathwik</p><p className="tr">Advisor · Tech & Cybersecurity</p></div>
          <div className="tc" style={{ borderStyle: 'dashed', borderColor: 'rgba(192,57,43,0.2)' }}><div className="tav" style={{ background: 'rgba(192,57,43,0.12)', color: 'var(--red-l)', fontSize: '20px' }}>+</div><p className="tn" style={{ color: 'var(--gray)' }}>We're Hiring</p><p className="tr">Part-time University Reps</p></div>
          <div className="tc" style={{ borderStyle: 'dashed', borderColor: 'rgba(192,57,43,0.2)' }}><div className="tav" style={{ background: 'rgba(192,57,43,0.12)', color: 'var(--red-l)', fontSize: '20px' }}>+</div><p className="tn" style={{ color: 'var(--gray)' }}>We're Hiring</p><p className="tr">Freelance App Developer</p></div>
        </div>
      </section>

      <section className="cta-sec fade">
        <h2>Let's move together.</h2>
        <p>Fleet operator, school admin, or potential partner — Akash wants to hear from you.</p>
        <div className="cc-wrap">
          <a href="https://wa.me/918778579209" target="_blank" rel="noreferrer" className="cc"><p className="ccl">WhatsApp Akash</p><p className="ccv">+91 87785 79209</p></a>
          <a href="mailto:akash@burgrental.com" className="cc"><p className="ccl">Email</p><p className="ccv">akash@burgrental.com</p></a>
          <a href="https://burgrental.com" target="_blank" rel="noreferrer" className="cc"><p className="ccl">Website</p><p className="ccv">burgrental.com</p></a>
        </div>
        <button
          className="btn-w"
          type="button"
          onClick={() =>
            window.open(
              'https://wa.me/918778579209?text=Hi%20Akash%2C%20I%20saw%20your%20founder%20profile%20and%20would%20love%20to%20connect%20about%20BURG.',
              '_blank',
              'noopener,noreferrer',
            )
          }
        >
          Message on WhatsApp ↗
        </button>
      </section>

      <footer>
        <div className="fl">
          <img src="https://i.ibb.co/rKbMhMsY/BURGRENTAL-COM-BADGE-removebg-preview.png" alt="BURG" />
          <div><p className="fb">BURG Rental Services LLP<span>LLPIN: ACR-9256 · Bengaluru, India</span></p></div>
        </div>
        <p className="fc">© 2026 BURG Rental Services LLP. All rights reserved.</p>
        <p className="fp">burgrental.com</p>
      </footer>
    </div>
  );
}

export default Founder;