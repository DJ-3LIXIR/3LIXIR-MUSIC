import React from "react";
import { Link } from "wouter";

export function ElixirVision() {
  return (
    <div className="relative w-full bg-black text-white py-24 px-6 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-purple-950/30 via-black to-red-950/30 rounded-3xl p-8 md:p-16 border border-purple-500/10">
          <div className="text-center">
            {/* Decorative top line */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
              <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
            </div>

            {/* Main heading */}
            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-pulse">
                3LIXIR Music
              </span>
            </h2>

            <h3 className="text-2xl md:text-3xl font-light mb-12 text-gray-400">
              Your Sound, Your Vision
            </h3>

            {/* Description with artistic styling */}
            <div className="relative max-w-3xl mx-auto mb-12">
              <div className="absolute -left-4 top-0 text-6xl text-pink-500/20 font-serif">
                "
              </div>
              <p className="text-lg md:text-xl leading-relaxed text-gray-300 font-light px-8">
                At 3LIXIR Music, we create and sell high-quality beats, provide
                full rights management, and offer professional production
                services to bring your music to life. We're constantly
                expanding, delivering innovative solutions to help artists,
                producers, and creators reach their full potential.
              </p>
              <div className="absolute -right-4 bottom-0 text-6xl text-red-500/20 font-serif">
                "
              </div>
            </div>

            {/* CTA Button with extra artistic flair */}
            <div className="flex flex-col items-center gap-6">
              <Link href="/info">
                <button className="group relative px-10 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-pink-500/50">
                  <span className="relative z-10 flex items-center gap-2">
                    More Info
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Link>

              {/* Decorative elements around button */}
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-purple-400 animate-ping"></div>
                <div
                  className="w-1 h-1 rounded-full bg-pink-400 animate-ping"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-1 h-1 rounded-full bg-red-400 animate-ping"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>

            {/* Decorative bottom line */}
            <div className="flex items-center justify-center gap-4 mt-16">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <div className="w-2 h-2 rounded-full bg-pink-500"></div>
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
