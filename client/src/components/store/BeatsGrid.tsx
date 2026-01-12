import { beats } from "@/lib/data";
import { BeatCard } from "./BeatCard";
import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { useLocation } from "wouter";

export function BeatsGrid() {
  const [sortBy, setSortBy] = useState("newest");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [location] = useLocation();

  // READ URL PARAMETERS
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSearch = params.get("search");
    const urlGenre = params.get("genre");

    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
    if (urlGenre) {
      setSelectedGenre(urlGenre);
    }
  }, [location]);

  // Filter and sort beats
  const filteredAndSortedBeats = useMemo(() => {
    // First filter by search query
    let filtered = beats.filter((beat) => {
      const query = searchQuery.toLowerCase();
      return (
        beat.title.toLowerCase().includes(query) ||
        beat.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        beat.bpm.toString().includes(query) ||
        beat.key?.toLowerCase().includes(query)
      );
    });

    // Then filter by genre
    if (selectedGenre !== "All") {
      filtered = filtered.filter((beat) => beat.tags.includes(selectedGenre));
    }

    // Then sort
    switch (sortBy) {
      case "newest":
        return filtered.sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime(),
        );
      case "oldest":
        return filtered.sort(
          (a, b) =>
            new Date(a.releaseDate).getTime() -
            new Date(b.releaseDate).getTime(),
        );
      case "price-low":
        return filtered.sort((a, b) => a.price - b.price);
      case "price-high":
        return filtered.sort((a, b) => b.price - a.price);
      case "bpm-low":
        return filtered.sort((a, b) => a.bpm - b.bpm);
      case "bpm-high":
        return filtered.sort((a, b) => b.bpm - a.bpm);
      default:
        return filtered;
    }
  }, [sortBy, selectedGenre, searchQuery]);

  return (
    <section className="py-24 bg-background relative">
      <div className="container px-6 mx-auto">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-6">
            {/* Left side - Title and description */}
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                EXPLORE <span className="text-[hsl(var(--gold))]">CATALOG</span>
              </h2>
              <p className="text-muted-foreground max-w-md">
                Explore our full catalog of premium instrumentals hand crafted
                by DJ 3LIXIR to inspire your next hit.
              </p>
            </div>

            {/* Right side - Search bar and genre filters stacked */}
            <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[500px]">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search beats by name, genre, mood, BPM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[hsl(var(--gold))]/50 focus:ring-2 focus:ring-[hsl(var(--gold))]/20 transition-all"
                />
              </div>

              {/* Genre filters */}
              <div className="flex gap-4 flex-wrap justify-end">
                {["All", "Trap", "R&B", "EDM", "Lofi", "Boom Bap"].map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedGenre(filter)}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                        selectedGenre === filter
                          ? "bg-white text-black"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {filter}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-full bg-white/5 text-white text-xs font-bold uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]"
            >
              <option value="newest" className="bg-black">
                Newest
              </option>
              <option value="oldest" className="bg-black">
                Oldest
              </option>
              <option value="price-low" className="bg-black">
                Price: Low to High
              </option>
              <option value="price-high" className="bg-black">
                Price: High to Low
              </option>
              <option value="bpm-low" className="bg-black">
                BPM: Low to High
              </option>
              <option value="bpm-high" className="bg-black">
                BPM: High to Low
              </option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-muted-foreground text-sm">
          Showing {filteredAndSortedBeats.length} of {beats.length} beats
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedBeats.map((beat, index) => (
            <motion.div
              key={beat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <BeatCard beat={beat} />
            </motion.div>
          ))}
        </div>

        {/* No results message */}
        {filteredAndSortedBeats.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No beats found matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
