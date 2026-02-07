import React from "react";
import { Link } from "wouter";

export function GetStarted() {
  return (
    <div className="w-full bg-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center bg-gradient-to-br from-purple-950/20 via-black to-pink-950/20 rounded-3xl p-8 md:p-12 border border-purple-500/10">
          <div className="space-y-5">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                License Your Next Hit
              </span>
              <br />
              <span className="text-white">Starting at Just $50</span>
            </h2>
            <div className="space-y-4 text-gray-300 text-base leading-relaxed">
              <p className="font-light">
                Bring your project to life with music that moves. Our licensing
                is simple, transparent, and designed to empower creators:
                starting at{" "}
                <span className="text-purple-400 font-semibold">$50</span>, with
                just{" "}
                <span className="text-pink-400 font-semibold">
                  60% of revenue
                </span>{" "}
                from your version of the track going to us.
              </p>
              <p className="font-light">
                No hidden fees, no hassle—just powerful music ready to elevate
                your work.
              </p>
            </div>
            <Link href="/licenses">
              <button className="group relative px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative aspect-square rounded-xl overflow-hidden border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
              <img
                src="/ChatGPT%20Image%20Jan%206,%202026%20at%2009_05_34%20PM.png"
                alt="Elixir Beats Artwork"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
