
import Footer from "../widgets/Footer/Footer";


const AboutUs = () => (
  <div className="bg-[#f5f7fb] min-h-screen flex flex-col">
    {/* Hero Section */}
    <section className="px-4 py-16 text-white sm:px-6 sm:py-20 md:py-24" style={{background: "linear-gradient(135deg, #0B1E33 0%, #1a2f44 100%)"}}>
      <div className="mx-auto max-w-7xl text-center">
        <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">About BURG</h1>
        <p className="mb-0 text-2xl font-bold text-yellow-300 sm:text-3xl md:text-4xl lg:text-5xl">Empowering businesses.</p>
      </div>
    </section>

    {/* Main About Content */}
    <section className="flex-1 bg-white px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">The Trust Layer for Real Estate Advisory</h2>
          <p className="text-gray-600 leading-relaxed">In India's real estate market, investors face a persistent challenge: how to find a reliable advisor. The internet is flooded with self-proclaimed experts, and even genuine firms struggle to stand out. Clients fear fraud, misrepresentation, and wasted time. Meanwhile, good advisory firms lose opportunities because they can't present their credibility in a way that instantly builds trust.</p>
          <p className="text-gray-600 leading-relaxed mt-4">BURG InvestDecide was built to solve that gap.</p>
        </div>
        <div className="mb-12">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">What We Do</h2>
          <p className="text-gray-600 leading-relaxed">We are a platform that connects serious investors with verified real estate advisory firms. We provide a complete ecosystem:</p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-yellow-600 text-sm">✔️</span>
              </div>
              <div><span className="font-semibold">Verified firm profiles</span><p className="text-gray-600 text-sm">Every firm undergoes background checks (SEBI registration, track record, client references).</p></div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-yellow-600 text-sm">🖥️</span>
              </div>
              <div><span className="font-semibold">Dedicated landing pages</span><p className="text-gray-600 text-sm">Each firm gets a professional, mobile-friendly page showcasing expertise and value.</p></div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-yellow-600 text-sm">📈</span>
              </div>
              <div><span className="font-semibold">Client management system</span><p className="text-gray-600 text-sm">Investor details are instantly verified, organised, and delivered to the firm’s private dashboard.</p></div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-yellow-600 text-sm">📅</span>
              </div>
              <div><span className="font-semibold">Meeting & communication tools</span><p className="text-gray-600 text-sm">Accept, reschedule, and manage conversations from one place, with WhatsApp & email integration.</p></div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-yellow-600 text-sm">🧠</span>
              </div>
              <div><span className="font-semibold">AI-powered insights</span><p className="text-gray-600 text-sm">Helps firms understand client preferences and prioritise opportunities.</p></div>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed mt-6">For investors, BURG InvestDecide is the safe, transparent way to find an advisor. For firms, it’s a growth engine that turns every website visitor into a well-managed relationship.</p>
        </div>
        <div className="mb-12">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">To become the default trust infrastructure for real estate advisory in India. We envision a market where every credible firm has a verified digital presence, every investor can find a trustworthy advisor in minutes, and the entire industry operates with transparency.</p>
        </div>
        <div className="mb-12">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">The Road Ahead</h2>
          <p className="text-gray-600 leading-relaxed">We started by solving a simple problem: helping firms present themselves credibly and helping investors find them. Today, we’re expanding our platform to include deeper client management capabilities, document handling, and even smarter AI tools. But our core remains unchanged: making trust visible and efficient.</p>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default AboutUs;
