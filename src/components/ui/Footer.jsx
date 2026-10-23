import React from 'react';
import { Link } from 'react-router-dom';
import { Microscope } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  return (
    <footer className="bg-purple-950 border-t border-purple-800/50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Microscope size={14} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-purple-200 font-semibold text-sm">MicrobeQuest</span>
            <span className="text-purple-500 text-sm hidden sm:inline">
              &copy; {currentYear} Chase Street Press
            </span>
          </div>

          {/* Legal links */}
          <nav className="flex items-center gap-1 flex-wrap justify-center">
            <Link
              to="/privacy"
              className="text-purple-400 hover:text-yellow-400 text-sm px-3 py-1 rounded transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <span className="text-purple-700 text-sm">·</span>
            <Link
              to="/terms"
              className="text-purple-400 hover:text-yellow-400 text-sm px-3 py-1 rounded transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <span className="text-purple-700 text-sm">·</span>
            <Link
              to="/refunds"
              className="text-purple-400 hover:text-yellow-400 text-sm px-3 py-1 rounded transition-colors duration-200"
            >
              Refund Policy
            </Link>
          </nav>

          {/* Mobile copyright */}
          <p className="text-purple-500 text-xs sm:hidden">
            &copy; {currentYear} Chase Street Press
          </p>
        </div>

        {/* Tagline */}
        <p className="text-center text-purple-600 text-xs mt-4">
          🌻 A minority and woman-owned STEM learning platform · Lead with curiosity
        </p>
      </div>
    </footer>
  );
};

export default Footer;
