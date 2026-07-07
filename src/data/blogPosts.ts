export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: number;
  excerpt: string;
  body: string[];
};

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "understanding-your-kundli",
    title: "Understanding Your Kundli: A Beginner's Complete Guide",
    category: "Kundli",
    date: "May 20, 2025",
    readTime: 6,
    excerpt:
      "Your Kundli is a cosmic snapshot of the sky at the moment you were born. Every house, planet, and sign placement tells a chapter of your life story — here's how to start reading it.",
    body: [
      "A Kundli, or Janma Kundli, is a chart of the sky at the precise moment of your birth. It is drawn for a specific time and place because the planets shift roughly one degree every four minutes — even twins born ten minutes apart can have meaningfully different charts.",
      "The chart is divided into twelve houses, each representing a domain of life: self, wealth, communication, home, creativity, health, partnerships, transformation, beliefs, career, networks and release. The planets sitting in those houses describe how that area of your life tends to unfold.",
      "The first thing a good astrologer looks at is the Lagna or rising sign. This is the house that was on the eastern horizon at the time of your birth and it sets the entire orientation of your chart. From the Lagna you then read planet placements, aspects between planets, and the running dasha — the planetary period currently active in your life.",
      "Reading a Kundli is not about predicting a fixed future. It is closer to reading a weather pattern: you can see which seasons are likely to bring rain, which years are likely to be steady, and how to prepare for either. The chart describes tendencies, timings and themes — your choices still shape how they actually play out.",
      "If you are just starting out, focus on three things first: your rising sign, the placement of the Moon (which describes your emotional life), and the current Maha Dasha. Those three together already explain a surprising amount of how the last few years of your life have felt.",
    ],
  },
  {
    id: 2,
    slug: "numerology-life-path-number",
    title: "Your Life Path Number and What It Reveals",
    category: "Numerology",
    date: "May 14, 2025",
    readTime: 5,
    excerpt:
      "Every person carries one number, derived from their birth date, that quietly shapes the broad themes of their life. Here is how to calculate yours and what it actually means.",
    body: [
      "Your Life Path Number is calculated by adding every digit of your full date of birth and reducing the total to a single digit. For example, 14 August 1992 becomes 1+4+8+1+9+9+2 = 34, then 3+4 = 7. The Life Path Number is 7.",
      "Each number from 1 to 9 has a recognisable character. 1 is initiation and independence. 2 is partnership and patience. 3 is expression and creativity. 4 is structure and persistence. 5 is movement and adaptability. 6 is care and responsibility. 7 is depth and analysis. 8 is power and material achievement. 9 is compassion and completion.",
      "Master numbers — 11, 22 and 33 — are not reduced further. They carry a heightened intensity of 2, 4 and 6 respectively, and usually come with both higher potential and a heavier load to carry.",
      "Where numerology is most useful is in noticing the friction in your life. A 4 trying to live like a 5 will feel constantly destabilised. A 7 forced into a fast, social profession will feel drained. Knowing your number does not change your circumstances, but it changes how you choose your environment.",
    ],
  },
  {
    id: 3,
    slug: "vedic-remedies-career-growth",
    title: "5 Powerful Vedic Remedies for Career Growth",
    category: "Remedies",
    date: "May 8, 2025",
    readTime: 4,
    excerpt:
      "Vedic astrology offers practical remedies to ease planetary blocks on your career. These five are the most effective and the easiest to sustain.",
    body: [
      "1. Strengthen the Sun. The Sun governs your authority and visibility at work. Offering water to the rising Sun every morning, taking a moment to face east, is a deceptively simple practice that has worked for centuries.",
      "2. Respect Saturn. Saturn rules discipline, structure and the slow grind of career-building. Avoiding shortcuts, doing your work cleanly even when no one is watching, and donating black sesame or iron on Saturdays are traditional ways to keep Saturn favourable.",
      "3. Chant the Gayatri Mantra. Eleven repetitions every morning, ideally before sunrise, clears mental fog and sharpens decision-making — qualities your career compounds on.",
      "4. Keep Wednesday clean. Mercury governs communication, contracts and skill. On Wednesdays, eat lightly, avoid major arguments, and review your work carefully. Small Wednesday-day discipline goes a long way.",
      "5. Donate where it counts. Once a month, donate food, books or money to a cause that genuinely improves someone's livelihood. Career karma is a direct beneficiary of livelihood-related charity.",
      "These are not magic. They are patterns of behaviour that, when held steadily for six to twelve months, gently shift how planetary energies express through your work life.",
    ],
  },
  {
    id: 4,
    slug: "nadi-astrology-explained",
    title: "What is Nadi Astrology? Ancient Science Explained",
    category: "Nadi",
    date: "April 30, 2025",
    readTime: 7,
    excerpt:
      "Nadi Astrology is one of the most precise branches of Indian astrology, rooted in palm leaf manuscripts from Tamil Nadu. Here is what makes it different and why it works.",
    body: [
      "Nadi Astrology is believed to have been authored by ancient seers — Agastya, Bhrigu, Kaushika and others — who recorded the lives of millions of individuals on palm leaves, indexed by thumbprint. A genuine Nadi reading involves locating your specific palm leaf, which contains the broad outline of your past, present and future.",
      "Compared with standard Vedic astrology, Nadi readings are unusually specific. They name parents, siblings, partners, professions and timing of major events. The system that supports this precision is structured around planetary positions read through Nadi amsa — finer divisions of each zodiac sign than most other branches use.",
      "Modern Nadi practice, especially outside Tamil Nadu, often refers to a derived form: applying Nadi principles to a standard birth chart. This is what most online Nadi readings actually are, including the educational reports offered here. They are not the original palm-leaf reading, but they do bring Nadi-style precision to a regular Kundli.",
      "If you are evaluating a Nadi astrologer, the marker of quality is specificity without theatrics. Vague spiritual language is easy. Naming the year a relationship will solidify, or the kind of work you will end up in, is hard. Look for the latter.",
    ],
  },
  {
    id: 5,
    slug: "marriage-timing-astrology",
    title: "How Astrology Predicts the Right Time to Marry",
    category: "Relationship",
    date: "April 22, 2025",
    readTime: 5,
    excerpt:
      "The seventh house, Venus and Jupiter together describe when marriage is likely to happen. Reading them well takes nuance — here is how it works.",
    body: [
      "Marriage timing in Vedic astrology rests primarily on the seventh house (partnership), Venus (love and harmony for men, marriage indicator for both), and Jupiter (commitment and expansion, marriage indicator for women).",
      "The current dasha is the next layer. A favourable seventh-house lord period, especially combined with a Venus or Jupiter sub-period, often coincides with marriage discussions becoming serious.",
      "Then comes transit. The transit of Jupiter through your seventh house, or its aspect on your seventh-house lord, is one of the most reliable triggers for marriage in the next 12 to 18 months.",
      "What good astrologers avoid is a single fixed date. Marriage is the joint outcome of two charts, family dynamics, and personal choice. What a chart can honestly offer is a small set of windows — usually two or three across a few years — when the conditions are most supportive.",
    ],
  },
  {
    id: 6,
    slug: "gemstones-birth-chart",
    title: "The Right Gemstone for Your Birth Chart",
    category: "Remedies",
    date: "April 15, 2025",
    readTime: 4,
    excerpt:
      "Not every gemstone is right for every person. Wearing the wrong stone can drain you. Here is how to know which gemstone your chart actually calls for.",
    body: [
      "Gemstones in Vedic astrology work by amplifying the energy of the planet they are associated with — ruby for the Sun, pearl for the Moon, red coral for Mars, emerald for Mercury, yellow sapphire for Jupiter, diamond for Venus, blue sapphire for Saturn.",
      "Amplification cuts both ways. Strengthening a planet that is already creating trouble in your chart can intensify the problem. This is why a chart-specific recommendation matters more than buying the gemstone of your zodiac sign.",
      "The right stone is usually for a planet that is well-placed but weak, or for the lord of a house you want to support. A trained astrologer reads the strength of each planet, the houses they rule for you specifically, and the current dasha before recommending anything.",
      "If you are unsure, the safest starting point is a chart reading first, then a gemstone recommendation. Buying a stone before knowing your chart is the most common — and most expensive — mistake people make with Vedic remedies.",
    ],
  },
];
