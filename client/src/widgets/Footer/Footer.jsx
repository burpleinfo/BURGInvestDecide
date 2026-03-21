import React from 'react'
import { Instagram, Linkedin, Mail, Phone } from 'lucide-react';


const Footer = () => (
  <footer className="bg-black text-white pt-12 pb-8 px-4 mt-0">
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
      {/* BURG Rental Services */}
      <div>
        <h3 className="text-xl font-bold mb-2 text-yellow-400">BURG Rental Services LLP</h3>
        <p className="text-sm mb-1">LLPIN: ACR-9256</p>
        <p className="text-sm mb-1">Revolutionizing commercial vehicle rentals since 2024</p>
        <p className="text-sm mb-1">Dhiraan Newyork Meadows, No.104, Block A, Chandapura, Iggaluru, Bangalore, India</p>
        <div className="flex space-x-4 mt-4">
          <a href="https://www.instagram.com/burgrental" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-yellow-400 transition">
            <Instagram size={22} />
          </a>
          <a href="https://www.linkedin.com/company/burg-rental" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-yellow-400 transition">
            <Linkedin size={22} />
          </a>
        </div>
      </div>
      {/* Quick Links */}
      <div>
        <h4 className="text-lg font-semibold mb-3 text-yellow-400">Quick Links</h4>
        <ul className="space-y-1">
          <li><a href="/about" className="hover:text-yellow-400 transition">About Us</a></li>
          <li><a href="/team" className="hover:text-yellow-400 transition">Meet Our Team</a></li>
          <li><a href="/services" className="hover:text-yellow-400 transition">Our Services</a></li>
          <li><a href="/" className="hover:text-yellow-400 transition">Home</a></li>
          <li><a href="/contact" className="hover:text-yellow-400 transition">Contact</a></li>
        </ul>
      </div>
      {/* Legal */}
      <div>
        <h4 className="text-lg font-semibold mb-3 text-yellow-400">Legal</h4>
        <ul className="space-y-1">
          <li><a href="#cookie" className="hover:text-yellow-400 transition">Cookie Policy</a></li>
          <li><a href="#terms" className="hover:text-yellow-400 transition">Terms of Service</a></li>
          <li><a href="#eula" className="hover:text-yellow-400 transition">EULA</a></li>
          <li><a href="#privacy" className="hover:text-yellow-400 transition">Privacy Policy</a></li>
          <li><a href="#refund" className="hover:text-yellow-400 transition">Refund Policy</a></li>
        </ul>
      </div>
      {/* Contact (moved to bottom right) */}
      <div>
        <h4 className="text-lg font-semibold mb-3 text-yellow-400">Contact</h4>
        <ul className="space-y-2">
          <li className="flex items-center space-x-2">
            <Mail size={18} />
            <a href="mailto:hello@burgrental.com" className="text-sm hover:text-yellow-400 transition">hello@burgrental.com</a>
          </li>
          <li className="flex items-center space-x-2">
            <Phone size={18} />
            <a href="tel:+918778579209" className="text-sm hover:text-yellow-400 transition">+91 877 857 9209</a>
          </li>
          <li className="flex items-center space-x-2">
            <Phone size={18} />
            <a href="tel:+918099853142" className="text-sm hover:text-yellow-400 transition">+91 809 985 3142</a>
          </li>
        </ul>
      </div>
    </div>
    <div className="text-center text-xs text-gray-400 mt-10">
      &copy; 2026 BURG Rental Services LLP. All rights reserved. LLPIN: ACR-9256
    </div>
  </footer>
);

export default Footer;
