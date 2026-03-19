import React from 'react'

const Footer = () => (
  <footer className="bg-black text-white pt-12 pb-8 px-4 mt-0">
    <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
      {/* Company Info */}
      <div>
        <h3 className="text-xl font-bold mb-2">BURG Rental Services LLP</h3>
        <p className="text-sm mb-1">LLPIN: ACR-9256</p>
        <p className="text-sm mb-1">Revolutionizing commercial vehicle rentals since 2024</p>
        <p className="text-sm mb-1">Dhiraan Newyork Meadows, No.104, Block A, Chandapura, Iggaluru, Bangalore, India</p>
      </div>
      {/* Quick Links */}
      <div>
        <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
        <ul className="space-y-1">
          <li><a href="#about" className="hover:text-yellow-400 transition">About Us</a></li>
          <li><a href="#team" className="hover:text-yellow-400 transition">Meet Our Team</a></li>
          <li><a href="#catalog" className="hover:text-yellow-400 transition">Vehicle Catalog</a></li>
          <li><a href="#faq" className="hover:text-yellow-400 transition">FAQ</a></li>
          <li><a href="/contact" className="hover:text-yellow-400 transition">Contact</a></li>
        </ul>
        <h4 className="text-lg font-semibold mt-6 mb-3">Legal</h4>
        <ul className="space-y-1">
          <li><a href="#cookie" className="hover:text-yellow-400 transition">Cookie Policy</a></li>
          <li><a href="#terms" className="hover:text-yellow-400 transition">Terms of Service</a></li>
          <li><a href="#eula" className="hover:text-yellow-400 transition">EULA</a></li>
          <li><a href="#privacy" className="hover:text-yellow-400 transition">Privacy Policy</a></li>
          <li><a href="#refund" className="hover:text-yellow-400 transition">Refund Policy</a></li>
        </ul>
      </div>
      {/* Contact */}
      <div>
        <h4 className="text-lg font-semibold mb-3">Contact</h4>
        <p className="text-sm mb-1">hello@burgrental.com</p>
        <p className="text-sm mb-1">+91 877 857 9209</p>
        <p className="text-sm mb-1">+91 809 985 3142</p>
      </div>
    </div>
    <div className="text-center text-xs text-gray-400 mt-10">&copy; {new Date().getFullYear()} BURG Rental Services LLP. All rights reserved.</div>
  </footer>
);

export default Footer;
