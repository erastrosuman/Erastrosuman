export type Testimonial = {
  id: number;
  name: string;
  label: string;
  rating: number;
  text: string;
};

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Gauresh",
    label: "Verified Client · Bengaluru",
    rating: 5,
    text: "I took a consultation last year for a career switch I had been dreading. Sudhansu ji's reading was specific — the right window, the right kind of role, even the friction I'd face in month two. All of it played out exactly. I send everyone in my family to him now.",
  },
  {
    id: 2,
    name: "Viny",
    label: "Verified Client · Pune",
    rating: 5,
    text: "He picked up things about my past that no one in my life knew. That's when I stopped doubting and started listening. Six months in, the things he said would settle have settled. Quietly, calmly, exactly as he said.",
  },
  {
    id: 3,
    name: "Nandu Dixit",
    label: "Verified Client · Indore",
    rating: 5,
    text: "What I appreciate is how grounded he is. No fear, no big promises, no expensive stones to buy. Just clear reasoning and small, doable remedies. My work life turned around within four months of following his guidance.",
  },
  {
    id: 4,
    name: "Animesh",
    label: "Verified Client · Delhi NCR",
    rating: 5,
    text: "Honest and balanced. He told me what was working in my chart and what was not, without sugar-coating either. I left the session feeling clearer, not anxious. That's rare with astrologers in my experience.",
  },
  {
    id: 5,
    name: "Adhiti Desai",
    label: "Verified Client · Mumbai",
    rating: 5,
    text: "I came in with a marriage decision and walked away with much more — a real understanding of my own chart. Three years later I still go back to his report. The accuracy and the warmth are both real.",
  },
];
