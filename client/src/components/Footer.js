import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-12 mt-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and About */}
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 text-xl font-bold mb-4">
            <div className="bg-white p-2 rounded-full">
              <FaUserMd className="text-blue-700 text-xl" />
            </div>
            <span>Where is my Doc</span>
          </div>
          <p className="text-blue-100 mb-4 text-sm">
            Connecting patients with the right healthcare professionals. Your health is our priority.
          </p>
        </div>

        {/* Quick Links */}
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-4 border-b border-blue-700 pb-2">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="text-blue-100 hover:text-white transition">Home</Link></li>
            <li><Link to="/signup" className="text-blue-100 hover:text-white transition">Sign Up</Link></li>
            <li><Link to="/login" className="text-blue-100 hover:text-white transition">Login</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-4 border-b border-blue-700 pb-2">Contact Us</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-blue-300" />
              <a href="mailto:info@whereismydoc.com" className="text-blue-100 hover:text-white transition">info@whereismydoc.com</a>
            </li>
            <li className="flex items-center gap-2">
              <FaPhone className="text-blue-300" />
              <a href="tel:+1234567890" className="text-blue-100 hover:text-white transition">+1 (234) 567-890</a>
            </li>
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-blue-300 mt-1" />
              <span className="text-blue-100">123 Healthcare Ave, Medical District, City, Country</span>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-4 border-b border-blue-700 pb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="bg-blue-700 hover:bg-blue-600 p-2 rounded-full transition">
              <FaFacebook />
            </a>
            <a href="#" className="bg-blue-700 hover:bg-blue-600 p-2 rounded-full transition">
              <FaTwitter />
            </a>
            <a href="#" className="bg-blue-700 hover:bg-blue-600 p-2 rounded-full transition">
              <FaInstagram />
            </a>
            <a href="#" className="bg-blue-700 hover:bg-blue-600 p-2 rounded-full transition">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-blue-700 mt-8 pt-8 text-center text-blue-200 text-sm">
        &copy; {new Date().getFullYear()} Where is my Doc. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;