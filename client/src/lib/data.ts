export interface Beat {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  price: number;
  cover: string;
  tags: string[];
  audioUrl?: string; // Placeholder for now
}

export const beats: Beat[] = [
  {
    id: "1",
    title: "MIDNIGHT TOKYO",
    artist: "3LIXR Exclusive",
    bpm: 140,
    key: "F#m",
    price: 199.00,
    cover: "https://images.unsplash.com/photo-1514525253440-b393452e233e?q=80&w=1000&auto=format&fit=crop",
    tags: ["Trap", "Dark", "Atmospheric"]
  },
  {
    id: "2",
    title: "CHAMPAGNE",
    artist: "3LIXR Exclusive",
    bpm: 95,
    key: "Cm",
    price: 149.00,
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop",
    tags: ["R&B", "Smooth", "Luxury"]
  },
  {
    id: "3",
    title: "NEON DEMONS",
    artist: "3LIXR Exclusive",
    bpm: 128,
    key: "Am",
    price: 249.00,
    cover: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1000&auto=format&fit=crop",
    tags: ["Synthwave", "Cyberpunk", "Hard"]
  },
  {
    id: "4",
    title: "PENTHOUSE",
    artist: "3LIXR Exclusive",
    bpm: 110,
    key: "Gm",
    price: 179.00,
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
    tags: ["Hip Hop", "Soulful", "Classic"]
  },
  {
    id: "5",
    title: "VOID WALKER",
    artist: "3LIXR Exclusive",
    bpm: 150,
    key: "Dm",
    price: 199.00,
    cover: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=1000&auto=format&fit=crop",
    tags: ["Drill", "Aggressive", "Dark"]
  },
  {
    id: "6",
    title: "GOLDEN HOUR",
    artist: "3LIXR Exclusive",
    bpm: 88,
    key: "Eb",
    price: 129.00,
    cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop",
    tags: ["Lo-Fi", "Chill", "Vibes"]
  }
];
