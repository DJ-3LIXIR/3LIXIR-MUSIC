import { Link, useLocation } from "wouter";
import { ShoppingBag, Search, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { totalItems } = useCart();
  const { user, openAuthModal, signOut } = useAuth();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link
              href="/"
              className="text-2xl font-display font-bold tracking-tighter hover:opacity-80 transition-opacity"
            >
              3LIXIR
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/info"
                className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
              >
                Info
              </Link>
              <span className="text-white/20">|</span>
              <Link
                href="/beats"
                className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
              >
                Beats
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
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-muted-foreground hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
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
            <div className="hidden md:block">
              {user ? (
                <Button
                  onClick={() => setLocation("/profile")}
                  variant="outline"
                  className="border-white/10 hover:bg-white/5 hover:text-white rounded-full px-6 text-xs font-bold uppercase tracking-widest"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              ) : (
                <Button
                  onClick={openAuthModal}
                  variant="outline"
                  className="border-white/10 hover:bg-white/5 hover:text-white rounded-full px-6 text-xs font-bold uppercase tracking-widest"
                >
                  Sign In
                </Button>
              )}
            </div>
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
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-20 left-0 right-0 bg-black border-b border-white/5 backdrop-blur-xl">
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
              <Link
                href="/info"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-muted-foreground hover:text-white transition-colors"
              >
                Info
              </Link>
              <Link
                href="/beats"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-muted-foreground hover:text-white transition-colors"
              >
                Beats
              </Link>
              <Link
                href="/licenses"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-muted-foreground hover:text-white transition-colors"
              >
                Licenses
              </Link>
              <Link
                href="/downloads"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-muted-foreground hover:text-white transition-colors"
              >
                Downloads
              </Link>
              {user ? (
                <>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setLocation("/profile");
                    }}
                    variant="outline"
                    className="border-white/10 hover:bg-white/5 hover:text-white rounded-full px-6 text-xs font-bold uppercase tracking-widest w-full"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    variant="outline"
                    className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400 rounded-full px-6 text-xs font-bold uppercase tracking-widest w-full"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
