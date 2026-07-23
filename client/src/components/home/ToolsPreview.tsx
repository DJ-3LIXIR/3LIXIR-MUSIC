import React from "react";
import { Link } from "wouter";

export function ToolsPreview() {
  const tools = [
    {
      title: "Video Converter",
      description: "Convert YouTube links and videos to MP3, WAV, MP4 and more",
      icon: "🎬",
      href: "/tools/video-converter",
    },
    {
      title: "Sample Digger",
      description: "Crate-dig random records with Discogs metadata and filtering",
      icon: "🔍",
      href: "/tools/sample-generator",
    },
    {
      title: "Stem Splitter",
      description: "Split audio into vocals, drums, bass and more with AI",
      icon: "🎚️",
      href: "/tools",
    },
  ];

  return (
    <div className="w-full bg-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full">
            <span className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
              Free Tools
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Producer Tools
            </span>
            <br />
            <span className="text-white">Built for Creators</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A growing suite of free audio tools designed to streamline your workflow—convert, sample, and split with ease.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href}>
              <div className="group h-full p-6 bg-gradient-to-br from-purple-950/20 to-pink-950/20 border border-purple-500/10 rounded-2xl hover:border-purple-500/30 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-purple-500/10">
                <div className="space-y-4">
                  <div className="text-4xl">{tool.icon}</div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="pt-4">
                    <span className="inline-flex items-center text-purple-400 font-semibold group-hover:translate-x-2 transition-transform">
                      Explore →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/tools">
            <button className="group relative px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50">
              <span className="relative z-10">View All Tools</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
