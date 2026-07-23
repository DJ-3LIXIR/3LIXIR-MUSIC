import React from "react";
import { Link } from "wouter";

export function StorePreview() {
  const storeCategories = [
    {
      title: "Beats & Licensing",
      description: "Royalty-free and exclusive beats starting at $50",
      icon: "🎵",
      href: "/beats",
    },
    {
      title: "VST Plugins",
      description: "Professional audio processing plugins for your DAW",
      icon: "🔌",
      href: "/vst",
    },
    {
      title: "Merchandise",
      description: "Official 3LIXIR apparel and exclusive collector items",
      icon: "👕",
      href: "/merchandise",
    },
    {
      title: "Plugin Installer",
      description: "Seamless installation and management for all plugins",
      icon: "⚙️",
      href: "/loader",
    },
  ];

  return (
    <div className="w-full bg-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full">
            <span className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
              Official Store
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Everything You Need
            </span>
            <br />
            <span className="text-white">In One Place</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Beats, plugins, merchandise, and tools—everything to level up your music production and support 3LIXIR.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {storeCategories.map((category) => (
            <Link key={category.href} href={category.href}>
              <div className="group h-full p-6 bg-gradient-to-br from-blue-950/20 via-black to-purple-950/20 border border-blue-500/10 rounded-2xl hover:border-blue-500/30 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-blue-500/10">
                <div className="space-y-4">
                  <div className="text-4xl">{category.icon}</div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {category.description}
                  </p>
                  <div className="pt-4">
                    <span className="inline-flex items-center text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
                      Shop →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/store">
            <button className="group relative px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50">
              <span className="relative z-10">Explore Store</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
