/** Données de démonstration du dashboard RBnB (aucun appel réseau). */

export type DashboardPeriod = "7d" | "30d" | "12m";

export interface DashboardKpis {
  revenue: number;
  bookings: number;
  occupancy: number;
  rating: number;
  series: number[];
  seriesLabels: string[];
}

export const DASHBOARD_DATA: Record<DashboardPeriod, DashboardKpis> = {
  "7d": {
    revenue: 1840,
    bookings: 9,
    occupancy: 82,
    rating: 4.95,
    series: [180, 240, 310, 220, 290, 330, 270],
    seriesLabels: ["L", "M", "M", "J", "V", "S", "D"],
  },
  "30d": {
    revenue: 7420,
    bookings: 34,
    occupancy: 87,
    rating: 4.92,
    series: [1480, 1920, 1760, 2260],
    seriesLabels: ["S1", "S2", "S3", "S4"],
  },
  "12m": {
    revenue: 48620,
    bookings: 312,
    occupancy: 79,
    rating: 4.9,
    series: [2600, 2900, 3400, 3700, 4100, 4800, 5600, 5900, 4300, 3800, 3500, 4020],
    seriesLabels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  },
};

export interface UpcomingBooking {
  id: string;
  guest: string;
  listing: string;
  dates: string;
  amount: number;
  status: "confirmée" | "en attente";
}

export const UPCOMING_BOOKINGS: UpcomingBooking[] = [
  { id: "b1", guest: "Camille R.", listing: "Loft Canal Saint-Martin", dates: "2 → 5 oct.", amount: 540, status: "confirmée" },
  { id: "b2", guest: "Jonas W.", listing: "Studio Montmartre", dates: "4 → 6 oct.", amount: 260, status: "confirmée" },
  { id: "b3", guest: "Inès B.", listing: "Maison Belleville", dates: "8 → 12 oct.", amount: 910, status: "en attente" },
  { id: "b4", guest: "Marco P.", listing: "Loft Canal Saint-Martin", dates: "11 → 13 oct.", amount: 380, status: "confirmée" },
];
