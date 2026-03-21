import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { SearchContext } from "../../contexts/SearchContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isHomeSearchVisible, searchQuery, updateSearchQuery } = useContext(SearchContext);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-yellow-400 bg-white/95 shadow-[0_4px_24px_0_rgba(0,0,0,0.18)] backdrop-blur-sm">
      <div className="flex w-full items-center gap-3 px-3 py-2 sm:px-4 lg:px-2 xl:px-2">
        <div
          className="flex min-w-max shrink-0 cursor-pointer select-none items-center text-xl  font-bold transition-opacity hover:opacity-80 sm:text-2xl"
          onClick={() => navigate("/")}
        >
          <span className="text-black">BURG</span>
          <span className="ml-1 bg-linear-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-lg">
            InvestDecide
          </span>
        </div>

        <div className={`hidden flex-1 transition-opacity duration-300 md:block ${isHomeSearchVisible ? "pointer-events-none opacity-0" : "opacity-100"}`}>
          <form
            className="mx-auto flex w-full max-w-lg items-center rounded-full border border-gray-200 bg-linear-to-br from-white to-gray-50 p-1.5 shadow-md transition-all duration-200 focus-within:border-yellow-400 focus-within:shadow-[0_4px_12px_rgba(251,191,36,0.15)] lg:max-w-xl xl:max-w-2xl lg:px-2"
            onSubmit={(event) => event.preventDefault()}
          >
            <span className="ml-3 mr-1.5 text-sm text-gray-400">
              <i className="fas fa-search" />
            </span>
            <input
              type="text"
              placeholder="Search firms..."
              className="flex-1 bg-transparent py-1.5 text-sm text-gray-700 outline-none"
              value={searchQuery}
              onChange={(event) => updateSearchQuery(event.target.value)}
              autoComplete="off"
              disabled={isHomeSearchVisible}
            />
          </form>
        </div>

        <div className="ml-auto flex min-w-max shrink-0 items-center gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
          <div className="hidden items-center gap-4 md:flex lg:gap-6 xl:gap-8">
            <span
              className="cursor-pointer text-base font-bold text-black transition hover:rounded hover:border hover:border-black hover:p-2 hover:text-yellow-600 sm:text-sm"
              onClick={() => navigate('/signup')}
            >
              SignUp
            </span>
            <button
              className="rounded-full bg-zinc-950 px-5 py-2 font-bold text-white shadow-md transition hover:bg-zinc-600 sm:text-sm xl:px-6 xl:py-2.5"
              onClick={() => navigate('/list-your-firm')}
            >
              List Your Firm
            </button>
          </div>

          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-yellow-400 p-2 text-black transition hover:bg-yellow-50"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              <span
                className={`inline-block transition-transform duration-300 ease-in-out ${menuOpen ? 'rotate-90' : 'rotate-0'}`}
              >
                {menuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg z-50 flex flex-col py-2 animate-fade-in">
                <span className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Links</span>
                <button
                  className="w-full px-4 py-2 text-left text-base font-medium text-gray-800 hover:bg-yellow-50 transition"
                  onClick={() => { setMenuOpen(false); navigate('/about'); }}
                >
                  About Us
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-base font-medium text-gray-800 hover:bg-yellow-50 transition"
                  onClick={() => { setMenuOpen(false); navigate('/team'); }}
                >
                  Meet Our Team
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-base font-medium text-gray-800 hover:bg-yellow-50 transition"
                  onClick={() => { setMenuOpen(false); navigate('/services'); }}
                >
                  Our Services
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-base font-medium text-gray-800 hover:bg-yellow-50 transition"
                  onClick={() => { setMenuOpen(false); navigate('/contact'); }}
                >
                  Contact
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Removed sidebar overlay for dropdown style */}
    </nav>
  );
};

export default Navbar;