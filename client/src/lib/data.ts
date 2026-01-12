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
    title: "EVOLUTION",
    artist: "3LIXIR Exclusive",
    bpm: 100,
    key: "D",
    price: 300.0,
    cover:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop",
    tags: ["Etheral", "Boom Bap", "LOFI"],
    releaseDate: "2026-01-02",
    youtubeUrl: "https://youtu.be/czWOFYrTASo", // Replace with actual video ID
  },
  {
    id: "3",
    title: "CHRONOPHOBIA",
    artist: "3LIXIR Exclusive",
    bpm: 120,
    key: "F",
    price: 150.0,
    cover:
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1000&auto=format&fit=crop",
    tags: ["Synthwave", "LOFI", "EDM"],
    releaseDate: "2026-01-02",
    youtubeUrl: "https://youtu.be/URACea9_w2Q", // Replace with actual video ID
  },
  {
    id: "4",
    title: "KINGCRAFT",
    artist: "3LIXIR Exclusive",
    bpm: 100,
    key: "D#",
    price: 650.0,
    cover:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
    tags: ["Boom Bap", "EDM", "LOFI"],
    releaseDate: "2026-01-03",
    youtubeUrl: "https://youtu.be/9HMeD5Hy_FU", // Replace with actual video ID
  },
  {
    id: "5",
    title: "THE HORYZON",
    artist: "3LIXIR Exclusive",
    bpm: 85,
    key: "Dm",
    price: 450.0,
    cover:
      "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=1000&auto=format&fit=crop",
    tags: ["EDM", "LOFI", "Boom Bap"],
    releaseDate: "2026-01-03",
    youtubeUrl: "https://youtu.be/1FewK3a-3l4", // Replace with actual video ID
  },
  {
    id: "6",
    title: "THE CROP BUMPER",
    artist: "3LIXIR Exclusive",
    bpm: 110,
    key: "Db",
    price: 250.0,
    cover:
      "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop",
    tags: ["LOFI", "Jazz", "Boombap"],
    releaseDate: "2026-01-03",
    youtubeUrl: "https://youtu.be/7WRtUYAtOqk", // Replace with actual video ID
  },
];
