import React from "react";
import { Link, useLocation } from "wouter";

export function Links() {
  const [, setLocation] = useLocation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSupportClick = (e) => {
    e.preventDefault();
    // Navigate to info page with artist section and support hash
    window.location.href = "/info?section=artist#support-section";
  };

  return (
    <div className="w-full bg-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-blue-950/20 via-black to-orange-950/20 rounded-3xl p-8 md:p-12 border border-blue-500/10">
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button
              onClick={scrollToTop}
              className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
            >
              <span className="relative z-10">Back to Top</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <Link href="/info?section=faq">
              <button className="group relative px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50">
                <span className="relative z-10">FAQ</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
            <Link href="/info?section=contact">
              <button className="group relative px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/50">
                <span className="relative z-10">Contact Us</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
            <button
              onClick={handleSupportClick}
              className="group relative px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50"
            >
              <span className="relative z-10">Support</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
