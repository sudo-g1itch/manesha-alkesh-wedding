/**
 * All site copy lives here. Swap placeholders for the couple's real details
 * without touching markup or logic.
 */

export interface WeddingEvent {
  name: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  dressCode: string;
  mapsUrl: string;
}

export interface Person {
  name: string;
  role: string;
  bio: string;
}

export const content = {
  couple: {
    bride: "Manesha",
    groom: "Alkesh",
    /** Short tagline shown beneath the names in the hero. */
    tagline: "are getting married",
    /** Primary wedding date shown in the hero. */
    date: "Saturday, the Fifteenth of November, 2026",
    /** Machine-readable date the countdown ticks down to (IST). */
    dateISO: "2026-11-15T18:30:00+05:30",
    location: "Udaipur, India",
  },

  families: {
    intro: "Together with their families",
    brideParents: "Daughter of Mr. Rajesh & Mrs. Sunita Sharma",
    groomParents: "Son of Mr. Mahesh & Mrs. Anita Patel",
    blessing:
      "request the honour of your presence as they begin their journey together",
    image: "images/hands.jpg",
  },

  events: <WeddingEvent[]>[
    {
      name: "Mehndi",
      date: "Thursday, 13 November 2026",
      time: "4:00 PM onwards",
      venue: "The Courtyard, Lake Palace Road",
      address: "Lake Palace Road, Udaipur, Rajasthan",
      dressCode: "Festive yellows & greens",
      mapsUrl: "https://maps.google.com/?q=Lake+Palace+Road+Udaipur",
    },
    {
      name: "Haldi",
      date: "Friday, 14 November 2026",
      time: "10:00 AM onwards",
      venue: "Garden Lawn, Family Residence",
      address: "Sector 11, Udaipur, Rajasthan",
      dressCode: "Bright florals",
      mapsUrl: "https://maps.google.com/?q=Udaipur+Rajasthan",
    },
    {
      name: "Sangeet",
      date: "Friday, 14 November 2026",
      time: "7:00 PM onwards",
      venue: "The Grand Ballroom, Taj Aravali",
      address: "Aravali Hills, Udaipur, Rajasthan",
      dressCode: "Indo-western glam",
      mapsUrl: "https://maps.google.com/?q=Taj+Aravali+Udaipur",
    },
    {
      name: "Wedding Ceremony",
      date: "Saturday, 15 November 2026",
      time: "6:30 PM (Pheras at 8:00 PM)",
      venue: "Lakeside Mandap, Jagmandir",
      address: "Jagmandir Island, Lake Pichola, Udaipur",
      dressCode: "Traditional formal",
      mapsUrl: "https://maps.google.com/?q=Jagmandir+Udaipur",
    },
    {
      name: "Reception",
      date: "Sunday, 16 November 2026",
      time: "7:30 PM onwards",
      venue: "The Crystal Hall, Leela Palace",
      address: "Lake Pichola, Udaipur, Rajasthan",
      dressCode: "Elegant cocktail",
      mapsUrl: "https://maps.google.com/?q=Leela+Palace+Udaipur",
    },
  ],

  couple_section: {
    image: "images/couple.jpg",
    caption: "Manesha & Alkesh",
  },

  couplePeople: <Person[]>[
    {
      name: "Manesha",
      role: "The Bride",
      bio: "A lover of art, slow mornings and the mountains. Manesha brings warmth and a quiet kind of magic to every room she walks into.",
    },
    {
      name: "Alkesh",
      role: "The Groom",
      bio: "An engineer with a wanderer's heart and an easy laugh. Alkesh finds joy in good food, long drives and even longer conversations.",
    },
  ],

  message: {
    heading: "A note from us",
    body: "From a chance hello to a lifetime of yes — our story has been written in small moments and big dreams. As we step into this new chapter, your love and blessings would mean the world to us. We can't wait to celebrate with you.",
    signoff: "With love, Manesha & Alkesh",
    image: "images/rings.jpg",
  },

  footer: {
    closing: "We look forward to celebrating with you",
    initials: "M & A",
    date: "15 . 11 . 2026",
  },
};

export type Content = typeof content;
