// AstroSuman Astro Configuration - Ported from js/astro/astro-config.js

export const ASTRO_CONFIG = {
  defaultTimezoneHours: 5.5,
  defaultLocation: {
    name: "New Delhi, India",
    latitude: 28.6139,
    longitude: 77.209,
    timezoneHours: 5.5,
  },
};

export const RASHIS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const RASHI_HI = [
  "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
  "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन",
];

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha",
  "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

export const NAKSHATRAS_HI = [
  "अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा",
  "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्व फाल्गुनी", "उत्तर फाल्गुनी",
  "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा",
  "मूल", "पूर्वाषाढ़ा", "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा",
  "शतभिषा", "पूर्व भाद्रपद", "उत्तर भाद्रपद", "रेवती",
];

export const TITHIS = [
  "Shukla Pratipada", "Shukla Dwitiya", "Shukla Tritiya", "Shukla Chaturthi",
  "Shukla Panchami", "Shukla Shashthi", "Shukla Saptami", "Shukla Ashtami",
  "Shukla Navami", "Shukla Dashami", "Shukla Ekadashi", "Shukla Dwadashi",
  "Shukla Trayodashi", "Shukla Chaturdashi", "Purnima",
  "Krishna Pratipada", "Krishna Dwitiya", "Krishna Tritiya", "Krishna Chaturthi",
  "Krishna Panchami", "Krishna Shashthi", "Krishna Saptami", "Krishna Ashtami",
  "Krishna Navami", "Krishna Dashami", "Krishna Ekadashi", "Krishna Dwadashi",
  "Krishna Trayodashi", "Krishna Chaturdashi", "Amavasya",
];

export const YOGAS = [
  "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
  "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata",
  "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva",
  "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti",
];

export const KARANAS = {
  repeating: ["Bava", "Balava", "Kaulava", "Taitila", "Garaja", "Vanija", "Vishti"],
  fixedStart: "Kimstughna",
  fixedEnd: ["Shakuni", "Chatushpada", "Naga"],
};

export const VAAR = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

export const ZODIAC_SIGNS = [
  { hi: "मेष", en: "Aries", icon: "♈", element: "अग्नि", focus: "पहल और आत्मविश्वास", career: "नई जिम्मेदारी या लंबित काम में पहल करें", money: "आवेग में खर्च करने से बचें", relation: "बात स्पष्ट रखें, पर प्रतिक्रिया में जल्दबाज़ी न करें", health: "ऊर्जा को संतुलित रखने के लिए आराम भी जरूरी है" },
  { hi: "वृषभ", en: "Taurus", icon: "♉", element: "पृथ्वी", focus: "स्थिरता और व्यावहारिकता", career: "धीरे लेकिन व्यवस्थित प्रगति पर ध्यान दें", money: "बचत और बजट आपके पक्ष में रहेंगे", relation: "विश्वास और धैर्य संबंधों को मजबूत करेंगे", health: "नियमित दिनचर्या बनाए रखें" },
  { hi: "मिथुन", en: "Gemini", icon: "♊", element: "वायु", focus: "संवाद और नई जानकारी", career: "मीटिंग, संपर्क और सीखने से अवसर मिल सकते हैं", money: "छोटे खर्चों का रिकॉर्ड रखें", relation: "गलतफहमी से बचने के लिए बात पूरी सुनें", health: "मानसिक व्यस्तता के बीच पर्याप्त विश्राम लें" },
  { hi: "कर्क", en: "Cancer", icon: "♋", element: "जल", focus: "भावनात्मक संतुलन और परिवार", career: "निर्णय लेते समय तथ्य और भावना दोनों को संतुलित रखें", money: "घर या परिवार से जुड़े खर्च की योजना बनाएं", relation: "अपनी अपेक्षाएँ शांत तरीके से व्यक्त करें", health: "नींद और भोजन की नियमितता पर ध्यान दें" },
  { hi: "सिंह", en: "Leo", icon: "♌", element: "अग्नि", focus: "नेतृत्व और अभिव्यक्ति", career: "अपनी क्षमता दिखाने का अवसर मिल सकता है", money: "प्रतिष्ठा के लिए अनावश्यक खर्च न करें", relation: "दूसरों की बात को भी समान महत्व दें", health: "अति-व्यस्तता से बचकर आराम रखें" },
  { hi: "कन्या", en: "Virgo", icon: "♍", element: "पृथ्वी", focus: "व्यवस्था और सूक्ष्म योजना", career: "डिटेल, दस्तावेज और अधूरे काम सुधारने का समय है", money: "बजट की समीक्षा उपयोगी रहेगी", relation: "अत्यधिक आलोचना के बजाय समाधान पर बात करें", health: "रूटीन और संतुलित भोजन पर ध्यान दें" },
  { hi: "तुला", en: "Libra", icon: "♎", element: "वायु", focus: "संतुलन और साझेदारी", career: "सहयोग और बातचीत से काम आगे बढ़ सकता है", money: "खरीदारी में जरूरत और इच्छा का अंतर देखें", relation: "समझौते में अपनी जरूरतें भी स्पष्ट रखें", health: "काम और आराम में संतुलन रखें" },
  { hi: "वृश्चिक", en: "Scorpio", icon: "♏", element: "जल", focus: "गहराई और रणनीति", career: "गोपनीय या जटिल काम पर एकाग्रता लाभ दे सकती है", money: "जोखिम वाले निर्णय से पहले पूरी जानकारी लें", relation: "संदेह के बजाय सीधे संवाद को प्राथमिकता दें", health: "तनाव कम करने के लिए नियमित विश्राम रखें" },
  { hi: "धनु", en: "Sagittarius", icon: "♐", element: "अग्नि", focus: "विस्तार और सीखना", career: "नई जानकारी, यात्रा या प्रशिक्षण उपयोगी हो सकता है", money: "बड़े खर्च से पहले दीर्घकालीन योजना देखें", relation: "स्वतंत्रता और जिम्मेदारी दोनों का संतुलन रखें", health: "अति-उत्साह में दिनचर्या न बिगाड़ें" },
  { hi: "मकर", en: "Capricorn", icon: "♑", element: "पृथ्वी", focus: "अनुशासन और दीर्घकालीन लक्ष्य", career: "निरंतर प्रयास और समय-सीमा पर ध्यान दें", money: "दीर्घकालीन बचत और जिम्मेदार खर्च उपयोगी रहेगा", relation: "काम के साथ निजी संबंधों के लिए समय निकालें", health: "अधिक काम के बीच शरीर को पर्याप्त आराम दें" },
  { hi: "कुंभ", en: "Aquarius", icon: "♒", element: "वायु", focus: "नवीन सोच और नेटवर्क", career: "नई तकनीक या अलग दृष्टिकोण समाधान दे सकता है", money: "नई योजना अपनाने से पहले व्यावहारिकता जांचें", relation: "भावनाओं को केवल तर्क से न देखें", health: "स्क्रीन और मानसिक थकान से नियमित ब्रेक लें" },
  { hi: "मीन", en: "Pisces", icon: "♓", element: "जल", focus: "अंतर्ज्ञान और रचनात्मकता", career: "रचनात्मक विचार को स्पष्ट कार्ययोजना में बदलें", money: "भावनात्मक खरीदारी से बचें", relation: "सीमाएँ और अपेक्षाएँ स्पष्ट रखना उपयोगी रहेगा", health: "नींद, पानी और शांत समय पर ध्यान दें" },
];
