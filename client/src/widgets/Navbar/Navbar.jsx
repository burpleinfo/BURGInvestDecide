import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isPartnersPage = location.pathname.startsWith('/partners');
  const useSolidBackground = scrolled || isPartnersPage;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${useSolidBackground ? 'bg-[#001f40] shadow-md' : 'bg-[#001f40] lg:bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="shrink-0 z-50">
            <img 
              src="https://i.ibb.co/rKbMhMsY/BURGRENTAL-COM-BADGE-removebg-preview.png" 
              alt="BURG Rental Services" 
              className="h-10"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className={`font-medium transition-colors ${location.pathname === '/' ? 'text-blue-600' : scrolled ? 'text-gray-900 hover:text-blue-600' : 'text-gray-200 hover:text-white'}`}>Home</Link>
            <Link to="/platform" className={`transition-colors ${location.pathname === '/platform' ? 'text-blue-600' : scrolled ? 'text-gray-600 hover:text-blue-600' : 'text-gray-200 hover:text-white'}`}>Platform</Link>
            <Link to="/services" className={`transition-colors ${location.pathname === '/services' ? 'text-blue-600' : scrolled ? 'text-gray-600 hover:text-blue-600' : 'text-gray-200 hover:text-white'}`}>Services</Link>
            <Link to="/partners" className={`transition-colors ${location.pathname === '/partners' ? 'text-blue-600' : scrolled ? 'text-gray-600 hover:text-blue-600' : 'text-gray-200 hover:text-white'}`}>Partners</Link>
            <Link to="/drivers" className={`transition-colors ${location.pathname === '/drivers' ? 'text-blue-600' : scrolled ? 'text-gray-600 hover:text-blue-600' : 'text-gray-200 hover:text-white'}`}>Drivers</Link>
            <Link to="/technology" className={`transition-colors ${location.pathname === '/technology' ? 'text-blue-600' : scrolled ? 'text-gray-600 hover:text-blue-600' : 'text-gray-200 hover:text-white'}`}>Technology</Link>
            <Link to="/contact" className={`px-6 py-2 rounded-lg transition-all ${scrolled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-blue-900 hover:bg-gray-100'}`}>
              Contact Us
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden flex flex-col gap-1.5 z-50 p-2 ${scrolled || menuOpen ? '' : 'bg-transparent'}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 block transition-all ${scrolled || menuOpen ? 'bg-gray-900' : 'bg-white'} ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 block transition-all ${scrolled || menuOpen ? 'bg-gray-900' : 'bg-white'} ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 block transition-all ${scrolled || menuOpen ? 'bg-gray-900' : 'bg-white'} ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className={`md:hidden absolute top-0 left-0 w-full bg-white shadow-xl transition-all duration-300 pt-20 pb-6`}>
            <nav className="flex flex-col px-6 space-y-4">
              <Link to="/" onClick={() => setMenuOpen(false)} className={`text-lg font-medium ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-900'}`}>Home</Link>
              <Link to="/platform" onClick={() => setMenuOpen(false)} className={`text-lg ${location.pathname === '/platform' ? 'text-blue-600' : 'text-gray-600'}`}>Platform</Link>
              <Link to="/services" onClick={() => setMenuOpen(false)} className={`text-lg ${location.pathname === '/services' ? 'text-blue-600' : 'text-gray-600'}`}>Services</Link>
              <Link to="/partners" onClick={() => setMenuOpen(false)} className={`text-lg ${location.pathname === '/partners' ? 'text-blue-600' : 'text-gray-600'}`}>Partners</Link>
              <Link to="/drivers" onClick={() => setMenuOpen(false)} className={`text-lg ${location.pathname === '/drivers' ? 'text-blue-600' : 'text-gray-600'}`}>Drivers</Link>
              <Link to="/technology" onClick={() => setMenuOpen(false)} className={`text-lg ${location.pathname === '/technology' ? 'text-blue-600' : 'text-gray-600'}`}>Technology</Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)} className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white text-center rounded-lg font-semibold w-full">Contact Us</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
