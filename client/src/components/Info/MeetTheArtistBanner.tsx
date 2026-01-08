import React from "react";
import { Sparkles, Music, Waves } from "lucide-react";

export default function MeetTheArtistBanner() {
  return (
    <div className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-neutral-900 to-black">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "1s" }}
        />

        {/* Gradient overlay lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 space-y-8">
        {/* Decorative top element */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-500" />
          <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-500" />
        </div>

        {/* Main heading */}
        <div className="space-y-4">
          <h1 className="text-7xl md:text-9xl font-display font-black tracking-tighter">
            <span
              className="block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-pulse"
              style={{ animationDuration: "3s" }}
            >
              MEET
            </span>
            <span className="block text-white mt-2">THE ARTIST</span>
          </h1>
        </div>

        {/* Subtext */}
        <p className="text-xl md:text-2xl text-neutral-400 font-light tracking-wide max-w-2xl mx-auto">
          Crafting Sonic Excellence, One Beat at a Time
        </p>

        {/* Decorative bottom element */}
        <div className="flex justify-center items-center gap-4 mt-12">
          <Music className="w-5 h-5 text-yellow-500/60" />
          <div className="h-px w-24 bg-gradient-to-r from-yellow-500/60 to-transparent" />
          <Waves className="w-5 h-5 text-yellow-500/60" />
          <div className="h-px w-24 bg-gradient-to-l from-yellow-500/60 to-transparent" />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-yellow-500/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-yellow-500/60 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60 pointer-events-none" />
    </div>
  );
}
