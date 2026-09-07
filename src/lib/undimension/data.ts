export type Member = {
  id: string;
  name: string;
  nick: string;
  role: string;
  img: string;
  color: string; // bg-* utility
  highlight: string; // text-* utility
  bio: string;
  tagline: string; // short punchy one-liner for modal
  quote: string; // a personal quote shown in modal
  funFacts: string[]; // 3-4 bullet facts
  element: string; // thematic element (e.g. "FIRE", "VOID")
  joinYear: string;
  stats: { label: string; value: string }[];
  socials: { label: string; href: string }[];
};

export const MEMBERS: Member[] = [
  {
    id: "aldi",
    name: "Raynaldi",
    nick: "Aldi",
    role: "THE FOUNDER",
    img: "/members/opening.webp",
    color: "bg-[#ff4d4d]",
    highlight: "text-[#ff4d4d]",
    bio: "Titik nol dari mana semua orbit dimulai. Sang pendiri yang menyalakan percikan pertama dan tak pernah membiarkannya padam, sejauh apapun anggota lainnya pergi.",
    tagline: "Lit the first spark. Never let it die.",
    quote: "Sejauh apapun kita terbang, gravitasi pertemanan selalu menarik kita kembali ke orbit yang sama.",
    funFacts: [
      "Selalu jadi orang pertama yang online di grup",
      "Pemilik rekor 'paling sering ngajak nongkrong'",
      "Punya playlist spotify untuk tiap mood anggota",
      "Tidak pernah telat — kecuali sengaja",
    ],
    element: "FIRE",
    joinYear: "2020",
    stats: [
      { label: "PWR", value: "99" },
      { label: "AGI", value: "MAX" },
      { label: "INT", value: "???" },
    ],
    socials: [
      { label: "INSTAGRAM", href: "#" },
      { label: "X_TWITTER", href: "#" },
      { label: "DISCORD", href: "#" },
    ],
  },
  {
    id: "razka",
    name: "Muhammad Razka Faudzan",
    nick: "Rembo",
    role: "THE ARCHITECT",
    img: "/members/member-razka.webp",
    color: "bg-[#00e5ff]",
    highlight: "text-[#00e5ff]",
    bio: "Perancang struktur di balik kekacauan. Setiap blueprint yang dia buat ternyata jadi peta untuk petualangan yang tak terduga.",
    tagline: "Designs the chaos others call home.",
    quote: "Setiap struktur yang aku bangun punya pintu rahasia. Itu bukan bug — itu feature.",
    funFacts: [
      "Bisa ngoding sambil denger podcast true crime",
      "Arsip screenshot-nya punya 4000+ file",
      "Selalu bawa charger cadangan ke mana-mana",
      "Menghitung optimasi FPS sebelum beli HP",
    ],
    element: "ICE",
    joinYear: "2020",
    stats: [
      { label: "PWR", value: "88" },
      { label: "AGI", value: "97" },
      { label: "INT", value: "MAX" },
    ],
    socials: [
      { label: "INSTAGRAM", href: "#" },
      { label: "X_TWITTER", href: "#" },
      { label: "DISCORD", href: "#" },
    ],
  },
  {
    id: "reza",
    name: "Reza",
    nick: "Eja",
    role: "THE STRATEGIST",
    img: "/members/member-reza.webp",
    color: "bg-[#d4ff00]",
    highlight: "text-[#d4ff00]",
    bio: "Pikirannya selalu lima langkah di depan. Saat yang lain panik, dia sudah menyiapkan tiga rencana cadangan.",
    tagline: "Five moves ahead before you blink.",
    quote: "Rencana A gagal? Tenang. Aku punya rencana B sampai Z, dan dua di antaranya melibatkan ayam.",
    funFacts: [
      "Punya notes folder khusus berisi 'what-if scenarios'",
      "Menang ranked 1v3 dengan strategi mind-game",
      "Tidur 5 jam tapi terlihat segar (kecurigaan robot)",
      "Pernah invalidate sebuah patch game dalam 30 menit",
    ],
    element: "MIND",
    joinYear: "2020",
    stats: [
      { label: "PWR", value: "75" },
      { label: "AGI", value: "80" },
      { label: "INT", value: "99" },
    ],
    socials: [
      { label: "INSTAGRAM", href: "#" },
      { label: "X_TWITTER", href: "#" },
      { label: "DISCORD", href: "#" },
    ],
  },
  {
    id: "abyan",
    name: "Muhammad Abyan Riyadh Amal",
    nick: "Byan",
    role: "THE VANGUARD",
    img: "/members/member-abyan.webp",
    color: "bg-[#ff00ff]",
    highlight: "text-[#ff00ff]",
    bio: "Barisan depan yang tak pernah mundur. Kalau ada tembok, dia yang duluan nubruk — dan biasanya temboknya yang kalah.",
    tagline: "Runs headfirst. Walls lose.",
    quote: "Pikir dulu itu nanti. Sekarang, charge!",
    funFacts: [
      "Pernah push tower sendirian dan menang",
      "Reaksi dodge creeper: 0.2 detik",
      "Koleksi skin game lebih mahal dari motor",
      "Motto: 'lebih baik regret daripada penasaran'",
    ],
    element: "STORM",
    joinYear: "2020",
    stats: [
      { label: "PWR", value: "MAX" },
      { label: "AGI", value: "85" },
      { label: "INT", value: "70" },
    ],
    socials: [
      { label: "INSTAGRAM", href: "#" },
      { label: "X_TWITTER", href: "#" },
      { label: "DISCORD", href: "#" },
    ],
  },
  {
    id: "rasya",
    name: "Rasya Musyafa Ridwan",
    nick: "Acong",
    role: "THE MAVERICK",
    img: "/members/member-rasya.webp",
    color: "bg-[#ff8c00]",
    highlight: "text-[#ff8c00]",
    bio: "Yang tak pernah bisa ditebak. Strateginya? Tidak ada. Dan itu justru strategi paling mematikan yang pernah ada.",
    tagline: "No plan. That's the plan.",
    quote: "Kalau musuh bisa nebak langkahku, berarti aku belum cukup random.",
    funFacts: [
      "Pernah menang tournament pake pick random",
      "Punya 12 meme yang hanya dimengerti circle ini",
      "Spontan ngajak roadtrip tengah malam — berkali-kali",
      "Quote-nya di-pin di 5 server discord berbeda",
    ],
    element: "CHAOS",
    joinYear: "2020",
    stats: [
      { label: "PWR", value: "82" },
      { label: "AGI", value: "MAX" },
      { label: "INT", value: "??" },
    ],
    socials: [
      { label: "INSTAGRAM", href: "#" },
      { label: "X_TWITTER", href: "#" },
      { label: "DISCORD", href: "#" },
    ],
  },
  {
    id: "rifqi",
    name: "Muhammad Rifqi",
    nick: "Tipki",
    role: "THE ENIGMA",
    img: "/members/member-razka.webp",
    color: "bg-[#00ff00]",
    highlight: "text-[#00ff00]",
    bio: "Misteri berjalan. Kadang hadir, kadang hilang, tapi selalu muncul tepat saat dibutuhkan. Seperti glitch di matriks.",
    tagline: "Here when it matters. Gone otherwise.",
    quote: "Online status-ku tidak mencerminkan realita. Aku selalu ada — di latar.",
    funFacts: [
      "Pernah ghosting 3 bulan lalu balik seolah tak terjadi apa-apa",
      "Punya 6 alias di platform berbeda",
      "Reaction time-nya konstan di bawah 150ms (dicurigai AI)",
      "Hanya muncul di chat saat ada yang butuh di-save",
    ],
    element: "VOID",
    joinYear: "2020",
    stats: [
      { label: "PWR", value: "??" },
      { label: "AGI", value: "??" },
      { label: "INT", value: "??" },
    ],
    socials: [
      { label: "INSTAGRAM", href: "#" },
      { label: "X_TWITTER", href: "#" },
      { label: "DISCORD", href: "#" },
    ],
  },
  {
    id: "dudit",
    name: "Raditya Jundika Putra",
    nick: "Dudit",
    role: "THE CATALYST",
    img: "/members/member-reza.webp",
    color: "bg-[#8a2be2]",
    highlight: "text-[#8a2be2]",
    bio: "Elemen yang mempercepat reaksi. Tanpa dia, semuanya akan berjalan lambat. Dengan dia, semuanya jadi ledakan.",
    tagline: "Accelerator of every reaction.",
    quote: "Aku bukan pemicu masalah. Aku cuma yang bikin semuanya jadi lebih cepat — termasuk kelar-nya.",
    funFacts: [
      "Pernah convert 3 orang jadi main game baru dalam sehari",
      "Menyebar rekomendasi anime lebih cepat dari algoritma",
      "Penemu 'meta baru' yang 80% akurat",
      "Tanggung jawab atas 60% drama server",
    ],
    element: "ENERGY",
    joinYear: "2020",
    stats: [
      { label: "PWR", value: "90" },
      { label: "AGI", value: "88" },
      { label: "INT", value: "92" },
    ],
    socials: [
      { label: "INSTAGRAM", href: "#" },
      { label: "X_TWITTER", href: "#" },
      { label: "DISCORD", href: "#" },
    ],
  },
];

export type HarapanCard = {
  id: string;
  title: string;
  img: string;
  stamp: string;
  quote: string;
  author: string;
  bg: string;
  shadow: string;
  rotate: string;
};

export const HARAPAN: HarapanCard[] = [
  {
    id: "mimpi",
    title: "MIMPI KAMI",
    img: "/gallery/harapan-mimpi.webp",
    stamp: "DREAM_01",
    quote: "Seperti bintang yang menerangi malam — mimpi kami abadi.",
    author: "BY REZA",
    bg: "bg-[#d4ff00]",
    shadow: "shadow-[12px_12px_0_#fff] dark:shadow-[12px_12px_0_#000]",
    rotate: "md:-rotate-3 md:-translate-y-4",
  },
  {
    id: "negeri",
    title: "HARAPAN NEGERI",
    img: "/gallery/harapan-negeri.webp",
    stamp: "VOICE_02",
    quote: "Our voices matter. Suara kami adalah kontribusi nyata.",
    author: "BY RAZKA",
    bg: "bg-[#00e5ff]",
    shadow: "shadow-[12px_12px_0_#fff] dark:shadow-[12px_12px_0_#000]",
    rotate: "md:rotate-2 md:translate-y-8",
  },
  {
    id: "kota",
    title: "HARAPAN KOTA",
    img: "/gallery/harapan-kota.webp",
    stamp: "UNITY_03",
    quote: "In unity, we find strength. Dalam kebersamaan ada kekuatan.",
    author: "BY RASYA",
    bg: "bg-[#ff4d4d]",
    shadow: "shadow-[12px_12px_0_#fff] dark:shadow-[12px_12px_0_#000]",
    rotate: "md:-rotate-1 md:-translate-y-2",
  },
  {
    id: "depan",
    title: "MASA DEPAN",
    img: "/gallery/harapan-depan.webp",
    stamp: "FUTURE_04",
    quote: "Tak ada yang tahu apa yang ada di depan — tapi kami hadapi bersama.",
    author: "BY ALDI",
    bg: "bg-[#ff00ff]",
    shadow: "shadow-[12px_12px_0_#d4ff00]",
    rotate: "md:rotate-4 md:translate-y-12",
  },
];

export type GameSection = {
  id: string;
  sector: string;
  title: string;
  subtitle: string;
  description: string;
  bg: string;
  accent: string;
  carouselTitle: string;
  images: string[];
  reverse?: boolean;
  fontClass?: string;
};

export const GAMES: GameSection[] = [
  {
    id: "minecraft",
    sector: "SEKTOR 01",
    title: "MINECRAFT",
    subtitle: "SURVIVAL OF THE FITTEST",
    description:
      "Dunia tanpa batas, tempat kami membangun dari nol. Satu blok tanah, satu pedang kayu, dan ratusan jam yang dihabiskan menambang diamond. (Dan ya, ada yang selalu mati kena creeper.)",
    bg: "/games/minecraft-bg.webp",
    accent: "#5d9e35",
    carouselTitle: "OUR WORLD",
    images: [
      "/members/member-razka.webp",
      "/members/member-reza.webp",
      "/members/member-abyan.webp",
      "/members/member-rasya.webp",
    ],
  },
  {
    id: "roblox",
    sector: "SEKTOR 02",
    title: "ROBLOX",
    subtitle: "PURE UNADULTERATED CHAOS",
    description:
      "Dari roleplay absurd sampai obby yang bikin emosi. Ini adalah kanvas imajinasi kolektif paling liar kami. Oof!",
    bg: "/games/roblox-bg.webp",
    accent: "#cc0000",
    carouselTitle: "CHAOS INC",
    images: [
      "/members/member-rasya.webp",
      "/members/member-abyan.webp",
      "/members/member-reza.webp",
      "/members/member-razka.webp",
    ],
    reverse: true,
  },
  {
    id: "ml",
    sector: "SEKTOR 03",
    title: "MOBILE LEGENDS",
    subtitle: "PUSH MID OR AFK",
    description:
      "Arena tempur harian. Kami menang bersama, atau kalah dengan gaya (dan saling menyalahkan). Koneksi merah, draft aneh, epic comeback.",
    bg: "/games/ml-bg.webp",
    accent: "#00e5ff",
    carouselTitle: "ARENA LOG",
    images: [
      "/members/member-reza.webp",
      "/members/member-rasya.webp",
      "/members/member-razka.webp",
      "/members/member-abyan.webp",
    ],
  },
  {
    id: "dnd",
    sector: "SEKTOR 04",
    title: "DUNGEONS & DRAGONS",
    subtitle: "NATURAL 20 OR CRITICAL FAIL",
    description:
      "Meja imajinasi tempat kami menjadi pahlawan (atau badut). Dunia yang terbentuk dari kata-kata, kertas, dan dadu 20 sisi. Roll for initiative!",
    bg: "/games/dnd-bg.webp",
    accent: "#ffebd2",
    carouselTitle: "TAVERN TALES",
    images: [
      "/members/member-abyan.webp",
      "/members/member-razka.webp",
      "/members/member-rasya.webp",
      "/members/member-reza.webp",
    ],
    reverse: true,
    fontClass: "font-cinzel",
  },
];

export type GalleryPhoto = {
  id: string;
  img: string;
  title: string;
  date: string;
  rotate: string;
  author: string;
};

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "g1",
    img: "/members/opening.webp",
    title: "VISI AWAL",
    date: "2020",
    rotate: "-rotate-2",
    author: "ALDI",
  },
  {
    id: "g2",
    img: "/members/member-razka.webp",
    title: "MIMPI BINTANG",
    date: "2021",
    rotate: "rotate-2",
    author: "RAZKA",
  },
  {
    id: "g3",
    img: "/members/member-reza.webp",
    title: "IMPIAN NEGERI",
    date: "2022",
    rotate: "-rotate-1",
    author: "REZA",
  },
  {
    id: "g4",
    img: "/members/member-abyan.webp",
    title: "MALAM DI KOTA",
    date: "2022",
    rotate: "rotate-3",
    author: "ABYAN",
  },
  {
    id: "g5",
    img: "/members/member-rasya.webp",
    title: "MALAM PERMAINAN",
    date: "2023",
    rotate: "-rotate-3",
    author: "RASYA",
  },
  {
    id: "g6",
    img: "/gallery/gallery-1.webp",
    title: "GLITCH MOMENT",
    date: "2023",
    rotate: "rotate-1",
    author: "RIFQI",
  },
  {
    id: "g7",
    img: "/gallery/gallery-2.webp",
    title: "CHaos THEORY",
    date: "2024",
    rotate: "-rotate-2",
    author: "DUDIT",
  },
  {
    id: "g8",
    img: "/gallery/gallery-3.webp",
    title: "NIGHT SEQUENCE",
    date: "2024",
    rotate: "rotate-2",
    author: "ALDI",
  },
];

export type TimelineMilestone = {
  id: string;
  year: string;
  season: string;
  title: string;
  description: string;
  color: string;
  icon: string;
};

export const TIMELINE: TimelineMilestone[] = [
  {
    id: "t1",
    year: "2020",
    season: "AUTUMN",
    title: "THE SPARK",
    description:
      "Tujuh anak SMK dipertemukan oleh satu meja kosong di pojok kantin. Obrolan tentang game jadi jembatan, dan tanpa disadari, sebuah orbit terbentuk.",
    color: "#ff4d4d",
    icon: "✦",
  },
  {
    id: "t2",
    year: "2021",
    season: "WINTER",
    title: "FIRST DUNGEON",
    description:
      "Kampanye D&D pertama yang berakhir total party kill di ruang pertama. Bukan kegagalan — itu inisiasi. Dari sini lahir inside joke yang bertahan bertahun-tahun.",
    color: "#00e5ff",
    icon: "🎲",
  },
  {
    id: "t3",
    year: "2022",
    season: "SPRING",
    title: "MINECRAFT ERA",
    description:
      "Server survival private dibangun. Base utama digrebeg creeper 47 kali. Diamond pertama ditambang bareng pada jam 3 pagi. Kenangan itu tak tergantikan.",
    color: "#d4ff00",
    icon: "⛏",
  },
  {
    id: "t4",
    year: "2023",
    season: "SUMMER",
    title: "MOBILE LEGENDS GRIND",
    description:
      "Push rank sampai Mythic dengan komposisi draft penuh chaos. Persahabatan diuji oleh lag, afk, dan saling menyalahkan — tapi tidak pernah patah.",
    color: "#ff00ff",
    icon: "⚔",
  },
  {
    id: "t5",
    year: "2024",
    season: "AUTUMN",
    title: "THE ROBLOX CHAOS",
    description:
      "Era obby absurd dan roleplay yang nggak masuk akal. Oof terdengar ratusan kali sehari. collective imajinasi mencapai puncak kekacauan yang indah.",
    color: "#ff8c00",
    icon: "◉",
  },
  {
    id: "t6",
    year: "2025",
    season: "WINTER",
    title: "DIMENSIONAL DRIFT",
    description:
      "Satu per satu mulai sibuk: kuliah, kerja, hidup. Grup sepi. Tapi setiap ada yang butuh, orbit selalu menarik kita kembali. Gravitasi tidak pernah lemah.",
    color: "#8a2be2",
    icon: "∞",
  },
  {
    id: "t7",
    year: "2026",
    season: "NOW",
    title: "UNDIMENSION MANIFEST",
    description:
      "Web profile ini lahir sebagai konstanta digital. Tempat menyimpan kenangan, harapan, dan bukti bahwa tujuh orbit yang berbeda bisa tetap selaras.",
    color: "#00ff00",
    icon: "★",
  },
];

export const RANDOM_QUOTES: { text: string; author: string }[] = [
  { text: "Chaos is just order you haven't understood yet.", author: "THE COLLECTIVE" },
  { text: "Tujuh orbit, satu gravitasi. Itu cukup.", author: "ALDI" },
  { text: "Kalau kita tidak saling menyalahkan di ranked, kita bukan teman.", author: "REZA" },
  { text: "Build dulu, fikir nanti. Itu filosofi kami.", author: "RAZKA" },
  { text: "Yang penting bunyi 'oof'-nya keras.", author: "RASYA" },
  { text: "Roll for initiative. Roll for friendship. Critical hit.", author: "ABYAN" },
  { text: "Aku ghosting grup 3 bulan, balik dan seolah tak terjadi apa-apa. Itu persahabatan.", author: "RIFQI" },
  { text: "Tanpa drama, hidup terlalu sunyi. Aku sediakan dramanya.", author: "DUDIT" },
];

// Member × Game compatibility matrix (who plays what)
// Values: 3 = main/frequent, 2 = casual, 1 = rare, 0 = no
export const COMPATIBILITY: Record<string, Record<string, number>> = {
  aldi:  { minecraft: 3, roblox: 2, ml: 2, dnd: 1 },
  razka: { minecraft: 3, roblox: 1, ml: 2, dnd: 3 },
  reza:  { minecraft: 2, roblox: 1, ml: 3, dnd: 3 },
  abyan: { minecraft: 2, roblox: 2, ml: 3, dnd: 1 },
  rasya: { minecraft: 3, roblox: 3, ml: 2, dnd: 2 },
  rifqi: { minecraft: 1, roblox: 2, ml: 1, dnd: 2 },
  dudit: { minecraft: 2, roblox: 3, ml: 3, dnd: 2 },
};

export const GAME_LABELS: Record<string, string> = {
  minecraft: "MINECRAFT",
  roblox: "ROBLOX",
  ml: "MOBILE LEGENDS",
  dnd: "D&D",
};
