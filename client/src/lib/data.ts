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
  memberOnly: boolean; // New property for member-only beats
}

export const beats: Beat[] = [
  {
    id: "1",
    title: "THUNDERSHOCK",
    artist: "3LIXIR Exclusive",
    bpm: 120,
    key: "Em",
    price: 749.99,
    cover:
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1000&auto=format&fit=crop",
    tags: ["EDM", "House", "Atmospheric"],
    releaseDate: "2026-01-02",
    youtubeUrl: "https://youtu.be/RamMgoQDEso",
    memberOnly: false,
  },
  {
    id: "2",
    title: "EVOLUTION",
    artist: "3LIXIR Exclusive",
    bpm: 100,
    key: "D",
    price: 299.99,
    cover:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop",
    tags: ["Etheral", "Boom Bap", "LOFI"],
    releaseDate: "2026-01-02",
    youtubeUrl: "https://youtu.be/czWOFYrTASo",
    memberOnly: false,
  },
  {
    id: "3",
    title: "CHRONOPHOBIA",
    artist: "3LIXIR Exclusive",
    bpm: 120,
    key: "F",
    price: 149.99,
    cover:
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1000&auto=format&fit=crop",
    tags: ["Synthwave", "LOFI", "EDM"],
    releaseDate: "2026-01-02",
    youtubeUrl: "https://youtu.be/URACea9_w2Q",
    memberOnly: true,
  },
  {
    id: "4",
    title: "KINGCRAFT",
    artist: "3LIXIR Exclusive",
    bpm: 100,
    key: "D#",
    price: 649.99,
    cover:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
    tags: ["Boom Bap", "EDM", "LOFI"],
    releaseDate: "2026-01-03",
    youtubeUrl: "https://youtu.be/9HMeD5Hy_FU",
    memberOnly: false,
  },
  {
    id: "5",
    title: "THE HORYZON",
    artist: "3LIXIR Exclusive",
    bpm: 85,
    key: "Dm",
    price: 449.99,
    cover:
      "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=1000&auto=format&fit=crop",
    tags: ["EDM", "LOFI", "Trap"],
    releaseDate: "2026-01-03",
    youtubeUrl: "https://youtu.be/1FewK3a-3l4",
    memberOnly: false,
  },
  {
    id: "6",
    title: "THE CROP BUMPER",
    artist: "3LIXIR Exclusive",
    bpm: 110,
    key: "Db",
    price: 249.99,
    cover:
      "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop",
    tags: ["LOFI", "Jazz", "Boombap"],
    releaseDate: "2026-01-03",
    youtubeUrl: "https://youtu.be/7WRtUYAtOqk",
    memberOnly: false,
  },
  {
    id: "7",
    title: "Suburbia",
    artist: "3LIXIR Exclusive",
    bpm: 120,
    key: "E",
    price: 1949.99,
    cover:
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1000&auto=format&fit=crop",
    tags: ["EDM", "House", "cinematic"],
    releaseDate: "2026-01-12",
    youtubeUrl: "https://youtu.be/fBU5HTRvtPc",
    memberOnly: false,
  },
  {
    id: "8",
    title: "Arcade",
    artist: "3LIXIR Exclusive",
    bpm: 100,
    key: "D#m",
    price: 249.99,
    cover:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop",
    tags: ["LOFI", "Liminal", "EDM"],
    releaseDate: "2026-01-12",
    youtubeUrl: "https://youtu.be/q1BUr1nkRAo",
    memberOnly: false,
  },
  {
    id: "9",
    title: "Space Cadet ",
    artist: "3LIXIR Exclusive",
    bpm: 120,
    key: "Em",
    price: 149.99,
    cover:
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1000&auto=format&fit=crop",
    tags: ["House", "EDM", "Club"],
    releaseDate: "2026-01-12",
    youtubeUrl: "https://youtu.be/nNExA6NHn5s",
    memberOnly: true,
  },
  {
    id: "10",
    title: "Incidous",
    artist: "3LIXIR Exclusive",
    bpm: 210,
    key: "Em",
    price: 1449.99,
    cover:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
    tags: ["Dubstep", "EDM", "Boom Bap"],
    releaseDate: "2026-01-12",
    youtubeUrl: "https://youtu.be/SNy6AtR55yM",
    memberOnly: true,
  },
  {
    id: "11",
    title: "Vibin'",
    artist: "3LIXIR Exclusive",
    bpm: 120,
    key: "F#",
    price: 1249.99,
    cover:
      "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=1000&auto=format&fit=crop",
    tags: ["EDM", "Techno", "House"],
    releaseDate: "2026-01-12",
    youtubeUrl: "https://youtu.be/9C9JfqOdQNQ",
    memberOnly: false,
  },
  {
    id: "12",
    title: "Shimmering",
    artist: "3LIXIR Exclusive",
    bpm: 150,
    key: "Db",
    price: 1949.99,
    cover:
      "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop",
    tags: ["EDM", "Dubstep", "Techno"],
    releaseDate: "2026-01-12",
    youtubeUrl: "https://youtu.be/9C9JfqOdQNQ",
    memberOnly: false,
  },
];
