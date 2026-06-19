export const EGYPT_CITIES = [
  "Cairo",
  "Alexandria",
  "Giza",
  "Shubra El-Kheima",
  "Port Said",
  "Suez",
  "Luxor",
  "Mansoura",
  "El-Mahalla El-Kubra",
  "Tanta",
  "Asyut",
  "Ismailia",
  "Faiyum",
  "Zagazig",
  "Aswan",
  "Damietta",
  "Damanhur",
  "Minya",
  "Beni Suef",
  "Hurghada",
  "Qena",
  "Sohag",
  "Shibin El Kom",
  "Banha",
  "Kafr El Sheikh",
  "Arish",
  "Marsa Matruh",
  "Sharm El Sheikh",
  "New Cairo",
  "6th of October City",
];

export const CAIRO_SHIPPING_FEE = 80;
export const OTHER_CITIES_SHIPPING_FEE = 120;

export function getShippingFee(city) {
  return city === "Cairo" ? CAIRO_SHIPPING_FEE : OTHER_CITIES_SHIPPING_FEE;
}
