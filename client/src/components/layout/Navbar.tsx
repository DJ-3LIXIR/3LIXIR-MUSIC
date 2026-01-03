import { Link, useLocation } from "wouter";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { totalItems } = useCart();
  const { openAuthModal } = useAuth();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link
              href="/"
              className="text-2xl font-display font-bold tracking-tighter hover:opacity-80 transition-opacity"
            >
              3LIXIR
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/info"
                className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
              >
                Info
              </Link>
              <Link
                href="/beats"
                className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
              >
                Beats
              </Link>
              <Link
                href="/licenses"
                className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
              >
                Licenses
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-muted-foreground hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <div className="relative group">
              <button
                onClick={() => setLocation("/shop")}
                className="text-muted-foreground hover:text-white transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[hsl(var(--gold))] text-black text-[10px] font-bold flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              </button>
            </div>
            <div className="hidden md:block">
              <Button
                onClick={openAuthModal}
                variant="outline"
                className="border-white/10 hover:bg-white/5 hover:text-white rounded-full px-6 text-xs font-bold uppercase tracking-widest"
              >
                Sign In
              </Button>
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
          <div className="fixed top-20 left-0 right-0 bg-background border-b border-white/5 backdrop-blur-xl">
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
          </div>
        </div>
      )}
    </>
  );
}
