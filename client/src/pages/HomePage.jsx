import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../widgets/Footer/Footer";
// Import background image
import bgImage from "../assets/Background.png";
import { ShieldCheck, FileSearch, Star } from "lucide-react";

import { useState, useContext, useEffect, useRef } from "react";
import { SearchContext } from "../contexts/SearchContext";

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
    badge: "",
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
  const { updateHomeSearchVisibility, searchQuery, updateSearchQuery } = useContext(SearchContext);
  const searchBarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (searchBarRef.current) {
        const rect = searchBarRef.current.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        updateHomeSearchVisibility(isVisible);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [updateHomeSearchVisibility]);

  // Sync context searchQuery back to local state when navbar search is used
  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (value) => {
    updateSearchQuery(value);
  };

  const filteredFirms = featuredFirms.filter(firm => {
    const q = searchQuery.toLowerCase();
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
      <section className="relative overflow-hidden bg-linear-to-b from-white to-gray-50 px-3 py-8 sm:px-4 md:py-20 lg:px-6">
        {/* Background image absolutely positioned behind hero and featured firms */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 w-full h-full z-0"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            opacity: 1,
          }}
        />
        <div className="relative z-10">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="mb-5 text-4xl font-black leading-tight sm:text-5xl md:text-7xl">
              <span className="text-black">BURG</span><br />
              <span className="bg-linear-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-lg">InvestDecide</span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-lg font-bold text-yellow-400 drop-shadow-md sm:text-xl md:text-3xl">
              Find verified, premium real estate advisory firms. <span className="text-white"><br/>We vet them. You choose with confidence.</span>
            </p>
            {/* SEARCH BAR */}
            <div className="mx-auto mb-6 max-w-3xl" ref={searchBarRef}>
              <form
                className="flex flex-col gap-3 rounded-3xl border border-gray-200 bg-linear-to-br from-white to-gray-50 p-3 shadow-lg transition-all duration-200 focus-within:border-yellow-400 focus-within:shadow-[0_4px_12px_rgba(251,191,36,0.15)] sm:flex-row sm:items-center sm:rounded-full sm:p-2"
                onSubmit={e => e.preventDefault()}
              >
                <span className="ml-4 mr-2 text-gray-400 sm:ml-4">
                  <i className="fas fa-search" />
                </span>
                <input
                  type="text"
                  placeholder="Search by firm name, city, specialty..."
                  className="flex-1 bg-transparent py-2.5 text-gray-700 outline-none sm:py-3"
                  id="searchInput"
                  value={search}
                  onChange={e => handleSearchChange(e.target.value)}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="rounded-full bg-linear-to-br from-yellow-400 to-yellow-500 px-6 py-3 font-semibold text-black transition hover:from-yellow-500 hover:to-yellow-600 hover:shadow-lg sm:mx-2 sm:py-2"
                  tabIndex={-1}
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
        {/* FEATURED FIRMS */}
        <div className="mx-auto mt-12 max-w-6xl px-1 sm:mt-16 sm:px-0" id="firms">
          <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Featured advisory firms</h2>
            <a href="#firms" className="text-yellow-600 font-medium flex items-center gap-1">
              View all <i className="fas fa-arrow-right text-sm" />
            </a>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {filteredFirms.length === 0 ? (
              <div className="col-span-3 text-center text-gray-400 py-12 text-lg">No firms found.</div>
            ) : (
              filteredFirms.map((firm) => (
                <div
                  key={firm.name}
                  className={`transition duration-200 transform hover:-translate-y-1 hover:shadow-2xl border border-white/60 ${firm.path ? 'cursor-pointer' : ''} bg-white/35 backdrop-blur-xl p-6 rounded-2xl shadow-[0_12px_34px_rgba(0,0,0,0.14)]`}
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
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:border-yellow-400 transition">
              <i className="fas fa-user-tie text-yellow-400 text-3xl mb-4" />
              <h3 className="text-2xl font-bold">Unverified advisors</h3>
              <p className="text-gray-300 mt-2">
                Anyone can claim to be an expert. We verify credentials and track record.
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
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="border border-gray-200 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition bg-white">
              <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="text-black w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold">Verified only</h3>
              <p className="text-gray-600 mt-2">
                Every firm is background-checked:  5+ years track record, client references.
              </p>
            </div>
            <div className="border border-gray-200 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition bg-white">
              <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6">
                <FileSearch className="text-black w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold">Detailed profiles</h3>
              <p className="text-gray-600 mt-2">
                Specialization, past projects, team credentials, fee structure – all transparent.
              </p>
            </div>
            <div className="border border-gray-200 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition bg-white">
              <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6">
                <Star className="text-black w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold">Client reviews</h3>
              <p className="text-gray-600 mt-2">
                Verified testimonials from real clients. No paid reviews, no fake ratings.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* HOW IT WORKS SECTION */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-yellow-600 font-bold text-sm uppercase tracking-widest">simple & transparent</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              How BURG InvestDecide works
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-6 font-bold text-2xl text-black">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-3">Search & filter</h3>
                <p className="text-gray-600">
                  Find firms by city, specialty, or minimum track record.
                </p>
              </div>
              {/* Connecting line for desktop */}
             
            </div>
            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-6 font-bold text-2xl text-black">
                  2
                </div>
                <h3 className="text-2xl font-bold mb-3">Review profiles</h3>
                <p className="text-gray-600">
                  Deep-dive into credentials, past work, and client feedback.
                </p>
              </div>
              {/* Connecting line for desktop */}
             
            </div>
            {/* Step 3 */}
            <div>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-6 font-bold text-2xl text-black">
                  3
                </div>
                <h3 className="text-2xl font-bold mb-3">Connect directly</h3>
                <p className="text-gray-600">
                  Reach out to the firm through their profile. No middleman.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* LIST YOUR FIRM BUTTON */}
      <div className="flex w-full flex-col items-center justify-center border-t border-gray-100 bg-yellow-500/10 px-4 py-10 text-center">
        <h2 className="mb-7 text-3xl font-bold text-zinc-900 sm:text-4xl md:text-5xl">Are you a real estate advisory firm?</h2>
        <button
          className="rounded-full bg-zinc-950 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-zinc-600"
          onClick={() => navigate('/list-your-firm')}
        >
          List Your Firm Today
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
