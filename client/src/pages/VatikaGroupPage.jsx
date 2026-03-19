import React from "react";

const VatikaGroupPage = () => (
  <div className="bg-white font-[Inter] text-[#2c2c2c]">
    <nav className="fixed top-0 w-full bg-white bg-opacity-95 backdrop-blur-lg border-b border-[#eaeef2] py-5 px-10 flex justify-between items-center z-50">
      <div className="font-serif text-[2.2rem] font-bold text-[#1e2b32]">Vatika Group</div>
      <div className="flex items-center gap-10">
        <a href="#home" className="text-base font-medium text-[#2c2c2c] hover:border-b hover:border-[#b28b5c] transition">Home</a>
        <a href="#purpose" className="text-base font-medium text-[#2c2c2c] hover:border-b hover:border-[#b28b5c] transition">Purpose</a>
        <a href="#presence" className="text-base font-medium text-[#2c2c2c] hover:border-b hover:border-[#b28b5c] transition">Presence</a>
        <a href="#contact" className="border border-[#2c2c2c] px-6 py-2 rounded-full bg-transparent transition hover:bg-[#2c2c2c] hover:text-white">Connect</a>
      </div>
    </nav>

    <section
      className="hero mt-[82px]"
      id="home"
      style={{
        background:
          "linear-gradient(100deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 60%), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80') center/cover no-repeat",
        padding: "5rem 0 7rem",
        color: "white"
      }}
    >
      <div className="container mx-auto max-w-[700px] bg-black/20 backdrop-blur-sm p-8 rounded-lg">
        <span className="overline text-[#ffd9b5] font-serif mb-2 block">Our Promise</span>
        <h1 className="font-serif font-bold text-white mb-4 leading-tight text-[4.8rem]" style={{textShadow: "0 4px 20px rgba(0,0,0,0.4)"}}>Creating the world's<br/>finest developments</h1>
        <p className="hero-sub text-[1.4rem] text-white/90 mb-6">Vatika Group is one of India's most trusted real estate developers, delivering thoughtfully designed, premium properties that shape urban lifestyle across the nation.</p>
        <a href="#contact" className="btn-outline-light border border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition inline-block" style={{padding: "0.8rem 2.8rem", display: "inline-block"}}>Enquire Now</a>
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
      <div className="container mx-auto">
        <span className="overline text-[#e6c9a8] font-serif mb-2 block">Our Purpose</span>
        <h2 className="section-title font-serif font-bold text-white mb-4 text-[3.5rem]">Do good. Do well.</h2>
        <p className="section-desc mx-auto text-lg text-[#e0d6cc] max-w-[750px]">Vatika is committed to elevating the living experience while emphasising the importance of creating a positive impact on the environment and society. Every project reflects this dual commitment.</p>
      </div>
    </section>

    <section id="presence" style={{paddingTop: "5rem"}}>
      <div className="container mx-auto">
        <span className="overline">Our Presence</span>
        <h2 className="section-title font-serif font-bold mb-8 text-[3.5rem]">Iconic Developments</h2>
        <div className="presence-grid grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="presence-card rounded shadow-lg flex flex-col justify-end min-h-[300px] text-white" style={{background: "linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1580216643062-cf460548a66a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover", color: "white"}}><i className="fas fa-building text-[2.5rem] text-[#f5d742] mb-4" style={{textShadow: "0 2px 6px black"}}></i><h3 className="font-serif text-[2.2rem] mb-1" style={{textShadow: "0 2px 5px rgba(0,0,0,0.5)"}}>Vatika City</h3><p className="text-white/90">Gurugram – 150‑acre integrated township.</p></div>
          <div className="presence-card rounded shadow-lg flex flex-col justify-end min-h-[300px] text-white" style={{background: "linear-gradient(0deg, rgba(0,0,0,0.3), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover", color: "white"}}><i className="fas fa-tree text-[2.5rem] text-[#f5d742] mb-4" style={{textShadow: "0 2px 6px black"}}></i><h3 className="font-serif text-[2.2rem] mb-1" style={{textShadow: "0 2px 5px rgba(0,0,0,0.5)"}}>Vatika Highlands</h3><p className="text-white/90">Luxury villas, Aravalis, Noida.</p></div>
          <div className="presence-card rounded shadow-lg flex flex-col justify-end min-h-[300px] text-white" style={{background: "linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover", color: "white"}}><i className="fas fa-city text-[2.5rem] text-[#f5d742] mb-4" style={{textShadow: "0 2px 6px black"}}></i><h3 className="font-serif text-[2.2rem] mb-1" style={{textShadow: "0 2px 5px rgba(0,0,0,0.5)"}}>One Vatika</h3><p className="text-white/90">Platinum‑rated BKC tower, Mumbai.</p></div>
          <div className="presence-card rounded shadow-lg flex flex-col justify-end min-h-[300px] text-white" style={{background: "linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover", color: "white"}}><i className="fas fa-hotel text-[2.5rem] text-[#f5d742] mb-4" style={{textShadow: "0 2px 6px black"}}></i><h3 className="font-serif text-[2.2rem] mb-1" style={{textShadow: "0 2px 5px rgba(0,0,0,0.5)"}}>The Vatika Hotel</h3><p className="text-white/90">Five‑star Aerocity, Delhi.</p></div>
          <div className="presence-card rounded shadow-lg flex flex-col justify-end min-h-[300px] text-white" style={{background: "linear-gradient(0deg, rgba(0,0,0,0.3), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover", color: "white"}}><i className="fas fa-warehouse text-[2.5rem] text-[#f5d742] mb-4" style={{textShadow: "0 2px 6px black"}}></i><h3 className="font-serif text-[2.2rem] mb-1" style={{textShadow: "0 2px 5px rgba(0,0,0,0.5)"}}>Vatika Industrial Park</h3><p className="text-white/90">Chennai logistics hub.</p></div>
          <div className="presence-card rounded shadow-lg flex flex-col justify-end min-h-[300px] text-white" style={{background: "linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1613490900145-0979d4ea5a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover", color: "white"}}><i className="fas fa-leaf text-[2.5rem] text-[#f5d742] mb-4" style={{textShadow: "0 2px 6px black"}}></i><h3 className="font-serif text-[2.2rem] mb-1" style={{textShadow: "0 2px 5px rgba(0,0,0,0.5)"}}>Vatika Greens</h3><p className="text-white/90">Eco‑friendly enclave, Bangalore.</p></div>
        </div>
      </div>
    </section>

    <section className="experiences bg-[#f6f3f0]" style={{padding: "6rem 0"}}>
      <div className="container mx-auto">
        <span className="overline">Our Experiences</span>
        <h2 className="section-title font-serif font-bold mb-4 text-[3.2rem]">Elevating everyday living</h2>
        <p className="section-desc">We craft a tapestry of experiences designed to enrich your life and elevate your every day, where every moment is a testament to the art of living.</p>
        <div className="exp-grid grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="exp-item bg-white p-6 rounded shadow-md">
            <div className="exp-img w-full h-[200px] rounded mb-4" style={{backgroundImage: "url('https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')", backgroundSize: "cover", backgroundPosition: "center"}}></div>
            <i className="fas fa-spa text-[#b28b5c] text-2xl mb-2"></i>
            <h4 className="font-serif text-[1.8rem] font-semibold mb-2">Wellness</h4>
            <p>Curated wellness amenities, spas, and meditation landscapes.</p>
          </div>
          <div className="exp-item bg-white p-6 rounded shadow-md">
            <div className="exp-img w-full h-[200px] rounded mb-4" style={{backgroundImage: "url('https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')", backgroundSize: "cover", backgroundPosition: "center"}}></div>
            <i className="fas fa-utensils text-[#b28b5c] text-2xl mb-2"></i>
            <h4 className="font-serif text-[1.8rem] font-semibold mb-2">Culinary</h4>
            <p>Signature restaurants & member‑only dining pavilions.</p>
          </div>
          <div className="exp-item bg-white p-6 rounded shadow-md">
            <div className="exp-img w-full h-[200px] rounded mb-4" style={{backgroundImage: "url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')", backgroundSize: "cover", backgroundPosition: "center"}}></div>
            <i className="fas fa-leaf text-[#b28b5c] text-2xl mb-2"></i>
            <h4 className="font-serif text-[1.8rem] font-semibold mb-2">Sustainability</h4>
            <p>Net‑zero communities and water‑positive campuses.</p>
          </div>
        </div>
      </div>
    </section>

    <div className="bg-white text-center py-12">
      <span className="overline">since 1983</span>
      <p className="text-[2rem] font-serif bg-[#f9f3ec] inline-block px-12 py-2 rounded-full">A legacy of trust, quality & innovation across 40+ projects</p>
    </div>

    <section id="contact" style={{padding: "5rem 0"}}>
      <div className="container mx-auto">
        <h2 className="section-title font-serif font-bold mb-8 text-[3rem]">Connect with us</h2>
        <div className="contact-grid grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="contact-form">
            <form action="#" method="post">
              <input type="text" placeholder="Full name" required className="w-full p-4 border border-[#ddd] mb-4 font-[Inter]" />
              <input type="email" placeholder="Email address" required className="w-full p-4 border border-[#ddd] mb-4 font-[Inter]" />
              <input type="tel" placeholder="Phone number" className="w-full p-4 border border-[#ddd] mb-4 font-[Inter]" />
              <textarea rows="4" placeholder="I'm interested in..." className="w-full p-4 border border-[#ddd] mb-4 font-[Inter]"></textarea>
              <button type="submit" className="btn-outline-light bg-[#1e2b32] text-white border-none px-8 py-3 rounded cursor-pointer" style={{background: "#1e2b32", color: "white", border: "none", padding: "1rem 3rem"}}>Submit</button>
            </form>
          </div>
          <div className="contact-details bg-[#f4f0eb] p-6 rounded-xl shadow-md" style={{backgroundImage: "url('https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')", backgroundSize: "cover", backgroundBlendMode: "overlay", backgroundColor: "#ece3d8", color: "#1e2b32"}}>
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
      <div className="footer-grid grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1280px] mx-auto">
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

export default VatikaGroupPage;
