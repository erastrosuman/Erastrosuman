export interface PlanetRef {
  name: { hi: string; en: string };
  single: { hi: string; en: string };
  double: { hi: string; en: string };
  health: { hi: string; en: string };
  colors: { hi: string; en: string };
  friends: string;
  enemy: string;
}

export const PLANET_MAP: Record<number, { cellClass: string; bg: string; text: string; border: string }> = {
  1: { cellClass: "bg-amber-100 border-amber-400 text-amber-900", bg: "#fef08a", text: "#78350f", border: "#f59e0b" },
  2: { cellClass: "bg-slate-100 border-slate-300 text-slate-800", bg: "#edf2f7", text: "#1e293b", border: "#cbd5e1" },
  3: { cellClass: "bg-yellow-100 border-yellow-400 text-yellow-900", bg: "#fefcbf", text: "#713f12", border: "#eab308" },
  4: { cellClass: "bg-sky-100 border-sky-400 text-sky-900", bg: "#bee3f8", text: "#0369a1", border: "#38bdf8" },
  5: { cellClass: "bg-emerald-100 border-emerald-400 text-emerald-900", bg: "#c6f6d5", text: "#065f46", border: "#10b981" },
  6: { cellClass: "bg-pink-100 border-pink-400 text-pink-900", bg: "#fed7e2", text: "#831843", border: "#f472b6" },
  7: { cellClass: "bg-purple-100 border-purple-400 text-purple-900", bg: "#e2e8f0", text: "#581c87", border: "#c084fc" },
  8: { cellClass: "bg-zinc-200 border-zinc-400 text-zinc-900", bg: "#cbd5e0", text: "#18181b", border: "#94a3b8" },
  9: { cellClass: "bg-red-100 border-red-400 text-red-900", bg: "#fed7d7", text: "#991b1b", border: "#ef4444" },
};

export const REFERENCE_DB: Record<number, PlanetRef> = {
  1: {
    name: { hi: "सूर्य (Sun)", en: "Sun" },
    single: {
      hi: "आत्मविश्वास, नेतृत्व क्षमता, मान-सम्मान, अधिकारप्रिय, महत्वाकांक्षी, स्वाभिमानी एवं दृढ़ निश्चयी स्वभाव।",
      en: "Confident, strong leadership traits, high reputation, commanding presence, ambitious and determined.",
    },
    double: {
      hi: "डबल 1 (1, 1): कभी अति-आत्मविश्वास तो कभी आत्मविश्वास की कमी। अपनी बात मनवाने का तीव्र आग्रह, सिर-आँखों से जुड़े विकार।",
      en: "Double 1 (1, 1): Fluctuating confidence, strong insistence on own terms, tendency for head or eye related fatigue.",
    },
    health: {
      hi: "सिरदर्द, माइग्रेन, नेत्र विकार, रक्तचाप और हृदय स्वास्थ्य का विशेष ध्यान रखें।",
      en: "ENT, migraine, weak eyesight, blood pressure and cardiovascular vitality.",
    },
    colors: { hi: "पीला, केसरिया, सुनहरा, तांबे का रंग।", en: "Yellow, saffron, gold, copper." },
    friends: "2, 6, 7, 3, 8",
    enemy: "1, 5, 9",
  },
  2: {
    name: { hi: "चंद्रमा (Moon)", en: "Moon" },
    single: {
      hi: "मातृवत स्नेह, कोमल हृदय, कल्पनाशीलता, रचनात्मकता, जनसम्पर्क में कुशल, मनमौजी एवं शांतिप्रिय।",
      en: "Gentle nature, strong intuition, emotional depth, creative thinking, good teamwork and pleasant charisma.",
    },
    double: {
      hi: "डबल 2 (2, 2): अति-संवेदनशील, मूड स्विंग्स, छोटी बातों पर आहत होना, अत्यधिक भावुकता व अनिद्रा।",
      en: "Double 2 (2, 2): Over-sensitive, mood swings, easily distressed by rejection, requires grounding and mindfulness.",
    },
    health: {
      hi: "मानसिक तनाव, अनिद्रा, पाचन दुर्बलता, कफ व सर्दी-जुकाम।",
      en: "Mental anxiety, insomnia, delicate digestive system, throat and cold vulnerabilities.",
    },
    colors: { hi: "सफेद, ऑफ-व्हाइट, क्रीम।", en: "White, off-white, cream." },
    friends: "6, 3, 8",
    enemy: "1, 5",
  },
  3: {
    name: { hi: "गुरु (Jupiter)", en: "Jupiter" },
    single: {
      hi: "विद्वत्ता, न्यायप्रिय, पारिवारिक मूल्यों के प्रति निष्ठा, उत्तम सलाहकार, आध्यात्मिक एवं ज्ञान पिपासु।",
      en: "Wise, ethical, attached to family values, exceptional counselor, disciplined and spiritual minded.",
    },
    double: {
      hi: "डबल 3 (3, 3): योजनाओं के क्रियान्वयन में विलंब, ज्ञान का अहंकार अथवा पारिवारिक मतभेद की संभावना।",
      en: "Double 3 (3, 3): Family frictions, planning grandly but delaying execution, need for humility.",
    },
    health: {
      hi: "यकृत (लिवर), थायराइड, नसों का खिंचाव एवं तनाव।",
      en: "Liver wellness, thyroid balance, nerve relaxation and stress relief.",
    },
    colors: { hi: "पीला, बैंगनी, जामुनी।", en: "Yellow, purple, violet." },
    friends: "6, 7, 9, 1, 2, 8",
    enemy: "4",
  },
  4: {
    name: { hi: "राहु (Rahu)", en: "Rahu" },
    single: {
      hi: "लीक से हटकर सोच (Out of the box), तकनीकी चातुर्य, शोध क्षमता, अप्रत्याशित यात्राएं एवं चंचल मन।",
      en: "Unconventional thinker, technical aptitude, deep research curiosity, frequent changes and dynamic journey.",
    },
    double: {
      hi: "समतुल्य 4 होने पर तार्किक क्षमता, सटीक योजनाएं एवं व्यावहारिक क्रियान्वयन में विशेष वृद्धि।",
      en: "Even occurrences of 4 bring grounded logic, structured predictability, and systematic execution.",
    },
    health: {
      hi: "गैस, अपच, अचानक चोट, उच्च रक्तचाप एवं अनिर्णय जनित सिरदर्द।",
      en: "Gastric issues, blood pressure variations, sudden unexpected accidents, respiratory care.",
    },
    colors: { hi: "नीला, गहरा हरा।", en: "Blue, dark green." },
    friends: "8",
    enemy: "3, 5",
  },
  5: {
    name: { hi: "बुध (Mercury)", en: "Mercury" },
    single: {
      hi: "तीक्ष्ण व्यापारिक बुद्धि, वाक-चातुर्य, तार्किक सोच, वित्तीय गणनाओं में निपुण, मिलनसार और सक्रिय।",
      en: "Sharp commercial intelligence, logical acumen, quick communication, business oriented, routine follower.",
    },
    double: {
      hi: "डबल 5 (5, 5): चंचलता में वृद्धि, जल्दबाजी में वित्तीय जोखिम लेना अथवा लेन-देन में सतर्कता की आवश्यकता।",
      en: "Double 5 (5, 5): High restlessness, risks of financial slips, needing extra due diligence in agreements.",
    },
    health: {
      hi: "अनिद्रा, स्नायु दुर्बलता (Nervous system), त्वचा रोग एवं बेचैनी।",
      en: "Sleeplessness, nervous fatigue, digestive/constipation sensitivities, anxiety management.",
    },
    colors: { hi: "पत्ते जैसा हरा, हल्का हरा।", en: "Emerald green, leaf green." },
    friends: "2",
    enemy: "1, 9, 5",
  },
  6: {
    name: { hi: "शुक्र (Venus)", en: "Venus" },
    single: {
      hi: "सौंदर्य प्रेमी, कलात्मक रुचि, सुरुचिपूर्ण वस्त्र व खानपान, आकर्षक व्यक्तित्व, विलासिता व मित्रता।",
      en: "Creative flair, love for aesthetics and luxury, culinary appreciation, charismatic aura, warm relationships.",
    },
    double: {
      hi: "डबल 6 (6, 6): भौतिक सुखों पर अत्यधिक व्यय, संबंधों में असंतोष या अस्थिरता की संभावना।",
      en: "Double 6 (6, 6): Overspending on luxuries, relationship vacillations, need for inner contentment.",
    },
    health: {
      hi: "मधुमेह, हार्मोनल असंतुलन, यूरिनरी ट्रैक्ट एवं त्वचा विकार।",
      en: "Hormonal balance, urinary tract health, blood sugar and throat care.",
    },
    colors: { hi: "गुलाबी, चमकीला सफेद, सिल्वर, फिरोजी।", en: "Pink, silver, white, turquoise." },
    friends: "3, 2, 6, 7",
    enemy: "1, 5",
  },
  7: {
    name: { hi: "केतु (Ketu)", en: "Ketu" },
    single: {
      hi: "गहन विचारक, दार्शनिक दृष्टिकोण, यात्राएं, सूक्ष्म अंतर्ज्ञान, आध्यात्मिक जिज्ञासा एवं स्वतंत्र स्वभाव।",
      en: "Deep thinker, philosophical outlook, traveler at heart, high intuition, spiritual curiosity, seeking life truths.",
    },
    double: {
      hi: "डबल 7 (7, 7): अत्यधिक बाल की खाल निकालना, व्यर्थ की चिंताएं, अनिर्णय एवं भटकाव।",
      en: "Double 7 (7, 7): Over-analyzing minor details, purposeless roaming, questioning everything excessively.",
    },
    health: {
      hi: "पेट के रोग, पाचन तंत्र, अनिद्रा एवं अत्यधिक चिंता।",
      en: "Stomach issues, chronic worry, sleep irregularities, digestive care.",
    },
    colors: { hi: "बहुरंगी, सफेद, हल्का क्रीम, धूसर।", en: "Multicolor, white, cream, gentle grey." },
    friends: "6, 7, 3, 9",
    enemy: "None",
  },
  8: {
    name: { hi: "शनि (Saturn)", en: "Saturn" },
    single: {
      hi: "परिश्रमी, धैर्यवान, न्यायप्रिय, संघर्षों से निखरने वाला, दयालु हृदय, विलंबित किंतु स्थायी सफलता।",
      en: "Hardworking, disciplined, justice-loving, forged through resilience, deep empathy, steady long-term victory.",
    },
    double: {
      hi: "डबल 8 (8, 8): संघर्ष कम होकर स्थायी संपत्ति, सरकारी या कॉर्पोरेट क्षेत्र में सर्वोच्च पद व प्रखर अंतर्ज्ञान।",
      en: "Double 8 (8, 8): Lessens delays, builds permanent wealth, governance authority, strong intuition.",
    },
    health: {
      hi: "जोड़ों का दर्द, दांत, आंतों के विकार, त्वचा एलर्जी एवं हड्डियों की कमजोरी।",
      en: "Joint aches, dental care, gut health, skin sensitivities, bone strength.",
    },
    colors: { hi: "काला, गहरा नीला, गहरा स्लेटी।", en: "Black, navy blue, dark grey." },
    friends: "3, 6, 2",
    enemy: "4",
  },
  9: {
    name: { hi: "मंगल (Mars)", en: "Mars" },
    single: {
      hi: "ऊर्जावान, साहसी, पराक्रमी, स्पष्टवादी, नेतृत्व क्षमता, त्वरित निर्णय लेने वाला एवं कर्मठ।",
      en: "High vitality, courageous, decisive leader, outspoken, action-driven, protective and athletic.",
    },
    double: {
      hi: "डबल 9 (9, 9): क्रोध व अधीरता पर नियंत्रण जरूरी, ज्वालामुखी जैसी भड़कने की प्रवृत्ति, जल्दबाजी से बचें।",
      en: "Double 9 (9, 9): Impatience, sudden explosive outbursts, needing patience and cool-headedness.",
    },
    health: {
      hi: "रक्त विकार, दुर्घटनाएं, गले का संक्रमण, फोड़े-फुंसी एवं उच्च ताप।",
      en: "Blood pressure spikes, sudden cuts/injuries, throat irritations, fever tendencies.",
    },
    colors: { hi: "लाल, नारंगी, सिंदूरी।", en: "Red, bright orange, vermilion." },
    friends: "9, 3, 6",
    enemy: "1",
  },
};

export const COMBINATIONS_DB: Record<string, { hi: string; en: string }> = {
  "1-1": {
    hi: "अत्यंत शक्तिशाली नेतृत्व, सरकारी लाभ, मजबूत इच्छाशक्ति और उच्च पद प्राप्ति। अहंकार से बचना लाभकारी है।",
    en: "Powerful leadership, government support, iron willpower, and high executive status.",
  },
  "1-2": {
    hi: "सूर्य और चंद्रमा का मिलन। कला, रचनात्मकता और जनसंपर्क में उत्तम सफलता। मन की स्थिरता आवश्यक है।",
    en: "Sun and Moon coordination. Great excellence in creative arts, diplomacy, and public relations.",
  },
  "1-3": {
    hi: "राजा और गुरु का अद्भुत संयोग। अत्यधिक बुद्धिमान, मार्गदर्शक, शिक्षा या प्रशासन में सर्वोच्च सफलता।",
    en: "King & Mentor combination. Highly intellectual, advisor qualities, top success in education & policy.",
  },
  "1-4": {
    hi: "राहु और सूर्य का योग। तकनीकी क्षेत्र या आउट-ऑफ-द-बॉक्स सोच। जीवन में अप्रत्याशित सफलता के योग।",
    en: "Rahu and Sun union. Technical mastery, unconventional strategies, sudden upward breakthroughs.",
  },
  "1-5": {
    hi: "बुधादित्य राजयोग तुल्य प्रभाव! असाधारण व्यापारिक समझ, तीक्ष्ण बुद्धि और मान-सम्मान। बिजनेस में शिखर।",
    en: "Budhaditya Yoga equivalent! Extraordinary business acumen, sharp intellect, and towering reputation.",
  },
  "1-6": {
    hi: "ज्ञान और भौतिकता का संगम। मीडिया, कला, ग्लैमर और व्यवसाय में लाभ। विलासिता और यश दोनों की प्राप्ति।",
    en: "Media, arts, glamour, and commerce flourish with comfort and social prestige.",
  },
  "1-7": {
    hi: "आध्यात्मिक ऊंचाई, शोध (PhD), ज्योतिष, दर्शनशास्त्र और नेतृत्व का अनोखा मेल। जातक दूरदर्शी होता है।",
    en: "Spiritual depth, research, astrology, and visionary leadership blended seamlessly.",
  },
  "1-8": {
    hi: "सूर्य-शनि का संयोग। शुरुआती संघर्ष, किंतु बाद में उच्च प्रशासनिक, औद्योगिक या कॉर्पोरेट सफलता।",
    en: "Sun-Saturn dynamic. Early perseverance leads to authoritative corporate or administrative stature.",
  },
  "1-9": {
    hi: "अत्यंत साहसी, प्रशासनिक सेवाओं, पुलिस, सेना या रक्षा में शीर्ष सफलता। ऊर्जा और पराक्रम भरपूर।",
    en: "Extremely courageous, top success in defense, civil administration, executive leadership.",
  },
  "2-1": {
    hi: "चंद्रमा और सूर्य का समन्वय। रचनात्मकता के साथ प्रशासनिक अधिकार। साझेदारी के कार्यों में उत्तम लाभ।",
    en: "Creativity harmonized with managerial authority. High rewards in collaborative ventures.",
  },
  "2-2": {
    hi: "अति-संवेदनशील स्वभाव। कला, संगीत और रचनात्मक क्षेत्रों में विशेष रुचि। ध्यान एवं योग से मानसिक शांति।",
    en: "Deep sensitivity, affinity for music and aesthetics; meditation brings centered focus.",
  },
  "2-3": {
    hi: "उच्च बौद्धिक क्षमता, परामर्श, समाज सेवा, शांत और सम्मानित व्यक्तित्व। शिक्षा व परामर्श में आदर।",
    en: "High intellect, counseling strength, societal respect, and scholastic achievement.",
  },
  "2-4": {
    hi: "ग्रहण योग प्रभाव। अत्यधिक सोचने से बचें। रचनात्मक शोध एवं तकनीकी कार्यों में सकारात्मक उपयोग करें।",
    en: "Deep analytical mind; channel imagination into technical research and avoid overthinking.",
  },
  "2-5": {
    hi: "व्यवसाय और कला का सुंदर मेल। नेटवर्किंग, ट्रैवल, लेखन और मीडिया में अच्छी ग्रोथ।",
    en: "Graceful mix of trade and artistry. Excellent growth in networking, writing, and media.",
  },
  "2-6": {
    hi: "शुक्र और चंद्रमा का जल-तत्व संयोजन। कला, फैशन, डिजाइनिंग और लग्जरी जीवन में बड़ी सफलता।",
    en: "Outstanding elegance in fashion, culinary arts, lifestyle branding, and visual appeal.",
  },
  "2-7": {
    hi: "गहरी कल्पनाशक्ति, मनोवैज्ञानिक समझ और अत्यंत तीव्र अंतर्ज्ञान। हीलिंग और ज्योतिष के लिए सर्वोत्तम।",
    en: "Profound intuitive insight, counseling empathy, supreme suitability for healing and astrology.",
  },
  "2-8": {
    hi: "विष योग प्रभाव। कार्य में धैर्य और अनुशासन से सफलता। दीर्घकालिक परियोजनाओं में स्थायी लाभ।",
    en: "Patience and discipline required; long-term steady efforts yield durable rewards.",
  },
  "2-9": {
    hi: "ऊर्जा और कोमलता का मिश्रण। खेल, रक्षा, चिकित्सा या सामाजिक कल्याण कार्यों में सक्रियता।",
    en: "Dynamic vigor softened by compassion; active in sports, healthcare, and humanitarian service.",
  },
  "3-1": {
    hi: "ज्ञान और सत्ता का मिलन। उच्च प्रबंधन, राजनीति या बड़े बिजनेस में शीर्ष स्थान।",
    en: "Wisdom meets executive authority; top positions in management, academia, and enterprise.",
  },
  "3-2": {
    hi: "परामर्शदाता योग। शिक्षा, शिक्षण और सलाहकारी भूमिकाओं में अत्यधिक आदर और सफलता।",
    en: "Mentor archetype. Immense respect in teaching, counseling, and organizational guidance.",
  },
  "3-3": {
    hi: "उच्च स्तर का ज्ञान, अध्यात्म, शिक्षण, मार्गदर्शन और समाज में गहरा सम्मान।",
    en: "Pure Jupiterian energy; wisdom, higher studies, ethics, and profound community reverence.",
  },
  "3-4": {
    hi: "तकनीकी शिक्षा, शोध और प्लानिंग में महारत। व्यावहारिक नियोजन से बड़ी उपलब्धियां।",
    en: "Mastery in educational planning, engineering, research, and structured innovation.",
  },
  "3-5": {
    hi: "बुद्धि और ज्ञान का सटीक संगम। बैंकिंग, वित्त, कानून और कंसल्टेंसी में शिखर सफलता।",
    en: "Flawless blend of intellect and wisdom; peak success in banking, finance, and legal consulting.",
  },
  "3-6": {
    hi: "ज्ञान और भौतिक सुखों का संतुलन। मीडिया, लग्जरी ब्रांड्स, या उच्च शिक्षा में नाम और प्रतिष्ठा।",
    en: "Balance of profound knowledge with material grace; prosperity in media and education.",
  },
  "3-7": {
    hi: "आध्यात्मिक ऊंचाई, PhD, ज्योतिष, दर्शनशास्त्र और शोध के लिए सर्वोत्तम कॉम्बिनेशन।",
    en: "Premier combination for spiritual philosophy, doctoral research, astrology, and authorship.",
  },
  "3-8": {
    hi: "अनुशासित ज्ञान। कानून, न्याय व्यवस्था, कॉर्पोरेट जगत या बड़े संस्थानों में उच्च सफलता।",
    en: "Disciplined intellect; commanding stature in judiciary, corporate governance, and ethics.",
  },
  "3-9": {
    hi: "साहस और ज्ञान का मेल। प्रशासनिक या उच्च शिक्षा क्षेत्रों में प्रभावशाली उपस्थिति।",
    en: "Courage reinforced by wisdom; authoritative presence in policy, defense, and leadership.",
  },
  "4-1": {
    hi: "राहु और सूर्य का प्रभाव। तकनीकी और प्रशासनिक क्षेत्रों में बड़ा मुकाम। अचानक सफलता।",
    en: "Breakthrough success in technical and governmental fields; sudden high trajectories.",
  },
  "4-2": {
    hi: "रचनात्मक शोध कार्य। मीडिया, राइटिंग या डिजाइनिंग में लीक से हटकर काम।",
    en: "Out-of-the-box creative intelligence; strong originality in design and digital media.",
  },
  "4-3": {
    hi: "तकनीकी विशेषज्ञता और उच्च ज्ञान। कंसल्टेंसी या सॉफ्टवेयर फील्ड में बेहतरीन ग्रोथ।",
    en: "Technical mastery merged with consultative insight; rapid ascent in tech and strategy.",
  },
  "4-4": {
    hi: "तकनीकी क्षेत्र, आईटी, आउट-ऑफ-द-बॉक्स विचार। जीवन में बड़े बदलाव और तकनीकी आविष्कार।",
    en: "IT, automation, disruptive ideas, dynamic turns and technological breakthroughs.",
  },
  "4-5": {
    hi: "शेयर बाजार, ट्रेडिंग और कमर्शियल सेक्टर में तेज दिमाग। जोखिम उठाने की क्षमता।",
    en: "Sharp speed in market trends, commercial analytics, and calculated calculated risk.",
  },
  "4-6": {
    hi: "विलासिता और तकनीक का मेल। मीडिया प्रोडक्शन, डिजाइनिंग या ग्लैमर इंडस्ट्री में सफलता।",
    en: "Convergence of tech and glamour; achievements in visual media and architectural design.",
  },
  "4-7": {
    hi: "गहन तकनीकी शोध, कोडिंग, डेटा एनालिटिक्स और गुप्त विद्याओं में महारत।",
    en: "Superb capability in confidential analytics, coding, cryptography, and occult sciences.",
  },
  "4-8": {
    hi: "कड़ा संघर्ष, किंतु अंततः रियल एस्टेट, कानून या भारी उद्योगों में बड़ी कामयाबी।",
    en: "Rigorous dedication unlocks massive success in heavy infrastructure, real estate, and law.",
  },
  "4-9": {
    hi: "राहु और मंगल का ऊर्जावान योग। तकनीकी सुरक्षा, रक्षा या इंजीनियरिंग में बड़ी सफलता।",
    en: "High-voltage drive; excellence in defense equipment, engineering, and cybersecurity.",
  },
  "5-1": {
    hi: "बुधादित्य राजयोग! व्यापारिक समझ, तीक्ष्ण बुद्धि और मान-सम्मान की प्राप्ति।",
    en: "Budhaditya Rajayoga! Commercial acumen, sharp intellect, and public prestige.",
  },
  "5-2": {
    hi: "संचार और जनसंपर्क में महारत। मीडिया, मार्केटिंग और सेल्स में शीर्ष पर पहुंचते हैं।",
    en: "Master of communication and public relations; top ranking in marketing and PR.",
  },
  "5-3": {
    hi: "बुद्धि और ज्ञान का अद्भुत संगम। फाइनेंस और कॉर्पोरेट कंसल्टेंसी में शिखर सफलता।",
    en: "Invaluable strategic mind; peak performance in corporate consultancy and finance.",
  },
  "5-4": {
    hi: "व्यवसाय और तकनीक का बेहतरीन संयोजन। स्टार्टअप्स या डिजिटल बिजनेस में लाभ।",
    en: "Great startup mindset; agility in commercial digitization and commercial tech.",
  },
  "5-5": {
    hi: "वित्तीय संतुलन, बहुमुखी प्रतिभा और जोखिम प्रबंधन में महारत। मल्टीपल बिजनेस से लाभ।",
    en: "High versatility, merchant agility, multiple income streams, and commercial balance.",
  },
  "5-6": {
    hi: "लक्ष्मी नारायण योग! धन, भौतिक समृद्धि, ग्लैमर, मीडिया और व्यापार में विपुल वृद्धि।",
    en: "Lakshmi Narayan Yoga! Immense fortune in commerce, fashion, media, and enterprise.",
  },
  "5-7": {
    hi: "विश्लेषणात्मक क्षमता बहुत तेज। डेटा साइंस, स्टॉक मार्केट या रिसर्च में सफलता।",
    en: "Exceptional analytical mind; breakthroughs in market research and data science.",
  },
  "5-8": {
    hi: "व्यापारिक अनुशासन, शेयर बाजार, कॉर्पोरेट या वित्त में अनुशासित सफलता।",
    en: "Commercial discipline; stable and robust wealth creation in finance and enterprise.",
  },
  "5-9": {
    hi: "साहस और व्यापार का मेल। डिफेंस कॉन्ट्रैक्ट्स, ट्रांसपोर्ट या बड़े कमर्शियल वेंचर्स में सफलता।",
    en: "Bold entrepreneurship; wins in logistics, heavy trading, and competitive markets.",
  },
  "6-1": {
    hi: "ग्लैमर, नाम और फेम का योग। मीडिया, कला, राजनीति या बिजनेस में उच्च सफलता।",
    en: "Aura of public magnetism; notable triumph in media, arts, and executive enterprise.",
  },
  "6-2": {
    hi: "कलात्मक स्वभाव, फैशन डिजाइनिंग, इंटीरियर डेकोरेशन और संगीत में विशेष ख्याति।",
    en: "Artistic sensibility; renown in interior aesthetics, fashion styling, and fine arts.",
  },
  "6-3": {
    hi: "ज्ञान और भौतिकता का सुंदर संतुलन। उच्च शिक्षा, शिक्षण और कला में मान-सम्मान।",
    en: "Harmony between wisdom and comfortable life; respect in academia and cultural fields.",
  },
  "6-4": {
    hi: "तकनीकी कला, फिल्म मेकिंग, फोटोग्राफी या मीडिया प्रोडक्शन में बड़ी सफलता।",
    en: "Creative technical production; successes in cinematics, photography, and visual arts.",
  },
  "6-5": {
    hi: "लक्ष्मी नारायण योग! व्यापार, मीडिया, फैशन या लग्जरी आइटम्स के व्यापार में असीम धन लाभ।",
    en: "Auspicious wealth combination; huge gains in luxury goods, marketing, and trade.",
  },
  "6-6": {
    hi: "कला, सिनेमा, फैशन, डिजाइनिंग और भौतिक विलासिता में बहुत बड़ी सफलता।",
    en: "Pure Venusian luxury; prominent achievements in cinema, fashion, and haute cuisine.",
  },
  "6-7": {
    hi: "रचनात्मक शोध और ज्योतिष। हीलिंग, इंटीरियर डिजाइनिंग या ऑकल्ट साइंसेज में गहरी रुचि।",
    en: "Creative research and intuitive arts; passion for aesthetics, healing, and astrology.",
  },
  "6-8": {
    hi: "रियल एस्टेट, लग्जरी प्रॉपर्टी, होटल इंडस्ट्री या फाइनेंस में बड़ी सफलता।",
    en: "Substantial prosperity in luxury properties, hospitality, and asset development.",
  },
  "6-9": {
    hi: "ऊर्जा और सौंदर्य का मेल। रियल एस्टेट, कंस्ट्रक्शन या फिटनेस इंडस्ट्री में शानदार सफलता।",
    en: "Dynamic creativity; grand wins in sports luxury, fitness brands, and architecture.",
  },
  "7-1": {
    hi: "आध्यात्मिक और प्रशासनिक नेतृत्व। ज्योतिष, हीलिंग, या सरकारी उच्च पदों पर विशेष सफलता।",
    en: "Spiritual authority merged with leadership; renown in astrology, governance, and counsel.",
  },
  "7-2": {
    hi: "गहरी कल्पनाशक्ति, तीव्र अंतर्ज्ञान और मनोवैज्ञानिक समझ। हीलर या काउंसलर के रूप में ख्याति।",
    en: "Deep intuition and psycho-emotional acuity; gifted healer and insightful guide.",
  },
  "7-3": {
    hi: "अध्यात्म, ज्योतिष, दर्शनशास्त्र और उच्च शिक्षण (PhD) के लिए सर्वोत्तम कॉम्बिनेशन।",
    en: "Supreme synergy for spiritual wisdom, philosophical writing, and esoteric knowledge.",
  },
  "7-4": {
    hi: "गहन तकनीकी शोध, डेटा साइंस, कोडिंग और गुप्त विद्याओं में महारत।",
    en: "Profound tech research capabilities; prowess in data architecture and occult research.",
  },
  "7-5": {
    hi: "इंटेलिजेंस, स्टॉक मार्केट एनालिसिस और बिजनेस कंसल्टेंसी में उत्तम सफलता।",
    en: "Sharp strategic intelligence; victories in market forecasting and advisory firms.",
  },
  "7-6": {
    hi: "कलात्मक शोध, फैशन, डिजाइनिंग या लग्जरी हीलिंग में सफलता।",
    en: "Artistic mysticism; distinction in lifestyle counseling, fashion, and organic wellness.",
  },
  "7-7": {
    hi: "अति-शोधक प्रवृत्ति। जीवन में दार्शनिक दृष्टिकोण, यात्राएं और आध्यात्मिक झुकाव।",
    en: "Philosopher archetype; deep search for truth, pilgrimages, and transcendental peace.",
  },
  "7-8": {
    hi: "शनि और केतु का कर्मा कनेक्शन। गुप्त विद्याएं, ज्योतिष, कानून या शोध में गहन सफलता।",
    en: "Karmic depth; extraordinary profundity in legal ethics, astrology, and confidential research.",
  },
  "7-9": {
    hi: "साहस और अंतर्ज्ञान का मेल। डिफेंस, खुफिया एजेंसियों या आध्यात्मिक संस्थानों में शीर्ष सफलता।",
    en: "Intuition fused with bravery; valorous leadership in intelligence, defense, and missions.",
  },
  "8-1": {
    hi: "सूर्य और शनि का प्रभाव। शुरुआती संघर्ष, किंतु बाद में सरकार या बड़े कॉर्पोरेट में सर्वोच्च पद।",
    en: "Sun-Saturn resilience; strong determination leads to towering governance or executive role.",
  },
  "8-2": {
    hi: "विष योग प्रभाव। धैर्य और नियमितता से मानसिक स्थिरता और बड़ी सफलता प्राप्त होती है।",
    en: "Requires emotional steadiness; persistent structured diligence produces lasting impact.",
  },
  "8-3": {
    hi: "न्याय, कानून, शिक्षा या बड़े संस्थानों में उच्च सलाहकार की प्रभावशाली भूमिका।",
    en: "Elevated advisory status in judiciary, corporate compliance, and higher learning.",
  },
  "8-4": {
    hi: "कठिन परिश्रम और तकनीकी दक्षता। रियल एस्टेट, माइनिंग या भारी उद्योगों में बड़ी सफलता।",
    en: "Formidable stamina; immense breakthroughs in engineering, real estate, and manufacturing.",
  },
  "8-5": {
    hi: "व्यापारिक अनुशासन, कॉर्पोरेट फाइनेंस, शेयर बाजार और बड़े प्रोजेक्ट्स में सफलता।",
    en: "Disciplined enterprise; financial masterminding in heavy corporate undertakings.",
  },
  "8-6": {
    hi: "लग्जरी रियल एस्टेट, होटल बिजनेस और संपत्ति के क्रय-विक्रय में बड़ा मुनाफा।",
    en: "High returns in property transactions, asset investment, and luxury hospitality.",
  },
  "8-7": {
    hi: "गहन कर्म और अध्यात्म। ज्योतिष, ऑकल्ट साइंसेज और गुप्त शोध में महारत।",
    en: "Deep spiritual duty; profound mastery in astrology, karma yoga, and mystical sciences.",
  },
  "8-8": {
    hi: "अत्यधिक कर्मठ, धीमी शुरुआत, 35 वर्ष की आयु के बाद स्थायी संपत्ति, सत्ता और अपार सफलता।",
    en: "Tremendous resilience; exponential accumulation of wealth, status, and authority with age.",
  },
  "8-9": {
    hi: "कर्म और पराक्रम का मेल। मैन्युफैक्चरिंग, इंजीनियरिंग, डिफेंस या बड़े उद्योगों में दबदबा।",
    en: "Union of labor and valor; commanding presence in infrastructure, defense, and industry.",
  },
  "9-1": {
    hi: "अत्यंत साहसी, प्रशासनिक सेवाओं, पुलिस, सेना या रक्षा में शीर्ष सफलता। राजयोग तुल्य कॉम्बिनेशन।",
    en: "Heroic archetype; Rajayoga status in public administration, defense, and leadership.",
  },
  "9-2": {
    hi: "साहस और संवेदनशीलता का मेल। मेडिकल फील्ड, नर्सिंग, हीलिंग या सामाजिक कार्यों में सफलता।",
    en: "Courage with compassionate heart; achievements in surgery, nursing, and crisis management.",
  },
  "9-3": {
    hi: "ज्ञान और ऊर्जा का संगम। उच्च शिक्षण, प्रशासनिक पदों और प्रबंधन में श्रेष्ठ सफलता।",
    en: "Knowledge fueled by fiery vigor; top stature in higher education and strategic administration.",
  },
  "9-4": {
    hi: "इंजीनियरिंग, कंस्ट्रक्शन, तकनीकी क्षेत्र और सुरक्षा बलों में विशेष सफलता।",
    en: "Technical courage; brilliance in structural engineering, defense, and high-tech safety.",
  },
  "9-5": {
    hi: "व्यापारिक साहस और जोखिम लेने की अद्भुत क्षमता। शेयर बाजार, ट्रेडिंग और कमर्शियल वेंचर्स में लाभ।",
    en: "Audacious commercial instinct; high returns in competitive trade and speculative markets.",
  },
  "9-6": {
    hi: "रियल एस्टेट, फैशन, ग्लैमर और लग्जरी संपत्तियों के व्यापार में बड़ी सफलता।",
    en: "Glamorous vitality; great profitability in high-end real estate, design, and fitness enterprises.",
  },
  "9-7": {
    hi: "तकनीकी शोध, आर्मी रिसर्च, या आध्यात्मिक रक्षा क्षेत्रों में गहरी सफलता।",
    en: "Deep technical investigation; distinguished service in defense research and martial arts.",
  },
  "9-8": {
    hi: "इंजीनियरिंग, मैन्युफैक्चरिंग, भारी उद्योग या लॉजिस्टिक्स में अनुशासित सफलता।",
    en: "Disciplined execution; command over manufacturing, logistics, and heavy construction.",
  },
  "9-9": {
    hi: "अत्यधिक ऊर्जावान और पराक्रमी। खेलों, सेना, पुलिस या बड़े नेतृत्व वाले अभियानों में सर्वोच्च स्थान।",
    en: "Unstoppable vigor; apex status in competitive sports, military command, and crisis leadership.",
  },
};
