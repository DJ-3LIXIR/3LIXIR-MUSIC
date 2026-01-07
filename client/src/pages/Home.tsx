import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { ElixirVision } from "@/components/home/ElixirVision";
import { ExploreArtist } from "@/components/home/ExploreArtist";
import { GetStarted } from "@/components/home/GetStarted";
import { BeatList } from "@/components/store/BeatList";
import { Links } from "@/components/home/Links";
import { useState, useEffect } from "react";
export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [autoScrollComplete, setAutoScrollComplete] = useState(false);

  useEffect(() => {
    // Auto-scroll on page load
    const autoScroll = () => {
      const targetScroll = 1600; // Scroll further to reach content
      const duration = 2000; // 2 seconds
      const startTime = Date.now();
      const startScroll = window.scrollY;

      const scroll = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth deceleration
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(progress);

        window.scrollTo(
          0,
          startScroll + (targetScroll - startScroll) * easedProgress,
        );

        if (progress < 1) {
          requestAnimationFrame(scroll);
        } else {
          setAutoScrollComplete(true);
        }
      };

      requestAnimationFrame(scroll);
    };

    // Start auto-scroll after 1.5 second delay
    const timer = setTimeout(autoScroll, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Smoother backsplash transition
  const backsplashProgress = Math.min(scrollY / 600, 1);
  // Smoother navbar fade in
  const navbarProgress = Math.max(0, Math.min((scrollY - 200) / 300, 1));
  // Animation helper - simple and smooth
  const getSectionAnimation = (start, stickyDuration) => {
    const fadeInDuration = 400; // Reduced from 800
    const scrollUpDuration = 200; // Reduced from 400
    const fadeOutDuration = 400; // Reduced from 800
    const fadeInStart = start;
    const stickyStart = fadeInStart + fadeInDuration;
    const scrollUpStart = stickyStart + scrollUpDuration;
    const stickyEnd = stickyStart + stickyDuration;
    const fadeOutEnd = stickyEnd + fadeOutDuration;
    // Calculate opacity
    let opacity = 1;
    if (scrollY < stickyStart) {
      // Fading in
      opacity = Math.max(
        0,
        Math.min((scrollY - fadeInStart) / fadeInDuration, 1),
      );
    } else if (scrollY > stickyEnd) {
      // Fading out
      opacity = Math.max(0, 1 - (scrollY - stickyEnd) / fadeOutDuration);
    }
    // Calculate position
    let style = {};
    if (scrollY < stickyStart) {
      // Fade in phase - absolute positioning moving up
      const progress = Math.max(
        0,
        Math.min((scrollY - fadeInStart) / fadeInDuration, 1),
      );
      style = {
        position: "absolute",
        top: "50%",
        transform: `translateY(calc(-50% + ${(1 - progress) * 50}vh))`,
      };
    } else if (scrollY >= stickyStart && scrollY < scrollUpStart) {
      // Sticky phase (before scroll up) - fixed at center, no movement yet
      style = {
        position: "fixed",
        top: "50%",
        transform: "translateY(-50%)",
      };
    } else if (scrollY >= scrollUpStart && scrollY <= stickyEnd) {
      // Sticky phase (during scroll up) - fixed at center, starts moving up
      const scrollProgress = Math.min(
        (scrollY - scrollUpStart) / (stickyEnd - scrollUpStart),
        1,
      );
      style = {
        position: "fixed",
        top: "50%",
        transform: `translateY(calc(-50% - ${scrollProgress * 20}vh))`,
      };
    } else {
      // Fade out phase - absolute positioning moving up more
      const progress = Math.min((scrollY - stickyEnd) / fadeOutDuration, 1);
      style = {
        position: "absolute",
        top: "50%",
        transform: `translateY(calc(-50% - 20vh - ${progress * 30}vh))`,
      };
    }
    return {
      opacity,
      ...style,
      totalHeight: fadeInDuration + stickyDuration + fadeOutDuration,
    };
  };
  // Initial spacer
  const initialSpacerHeight = 800;
  // Section calculations - keeping sticky durations but faster transitions
  const heroStart = initialSpacerHeight;
  const heroSticky = 1500;
  const heroAnimation = getSectionAnimation(heroStart, heroSticky);
  const heroEnd = heroStart + heroAnimation.totalHeight;
  const elixirStart = heroEnd;
  const elixirSticky = 1500;
  const elixirAnimation = getSectionAnimation(elixirStart, elixirSticky);
  const elixirEnd = elixirStart + elixirAnimation.totalHeight;
  const artistStart = elixirEnd;
  const artistSticky = 1500;
  const artistAnimation = getSectionAnimation(artistStart, artistSticky);
  const artistEnd = artistStart + artistAnimation.totalHeight;
  const startedStart = artistEnd;
  const startedSticky = 1500;
  // Custom animation for GetStarted section
  const getStartedAnimation = () => {
    const fadeInDuration = 400; // Reduced from 800
    const fadeOutDuration = 400; // Reduced from 800
    const fadeInStart = startedStart;
    const stickyStart = fadeInStart + fadeInDuration;
    const stickyEnd = stickyStart + startedSticky;
    const fadeOutEnd = stickyEnd + fadeOutDuration;
    // Calculate opacity
    let opacity = 1;
    if (scrollY < stickyStart) {
      opacity = Math.max(
        0,
        Math.min((scrollY - fadeInStart) / fadeInDuration, 1),
      );
    } else if (scrollY > stickyEnd) {
      opacity = Math.max(0, 1 - (scrollY - stickyEnd) / fadeOutDuration);
    }
    // Calculate position - stays fixed at center throughout
    let style = {};
    if (scrollY < stickyStart) {
      // Fade in phase - slides up to center
      const progress = Math.max(
        0,
        Math.min((scrollY - fadeInStart) / fadeInDuration, 1),
      );
      style = {
        position: "absolute",
        top: "50%",
        transform: `translateY(calc(-50% + ${(1 - progress) * 50}vh))`,
      };
    } else if (scrollY >= stickyStart && scrollY <= stickyEnd) {
      // Sticky phase - stays at center, no upward movement
      style = {
        position: "fixed",
        top: "50%",
        transform: "translateY(-50%)",
      };
    } else {
      // Fade out phase - fades out while staying centered
      style = {
        position: "fixed",
        top: "50%",
        transform: "translateY(-50%)",
      };
    }
    return {
      opacity,
      ...style,
      totalHeight: fadeInDuration + startedSticky + fadeOutDuration,
    };
  };
  const startedAnimation = getStartedAnimation();
  return (
    <div className="relative bg-black min-h-screen">
      {/* Backsplash fade */}
      <div
        className="fixed inset-0 bg-black z-50 pointer-events-none"
        style={{ opacity: 1 - backsplashProgress }}
      />
      <div className="min-h-screen bg-black text-foreground selection:bg-[hsl(var(--gold))] selection:text-black">
        {/* Navbar */}
        <div
          style={{
            opacity: navbarProgress,
            transform: `translateY(${(1 - navbarProgress) * -20}px)`,
          }}
          className="fixed top-0 left-0 right-0 z-40 bg-black"
        >
          <Navbar />
        </div>
        {/* Initial spacer */}
        <div style={{ height: `${initialSpacerHeight}px` }} />
        {/* Hero Section */}
        <div
          style={{ height: `${heroAnimation.totalHeight}px` }}
          className="relative"
        >
          <div
            style={{
              opacity: heroAnimation.opacity,
              position: heroAnimation.position,
              top: heroAnimation.top,
              left: 0,
              right: 0,
              transform: heroAnimation.transform,
            }}
            className="pt-20 bg-black"
          >
            <Hero />
          </div>
        </div>
        {/* ElixirVision Section */}
        <div
          style={{ height: `${elixirAnimation.totalHeight}px` }}
          className="relative"
        >
          <div
            style={{
              opacity: elixirAnimation.opacity,
              position: elixirAnimation.position,
              top: elixirAnimation.top,
              left: 0,
              right: 0,
              transform: elixirAnimation.transform,
            }}
            className="bg-black"
          >
            <ElixirVision />
          </div>
        </div>
        {/* ExploreArtist Section */}
        <div
          style={{ height: `${artistAnimation.totalHeight}px` }}
          className="relative"
        >
          <div
            style={{
              opacity: artistAnimation.opacity,
              position: artistAnimation.position,
              top: artistAnimation.top,
              left: 0,
              right: 0,
              transform: artistAnimation.transform,
            }}
            className="bg-black"
          >
            <ExploreArtist />
          </div>
        </div>
        {/* GetStarted Section */}
        <div
          style={{ height: `${startedAnimation.totalHeight}px` }}
          className="relative"
        >
          <div
            style={{
              opacity: startedAnimation.opacity,
              position: startedAnimation.position,
              top: startedAnimation.top,
              left: 0,
              right: 0,
              transform: startedAnimation.transform,
            }}
            className="bg-black"
          >
            <GetStarted />
          </div>
        </div>
        {/* Final content */}
        <div className="bg-black">
          <BeatList />
          <Links />
        </div>
        <footer className="py-20 border-t border-yellow-500/20 bg-yellow-500/5">
          <div className="container px-6 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <h2 className="text-3xl font-display font-bold tracking-tighter text-yellow-500/80">
                3LIXIR
              </h2>
              <div className="text-sm text-yellow-500/60">
                © 2024 3LIXIR Audio. All rights reserved.
              </div>
              <div className="flex gap-6">
                <a
                  href="#"
                  className="text-yellow-500/60 hover:text-yellow-500 transition-colors text-sm uppercase tracking-wider"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="text-yellow-500/60 hover:text-yellow-500 transition-colors text-sm uppercase tracking-wider"
                >
                  Twitter
                </a>
                <a
                  href="https://www.youtube.com/@DJ3LIXIR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-500/60 hover:text-yellow-500 transition-colors text-sm uppercase tracking-wider"
                >
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
