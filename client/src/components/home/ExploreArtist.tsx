import React from "react";
import { Link } from "wouter";

export function ExploreArtist() {
  return (
    <div className="w-full bg-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center bg-gradient-to-br from-pink-950/20 via-black to-red-950/20 rounded-3xl p-8 md:p-12 border border-pink-500/10">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-red-600/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative aspect-square rounded-xl overflow-hidden border border-pink-500/30 bg-gradient-to-br from-pink-900/20 to-red-900/20">
              <img
                src="/3LIXIR_logo_transparent.png"
                alt="DJ 3LIXIR Logo"
                className="w-full h-full object-contain p-8"
              />
            </div>
          </div>
          <div className="space-y-5">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-pink-400 via-red-400 to-rose-400 bg-clip-text text-transparent">
                DJ 3LIXIR
              </span>
              <br />
              <span className="text-white">Feel the Beat, Live the Moment</span>
            </h2>
            <div className="space-y-4 text-gray-300 text-base leading-relaxed">
              <p className="font-light">
                DJ 3LIXIR is a sonic force, blending electrifying energy with
                unforgettable grooves. From heart-pounding drops to
                soul-stirring rhythms, every set is a journey that moves crowds,
                ignites dance floors, and turns every moment into an experience
                you won't forget.
              </p>
            </div>
            <Link href="/info?section=artist">
              <button className="group relative px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/50">
                <span className="relative z-10">Learn More</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
