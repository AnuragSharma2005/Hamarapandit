/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Planet, ZodiacSign, Testimonial, BlogArticle, Client, Appointment } from "../types";

export const PLANETS_DATA: Planet[] = [
  {
    id: "moon",
    name: "Moon",
    vedicName: "Chandra",
    degree: "15° Taurus 07' 29\"",
    sign: "Taurus (Exalted)",
    color: "from-blue-200 via-slate-150 to-indigo-150",
    glowColor: "rgba(224, 231, 255, 0.5)",
    image: "/images/planets/moon.png",
    description: "The Moon regulates mind, logic, focus, emotions, maternal connections, and the subconscious. It dictates how you perceive things and react emotionally to your surroundings.",
    influence: {
      traits: [
        "Nurturing energy, intense mood transitions, and high sensory feedback",
        "Deep intuitive capacities, emotional depth, and active dream states",
        "Empathetic connections to others and appreciation of tranquility"
      ],
      signs: {
        own: "Cancer (its own sign)",
        exaltation: "Taurus (highest alignment)",
        debilitation: "Scorpio (challenges emotional stability)"
      },
      houses: ["4th House (Mental peace and Motherhood)", "9th House (Intuition and Philosophy)", "1st House (Sensibility and physical glow)"]
    }
  },
  {
    id: "rahu",
    name: "Moon North",
    vedicName: "Rahu",
    degree: "15° Taurus 07' 29\"",
    sign: "Taurus",
    color: "from-slate-700 via-zinc-800 to-indigo-950",
    glowColor: "rgba(99, 102, 241, 0.4)",
    image: "/images/planets/rahu.png",
    description: "Rahu represents sudden changes, technology, deep desires, illusion, ambition, and modern fields of research. It accelerates things and triggers swift, unexpected breakthroughs.",
    influence: {
      traits: [
        "Unconventional thoughts, high ambition, and disruption of norms",
        "Fascination with foreign ideas, futuristic designs, and mystery",
        "Deep drive to seek recognition and break structural limits"
      ],
      signs: {
        own: "Aquarius (Vedic co-ruler)",
        exaltation: "Taurus / Gemini (unleashes massive intellectual drive)",
        debilitation: "Scorpio / Sagittarius (causes disorientation or unexpected shifts)"
      },
      houses: ["10th House (Career breakthroughs)", "11th House (Large networks and gains)", "3rd House (Courage and technical skills)"]
    }
  },
  {
    id: "mercury",
    name: "Mercury",
    vedicName: "Budha",
    degree: "15° Taurus 07' 29\"",
    sign: "Taurus",
    color: "from-emerald-400 via-green-500 to-indigo-900",
    glowColor: "rgba(16, 185, 129, 0.5)",
    image: "/images/planets/mercury.png",
    description: "Mercury represents intellect, speech, logical reasoning, trade, computer code, and general business skills. It drives analytical focus and precision.",
    influence: {
      traits: [
        "Extremely sharp wit, calculating logic, and adaptiveness",
        "Affinity for learning new languages, complex analytics, and scripts",
        "Effective mercantile strategies and clear expressive speech"
      ],
      signs: {
        own: "Gemini & Virgo",
        exaltation: "Virgo (exquisite precision and structural capability)",
        debilitation: "Pisces (replaces dry logic with abstract dreams)"
      },
      houses: ["2nd House (Speech and finance)", "5th House (Education and logic)", "10th House (Commerce and trade layouts)"]
    }
  },
  {
    id: "mars",
    name: "Mars",
    vedicName: "Mangala",
    degree: "14° Leo 12' 41\"",
    sign: "Leo",
    color: "from-amber-600 via-red-500 to-rose-900",
    glowColor: "rgba(239, 68, 68, 0.6)",
    image: "/images/planets/mars.png",
    description: "Mars, known as Mangala or Kuja, is a highly relevant planet for action, energy, and ambition. It symbolizes our inner warrior, the urge that impels us to override all sorts of hurdles and pursue goals with fervor and fight for the causes we believe in.",
    influence: {
      traits: [
        "Strong and beneficial, leading to assertiveness, self-confidence, and a competitive edge",
        "Fervent pursuit of objectives and strong physical stamina",
        "Excellent leadership potential when channeled with absolute discipline"
      ],
      signs: {
        own: "Aries & Scorpio (its own signs)",
        exaltation: "Capricorn (unparalleled endurance, power, and strategy)",
        debilitation: "Cancer (weakens drive, turning action into emotional response)"
      },
      houses: ["1st House (Physical vitality)", "3rd House (Valor and younger siblings)", "10th House (Commands high career authority)"]
    }
  },
  {
    id: "sun",
    name: "Sun",
    vedicName: "Surya",
    degree: "28° Taurus 05' 39\"",
    sign: "Taurus",
    color: "from-yellow-400 via-amber-500 to-red-650",
    glowColor: "rgba(245, 158, 11, 0.7)",
    image: "/images/planets/sun.png",
    description: "The Sun is the soul, the core self-identity, power, and fatherly patterns. It represents solar strength, public leadership, self-esteem, sovereignty, and administrative ability.",
    influence: {
      traits: [
        "Unshakeable self-confidence, magnetic presence, and nobility",
        "Nurturing leadership style, protective instinct, and radiant spirit",
        "Upholds truth, cosmic order, and organizational rules"
      ],
      signs: {
        own: "Leo (exquisite celestial throne)",
        exaltation: "Aries (ignites tremendous initiative, power, and drive)",
        debilitation: "Libra (subjugates ego to seek balance and consensus)"
      },
      houses: ["1st House (Bright personality and health)", "9th House (Righteousness, dharma, and gurus)", "10th House (Executive power and royalty)"]
    }
  },
  {
    id: "venus",
    name: "Venus",
    vedicName: "Shukra",
    degree: "15° Taurus 07' 29\"",
    sign: "Taurus (Own Sign)",
    color: "from-sky-100 via-pink-200 to-indigo-805",
    glowColor: "rgba(244, 63, 174, 0.4)",
    image: "/images/planets/venus.png",
    description: "Venus governs artistry, design, relationships, love, comfort, wealth, and sophisticated aesthetics. It signifies our creative spirit and value evaluation processes.",
    influence: {
      traits: [
        "Genteel and attractive nature, artistic inclinations, and appreciation of luxury",
        "Highly romantic, harmonious in collaboration, and diplomatic in disputes",
        "Aesthetic refinement, creating visual balance and musical rhythm"
      ],
      signs: {
        own: "Taurus & Libra (brings material comfort and elegant designs)",
        exaltation: "Pisces (creates ideal love, divine devotion, and absolute selflessness)",
        debilitation: "Virgo (focuses overly on minor detail, limiting creative ease)"
      },
      houses: ["7th House (Relationships and partnerships)", "4th House (Comfortable home and rich vehicles)", "12th House (Fine luxuries and spiritual retreats)"]
    }
  },
  {
    id: "jupiter",
    name: "Jupiter",
    vedicName: "Brihaspati",
    degree: "15° Taurus 07' 29\"",
    sign: "Taurus",
    color: "from-yellow-250 via-amber-400 to-orange-900",
    glowColor: "rgba(251, 191, 36, 0.55)",
    image: "/images/planets/jupiter.png",
    description: "Jupiter represents wisdom, general prosperity, higher learning, good fortune, expansions of mind, philosophy, and spiritual mentorship. It is the most benevolent planet.",
    influence: {
      traits: [
        "Broad philosophical view, absolute optimism, and massive generosity",
        "Intuitive grasp of structural and spiritual laws, wisdom, and ethics",
        "Ability to teach, uplift communities, and spread positive vibrations"
      ],
      signs: {
        own: "Sagittarius & Pisces (brings grand vision and spiritual growth)",
        exaltation: "Cancer (abundant emotional wisdom, deep family care)",
        debilitation: "Capricorn (replaces pure wisdom with dry, legalistic structure)"
      },
      houses: ["5th House (Children, investments, and past merits)", "9th House (Divine grace, higher studies, destiny)", "11th House (Avenues of massive financial security)"]
    }
  },
  {
    id: "ketu",
    name: "Moon South",
    vedicName: "Ketu",
    degree: "15° Taurus 07' 29\"",
    sign: "Taurus",
    color: "from-zinc-650 via-slate-800 to-violet-950",
    glowColor: "rgba(139, 92, 246, 0.4)",
    image: "/images/planets/ketu.png",
    description: "Ketu represents spiritual liberation, deep insight, isolation, mystery, and deep meditative qualities. It strips away material attachment to reveal raw, deep inner truths.",
    influence: {
      traits: [
        "Strong detachment from validation, sharp focus, and mystic insight",
        "Deep interest in meta-physics, deep silent mediation, and high philosophy",
        "Ability to analyze patterns quickly and find bugs or spiritual answers"
      ],
      signs: {
        own: "Scorpio (Vedic co-ruler)",
        exaltation: "Scorpio / Sagittarius (creates powerful spiritual seekers)",
        debilitation: "Taurus / Gemini (can cause sudden changes or minor confusion)"
      },
      houses: ["12th House (Moksha, meditation, and ultimate sleep)", "8th House (Deconstructs secrets and psychic paths)", "9th House (Renunciation of religious dogma for true soul study)"]
    }
  },
  {
    id: "saturn",
    name: "Saturn",
    vedicName: "Shani",
    degree: "15° Taurus 07' 29\"",
    sign: "Taurus",
    color: "from-slate-800 via-indigo-900 to-slate-950",
    glowColor: "rgba(79, 70, 229, 0.5)",
    image: "/images/planets/saturn.png",
    description: "Saturn is the planet of karma, discipline, focus, duty, patience, and persistence. It demands hard work and absolute structure, rewarding you handsomely on key life milestones.",
    influence: {
      traits: [
        "Highly practical, emotionally grounded, and patient under extreme pressure",
        "Deep commitment to duty, structural integrity, and building legacy",
        "Acceptance of delays while refining mastery, detail, and quality"
      ],
      signs: {
        own: "Capricorn & Aquarius",
        exaltation: "Libra (creates immense judicial, public, and social justice)",
        debilitation: "Aries (leads to impatience, rushing processes, and high stress)"
      },
      houses: ["10th House (Grounded career progression)", "8th House (Long life indices)", "6th House (Absolute control over battles and debts)"]
    }
  }
];

export const ZODIAC_SIGNS_DATA: ZodiacSign[] = [
  {
    id: "aries",
    name: "Aries",
    date: "Mar 21 - Apr 19",
    rulingPlanet: "Mars",
    element: "Fire",
    symbol: "♈",
    traits: ["Dynamic", "Fervent", "Pioneering", "Courageous"],
    horoscope: "The cosmos urges you to launch your key projects today. Your energy levels are high, and the warrior spirit within you shines bright. Clear all previous backlogs now!"
  },
  {
    id: "taurus",
    name: "Taurus",
    date: "Apr 20 - May 20",
    rulingPlanet: "Venus",
    element: "Earth",
    symbol: "♉",
    traits: ["Grounded", "Patient", "Dedicated", "Artistic"],
    horoscope: "Venus focuses on stabilizing your personal life today. Focus on long-term assets and fine adjustments to your comfort. A relaxing environment brings fresh creative breakthroughs."
  },
  {
    id: "gemini",
    name: "Gemini",
    date: "May 21 - Jun 20",
    rulingPlanet: "Mercury",
    element: "Air",
    symbol: "♊",
    traits: ["Versatile", "Witty", "Expressive", "Inquisitive"],
    horoscope: "Your communicative powers are highly magnetic today. Pitch your designs, write active code, or reach out to important clients. A casual talk will bring a nice surprise!"
  },
  {
    id: "cancer",
    name: "Cancer",
    date: "Jun 21 - Jul 22",
    rulingPlanet: "Moon",
    element: "Water",
    symbol: "♋",
    traits: ["Intuitive", "Empathetic", "Protective", "Imaginative"],
    horoscope: "The Moon heightens your subconscious perception today. Dedicate some quiet time to meditative focus. Family conversations bring deep mutual trust and mental comfort."
  },
  {
    id: "leo",
    name: "Leo",
    date: "Jul 23 - Aug 22",
    rulingPlanet: "Sun",
    element: "Fire",
    symbol: "♌",
    traits: ["Magnetic", "Generous", "Loyal", "Regal"],
    horoscope: "The spotlight naturally turns to you as your ruling planet, the Sun, elevates your charisma. Lead with an open mind, and inspire your team with absolute integrity."
  },
  {
    id: "virgo",
    name: "Virgo",
    date: "Aug 23 - Sep 22",
    rulingPlanet: "Mercury",
    element: "Earth",
    symbol: "♍",
    traits: ["Analytical", "Meticulous", "Helpful", "Refined"],
    horoscope: "Excellent day for sorting complex analytics and debugging designs. Your eye for minor details is outstanding. Streamline your office workflows for incredible efficiency gains."
  },
  {
    id: "libra",
    name: "Libra",
    date: "Sep 23 - Oct 22",
    rulingPlanet: "Venus",
    element: "Air",
    symbol: "♎",
    traits: ["Diplomatic", "Fair", "Charming", "Symmetric"],
    horoscope: "Focus shifts to beautiful, balanced collaborations. Align with partners on strategic metrics. Venus makes this a prime time for cosmetic refinements and legal agreements."
  },
  {
    id: "scorpio",
    name: "Scorpio",
    date: "Oct 23 - Nov 21",
    rulingPlanet: "Mars & Ketu",
    element: "Water",
    symbol: "♏",
    traits: ["Mysterious", "Passionate", "Resilient", "Strategic"],
    horoscope: "High-octane energetic patterns are driving deep transformations. Dive into mysterious problems or explore hidden details. Your strategic intuition is extremely reliable today."
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    date: "Nov 22 - Dec 21",
    rulingPlanet: "Jupiter",
    element: "Fire",
    symbol: "♐",
    traits: ["Optimistic", "Adventurous", "Wise", "Candid"],
    horoscope: "Your vision is grand and unconstrained. Study philosophy, share spiritual guidance, or outline your next travel maps. Good luck supports your major professional choices."
  },
  {
    id: "capricorn",
    name: "Capricorn",
    date: "Dec 22 - Jan 19",
    rulingPlanet: "Saturn",
    element: "Earth",
    symbol: "♑",
    traits: ["Ambitious", "Disciplined", "Praiseworthy", "Patient"],
    horoscope: "Your steady efforts from the past are consolidating into a solid foundation. Take charge of complicated structures. Discipline today leads to heavy respect and long-term gains."
  },
  {
    id: "aquarius",
    name: "Aquarius",
    date: "Jan 20 - Feb 18",
    rulingPlanet: "Saturn & Rahu",
    element: "Air",
    symbol: "♒",
    traits: ["Futuristic", "Altruistic", "Inventive", "Unbiased"],
    horoscope: "Excellent time to construct communal tools and coordinate team systems. A brilliant scientific spark allows you to solve legacy problems with elegant, modern tech models."
  },
  {
    id: "pisces",
    name: "Pisces",
    date: "Feb 19 - Mar 20",
    rulingPlanet: "Jupiter & Ketu",
    element: "Water",
    symbol: "♓",
    traits: ["Spiritual", "Selfless", "Imaginative", "Wise"],
    horoscope: "A state of high artistic expression and cosmic awareness surrounds you. Trust your dreams and explore mystical patterns. Selfless help offered to a colleague brings huge karma blessings."
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "t1",
    name: "Lincoln Donin",
    role: "Tech Lead & Astrology Enthusiast",
    rating: 5,
    text: "This platform has completely transformed how we view raw spatial birth charts. The interface is intuitive, fast, and incredibly reliable for real-time planetary projections. Absolute masterpiece!",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "t2",
    name: "Erin Phillips",
    role: "Professional Astrologer",
    rating: 5,
    text: "Setup was seamless, and the performance exceeds expectations. The level of accuracy and planetary detail makes it a powerful everyday tool for quick client chart readings and daily predictions.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "t3",
    name: "Arjun Mehta",
    role: "Astro-Consultant",
    rating: 5,
    text: "A modern, well-designed solution that delivers exactly what it promises. The real-time interactive dashboards and clean, immersive UI make it a complete pleasure to run. It saves me hours every single week!",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
  }
];

export const BLOGS_DATA: BlogArticle[] = [
  {
    id: "blog-1",
    title: "Tarotscopes For The July Full Moon Eclipse",
    category: "Horoscope",
    date: "July 12, 2026",
    excerpt: "Discover how the powerful July Full Moon Eclipse influences your zodiac signs, emotions, and upcoming life shifts. Gain absolute clarity through tarot readings.",
    imageUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=600",
    readTime: "5 min read",
    content: "The upcoming Full Moon Lunar Eclipse in Capricorn will shake structures and build new paradigms. This transit aligns with solar sparks of Mars in Taurus, challenging us to resolve lingering disputes using absolute focus and pragmatic patience. In this comprehensive guide, we cast a structural tarot reading for every elemental archetype..."
  },
  {
    id: "blog-2",
    title: "Why Gemini Are Obsessed With Each Other",
    category: "Astrology",
    date: "May 28, 2026",
    excerpt: "Explore the magnetic connection between Gemini souls. Understand what drives their dual curiosity, multi-topic chemistry, and irresistible mental alignment.",
    imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=600",
    readTime: "4 min read",
    content: "Gemini is ruled by Mercury, the planet of swift synapses, dual perspectives, and constant learning. When two Gemini minds meet, the intellectual speed increases dramatically. This article deconstructs the structural astro-psychological mechanics of Gemini-to-Gemini bonds and why they find absolute comfort in their conversational loops."
  },
  {
    id: "blog-3",
    title: "My Jupiter Return & The Wheel Of Fortune",
    category: "Fortune",
    date: "Feb 19, 2026",
    excerpt: "Uncover how a Jupiter return signals major expansion, luck, transformation, and what the Wheel of Fortune reveals about timing and destiny.",
    imageUrl: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=600",
    readTime: "7 min read",
    content: "A Jupiter Return occurs every 12 years when the solar giant returns to the exact position it occupied at your birth. This is an era of incredible wisdom, professional breakthroughs, and structural expansions. We look at how this rare cosmic event aligns with the classical Wheel of Fortune archetype to catalyze major destiny events."
  }
];

// Seed Data for Astrologer CRM
export const INITIAL_CLIENTS: Client[] = [
  {
    id: "c-1",
    name: "Anurag Sharma",
    email: "Anurag.sharma@example.com",
    phone: "+91 98765 43210",
    birthDate: "1994-11-23",
    birthTime: "05:30",
    birthPlace: "New Delhi, India",
    zodiacSign: "Leo",
    notes: "Suffering from blockages in career growth. Recommended chanting Surya Mantra every morning and performing water offering.",
    joinedAt: "2026-03-12"
  },
  {
    id: "c-2",
    name: "Priya Patel",
    email: "priya.patel@gmail.com",
    phone: "+91 93210 56789",
    birthDate: "1991-05-15",
    birthTime: "14:15",
    birthPlace: "Ahmedabad, India",
    zodiacSign: "Taurus",
    notes: "Inquiring about marriage compatibility with a prospective partner. Analyzed Venus dasha, matches excellently.",
    joinedAt: "2026-04-05"
  },
  {
    id: "c-3",
    name: "John Harrison",
    email: "john.h@example.com",
    phone: "+1 415 555 2673",
    birthDate: "1988-08-10",
    birthTime: "19:45",
    birthPlace: "San Francisco, USA",
    zodiacSign: "Scorpio",
    notes: "Deep interest in spiritual alignment and Ketu dasha trends. Guided through daily meditation guidelines.",
    joinedAt: "2026-05-20"
  },
  {
    id: "c-4",
    name: "Rishi Kapoor",
    email: "rishi.kapoor@example.com",
    phone: "+91 99990 12345",
    birthDate: "1985-12-25",
    birthTime: "23:40",
    birthPlace: "Mumbai, India",
    zodiacSign: "Sagittarius",
    notes: "Wants to expand business overseas. Jupiter transiting through 9th house soon. Highly supportive time for expansion.",
    joinedAt: "2026-06-01"
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "a-1",
    clientId: "c-1",
    clientName: "Anurag Sharma",
    date: "2026-06-11",
    time: "10:00",
    status: "In-Progress",
    fee: 1500,
    paymentStatus: "Paid",
    topic: "Career hurdles & Dasha trends",
    notes: "Discussed the Sade Sati effects and planetary alignments. Scheduled a gemstones consultation."
  },
  {
    id: "a-2",
    clientId: "c-2",
    clientName: "Priya Patel",
    date: "2026-06-12",
    time: "15:30",
    status: "Scheduled",
    fee: 2500,
    paymentStatus: "Paid",
    topic: "Kundali Marriage Matchmaking",
    notes: "Need to verify the Guna Milan scoring and modern placement compatibility charts."
  },
  {
    id: "a-3",
    clientId: "c-3",
    clientName: "John Harrison",
    date: "2026-06-15",
    time: "09:00",
    status: "Scheduled",
    fee: 3000,
    paymentStatus: "Paid",
    topic: "Sade Sati & Shani Remedial Measures",
    notes: "Review detailed charts for Saturn transit and explain proper meditation routines."
  },
  {
    id: "a-4",
    clientId: "c-4",
    clientName: "Rishi Kapoor",
    date: "2026-06-09",
    time: "17:00",
    status: "Completed",
    fee: 2000,
    paymentStatus: "Paid",
    topic: "Business Foreign Partnerships",
    notes: "Advised starting operations after Jupiter's transit next month. He was highly satisfied."
  }
];
