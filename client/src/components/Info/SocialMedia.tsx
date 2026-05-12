// File: src/components/Info/SocialMedia.tsx
import React, { useState } from "react";
import { ExternalLink, QrCode } from "lucide-react";

const YouTubeIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const SpotifyIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

interface SocialLink {
  platform: string;
  url: string;
  qrCodeUrl?: string;
  icon: React.ReactNode;
  color: string;
}

export const SocialMedia = () => {
  const [showQR, setShowQR] = useState<string | null>(null);

  const socialLinks: SocialLink[] = [
    {
      platform: "YouTube",
      url: "https://youtube.com/@dj3lixir",
      qrCodeUrl: "/qrcode.png",
      icon: <YouTubeIcon />,
      color: "#FF0000",
    },
    {
      platform: "Spotify",
      url: "https://open.spotify.com/artist/your-artist-id",
      qrCodeUrl: "/qr-codes/spotify-qr.png",
      icon: <SpotifyIcon />,
      color: "#1DB954",
    },
    {
      platform: "TikTok",
      url: "https://tiktok.com/@dj3lixir",
      qrCodeUrl: "/qr-codes/tiktok-qr.png",
      icon: <TikTokIcon />,
      color: "#000000",
    },
    {
      platform: "Instagram",
      url: "https://instagram.com/dj3lixir",
      qrCodeUrl: "/qr-codes/instagram-qr.png",
      icon: <InstagramIcon />,
      color: "#E4405F",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6 text-center">
        Connect With Us
      </h2>

      <div className="space-y-8">
        <section className="max-w-3xl mx-auto text-center">
          <p className="text-lg leading-relaxed text-muted-foreground">
            Follow DJ 3LIXIR across platforms for new releases,
            behind-the-scenes content, and exclusive updates. Stream our music,
            watch our videos, and join the community.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto">
          {socialLinks.map((link) => (
            <div
              key={link.platform}
              className="border border-white/10 rounded-xl p-6 bg-white/5 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${link.color}20` }}
                  >
                    <div style={{ color: link.color }}>{link.icon}</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold tracking-tight">
                      {link.platform}
                    </h3>
                    <p className="text-sm text-muted-foreground">@dj3lixir</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[hsl(var(--gold))] text-black px-4 py-2.5 rounded-full font-semibold hover:bg-[hsl(var(--gold))]/90 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Page
                </a>
                <button
                  onClick={() =>
                    setShowQR(showQR === link.platform ? null : link.platform)
                  }
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-foreground px-4 py-2.5 rounded-full font-semibold transition-colors text-sm"
                >
                  <QrCode className="w-4 h-4" />
                  QR Code
                </button>
              </div>

              {showQR === link.platform && (
                <div className="mt-4 p-4 bg-white rounded-xl text-center">
                  {link.qrCodeUrl ? (
                    <div>
                      <img
                        src={link.qrCodeUrl}
                        alt={`${link.platform} QR Code`}
                        className="w-48 h-48 mx-auto mb-2"
                      />
                      <p className="text-sm text-gray-600">
                        Scan to follow on {link.platform}
                      </p>
                    </div>
                  ) : (
                    <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <QrCode className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-xs">QR Code Coming Soon</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <section className="mt-12 bg-gradient-to-r from-[hsl(var(--gold))]/10 to-transparent border border-[hsl(var(--gold))]/20 rounded-xl p-8 text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
            Stay Updated
          </h3>
          <p className="text-muted-foreground mb-6">
            Get notified about new releases, exclusive content, and special
            offers directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 focus:border-[hsl(var(--gold))] focus:outline-none text-foreground placeholder:text-muted-foreground"
            />
            <button className="bg-[hsl(var(--gold))] text-black px-6 py-3 rounded-full font-semibold hover:bg-[hsl(var(--gold))]/90 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
