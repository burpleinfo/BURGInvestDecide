import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../widgets/Footer/Footer";

import { useState } from "react";

const featuredFirms = [
  {
    name: "Vatika Group",
    city: "Gurugram",
    years: "40+ yrs",
    specialty: "Luxury residential & commercial",
    description: "Iconic developments. Luxury residential & commercial. 25M sq.ft. delivered.",
    badge: "Developer + advisory",
    color: "bg-black",
    initials: "VG",
    path: "/vatika-group",
  },
  {
    name: "BURG Realty",
    city: "Mumbai",
    years: "17 yrs",
    specialty: "Portfolio structuring & acquisition support",
    description: "Portfolio structuring & acquisition support. Family offices specialist.",
    badge: "SEBI registered",
    color: "bg-yellow-600",
    initials: "BR",
    path: "/burg-realty",
  },
  {
    name: "Legacy Wealth",
    city: "Bangalore",
    years: "12 yrs",
    specialty: "NRI investment advisory",
    description: "NRI investment advisory. Tax-efficient real estate solutions.",
    badge: "NRI specialists",
    color: "bg-gray-800",
    initials: "LW",
    path: null,
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const filteredFirms = featuredFirms.filter(firm => {
    const q = search.toLowerCase();
    return (
      firm.name.toLowerCase().includes(q) ||
      firm.city.toLowerCase().includes(q) ||
      firm.specialty.toLowerCase().includes(q) ||
      firm.description.toLowerCase().includes(q)
    );
  });
  return (
    <div className="bg-white">
      {/* NAVBAR is handled globally */}
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-black leading-tight mt-4 mb-6">
            BURG    <br />
            <span className="text-yellow-600">InvestDecide</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Find verified, premium real estate advisory firms. We vet them. You choose with confidence.
          </p>
          {/* SEARCH BAR */}
          <div className="max-w-3xl mx-auto mb-8">
            <form
              className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 transition-all duration-200 focus-within:border-yellow-400 focus-within:shadow-[0_4px_12px_rgba(251,191,36,0.15)] flex items-center p-2 rounded-full shadow-lg"
              onSubmit={e => e.preventDefault()}
            >
              <span className="ml-4 mr-2 text-gray-400">
                <i className="fas fa-search" />
              </span>
              <input
                type="text"
                placeholder="Search by firm name, city, specialty..."
                className="flex-1 py-4 outline-none text-gray-700 bg-transparent"
                id="searchInput"
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoComplete="off"
              />
              <button
                type="submit"
                className="bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-8 py-3 rounded-full hover:shadow-lg transition mx-2"
                tabIndex={-1}
              >
                Search
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-3 flex items-center justify-center gap-4">
              <span>
                <i className="fas fa-check-circle text-yellow-500" /> 50+ verified firms
              </span>
              <span>
                <i className="fas fa-map-marker-alt text-yellow-500" /> 12 cities
              </span>
              <span>
                <i className="fas fa-shield-alt text-yellow-500" /> SEBI registered only
              </span>
            </p>
          </div>
        </div>
        {/* FEATURED FIRMS */}
        <div className="max-w-6xl mx-auto mt-16" id="firms">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured advisory firms</h2>
            <a href="#firms" className="text-yellow-600 font-medium flex items-center gap-1">
              View all <i className="fas fa-arrow-right text-sm" />
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {filteredFirms.length === 0 ? (
              <div className="col-span-3 text-center text-gray-400 py-12 text-lg">No firms found.</div>
            ) : (
              filteredFirms.map((firm, idx) => (
                <div
                  key={firm.name}
                  className={`transition duration-200 transform hover:-translate-y-1 hover:shadow-xl border border-[#f0f0f0] ${firm.path ? 'cursor-pointer' : ''} bg-white p-6 rounded-2xl shadow-sm`}
                  onClick={() => firm.path && navigate(firm.path)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 ${firm.color} rounded-xl flex items-center justify-center text-white font-bold text-xl`}>{firm.initials}</div>
                    <span className="bg-[#e6f7e6] text-[#0a5c0a] text-[0.7rem] py-[0.2rem] px-[0.8rem] rounded-2xl inline-flex items-center gap-1"><i className="fas fa-check-circle text-xs" /> Verified</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{firm.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    <i className="fas fa-map-marker-alt text-yellow-600 mr-1" /> {firm.city} · {firm.years}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">{firm.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">{firm.badge}</span>
                    <span className="text-black font-medium text-sm border-b border-black">View profile →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      {/* PROBLEM SECTION */}
      <section className="bg-black text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-yellow-400 font-bold text-sm uppercase tracking-widest">the trust deficit</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              One wrong advisor <span className="text-yellow-400">can cost you years</span>
            </h2>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto mt-4">
              Most investors lose money because they don't know who to trust.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:border-yellow-400 transition">
              <i className="fas fa-user-tie text-yellow-400 text-3xl mb-4" />
              <h3 className="text-2xl font-bold">Unverified advisors</h3>
              <p className="text-gray-300 mt-2">
                Anyone can claim to be an expert. We verify credentials, track record, and SEBI registration.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:border-yellow-400 transition">
              <i className="fas fa-chart-line text-yellow-400 text-3xl mb-4" />
              <h3 className="text-2xl font-bold">Hidden commissions</h3>
              <p className="text-gray-300 mt-2">
                Many advisors push products with high commissions. We ensure fee transparency.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:border-yellow-400 transition">
              <i className="fas fa-file-invoice text-yellow-400 text-3xl mb-4" />
              <h3 className="text-2xl font-bold">No track record</h3>
              <p className="text-gray-300 mt-2">
                Past performance matters. Every firm on our platform shows verified client history.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:border-yellow-400 transition">
              <i className="fas fa-building text-yellow-400 text-3xl mb-4" />
              <h3 className="text-2xl font-bold">Wrong property fit</h3>
              <p className="text-gray-300 mt-2">
                Advisors who don't understand your needs recommend what's easy, not what's right.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* SOLUTION SECTION */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-yellow-600 font-bold text-sm uppercase tracking-widest">the BURG solution</span>
            <h2 className="text-4xl md:text-5xl font-black mt-2">
              Introducing <span className="border-b-4 border-yellow-400">BURG InvestDecide</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
              A platform that connects you with thoroughly vetted real estate advisory firms.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border border-gray-200 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition bg-white">
              <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-shield-alt text-black text-2xl" />
              </div>
              <h3 className="text-2xl font-bold">Verified only</h3>
              <p className="text-gray-600 mt-2">
                Every firm is background-checked: SEBI registration, 5+ years track record, client references.
              </p>
            </div>
            <div className="border border-gray-200 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition bg-white">
              <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-magnifying-glass-chart text-black text-2xl" />
              </div>
              <h3 className="text-2xl font-bold">Detailed profiles</h3>
              <p className="text-gray-600 mt-2">
                Specialization, past projects, team credentials, fee structure – all transparent.
              </p>
            </div>
            <div className="border border-gray-200 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition bg-white">
              <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-star text-black text-2xl" />
              </div>
              <h3 className="text-2xl font-bold">Client reviews</h3>
              <p className="text-gray-600 mt-2">
                Verified testimonials from real clients. No paid reviews, no fake ratings.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* LIST YOUR FIRM BUTTON */}
      <div className="w-full flex justify-center py-10 bg-white border-t border-gray-100">
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-8 py-4 rounded-full text-lg shadow-lg transition"
          onClick={() => navigate('/contact')}
        >
          List Your Firm
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
