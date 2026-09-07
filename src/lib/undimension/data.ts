export type Member = {
  id: string;
  name: string;
  nick: string;
  role: string;
  img: string;
  color: string; // bg-* utility
  highlight: string; // text-* utility
  bio: string;
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
