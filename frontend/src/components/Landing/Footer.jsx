// components/Landing/Footer.jsx
import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Instagram,
  Github,
  Linkedin,
} from "lucide-react";
import { useSelector } from "react-redux";

const Footer = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <footer className="bg-black text-white pt-16 pb-8 px-6 relative z-10 border-t border-orange-500/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-orange-500/20 pb-10">
        {/* About */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-orange-500">About indieCode</h2>
          <p className="text-sm text-gray-300">
            indieCode is your ultimate platform for coding excellence. Solve
            problems, track progress, and grow your skills with our
            cutting-edge tools and vibrant community.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-orange-500">Quick Links</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="/problemset" className="hover:text-orange-400 transition">Problems</a></li>
            <li>
              <a href={user ? `/myprofile/${user._id}` : "#"} className="hover:text-orange-400 transition">
                Profile
              </a>
            </li>
            <li><a href="#" className="hover:text-orange-400 transition">Report an Issue</a></li>
            <li><a href="#" className="hover:text-orange-400 transition">Feedback</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-orange-500">Contact Us</h2>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-orange-500" /> rohit@indieCode.in
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-orange-500" /> +91 123 456 789
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-orange-500" /> 123 , Tech City
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-orange-500">Newsletter</h2>
          <p className="text-sm text-gray-300 mb-4">
            Stay updated with the latest coding challenges and tips.
          </p>
          <form className="flex items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="rounded-l-md px-4 py-2 bg-gray-800 text-white text-sm w-full border border-orange-500/30 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-4 py-2 rounded-r-md transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Social & Bottom */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mt-6 px-4">
        <div className="flex space-x-4 text-orange-400 mb-4 md:mb-0">
          <Twitter size={18} className="hover:text-orange-300 cursor-pointer transition" />
          <Instagram size={18} className="hover:text-orange-300 cursor-pointer transition" />
          <Github size={18} className="hover:text-orange-300 cursor-pointer transition" />
          <Linkedin size={18} className="hover:text-orange-300 cursor-pointer transition" />
        </div>
        <div className="text-xs text-gray-400">
          © 2025 indieCode. All rights reserved.{" "}
          <span className="ml-4">
            <a href="#" className="hover:underline hover:text-orange-400">Privacy Policy</a> &nbsp;
            <a href="#" className="hover:underline hover:text-orange-400">Terms of Service</a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
