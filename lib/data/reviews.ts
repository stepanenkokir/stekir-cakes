export type Review = {
  id: string;
  quote: string;
  name: string;
  rating: number;
  occasion: string;
};

export const reviews: Review[] = [
  {
    id: "1",
    quote:
      "The Napoleon was absolutely stunning — flaky layers and the cream was divine. Our anniversary guests couldn't stop raving about it!",
    name: "Maria K.",
    rating: 5,
    occasion: "Anniversary cake",
  },
  {
    id: "2",
    quote:
      "Ordered a Medovik for my daughter's birthday and it was the hit of the party. So moist and not too sweet — exactly what we wanted.",
    name: "James T.",
    rating: 5,
    occasion: "Birthday cake",
  },
  {
    id: "3",
    quote:
      "Fresh, beautiful, and delivered right on time to Folsom. The Smetannik tasted like something from my grandmother's kitchen.",
    name: "Elena P.",
    rating: 5,
    occasion: "Family celebration",
  },
  {
    id: "4",
    quote:
      "We get a Mannik every few months — it's our go-to for weekend gatherings. Light, tender, and always perfect.",
    name: "David R.",
    rating: 5,
    occasion: "Everyday treat",
  },
  {
    id: "5",
    quote:
      "Professional service from start to finish. They confirmed every detail by text and the cake looked even better in person.",
    name: "Sarah M.",
    rating: 5,
    occasion: "Holiday party",
  },
];
