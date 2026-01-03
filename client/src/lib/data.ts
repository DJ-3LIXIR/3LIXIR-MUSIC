export interface Beat {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  price: number;
  cover: string;
  tags: string[];
  releaseDate: string;
  youtubeUrl?: string; // YouTube video URL
  audioUrl?: string; // Placeholder for now
}

export const beats: Beat[] = [
  {
    id: "1",
    title: "THUNDERSHOCK",
    artist: "3LIXIR Exclusive",
    bpm: 120,
    key: "Em",
    price: 750.0,
    cover:
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1000&auto=format&fit=crop",
    tags: ["EDM", "House", "Atmospheric"],
    releaseDate: "2026-01-02",
    youtubeUrl: "https://youtu.be/RamMgoQDEso",
  },
  {
    id: "2",
    title: "CHAMPAGNE",
    artist: "3LIXIR Exclusive",
    bpm: 95,
    key: "Cm",
    price: 149.0,
    cover:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop",
    tags: ["R&B", "Smooth", "Luxury"],
    releaseDate: "2025-12-28",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual video ID
  },
  {
    id: "3",
    title: "NEON DEMONS",
    artist: "3LIXIR Exclusive",
    bpm: 128,
    key: "Am",
    price: 249.0,
    cover:
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1000&auto=format&fit=crop",
    tags: ["Synthwave", "Cyberpunk", "EDM"],
    releaseDate: "2025-12-20",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual video ID
  },
  {
    id: "4",
    title: "PENTHOUSE",
    artist: "3LIXIR Exclusive",
    bpm: 110,
    key: "Gm",
    price: 179.0,
    cover:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
    tags: ["Boom Bap", "Soulful", "Classic"],
    releaseDate: "2025-12-15",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual video ID
  },
  {
    id: "5",
    title: "VOID WALKER",
    artist: "3LIXIR Exclusive",
    bpm: 150,
    key: "Dm",
    price: 199.0,
    cover:
      "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=1000&auto=format&fit=crop",
    tags: ["Trap", "Aggressive", "Dark"],
    releaseDate: "2025-12-10",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual video ID
  },
  {
    id: "6",
    title: "GOLDEN HOUR",
    artist: "3LIXIR Exclusive",
    bpm: 88,
    key: "Eb",
    price: 129.0,
    cover:
      "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop",
    tags: ["Lo-Fi", "Chill", "Vibes"],
    releaseDate: "2025-12-05",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual video ID
  },
];
