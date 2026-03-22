import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { SearchContext } from "../../contexts/SearchContext";
import { getStoredUserEmail, clearUserData } from "../../utils/cookieUtils";

const Navbar = () => {
  const navigate = useNavigate();
  const { isHomeSearchVisible, searchQuery, updateSearchQuery } = useContext(SearchContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const storedEmail = getStoredUserEmail();
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(storedEmail));
  const [userEmail, setUserEmail] = useState(storedEmail || "");
  const isAdmin = userEmail === "burpleinfodesk@gmail.com";

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogout = () => {
    clearUserData();
    setIsLoggedIn(false);
    setUserEmail("");
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/35 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl backdrop-saturate-150">
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

        <div className="ml-auto flex min-w-max shrink-0 items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8">
          <div className="hidden items-center gap-2 md:flex md:gap-3 lg:gap-6 xl:gap-8">
            {!isLoggedIn ? (
              <>
                <span
                  className="cursor-pointer text-sm font-bold text-black transition hover:text-yellow-600 active:scale-95 whitespace-nowrap lg:text-base"
                  onClick={() => navigate('/register')}
                >
                  SignUp
                </span>
              </>
            ) : (
              <>
                {isAdmin && (
                  <button
                    className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black shadow-md transition hover:bg-yellow-500 active:scale-95 lg:px-5 lg:py-2.5 xl:px-6"
                    onClick={() => navigate('/dashboard')}
                  >
                    Dashboard
                  </button>
                )}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="inline-flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-yellow-400 text-black font-bold transition hover:bg-yellow-500 shadow-md active:scale-95"
                    title={userEmail}
                  >
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg z-50 flex flex-col py-2 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</p>
                        <p className="text-sm font-medium text-gray-900 mt-1 truncate">{userEmail}</p>
                      </div>
                      {isAdmin && (
                        <button
                          className="w-full px-4 py-2 text-left text-base font-medium text-gray-800 hover:bg-yellow-50 transition flex items-center gap-2"
                          onClick={() => { setProfileOpen(false); navigate('/dashboard'); }}
                        >
                          <User className="h-4 w-4" />
                          Dashboard
                        </button>
                      )}
                      <button
                        className="w-full px-4 py-2 text-left text-base font-medium text-gray-800 hover:bg-yellow-50 transition flex items-center gap-2"
                        onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                      >
                        <Settings className="h-4 w-4" />
                        Profile Settings
                      </button>
                      <divider className="border-b border-gray-100 my-1" />
                      <button
                        className="w-full px-4 py-2 text-left text-base font-medium text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            <button
              className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-bold text-white shadow-md transition hover:bg-zinc-600 active:scale-95 whitespace-nowrap lg:px-5 lg:py-2.5 xl:px-6"
              onClick={() => navigate('/list-your-firm')}
            >
              List Your Firm
            </button>
          </div>

          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border-2 hover:border-yellow-400 p-2 sm:p-2.5 text-black transition hover:bg-yellow-50 active:scale-90"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              <span
                className={`inline-block transition-transform duration-300 ease-in-out ${menuOpen ? 'rotate-90' : 'rotate-0'}`}
              >
                {menuOpen ? (
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 sm:w-56 rounded-xl border border-gray-200 bg-white shadow-lg z-50 flex flex-col py-2 animate-fade-in origin-top-right">
                {isLoggedIn && (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</p>
                      <p className="text-sm font-medium text-gray-900 mt-1 truncate">{userEmail}</p>
                    </div>
                    {isAdmin && (
                      <button
                        className="w-full px-4 py-2 text-left text-base font-medium text-gray-800 hover:bg-yellow-50 transition flex items-center gap-2"
                        onClick={() => { setMenuOpen(false); navigate('/dashboard'); }}
                      >
                        <User className="h-4 w-4" />
                        Dashboard
                      </button>
                    )}
                    <button
                      className="w-full px-4 py-2 text-left text-base font-medium text-gray-800 hover:bg-yellow-50 transition flex items-center gap-2"
                      onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                    >
                      <Settings className="h-4 w-4" />
                      Profile Settings
                    </button>
                    <divider className="border-b border-gray-100 my-1" />
                  </>
                )}
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
                {isLoggedIn && (
                  <>
                    <divider className="border-b border-gray-100 my-1" />
                    <button
                      className="w-full px-4 py-2 text-left text-base font-medium text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                      onClick={() => { setMenuOpen(false); handleLogout(); }}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                )}
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