// Curated city options for the admin spot form, grouped by country (France first,
// with many cities). This drives the "Ville" dropdown when creating a spot; the
// mobile `cities` table (home search) is seeded separately (migration 0040).

export type CityGroup = { country: string; flag: string; cities: string[] };

export const CITY_GROUPS: CityGroup[] = [
  {
    country: "France",
    flag: "🇫🇷",
    cities: [
      "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Montpellier",
      "Strasbourg", "Bordeaux", "Lille", "Rennes", "Reims", "Grenoble", "Dijon",
      "Annecy", "Biarritz", "Cannes", "Avignon", "Colmar", "La Rochelle",
      "Saint-Malo", "Chamonix", "Versailles", "Honfleur", "Étretat", "Carcassonne",
    ],
  },
  { country: "Portugal", flag: "🇵🇹", cities: ["Lisbonne", "Porto", "Sintra"] },
  { country: "Espagne", flag: "🇪🇸", cities: ["Barcelone", "Madrid", "Séville", "Valence"] },
  { country: "Italie", flag: "🇮🇹", cities: ["Rome", "Milan", "Venise", "Florence"] },
  { country: "Maroc", flag: "🇲🇦", cities: ["Marrakech", "Casablanca", "Chefchaouen"] },
  { country: "Royaume-Uni", flag: "🇬🇧", cities: ["Londres"] },
  { country: "Pays-Bas", flag: "🇳🇱", cities: ["Amsterdam"] },
  { country: "Allemagne", flag: "🇩🇪", cities: ["Berlin"] },
  { country: "Turquie", flag: "🇹🇷", cities: ["Istanbul"] },
  { country: "Japon", flag: "🇯🇵", cities: ["Tokyo"] },
];

export const ALL_CITY_NAMES: string[] = CITY_GROUPS.flatMap((g) => g.cities);
