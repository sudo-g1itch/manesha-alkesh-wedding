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
  dressCode?: string;
  mapsUrl: string;
}

export interface Person {
  name: string;
  role: string;
  bio: string;
}

export interface FamilySide {
  relation: string;
  parents: string;
  home: string;
}

export const content = {
  couple: {
    bride: "Manesha",
    groom: "Alkesh",
    /** Short tagline shown beneath the names in the hero. */
    tagline: "are getting married",
    /** Primary wedding date shown in the hero. */
    date: "Sunday, the Twenty-Third of August, 2026",
    /** Machine-readable date the countdown ticks down to (IST). */
    dateISO: "2026-08-23T12:00:00+05:30",
    location: "Ernakulam Town Hall · Kochi, Kerala",
  },

  families: {
    intro: "Together with their families",
    bride: <FamilySide>{
      relation: "Daughter of",
      parents: "Mr. Manoj P.L & Mrs. Shalini A.S",
      home: "Pathazhapurakkal (H), Kazhuthumuttu, Thoppumpady P.O., Kochi - 682005",
    },
    groom: <FamilySide>{
      relation: "Son of",
      parents: "Mr. K. S. Rajeev & Mrs. Shylaja P.T.",
      home: "Kulathunkal (H), Valiyakandam, Kattappana P.O., Idukki - 685508",
    },
    blessing:
      "cordially invite your esteemed presence and blessings, with family, on the auspicious occasion of the marriage of Manesha Manoj with Alkesh Rajeev",
    image: "images/hands.jpg",
  },

  events: <WeddingEvent[]>[
    {
      name: "Sangeet",
      date: "Saturday, 22 August 2026",
      time: "5:00 PM onwards",
      venue: "CSI Heritage Bungalow",
      address: "Fort Kochi, Kerala",
      dressCode: "Black Indo-Western",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=CSI+Heritage+Bungalow+Fort+Kochi",
    },
    {
      name: "Wedding",
      date: "Sunday, 23 August 2026",
      time: "Muhurtham · 12:00 PM – 12:22 PM",
      venue: "Ernakulam Town Hall",
      address: "Ernakulam, Kochi, Kerala",
      dressCode: "Soft pastel colours",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Ernakulam+Town+Hall+Kochi",
    },
    {
      name: "Reception",
      date: "Sunday, 30 August 2026",
      time: "4:00 PM onwards",
      venue: "Highrange Convention Centre & Club House",
      address: "Kattappana, Idukki, Kerala",
      dressCode: "Formals",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Highrange+Convention+Centre+and+Club+House+Kattappana",
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
    date: "23 . 08 . 2026",
    contact: "For enquiries: 8891216995 · 7736530296",
    host: "Sharing the happiness, Maneeth Manoj",
  },
};

export type Content = typeof content;
