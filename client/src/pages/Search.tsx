import { useLocation, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { useState, useEffect } from "react";
import {
  Search as SearchIcon,
  FileText,
  Music,
  Shield,
  Mail,
  HelpCircle,
  Crown,
  ShoppingBag,
  Download,
  Home,
  User,
  Settings,
  Lock,
  MessageSquare,
} from "lucide-react";

const SearchPage = () => {
  const [location] = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // All searchable pages
  const allPages = [
    {
      title: "Home",
      path: "/",
      icon: Home,
      keywords: ["home", "main", "landing"],
    },
    {
      title: "Beats",
      path: "/beats",
      icon: Music,
      keywords: ["beats", "instrumentals", "music", "tracks", "productions"],
    },
    {
      title: "Licenses",
      path: "/licenses",
      icon: FileText,
      keywords: ["licenses", "licensing", "rights", "usage", "commercial"],
    },
    {
      title: "Downloads",
      path: "/downloads",
      icon: Download,
      keywords: ["downloads", "purchased", "my beats", "library"],
    },
    {
      title: "VIP Membership",
      path: "/vip",
      icon: Crown,
      keywords: ["vip", "subscription", "premium", "membership", "exclusive"],
    },
    {
      title: "Shop / Cart",
      path: "/shop",
      icon: ShoppingBag,
      keywords: ["shop", "cart", "checkout", "purchase", "buy"],
    },

    // Store, Plugins & Merch
    {
      title: "Store",
      path: "/store",
      icon: ShoppingBag,
      keywords: ["store", "shop", "catalog", "plugins", "beats", "merch"],
    },
    {
      title: "VST Plugins",
      path: "/vst",
      icon: Music,
      keywords: ["vst", "plugins", "synth", "effects", "instruments", "audio units", "au", "aax"],
    },
    {
      title: "Merchandise",
      path: "/merchandise",
      icon: ShoppingBag,
      keywords: ["merch", "merchandise", "apparel", "clothing", "shirts", "hoodies"],
    },
    {
      title: "Plugin Installer",
      path: "/loader",
      icon: Download,
      keywords: ["installer", "loader", "install", "3lixir loader", "plugin installer", "setup"],
    },
    {
      title: "ARK Synthesizer",
      path: "/ark",
      icon: Music,
      keywords: ["ark", "synth", "synthesizer", "plugin", "vst", "instrument"],
    },
    {
      title: "Apollo Reverb",
      path: "/apollo",
      icon: Music,
      keywords: ["apollo", "reverb", "room", "effect", "plugin", "vst"],
    },
    {
      title: "Hades",
      path: "/hades",
      icon: Music,
      keywords: ["hades", "bass", "distortion", "effect", "plugin", "vst"],
    },
    {
      title: "Oyster Granular Synth",
      path: "/oyster",
      icon: Music,
      keywords: ["oyster", "granular", "synth", "synthesizer", "plugin", "vst"],
    },
    {
      title: "Orion Sound EQ",
      path: "/orion",
      icon: Music,
      keywords: ["orion", "eq", "equalizer", "sound shaping", "plugin", "vst"],
    },

    // Producer Tools
    {
      title: "Producer Tools",
      path: "/tools",
      icon: Download,
      keywords: ["tools", "producer tools", "utilities", "free tools", "audio tools"],
    },
    {
      title: "Video Converter",
      path: "/tools/video-converter",
      icon: Download,
      keywords: ["converter", "video converter", "video downloader", "youtube", "download", "mp3", "wav", "mp4", "convert"],
    },
    {
      title: "Sample Digger",
      path: "/tools/sample-generator",
      icon: Music,
      keywords: ["sample", "digger", "sample digger", "crate dig", "samples", "discogs", "records", "sample generator"],
    },
    {
      title: "Customer Support",
      path: "/support",
      icon: MessageSquare,
      keywords: ["support", "help", "customer service", "contact", "tickets", "assistance"],
    },

    // Profile Pages
    {
      title: "Profile - Settings",
      path: "/profile?section=settings",
      icon: Settings,
      keywords: ["settings", "preferences", "configuration", "options"],
    },
    {
      title: "Profile - Personal Info",
      path: "/profile?section=personal",
      icon: User,
      keywords: [
        "personal",
        "info",
        "profile",
        "account details",
        "information",
      ],
    },
    {
      title: "Profile - Security",
      path: "/profile?section=security",
      icon: Lock,
      keywords: ["security", "password", "authentication", "2fa", "login"],
    },
    {
      title: "Profile - Purchases",
      path: "/profile?section=purchases",
      icon: ShoppingBag,
      keywords: ["purchases", "orders", "history", "bought", "transactions"],
    },
    {
      title: "Profile - Subscription",
      path: "/profile?section=subscription",
      icon: Crown,
      keywords: [
        "subscription",
        "manage subscription",
        "billing",
        "plan",
        "membership",
      ],
    },
    {
      title: "Profile - Customer Support",
      path: "/profile?section=support",
      icon: MessageSquare,
      keywords: [
        "support",
        "customer service",
        "help",
        "contact support",
        "tickets",
      ],
    },

    // Info Pages
    {
      title: "About Us",
      path: "/info?section=about",
      icon: FileText,
      keywords: ["about", "story", "mission", "company", "who we are"],
    },
    {
      title: "Our Story",
      path: "/info?section=about#story",
      icon: FileText,
      keywords: ["story", "history", "background", "origin"],
    },
    {
      title: "Our Mission",
      path: "/info?section=about#mission",
      icon: FileText,
      keywords: ["mission", "vision", "goals", "values", "purpose"],
    },
    {
      title: "What We Offer",
      path: "/info?section=about#offer",
      icon: FileText,
      keywords: ["offer", "services", "products", "what we do"],
    },

    {
      title: "Meet the Artist",
      path: "/info?section=artist",
      icon: Music,
      keywords: ["artist", "producer", "dj", "creator", "musician"],
    },
    {
      title: "DJ 3LIXIR",
      path: "/info?section=artist#dj3lixir",
      icon: Music,
      keywords: ["dj 3lixir", "producer", "biography", "bio"],
    },
    {
      title: "Future Artist",
      path: "/info?section=artist#future",
      icon: Music,
      keywords: ["future artist", "host music", "featured artist"],
    },

    {
      title: "Policies",
      path: "/info?section=policy",
      icon: Shield,
      keywords: ["policies", "legal", "terms", "rules"],
    },
    {
      title: "Terms of Service",
      path: "/info?section=terms",
      icon: FileText,
      keywords: ["terms", "service", "agreement", "conditions", "tos"],
    },
    {
      title: "Privacy Policy",
      path: "/info?section=privacy",
      icon: Shield,
      keywords: ["privacy", "data", "personal information", "gdpr"],
    },
    {
      title: "Licensing Agreement",
      path: "/info?section=licensing",
      icon: FileText,
      keywords: ["licensing", "agreement", "usage rights", "copyright"],
    },
    {
      title: "Refund Policy",
      path: "/info?section=refund",
      icon: FileText,
      keywords: ["refund", "return", "money back", "cancellation"],
    },
    {
      title: "Copyright & DMCA",
      path: "/info?section=copyright",
      icon: Shield,
      keywords: ["copyright", "dmca", "intellectual property", "infringement"],
    },

    {
      title: "FAQ",
      path: "/info?section=faq",
      icon: HelpCircle,
      keywords: ["faq", "questions", "help", "answers", "support"],
    },
    {
      title: "Contact",
      path: "/info?section=contact",
      icon: Mail,
      keywords: ["contact", "email", "support", "get in touch", "reach us"],
    },
  ];

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const q = searchParams.get("q") || "";
    setQuery(q);

    if (q) {
      const searchTerm = q.toLowerCase().trim();

      // Fuzzy search function
      const fuzzyMatch = (text, search) => {
        text = text.toLowerCase();
        search = search.toLowerCase();

        // Exact match
        if (text.includes(search)) return 100;

        // Split search into words
        const searchWords = search.split(" ");
        let matchScore = 0;

        // Check if all search words are in the text
        const allWordsMatch = searchWords.every((word) => text.includes(word));
        if (allWordsMatch) matchScore += 80;

        // Check for partial matches
        searchWords.forEach((word) => {
          if (text.includes(word)) matchScore += 20;
        });

        // Check for similar starting characters
        if (text.startsWith(search.charAt(0))) matchScore += 10;

        return matchScore;
      };

      // Score each page
      const scoredPages = allPages.map((page) => {
        let score = 0;

        // Check title
        score += fuzzyMatch(page.title, searchTerm);

        // Check keywords
        page.keywords.forEach((keyword) => {
          score += fuzzyMatch(keyword, searchTerm) * 0.8;
        });

        return { ...page, score };
      });

      // Filter pages with score > 0 and sort by score
      const matches = scoredPages
        .filter((page) => page.score > 0)
        .sort((a, b) => b.score - a.score);

      setResults(matches);
    } else {
      setResults([]);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-black text-white relative">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute top-0 left-0 bottom-0 w-1/2"
          style={{
            backgroundImage: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.4,
          }}
        />
        <div
          className="absolute top-0 right-0 bottom-0 w-1/2"
          style={{
            backgroundImage: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.4,
            transform: "scaleX(-1)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 pt-32 pb-20">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
              Search
            </h1>
            {query && (
              <p className="text-xl text-muted-foreground">
                Showing results for:{" "}
                <span className="text-[hsl(var(--gold))]">"{query}"</span>
              </p>
            )}
          </div>

          {!query ? (
            // No search query
            <div className="text-center py-20">
              <SearchIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl text-muted-foreground">
                Search for pages, information, and more
              </p>
            </div>
          ) : results.length > 0 ? (
            // Search results
            <div className="max-w-3xl mx-auto space-y-4">
              {results.map((page, index) => {
                const Icon = page.icon;
                return (
                  <Link key={index} href={page.path}>
                    <a className="block border border-white/10 rounded-xl p-6 bg-white/5 hover:bg-white/10 hover:border-[hsl(var(--gold))]/50 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-[hsl(var(--gold))]/20 rounded-lg group-hover:bg-[hsl(var(--gold))]/30 transition-colors">
                          <Icon className="w-6 h-6 text-[hsl(var(--gold))]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1 group-hover:text-[hsl(var(--gold))] transition-colors">
                            {page.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {page.path}
                          </p>
                        </div>
                        <div className="text-muted-foreground group-hover:text-[hsl(var(--gold))] transition-colors">
                          →
                        </div>
                      </div>
                    </a>
                  </Link>
                );
              })}
            </div>
          ) : (
            // No results found
            <div className="text-center py-20">
              <SearchIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl text-muted-foreground mb-2">
                No pages found for "{query}"
              </p>
              <p className="text-muted-foreground">
                Try different keywords or check the spelling
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
