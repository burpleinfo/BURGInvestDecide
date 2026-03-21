import React, { useState } from "react";

const VatikaGroupPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
  <div className="bg-white font-[Inter] text-[#2c2c2c]">
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-[#eaeef2] bg-white/95 px-4 py-4 backdrop-blur-lg sm:px-6 lg:px-10">
      <div className="font-serif text-xl font-bold text-[#1e2b32] sm:text-2xl lg:text-[2.2rem]">Vatika Group</div>
      <div className="hidden items-center gap-8 md:flex lg:gap-10">
        <a href="#home" className="text-base font-medium text-[#2c2c2c] transition hover:border-b hover:border-[#b28b5c]">Home</a>
        <a href="#purpose" className="text-base font-medium text-[#2c2c2c] transition hover:border-b hover:border-[#b28b5c]">Purpose</a>
        <a href="#presence" className="text-base font-medium text-[#2c2c2c] transition hover:border-b hover:border-[#b28b5c]">Presence</a>
        <a href="#contact" className="rounded-full border border-[#2c2c2c] bg-transparent px-6 py-2 transition hover:bg-[#2c2c2c] hover:text-white">Connect</a>
      </div>
      <button
        type="button"
        className="rounded-full border border-[#2c2c2c] px-3 py-2 text-sm font-medium md:hidden"
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
          <div className="flex items-center justify-between border-b border-[#eaeef2] px-5 py-4">
            <span className="font-serif text-lg font-bold text-[#1e2b32]">Vatika Group</span>
            <button type="button" className="rounded-full px-2 py-1 text-xl" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation menu">×</button>
          </div>
          <div className="space-y-2 px-4 py-5">
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block rounded-2xl px-4 py-3 text-base font-medium hover:bg-gray-100">Home</a>
            <a href="#purpose" onClick={() => setMobileMenuOpen(false)} className="block rounded-2xl px-4 py-3 text-base font-medium hover:bg-gray-100">Purpose</a>
            <a href="#presence" onClick={() => setMobileMenuOpen(false)} className="block rounded-2xl px-4 py-3 text-base font-medium hover:bg-gray-100">Presence</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block rounded-2xl px-4 py-3 text-base font-medium hover:bg-gray-100">Connect</a>
          </div>
        </aside>
      </div>
    )}

    <section
      className="hero mt-18.5 px-4 sm:px-6"
      id="home"
      style={{
        background:
          "linear-gradient(100deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 60%), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80') center/cover no-repeat",
        padding: "5rem 0 7rem",
        color: "white"
      }}
    >
      <div className="container mx-auto max-w-175 rounded-lg bg-black/20 p-6 backdrop-blur-sm sm:p-8">
        <span className="overline text-[#ffd9b5] font-serif mb-2 block">Our Promise</span>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-[4.8rem]" style={{textShadow: "0 4px 20px rgba(0,0,0,0.4)"}}>Creating the world's<br/>finest developments</h1>
        <p className="mb-6 text-base text-white/90 sm:text-lg lg:text-[1.4rem]">Vatika Group is one of India's most trusted real estate developers, delivering thoughtfully designed, premium properties that shape urban lifestyle across the nation.</p>
        <a href="#contact" className="inline-block rounded-full border border-white px-8 py-3 text-white transition hover:bg-white hover:text-black sm:px-10" style={{padding: "0.8rem 2.8rem", display: "inline-block"}}>Enquire Now</a>
      </div>
    </section>

    <section
      className="purpose-strip text-center text-white"
      id="purpose"
      style={{
        background:
          "linear-gradient(rgba(30,43,50,0.85), rgba(30,43,50,0.9)), url('https://images.unsplash.com/photo-1615873968403-89e068629265?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80') center/cover fixed",
        padding: "5rem 0"
      }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <span className="overline text-[#e6c9a8] font-serif mb-2 block">Our Purpose</span>
        <h2 className="section-title mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-[3.5rem]">Do good. Do well.</h2>
        <p className="section-desc mx-auto max-w-187.5 text-lg text-[#e0d6cc]">Vatika is committed to elevating the living experience while emphasising the importance of creating a positive impact on the environment and society. Every project reflects this dual commitment.</p>
      </div>
    </section>

    <section id="presence" className="px-4 pt-16 sm:px-6" style={{paddingTop: "5rem"}}>
      <div className="container mx-auto">
        <span className="overline">Our Presence</span>
        <h2 className="section-title mb-8 text-3xl font-bold sm:text-4xl lg:text-[3.5rem]">Iconic Developments</h2>
        <div className="presence-grid mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <div className="presence-card flex min-h-65 flex-col justify-end rounded shadow-lg text-white sm:min-h-75" style={{background: "linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1580216643062-cf460548a66a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover", color: "white"}}><i className="fas fa-building mb-4 text-[2rem] text-[#f5d742] sm:text-[2.5rem]" style={{textShadow: "0 2px 6px black"}}></i><h3 className="mb-1 font-serif text-2xl sm:text-[2.2rem]" style={{textShadow: "0 2px 5px rgba(0,0,0,0.5)"}}>Vatika City</h3><p className="text-white/90">Gurugram – 150‑acre integrated township.</p></div>
          <div className="presence-card flex min-h-65 flex-col justify-end rounded shadow-lg text-white sm:min-h-75" style={{background: "linear-gradient(0deg, rgba(0,0,0,0.3), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover", color: "white"}}><i className="fas fa-tree mb-4 text-[2rem] text-[#f5d742] sm:text-[2.5rem]" style={{textShadow: "0 2px 6px black"}}></i><h3 className="mb-1 font-serif text-2xl sm:text-[2.2rem]" style={{textShadow: "0 2px 5px rgba(0,0,0,0.5)"}}>Vatika Highlands</h3><p className="text-white/90">Luxury villas, Aravalis, Noida.</p></div>
          <div className="presence-card flex min-h-65 flex-col justify-end rounded shadow-lg text-white sm:min-h-75" style={{background: "linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover", color: "white"}}><i className="fas fa-city mb-4 text-[2rem] text-[#f5d742] sm:text-[2.5rem]" style={{textShadow: "0 2px 6px black"}}></i><h3 className="mb-1 font-serif text-2xl sm:text-[2.2rem]" style={{textShadow: "0 2px 5px rgba(0,0,0,0.5)"}}>One Vatika</h3><p className="text-white/90">Platinum‑rated BKC tower, Mumbai.</p></div>
          <div className="presence-card flex min-h-65 flex-col justify-end rounded shadow-lg text-white sm:min-h-75" style={{background: "linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover", color: "white"}}><i className="fas fa-hotel mb-4 text-[2rem] text-[#f5d742] sm:text-[2.5rem]" style={{textShadow: "0 2px 6px black"}}></i><h3 className="mb-1 font-serif text-2xl sm:text-[2.2rem]" style={{textShadow: "0 2px 5px rgba(0,0,0,0.5)"}}>The Vatika Hotel</h3><p className="text-white/90">Five‑star Aerocity, Delhi.</p></div>
          <div className="presence-card flex min-h-65 flex-col justify-end rounded shadow-lg text-white sm:min-h-75" style={{background: "linear-gradient(0deg, rgba(0,0,0,0.3), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover", color: "white"}}><i className="fas fa-warehouse mb-4 text-[2rem] text-[#f5d742] sm:text-[2.5rem]" style={{textShadow: "0 2px 6px black"}}></i><h3 className="mb-1 font-serif text-2xl sm:text-[2.2rem]" style={{textShadow: "0 2px 5px rgba(0,0,0,0.5)"}}>Vatika Industrial Park</h3><p className="text-white/90">Chennai logistics hub.</p></div>
          <div className="presence-card flex min-h-65 flex-col justify-end rounded shadow-lg text-white sm:min-h-75" style={{background: "linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1613490900145-0979d4ea5a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover", color: "white"}}><i className="fas fa-leaf mb-4 text-[2rem] text-[#f5d742] sm:text-[2.5rem]" style={{textShadow: "0 2px 6px black"}}></i><h3 className="mb-1 font-serif text-2xl sm:text-[2.2rem]" style={{textShadow: "0 2px 5px rgba(0,0,0,0.5)"}}>Vatika Greens</h3><p className="text-white/90">Eco‑friendly enclave, Bangalore.</p></div>
        </div>
      </div>
    </section>

    <section className="experiences bg-[#f6f3f0] px-4 py-16 sm:px-6 sm:py-20" style={{padding: "6rem 0"}}>
      <div className="container mx-auto">
        <span className="overline">Our Experiences</span>
        <h2 className="section-title mb-4 text-3xl font-bold sm:text-4xl lg:text-[3.2rem]">Elevating everyday living</h2>
        <p className="section-desc">We craft a tapestry of experiences designed to enrich your life and elevate your every day, where every moment is a testament to the art of living.</p>
        <div className="exp-grid mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="exp-item bg-white p-6 rounded shadow-md">
            <div className="exp-img mb-4 h-50 w-full rounded" style={{backgroundImage: "url('https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')", backgroundSize: "cover", backgroundPosition: "center"}}></div>
            <i className="fas fa-spa text-[#b28b5c] text-2xl mb-2"></i>
            <h4 className="font-serif text-[1.8rem] font-semibold mb-2">Wellness</h4>
            <p>Curated wellness amenities, spas, and meditation landscapes.</p>
          </div>
          <div className="exp-item bg-white p-6 rounded shadow-md">
            <div className="exp-img mb-4 h-50 w-full rounded" style={{backgroundImage: "url('https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')", backgroundSize: "cover", backgroundPosition: "center"}}></div>
            <i className="fas fa-utensils text-[#b28b5c] text-2xl mb-2"></i>
            <h4 className="font-serif text-[1.8rem] font-semibold mb-2">Culinary</h4>
            <p>Signature restaurants & member‑only dining pavilions.</p>
          </div>
          <div className="exp-item bg-white p-6 rounded shadow-md">
            <div className="exp-img mb-4 h-50 w-full rounded" style={{backgroundImage: "url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')", backgroundSize: "cover", backgroundPosition: "center"}}></div>
            <i className="fas fa-leaf text-[#b28b5c] text-2xl mb-2"></i>
            <h4 className="font-serif text-[1.8rem] font-semibold mb-2">Sustainability</h4>
            <p>Net‑zero communities and water‑positive campuses.</p>
          </div>
        </div>
      </div>
    </section>

    <div className="bg-white px-4 py-12 text-center sm:px-6">
      <span className="overline">since 1983</span>
      <p className="inline-block rounded-full bg-[#f9f3ec] px-6 py-3 text-xl font-serif sm:px-10 sm:text-[2rem]">A legacy of trust, quality & innovation across 40+ projects</p>
    </div>

    <section id="contact" className="px-4 py-16 sm:px-6" style={{padding: "5rem 0"}}>
      <div className="container mx-auto">
        <h2 className="section-title mb-8 text-3xl font-bold sm:text-4xl lg:text-[3rem]">Connect with us</h2>
        <div className="contact-grid grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="contact-form">
            <form action="#" method="post">
              <input type="text" placeholder="Full name" required className="mb-4 w-full border border-[#ddd] p-4 font-[Inter]" />
              <input type="email" placeholder="Email address" required className="mb-4 w-full border border-[#ddd] p-4 font-[Inter]" />
              <input type="tel" placeholder="Phone number" className="mb-4 w-full border border-[#ddd] p-4 font-[Inter]" />
              <textarea rows="4" placeholder="I'm interested in..." className="mb-4 w-full border border-[#ddd] p-4 font-[Inter]"></textarea>
              <button type="submit" className="btn-outline-light cursor-pointer rounded border-none bg-[#1e2b32] px-8 py-3 text-white sm:px-12" style={{background: "#1e2b32", color: "white", border: "none", padding: "1rem 3rem"}}>Submit</button>
            </form>
          </div>
          <div className="contact-details rounded-xl bg-[#f4f0eb] p-6 shadow-md" style={{backgroundImage: "url('https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')", backgroundSize: "cover", backgroundBlendMode: "overlay", backgroundColor: "#ece3d8", color: "#1e2b32"}}>
            <p><i className="fas fa-map-marker-alt mr-2" /> <strong>Vatika Group</strong><br />Vatika Towers, Sector 54, Gurugram – 122011</p>
            <p><i className="fas fa-phone-alt mr-2" /> +91-124-456-7890</p>
            <p><i className="fas fa-envelope mr-2" /> contact@vatikagroup.com</p>
            <p className="mt-8"><i className="fas fa-clock mr-2" /> Mon – Fri, 9:30 – 18:30</p>
            <p><i className="fas fa-award mr-2" /> CREDAI member · ISO 9001</p>
          </div>
        </div>
      </div>
    </section>

    <footer className="bg-[#1e2b32] text-[#b7b7b7] py-12">
      <div className="footer-grid mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-3">
        <div className="footer-col">
          <h4 className="text-white font-serif text-[1.7rem] mb-2">Vatika Group</h4>
          <p>Do good. Do well.</p>
          <p>© 2026 Vatika Group.<br />All rights reserved.</p>
        </div>
        <div className="footer-col">
          <h4 className="text-white font-serif text-[1.7rem] mb-2">Head office</h4>
          <p>Vatika Towers, Golf Course Rd, Sector 54, Gurugram</p>
          <p>+91-124-456-7890</p>
        </div>
        <div className="footer-col">
          <h4 className="text-white font-serif text-[1.7rem] mb-2">Credibility</h4>
          <p>Four decades of trust · 25 million sq.ft. delivered · 15+ awards</p>
        </div>
      </div>
      <div className="footer-copyright text-center border-t border-[#33434b] pt-8 mt-8 text-sm">
        <p>DISCLAIMER: Conceptual representation. Information for informational purposes only.</p>
      </div>
    </footer>
  </div>
  );
};

export default VatikaGroupPage;
