import kundli from "@/assets/services/kundli.jpg";
import career from "@/assets/services/career.jpg";
import health from "@/assets/services/health.jpg";
import love from "@/assets/services/love.jpg";
import gemstone from "@/assets/services/gemstone.jpg";
import question from "@/assets/services/question.jpg";
import cards from "@/assets/services/cards.jpg";
import nadiEdu from "@/assets/services/nadi-education.jpg";
import remedies from "@/assets/services/remedies.jpg";

export type Service = {
  id: number;
  slug: string;
  name: string;
  price: number;
  category: ServiceCategory;
  tagline: string;
  desc: string;
  delivery: string;
  image: string;
  covers: string[];
  receive: string[];
  faqs: { q: string; a: string }[];
};

export type ServiceCategory =
  | "personal"
  | "professional"
  | "relationship"
  | "remedies"
  | "health"
  | "specialized"
  | "education";

export const categoryLabel: Record<ServiceCategory, string> = {
  personal: "Personal",
  professional: "Career",
  relationship: "Relationship",
  remedies: "Remedies",
  health: "Health",
  specialized: "Specialised",
  education: "Education",
};

export const categoryColors: Record<ServiceCategory, { bg: string; text: string }> = {
  personal: { bg: "bg-saffron-ghost", text: "text-saffron-hover" },
  professional: { bg: "bg-[#E8EAF6]", text: "text-indigo-deep" },
  relationship: { bg: "bg-[#FCE4EC]", text: "text-[#AD1457]" },
  remedies: { bg: "bg-[#E8F5E9]", text: "text-[#2D6A4F]" },
  health: { bg: "bg-[#FFF3E0]", text: "text-[#A85C00]" },
  specialized: { bg: "bg-parchment", text: "text-indigo-deep" },
  education: { bg: "bg-[#E1F5FE]", text: "text-[#0277BD]" },
};

const baseFaqs = (delivery: string) => [
  {
    q: "How do I receive my report?",
    a: `After payment we prepare your reading personally and email a detailed PDF within ${delivery}. We never send templated or auto-generated reports.`,
  },
  {
    q: "What details do I need to provide?",
    a: "Your full name as on documents, date of birth, exact birth time (from hospital records if possible), and place of birth. The more precise the time, the more precise the reading.",
  },
  {
    q: "Can I ask follow-up questions?",
    a: "Yes. Every consultation includes one round of follow-up clarification over WhatsApp or email within 14 days of delivery.",
  },
  {
    q: "Is my information kept private?",
    a: "Always. Your birth details and reading are confidential and never shared, sold, or used in marketing.",
  },
];

export const services: Service[] = [
  {
    id: 1,
    slug: "kundli-report",
    name: "Kundli Report",
    price: 499,
    category: "personal",
    tagline: "Your complete birth chart, decoded",
    desc: "A full Vedic birth chart reading covering your life path, career arc, relationships, finances and key timings — written personally for you, not generated.",
    delivery: "3–5 business days",
    image: kundli,
    covers: [
      "Planetary placements across all twelve houses",
      "Dasha periods — what is active now and what's coming next",
      "Career, finance and relationship outlook",
      "Key strengths and areas to handle with care",
      "Specific timings for major life decisions",
    ],
    receive: [
      "A detailed 12–15 page PDF report by email",
      "Your full Vedic birth chart (Lagna, Navamsa, Chalit)",
      "Personalised remedy guidance — simple and practical",
      "One round of follow-up over WhatsApp",
    ],
    faqs: baseFaqs("3–5 business days"),
  },
  {
    id: 2,
    slug: "career-report",
    name: "Career Report",
    price: 151,
    category: "professional",
    tagline: "Find work that finally fits",
    desc: "Discover the profession your chart actually supports, the right time for a switch, and how to navigate the next two years of your work life.",
    delivery: "2–3 business days",
    image: career,
    covers: [
      "Career fields aligned with your tenth house and planetary strengths",
      "Best windows for job changes, promotions and new ventures",
      "Whether business or service suits you better",
      "Obstacles your chart is currently working through",
    ],
    receive: [
      "A 6–8 page career-focused PDF report",
      "Specific industries and roles to consider",
      "Timing guidance for the next 24 months",
      "Practical remedies to ease career friction",
    ],
    faqs: baseFaqs("2–3 business days"),
  },
  {
    id: 3,
    slug: "health-report",
    name: "Health Report",
    price: 151,
    category: "health",
    tagline: "Listen to what your chart says about your body",
    desc: "Astrological patterns that reveal long-term health tendencies and the lifestyle adjustments your chart is asking you to make.",
    delivery: "2–3 business days",
    image: health,
    covers: [
      "Health-sensitive houses and planetary influences in your chart",
      "Areas of the body that need extra care",
      "Periods that may bring more strain",
      "Preventive lifestyle and dietary guidance",
    ],
    receive: [
      "A 6–8 page health-focused PDF report",
      "Long-term wellness recommendations",
      "Ayurvedic and Vedic remedies suited to your chart",
      "Follow-up clarification over WhatsApp",
    ],
    faqs: baseFaqs("2–3 business days"),
  },
  {
    id: 4,
    slug: "love-marriage",
    name: "Love & Marriage Compatibility",
    price: 151,
    category: "relationship",
    tagline: "Honest answers about your relationship",
    desc: "A complete horoscope matching for love or arranged marriage — Guna milan plus a deeper look at emotional, financial and karmic compatibility.",
    delivery: "2–3 business days",
    image: love,
    covers: [
      "Guna milan score and what the points actually mean",
      "Mangal dosha check for both partners",
      "Emotional, mental and financial compatibility",
      "Likely friction points and how to handle them",
      "Most auspicious windows for marriage",
    ],
    receive: [
      "A detailed compatibility PDF (both charts side by side)",
      "Honest, balanced verdict — not just a score",
      "Remedies for any doshas found",
      "Follow-up clarification over WhatsApp",
    ],
    faqs: baseFaqs("2–3 business days"),
  },
  {
    id: 5,
    slug: "gemstone-report",
    name: "Gemstone Report",
    price: 151,
    category: "remedies",
    tagline: "The exact stone your chart actually needs",
    desc: "The wrong gemstone can hurt more than help. Find the precise stone, weight, metal and finger that your birth chart genuinely supports.",
    delivery: "2–3 business days",
    image: gemstone,
    covers: [
      "Which planet in your chart needs strengthening",
      "Primary gemstone and a budget-friendly substitute",
      "Recommended weight in carats and metal",
      "Finger, day and procedure for wearing it",
    ],
    receive: [
      "A 4–6 page gemstone recommendation PDF",
      "Sanctified mantra to energise the stone",
      "Stones to avoid for your chart",
      "Follow-up clarification over WhatsApp",
    ],
    faqs: baseFaqs("2–3 business days"),
  },
  {
    id: 6,
    slug: "ask-question",
    name: "Ask a Question",
    price: 151,
    category: "specialized",
    tagline: "One specific question, one honest answer",
    desc: "Have one focused question? Submit it with your birth details and receive a precise, personalised astrological answer within two days.",
    delivery: "1–2 business days",
    image: question,
    covers: [
      "Any one specific question on career, marriage, health, finance, study, travel or family",
      "Direct yes/no/timing answer wherever the chart allows",
      "Reasoning from your dasha and transit chart",
      "Optional remedy if one is genuinely needed",
    ],
    receive: [
      "A focused 2–3 page answer document",
      "Direct response to your specific question",
      "One round of follow-up clarification",
    ],
    faqs: baseFaqs("1–2 business days"),
  },
  {
    id: 7,
    slug: "vedic-cards",
    name: "Vedic Cards Reading",
    price: 151,
    category: "specialized",
    tagline: "Insight into the next six months",
    desc: "An ancient Vedic card reading focused on your present situation and the near future — a quick, intuitive complement to a full Kundli.",
    delivery: "1–2 business days",
    image: cards,
    covers: [
      "Your current emotional and situational landscape",
      "Themes likely to unfold over the next six months",
      "What to embrace and what to release",
      "One actionable guidance card per life area",
    ],
    receive: [
      "A 3–4 page card-reading PDF",
      "Image of your spread with interpretations",
      "Follow-up clarification over WhatsApp",
    ],
    faqs: baseFaqs("1–2 business days"),
  },
  {
    id: 8,
    slug: "nadi-education",
    name: "Nadi Astrology Education Report",
    price: 151,
    category: "education",
    tagline: "Learn Nadi through your own chart",
    desc: "An accessible introduction to the principles of Nadi Astrology, explained step by step using the planets, houses and patterns in your own birth chart.",
    delivery: "3–5 business days",
    image: nadiEdu,
    covers: [
      "Foundations of Nadi Astrology and how it differs from Vedic",
      "How to read your own chart at a beginner level",
      "Worked examples drawn from your specific chart",
      "Recommended next steps if you want to study further",
    ],
    receive: [
      "A 10–12 page educational PDF tailored to your chart",
      "Diagrams and worked examples",
      "Resource list for further study",
    ],
    faqs: baseFaqs("3–5 business days"),
  },
  {
    id: 9,
    slug: "nadi-remedies",
    name: "Nadi Astrology Remedies",
    price: 151,
    category: "remedies",
    tagline: "Targeted remedies for stubborn blocks",
    desc: "If a specific area of life keeps stalling — work, marriage, money, health — these are the Nadi remedies precisely matched to the planetary pattern blocking you.",
    delivery: "2–3 business days",
    image: remedies,
    covers: [
      "Which planet/house pattern is creating the block",
      "Mantras, donations and ritual remedies suited to your chart",
      "Simple daily practices you can actually sustain",
      "Timing for performing each remedy",
    ],
    receive: [
      "A 5–7 page remedy PDF tailored to your concern",
      "Step-by-step instructions for each remedy",
      "Follow-up clarification over WhatsApp",
    ],
    faqs: baseFaqs("2–3 business days"),
  },
];
