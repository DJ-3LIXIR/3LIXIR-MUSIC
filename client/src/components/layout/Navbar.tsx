import { Link, useLocation } from "wouter";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  User,
  Crown,
  ChevronDown,
  LogOut,
  Settings,
  Lock,
  MessageSquare,
  FileText,
  Shield,
  Scale,
  HelpCircle,
  Music,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { totalItems } = useCart();
  const { user, openAuthModal, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileSubMenuOpen(null);
    setSearchOpen(false);
  }, [location]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
    };
    if (activeDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeDropdown]);

  const infoMenuItems = [
    { id: "about", label: "About Us", section: "about", icon: FileText },
    { id: "artist", label: "Meet the Artist", section: "artist", icon: Music },
    { id: "policy", label: "Policies", section: "policy", icon: Shield },
    { id: "faq", label: "FAQ", section: "faq", icon: HelpCircle },
    { id: "contact", label: "Contact", section: "contact", icon: Mail },
  ];

  const aboutSubItems = [
    { id: "story", label: "Our Story", icon: FileText },
    { id: "mission", label: "Our Mission", icon: FileText },
    { id: "offer", label: "What We Offer", icon: FileText },
  ];

  const artistSubItems = [
    { id: "dj3lixir", label: "DJ 3LIXIR", icon: Music },
    { id: "future", label: "Future Artist", icon: Music },
  ];

  const policySubItems = [
    { id: "terms", label: "Terms of Service", icon: FileText },
    { id: "privacy", label: "Privacy Policy", icon: Shield },
    { id: "licensing", label: "Licensing Agreement", icon: Scale },
    { id: "refund", label: "Refund Policy", icon: FileText },
    { id: "copyright", label: "Copyright & DMCA", icon: Shield },
  ];

  const accountMenuItems = user
    ? [
        {
          id: "settings",
          label: "Settings",
          icon: Settings,
          href: "/profile?section=settings",
        },
        {
          id: "personal",
          label: "Personal Info",
          icon: User,
          href: "/profile?section=personal",
        },
        {
          id: "security",
          label: "Security",
          icon: Lock,
          href: "/profile?section=security",
        },
        {
          id: "purchases",
          label: "Purchases",
          icon: ShoppingBag,
          href: "/profile?section=purchases",
        },
        {
          id: "subscription",
          label: "Manage Subscription",
          icon: Crown,
          href: "/profile?section=subscription",
        },
        {
          id: "support",
          label: "Customer Support",
          icon: MessageSquare,
          href: "/profile?section=support",
        },
      ]
    : [];

  const handleInfoClick = (section) => {
    if (location.startsWith("/info")) {
      // Already on info page, manually update URL and dispatch event
      window.history.pushState({}, "", `/info?section=${section}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    } else {
      setLocation(`/info?section=${section}`);
    }
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const handleAboutClick = (section) => {
    if (location.startsWith("/info")) {
      window.history.pushState({}, "", `/info?section=about#${section}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    } else {
      setLocation(`/info?section=about#${section}`);
    }
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const handleArtistClick = (section) => {
    if (location.startsWith("/info")) {
      window.history.pushState({}, "", `/info?section=artist#${section}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    } else {
      setLocation(`/info?section=artist#${section}`);
    }
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const handlePolicyClick = (section) => {
    if (location.startsWith("/info")) {
      window.history.pushState({}, "", `/info?section=${section}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    } else {
      setLocation(`/info?section=${section}`);
    }
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const handleAccountClick = (href) => {
    setLocation(href);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const toggleMobileSubMenu = (menu) => {
    setMobileSubMenuOpen(mobileSubMenuOpen === menu ? null : menu);
  };

  const isInfoMenuState = (value) =>
    value === "info" ||
    value === "about" ||
    value === "artist" ||
    value === "policy";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Handle ESC key to close search
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [searchOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-20 border-b transition-all duration-300 ${
          scrolled
            ? "border-white/10 bg-black/95 backdrop-blur-xl"
            : "border-white/5 bg-black/50 backdrop-blur-xl"
        }`}
      >
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-display font-bold tracking-tighter hover:opacity-80 transition-opacity"
          >
            3LIXIR <span style={{ color: "#C9A84C" }}>MUSIC</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Info Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={() =>
                  setActiveDropdown(activeDropdown === "info" ? null : "info")
                }
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-white transition-colors"
              >
                Info
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${activeDropdown === "info" ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            <span className="text-white/20">|</span>
            <Link
              href="/tools"
              className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
            >
              Tools
            </Link>
            <span className="text-white/20">|</span>
            <Link
              href="/store"
              className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
            >
              Store
            </Link>
            <span className="text-white/20">|</span>
            <Link
              href="/licenses"
              className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
            >
              Licenses
            </Link>
            <span className="text-white/20">|</span>
            <Link
              href="/downloads"
              className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
            >
              Downloads
            </Link>
            <span className="text-white/20">|</span>

            {/* VIP Link */}
            <Link
              href="/vip"
              className="text-sm font-medium text-[hsl(var(--gold))] hover:text-[hsl(var(--gold))]/80 transition-colors flex items-center gap-1.5"
            >
              <Crown className="w-4 h-4" />
              VIP
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-muted-foreground hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <div className="relative">
              <button
                onClick={() => setLocation("/shop")}
                className="p-2 text-muted-foreground hover:text-white transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[hsl(var(--gold))] text-black text-[10px] font-bold flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {/* Account Dropdown - Desktop */}
            {user ? (
              <div
                className="hidden md:block relative"
                onMouseEnter={() => setActiveDropdown("account")}
                onMouseLeave={() => setActiveDropdown(null)}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(var(--gold))] to-orange-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-black">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${activeDropdown === "account" ? "rotate-180" : ""}`}
                  />
                </button>
                {activeDropdown === "account" && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-black/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl py-2">
                    {accountMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleAccountClick(item.href)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </button>
                      );
                    })}
                    <div className="my-2 border-t border-white/10" />
                    <button
                      onClick={() => {
                        signOut();
                        setActiveDropdown(null);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:block">
                <Button
                  onClick={openAuthModal}
                  variant="outline"
                  className="border-white/10 hover:bg-white/5 hover:text-white rounded-full px-6 text-xs font-bold uppercase tracking-widest"
                >
                  Sign In
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-muted-foreground hover:text-white"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Full Width Gold Dropdown Banner - Info */}
      {activeDropdown === "info" && (
        <div className="fixed top-20 left-0 right-0 z-40 shadow-2xl animate-in slide-in-from-top duration-300">
          {/* Top Banner with Main Sections */}
          <div className="bg-black border-t-4 border-[hsl(var(--gold))]/50 border-b-2 border-black/30">
            <div className="container mx-auto px-6 py-4">
              <div className="grid grid-cols-5 gap-8">
                <button
                  onClick={() => handleInfoClick("about")}
                  className="flex items-center justify-center gap-2 font-bold text-base hover:bg-white/10 py-2 px-4 rounded-lg transition-all" style={{ color: "#C9A84C" }}
                >
                  <FileText className="w-5 h-5" />
                  About Us
                </button>
                <button
                  onClick={() => handleInfoClick("artist")}
                  className="flex items-center justify-center gap-2 font-bold text-base hover:bg-white/10 py-2 px-4 rounded-lg transition-all" style={{ color: "#C9A84C" }}
                >
                  <Music className="w-5 h-5" />
                  Meet the Artist
                </button>
                <button
                  onClick={() => handleInfoClick("policy")}
                  className="flex items-center justify-center gap-2 font-bold text-base hover:bg-white/10 py-2 px-4 rounded-lg transition-all" style={{ color: "#C9A84C" }}
                >
                  <Shield className="w-5 h-5" />
                  Policies
                </button>
                <button
                  onClick={() => handleInfoClick("faq")}
                  className="flex items-center justify-center gap-2 font-bold text-base hover:bg-white/10 py-2 px-4 rounded-lg transition-all" style={{ color: "#C9A84C" }}
                >
                  <HelpCircle className="w-5 h-5" />
                  FAQ
                </button>
                <button
                  onClick={() => handleInfoClick("contact")}
                  className="flex items-center justify-center gap-2 font-bold text-base hover:bg-white/10 py-2 px-4 rounded-lg transition-all" style={{ color: "#C9A84C" }}
                >
                  <Mail className="w-5 h-5" />
                  Contact
                </button>
              </div>
            </div>
          </div>

          {/* Subsections Area - Gold Background */}
          <div className="bg-[hsl(var(--gold))] border-b-4 border-black">
            <div className="border-t-2 border-black/20">
              <div className="container mx-auto px-6 py-6">
                <div className="grid grid-cols-5 gap-8">
                  {/* About Us Subsections */}
                  <div className="flex flex-col items-start border-r border-black/30 pr-8">
                    <div className="space-y-2 w-full">
                      {aboutSubItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleAboutClick(item.id)}
                          className="block text-black/80 hover:text-black hover:underline text-sm transition-all text-left w-full"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Artist Subsections */}
                  <div className="flex flex-col items-start border-r border-black/30 pr-8">
                    <div className="space-y-2 w-full">
                      {artistSubItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleArtistClick(item.id)}
                          className="block text-black/80 hover:text-black hover:underline text-sm transition-all text-left w-full"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Policy Subsections */}
                  <div className="flex flex-col items-start border-r border-black/30 pr-8">
                    <div className="space-y-2 w-full">
                      {policySubItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handlePolicyClick(item.id)}
                          className="block text-black/80 hover:text-black hover:underline text-sm transition-all text-left w-full"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Empty columns for FAQ and Contact alignment */}
                  <div className="border-r border-black/30 pr-8"></div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-start justify-center pt-32">
          <div className="container mx-auto px-6 max-w-3xl">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search beats, licenses, downloads, and more..."
                autoFocus
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[hsl(var(--gold))] focus:bg-white/15 transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[hsl(var(--gold))] hover:text-[hsl(var(--gold))]/80 transition-colors"
              >
                <Search className="w-6 h-6" />
              </button>
            </form>
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              className="mt-8 mx-auto flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
              <span className="text-sm">Close Search (ESC)</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-20 left-0 right-0 bg-black border-b border-white/5 backdrop-blur-xl max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="container mx-auto px-6 py-8 flex flex-col gap-4">
              {/* Info Mobile Menu */}
              <div>
                <div className="w-full flex items-center justify-between px-4 py-2 text-lg font-medium text-muted-foreground transition-colors">
                  <button
                    onClick={() => handleInfoClick("about")}
                    className="text-left hover:text-white transition-colors"
                  >
                    Info
                  </button>
                  <button
                    onClick={() => {
                      if (isInfoMenuState(mobileSubMenuOpen)) {
                        setMobileSubMenuOpen(null);
                      } else {
                        setMobileSubMenuOpen("info");
                      }
                    }}
                    className="p-1 hover:text-white transition-colors"
                    aria-label="Toggle info menu"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isInfoMenuState(mobileSubMenuOpen) ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
                {isInfoMenuState(mobileSubMenuOpen) && (
                  <div className="ml-4 mt-2 space-y-1">
                    {infoMenuItems.map((item) => {
                      const Icon = item.icon;
                      if (item.id === "about") {
                        return (
                          <div key={item.id}>
                            <div className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-muted-foreground hover:bg-white/5 rounded-lg transition-colors">
                              <button
                                onClick={() => handleInfoClick(item.section)}
                                className="flex items-center gap-2 hover:text-white transition-colors"
                              >
                                <Icon className="w-4 h-4" />
                                {item.label}
                              </button>
                              <button
                                onClick={() => toggleMobileSubMenu("about")}
                                className="p-1 hover:text-white transition-colors"
                                aria-label="Toggle About Us submenu"
                              >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${mobileSubMenuOpen === "about" ? "rotate-180" : ""}`}
                              />
                              </button>
                            </div>
                            {mobileSubMenuOpen === "about" && (
                              <div className="ml-4 mt-1 space-y-1">
                                {aboutSubItems.map((subItem) => (
                                  <button
                                    key={subItem.id}
                                    onClick={() => handleAboutClick(subItem.id)}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                  >
                                    {subItem.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }
                      if (item.id === "artist") {
                        return (
                          <div key={item.id}>
                            <div className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-muted-foreground hover:bg-white/5 rounded-lg transition-colors">
                              <button
                                onClick={() => handleInfoClick(item.section)}
                                className="flex items-center gap-2 hover:text-white transition-colors"
                              >
                                <Icon className="w-4 h-4" />
                                {item.label}
                              </button>
                              <button
                                onClick={() => toggleMobileSubMenu("artist")}
                                className="p-1 hover:text-white transition-colors"
                                aria-label="Toggle Meet the Artist submenu"
                              >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${mobileSubMenuOpen === "artist" ? "rotate-180" : ""}`}
                              />
                              </button>
                            </div>
                            {mobileSubMenuOpen === "artist" && (
                              <div className="ml-4 mt-1 space-y-1">
                                {artistSubItems.map((subItem) => (
                                  <button
                                    key={subItem.id}
                                    onClick={() =>
                                      handleArtistClick(subItem.id)
                                    }
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                  >
                                    {subItem.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }
                      if (item.id === "policy") {
                        return (
                          <div key={item.id}>
                            <div className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-muted-foreground hover:bg-white/5 rounded-lg transition-colors">
                              <button
                                onClick={() => handleInfoClick(item.section)}
                                className="flex items-center gap-2 hover:text-white transition-colors"
                              >
                                <Icon className="w-4 h-4" />
                                {item.label}
                              </button>
                              <button
                                onClick={() => toggleMobileSubMenu("policy")}
                                className="p-1 hover:text-white transition-colors"
                                aria-label="Toggle Policies submenu"
                              >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${mobileSubMenuOpen === "policy" ? "rotate-180" : ""}`}
                              />
                              </button>
                            </div>
                            {mobileSubMenuOpen === "policy" && (
                              <div className="ml-4 mt-1 space-y-1">
                                {policySubItems.map((subItem) => {
                                  const SubIcon = subItem.icon;
                                  return (
                                    <button
                                      key={subItem.id}
                                      onClick={() =>
                                        handlePolicyClick(subItem.id)
                                      }
                                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                    >
                                      <SubIcon className="w-4 h-4" />
                                      {subItem.label}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleInfoClick(item.section)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <Link
                href="/tools"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-muted-foreground hover:text-white transition-colors px-4 py-2"
              >
                Tools
              </Link>
              <Link
                href="/store"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-muted-foreground hover:text-white transition-colors px-4 py-2"
              >
                Store
              </Link>
              <Link
                href="/licenses"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-muted-foreground hover:text-white transition-colors px-4 py-2"
              >
                Licenses
              </Link>
              <Link
                href="/downloads"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-muted-foreground hover:text-white transition-colors px-4 py-2"
              >
                Downloads
              </Link>

              {/* VIP Mobile */}
              <Link
                href="/vip"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-[hsl(var(--gold))] hover:text-[hsl(var(--gold))]/80 transition-colors flex items-center gap-2 px-4 py-2"
              >
                <Crown className="w-5 h-5" />
                VIP
              </Link>

              {/* Account Mobile Menu */}
              {user ? (
                <div className="border-t border-white/10 pt-4 mt-4">
                  <button
                    onClick={() => toggleMobileSubMenu("account")}
                    className="w-full flex items-center justify-between px-4 py-2 text-lg font-medium text-muted-foreground hover:text-white transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Account
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${mobileSubMenuOpen === "account" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileSubMenuOpen === "account" && (
                    <div className="ml-4 mt-2 space-y-1">
                      {accountMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleAccountClick(item.href)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <Icon className="w-4 h-4" />
                            {item.label}
                          </button>
                        );
                      })}
                      <div className="my-2 border-t border-white/10" />
                      <button
                        onClick={() => {
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-t border-white/10 pt-4 mt-4">
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal();
                    }}
                    variant="outline"
                    className="border-white/10 hover:bg-white/5 hover:text-white rounded-full px-6 text-xs font-bold uppercase tracking-widest w-full"
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
