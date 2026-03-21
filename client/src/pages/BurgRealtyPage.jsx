import React, { useState } from "react";

const BurgRealtyPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
  <div className="bg-[#fcfaf7] font-[Manrope] text-[#2e2b28]">
    {/* Navbar */}
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-[#e5dbd2] bg-[#fcfaf7]/90 px-4 py-4 backdrop-blur-lg sm:px-6 lg:px-10">
      <div className="font-serif text-xl font-semibold text-[#4f3822] sm:text-2xl lg:text-[2.2rem]" style={{fontFamily: 'Literata, serif'}}>BURG Realty</div>
      <div className="hidden items-center gap-8 md:flex lg:gap-10 nav-links">
        <a href="#home" className="text-base text-[#2e2b28] transition hover:border-b hover:border-[#a56b3c]">Home</a>
        <a href="#story" className="text-base text-[#2e2b28] transition hover:border-b hover:border-[#a56b3c]">Our story</a>
        <a href="#services" className="text-base text-[#2e2b28] transition hover:border-b hover:border-[#a56b3c]">Approach</a>
        <a href="#contact" className="text-base text-[#2e2b28] transition hover:border-b hover:border-[#a56b3c]">Connect</a>
      </div>
      <button
        type="button"
        className="rounded-full border border-[#2e2b28] px-3 py-2 text-sm font-medium md:hidden"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open navigation menu"
      >
        ☰
      </button>
    </nav>

    {mobileMenuOpen && (
      <div className="fixed inset-0 z-60 md:hidden">
        <button
          type="button"
          className="absolute inset-0 bg-black/45"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
        />
        <aside className="absolute right-0 top-0 h-full w-[82vw] max-w-sm bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#e5dbd2] px-5 py-4">
            <span className="font-serif text-lg font-semibold text-[#4f3822]" style={{fontFamily: 'Literata, serif'}}>BURG Realty</span>
            <button type="button" className="rounded-full px-2 py-1 text-xl" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation menu">×</button>
          </div>
          <div className="space-y-2 px-4 py-5">
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block rounded-2xl px-4 py-3 text-base font-medium hover:bg-gray-100">Home</a>
            <a href="#story" onClick={() => setMobileMenuOpen(false)} className="block rounded-2xl px-4 py-3 text-base font-medium hover:bg-gray-100">Our story</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block rounded-2xl px-4 py-3 text-base font-medium hover:bg-gray-100">Approach</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block rounded-2xl px-4 py-3 text-base font-medium hover:bg-gray-100">Connect</a>
          </div>
        </aside>
      </div>
    )}

    {/* HERO */}
    <section id="home" className="hero relative flex min-h-[85vh] items-center px-4" style={{marginTop: 74, backgroundImage: "url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')", backgroundSize: 'cover', backgroundPosition: '30% 40%', backgroundBlendMode: 'multiply', backgroundColor: '#84756a', color: 'white'}}>
      <div className="hero-content relative z-10 max-w-175 pl-0 sm:pl-6 lg:pl-12">
        <span className="overline block mb-3" style={{color: '#f0dbbc', fontFamily: 'Literata, serif'}}>BURG Realty</span>
        <h1 className="mb-4 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-[5rem]" style={{textShadow: "0 4px 25px rgba(0,0,0,0.3)", fontFamily: 'Literata, serif'}}>Not just advice.<br/>a partnership.</h1>
        <div className="hero-tagline mb-8 text-lg font-light sm:text-xl lg:text-[1.5rem]" style={{fontFamily: 'Manrope, sans-serif', textShadow: '0 2px 10px rgba(0,0,0,0.3)'}}>Real estate investment, stripped of jargon. Clarity, conviction, and a human touch.</div>
        <a href="#contact" className="btn btn-light relative overflow-hidden rounded-full border border-[#fcfaf7] px-8 py-3 text-[#fcfaf7] transition" style={{background: 'transparent', position: 'relative'}}>Let's talk</a>
      </div>
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
    </section>

    {/* STATS */}
    <div className="relative z-10 mx-auto -mt-12 container">
      <div className="stats-row flex flex-col gap-6 rounded-sm bg-[#fcfaf7] px-5 py-8 shadow-lg sm:flex-row sm:flex-wrap sm:gap-10 sm:px-8 sm:py-10">
        <div className="stat-item flex-1 min-w-35">
          <span className="stat-number text-[2.4rem] font-serif font-semibold leading-none text-[#4f3822] sm:text-[3rem]" style={{fontFamily: 'Literata, serif'}}>17</span> <span className="stat-label text-xs uppercase tracking-wider text-[#6f5e4f]">years walking with investors</span>
        </div>
        <div className="stat-item flex-1 min-w-35">
          <span className="stat-number text-[2.4rem] font-serif font-semibold leading-none text-[#4f3822] sm:text-[3rem]" style={{fontFamily: 'Literata, serif'}}>₹850Cr+</span> <span className="stat-label text-xs uppercase tracking-wider text-[#6f5e4f]">transacted with trust</span>
        </div>
        <div className="stat-item flex-1 min-w-35">
          <span className="stat-number text-[2.4rem] font-serif font-semibold leading-none text-[#4f3822] sm:text-[3rem]" style={{fontFamily: 'Literata, serif'}}>1,400+</span> <span className="stat-label text-xs uppercase tracking-wider text-[#6f5e4f]">families & founders</span>
        </div>
        <div className="stat-item flex-1 min-w-35">
          <span className="stat-number text-[2.4rem] font-serif font-semibold leading-none text-[#4f3822] sm:text-[3rem]" style={{fontFamily: 'Literata, serif'}}>9</span> <span className="stat-label text-xs uppercase tracking-wider text-[#6f5e4f]">cities – one standard</span>
        </div>
      </div>
    </div>

    {/* STORY */}
    <section id="story" className="section-padding px-4 py-16 sm:px-6 sm:py-20">
      <div className="container mx-auto grid items-center gap-12 md:grid-cols-2 lg:gap-16 story-grid">
        <div className="story-text">
          <span className="overline block mb-3">why we exist</span>
          <h2 className="section-title mb-6 text-3xl font-serif font-semibold sm:text-4xl lg:text-[3rem]" style={{color: '#2e2b28', fontFamily: 'Literata, serif'}}>Real estate is personal.<br/>So is our advice.</h2>
          <p className="text-[1.1rem] text-[#3f3a35] mb-6 leading-relaxed">BURG Realty was founded because most property advice felt like a transaction. We believe in walking with you – through market noise, through paperwork, through the moments of doubt. No pressure, no fluff. Only structured wisdom and a steady hand.</p>
          <p className="text-[1.1rem] text-[#3f3a35] mb-6 leading-relaxed">We are a team of seven, based between Mumbai and Gurugram. Together we’ve helped first‑time buyers, family offices, and everyone in between. Our work is quiet, but our clients’ confidence speaks.</p>
          <a href="#contact" className="btn border border-[#2e2b28] px-8 py-3 mt-4 inline-block transition" style={{background: 'transparent'}}>Write to us</a>
        </div>
        <div className="story-image rounded shadow-lg" style={{background: "#cfbcac url('https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80') center/cover", height: 400}}></div>
      </div>
    </section>

    {/* SERVICES */}
    <section id="services" className="bg-[#f6f1eb]">
      <div className="container mx-auto section-padding px-4 py-16 sm:px-6 sm:py-20">
        <span className="overline block mb-3">our craft</span>
        <h2 className="section-title mb-6 text-3xl font-serif font-semibold sm:text-4xl lg:text-[3rem]" style={{color: '#2e2b28', fontFamily: 'Literata, serif'}}>What we actually do</h2>
        <div className="service-grid mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="service-card bg-white/85 p-8 backdrop-blur transition hover:border-[#a56b3c] hover:bg-[#fffcf8] shadow-md border border-[#e5dbd2] sm:p-10">
            <i className="fas fa-compass text-[2.6rem] text-[#a56b3c] mb-6"></i>
            <h3 className="text-[1.9rem] font-serif font-semibold mb-2">Investment advisory</h3>
            <p className="text-[#4e4944]">Quiet, rigorous analysis of what suits you – not what’s trending. residential, commercial, land.</p>
          </div>
          <div className="service-card bg-white/85 p-8 backdrop-blur transition hover:border-[#a56b3c] hover:bg-[#fffcf8] shadow-md border border-[#e5dbd2] sm:p-10">
            <i className="fas fa-file-signature text-[2.6rem] text-[#a56b3c] mb-6"></i>
            <h3 className="text-[1.9rem] font-serif font-semibold mb-2">Acquisition support</h3>
            <p className="text-[#4e4944]">We hold your hand through due diligence, legal, and negotiation. No fine print left unturned.</p>
          </div>
          <div className="service-card bg-white/85 p-8 backdrop-blur transition hover:border-[#a56b3c] hover:bg-[#fffcf8] shadow-md border border-[#e5dbd2] sm:p-10">
            <i className="fas fa-sitemap text-[2.6rem] text-[#a56b3c] mb-6"></i>
            <h3 className="text-[1.9rem] font-serif font-semibold mb-2">Portfolio structuring</h3>
            <p className="text-[#4e4944]">Helping you build a real estate basket that balances risk, tax, and long‑term value.</p>
          </div>
          <div className="service-card bg-white/85 p-8 backdrop-blur transition hover:border-[#a56b3c] hover:bg-[#fffcf8] shadow-md border border-[#e5dbd2] sm:p-10">
            <i className="fas fa-hand-holding-heart text-[2.6rem] text-[#a56b3c] mb-6"></i>
            <h3 className="text-[1.9rem] font-serif font-semibold mb-2">Investor consultation</h3>
            <p className="text-[#4e4944]">A calm conversation about your goals, market cycles, and the right entry. No obligation, only clarity.</p>
          </div>
        </div>
      </div>
    </section>

    {/* VISION */}
    <div className="vision-block bg-[#efe7de] px-4 py-16 text-center sm:px-6 sm:py-20" style={{backgroundImage: "url('https://images.unsplash.com/photo-1505843490578-4c22b191bfb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')", backgroundSize: 'cover', backgroundBlendMode: 'overlay', backgroundColor: '#dad1c7'}}>
      <div className="container mx-auto">
        <span className="overline block mb-3">our north star</span>
        <h2 className="section-title mb-6 text-3xl font-serif font-semibold sm:text-4xl lg:text-[3rem]" style={{color: '#2e2b28', fontFamily: 'Literata, serif'}}>Transparency isn’t a tagline.<br/>It’s the only way.</h2>
        <div className="vision-quote mx-auto max-w-200 text-xl font-serif italic leading-snug text-[#2e2b28] sm:text-[1.7rem]">“We don’t chase commissions. We chase fit. If a deal isn’t right for you, we’ll be the first to say no.”</div>
      </div>
    </div>

    {/* WHAT IS BURG? */}
    <section className="section-padding px-4 py-16 sm:px-6 sm:py-20">
      <div className="container mx-auto grid items-center gap-12 md:grid-cols-[1.2fr_0.8fr] identity-grid">
        <div className="identity-image h-70 rounded shadow-lg sm:h-80 lg:h-95" style={{background: "#b8aa9b url('https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80') center/cover"}}></div>
        <div>
          <span className="overline block mb-3">who we are</span>
          <h2 className="section-title mb-6 text-3xl font-serif font-semibold sm:text-4xl lg:text-[3rem]" style={{color: '#2e2b28', fontFamily: 'Literata, serif'}}>BURG Realty, in short</h2>
          <p className="text-[1.1rem] text-[#3e3a36] mb-6">A real estate advisory firm that connects investors with well‑evaluated, structured opportunities. We don’t list everything – we curate what makes sense. Every property we recommend has been walked, vetted, and stress‑tested. Our reputation lives or dies by your peace of mind.</p>
          <p className="mt-6"><i className="fas fa-check-circle text-[#a56b3c] mr-2"></i> SEBI registered · <i className="fas fa-check-circle text-[#a56b3c] mr-2"></i> 17 yrs · <i className="fas fa-check-circle text-[#a56b3c] mr-2"></i> zero mis-selling</p>
        </div>
      </div>
    </section>

    {/* TESTIMONIALS */}
    <section className="bg-[#f6f1eb]">
      <div className="container mx-auto section-padding px-4 py-16 sm:px-6 sm:py-20">
        <span className="overline block mb-3">client whispers</span>
        <h2 className="section-title mb-6 text-3xl font-serif font-semibold sm:text-4xl lg:text-[3rem]" style={{color: '#2e2b28', fontFamily: 'Literata, serif'}}>Not our words, theirs</h2>
        <div className="testimonial-grid mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="testimonial-card bg-white p-8 border border-[#ece2d9]">
            <i className="fas fa-quote-left text-[#d4b595] text-[1.8rem] mb-4"></i>
            <p className="testimonial-text italic mb-6 text-[#2e2b28]">"BURG didn’t just advise on a property – they advised on my portfolio mix. Now I sleep better."</p>
            <span className="testimonial-author font-serif font-semibold">— Rajeev B.</span><br /><span className="text-xs">first-time investor, Pune</span>
          </div>
          <div className="testimonial-card bg-white p-8 border border-[#ece2d9]">
            <i className="fas fa-quote-left text-[#d4b595] text-[1.8rem] mb-4"></i>
            <p className="testimonial-text italic mb-6 text-[#2e2b28]">"They saved me from a ‘hot’ project that would have been a disaster. True fiduciaries."</p>
            <span className="testimonial-author font-serif font-semibold">— Anjali Mehta</span><br /><span className="text-xs">family office, Delhi</span>
          </div>
          <div className="testimonial-card bg-white p-8 border border-[#ece2d9]">
            <i className="fas fa-quote-left text-[#d4b595] text-[1.8rem] mb-4"></i>
            <p className="testimonial-text italic mb-6 text-[#2e2b28]">"The team actually explained the downside. That's rare. That's BURG."</p>
            <span className="testimonial-author font-serif font-semibold">— Vivek Nair</span><br /><span className="text-xs">NRI investor</span>
          </div>
        </div>
      </div>
    </section>

    {/* CONTACT */}
    <section id="contact" className="section-padding px-4 py-16 sm:px-6 sm:py-20">
      <div className="container mx-auto contact-grid grid grid-cols-1 gap-12 bg-[#fcfaf7] p-6 md:grid-cols-2 sm:p-8">
        <div>
          <span className="overline block mb-3">start a conversation</span>
          <h2 className="section-title mb-6 text-3xl font-serif font-semibold sm:text-4xl lg:text-[3rem]" style={{color: '#2e2b28', fontFamily: 'Literata, serif'}}>We're listening.</h2>
          <form className="contact-form">
            <input type="text" placeholder="Your name *" className="mb-4 w-full border border-[#dad1c7] bg-white p-4 font-[Manrope]" />
            <input type="email" placeholder="Email *" className="mb-4 w-full border border-[#dad1c7] bg-white p-4 font-[Manrope]" />
            <input type="tel" placeholder="Phone (if you'd like a call)" className="mb-4 w-full border border-[#dad1c7] bg-white p-4 font-[Manrope]" />
            <textarea rows="4" placeholder="What's on your mind?" className="mb-4 w-full border border-[#dad1c7] bg-white p-4 font-[Manrope]"></textarea>
            <button type="submit" className="btn mt-2 cursor-pointer border-none px-8 py-3" style={{background: 'transparent'}}>Send</button>
          </form>
        </div>
        <div className="contact-details border-l-4 border-[#a56b3c] bg-[#f1ebe5] p-6 sm:p-8">
          <p><i className="fas fa-map-marker-alt mr-2" /> <strong>BURG Realty</strong><br />Studio 4, Kabir House, Bandra West, Mumbai – 400050</p>
          <p><i className="fas fa-phone-alt mr-2" /> +91-22-2640-8800</p>
          <p><i className="fas fa-envelope mr-2" /> hello@burgrealty.in</p>
          <p><i className="fas fa-clock mr-2" /> Mon–Fri, 10am – 6pm (but we reply evenings too)</p>
          <p className="mt-8"><i className="fas fa-seedling mr-2" /> SEBI reg. INA100004567 · since 2009</p>
        </div>
      </div>
    </section>

    {/* FOOTER */}
    <footer className="bg-[#2e2b28] text-[#dad1c7] py-12">
      <div className="footer-grid mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-3">
        <div className="footer-col">
          <h4 className="text-white text-[1.5rem] mb-2">BURG Realty</h4>
          <p>Structured wisdom, human warmth.</p>
          <p>© 2026 BURG Realty</p>
        </div>
        <div className="footer-col">
          <h4 className="text-white text-[1.5rem] mb-2">Visit</h4>
          <p>Studio 4, Kabir House, Bandra West, Mumbai</p>
        </div>
        <div className="footer-col">
          <h4 className="text-white text-[1.5rem] mb-2">Credibility</h4>
          <p>SEBI registered · 17 years · zero commission model</p>
        </div>
      </div>
      <div className="footer-copyright text-center border-t border-[#4f4944] pt-8 mt-8 text-sm">
        <p>This is a real advisory, not a lead generator. We reply personally.</p>
      </div>
    </footer>
  </div>
  );
};

export default BurgRealtyPage;
