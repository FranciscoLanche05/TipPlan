export const destinationsData = [
  { id: 1, name: "París, Francia" },
  { id: 2, name: "Barcelona, España" },
  { id: 3, name: "Roma, Italia" },
  { id: 4, name: "Amsterdam, Países Bajos" },
  { id: 5, name: "Berlín, Alemania" },
  { id: 6, name: "Londres, Reino Unido" },
  { id: 7, name: "Estambul, Turquía" },
  { id: 8, name: "Cancún, México" },
  { id: 9, name: "Nueva York, Estados Unidos" },
  { id: 10, name: "Tokio, Japón" },
  { id: 11, name: "Bangkok, Tailandia" },
  { id: 12, name: "Dubái, Emiratos Árabes" }
];
import panecillo from "../../imagenes/panecillo_11zon.webp";
import mitadMundo from "../../imagenes/mitad_mundog_11zon.webp";
import basilica from "../../imagenes/basilica_11zon.webp";
import malecon from "../../imagenes/malecon_11zon.webp";

const destinations = [
  {
    id: 1,
    title: "Virgen del Panecillo",
    location: "QUITO, ECUADOR",
    image: panecillo,
    mapUrl: "https://maps.google.com/?q=Virgen+del+Panecillo+Quito",
  },
  {
    id: 2,
    title: "Mitad del Mundo",
    location: "QUITO, ECUADOR",
    image: mitadMundo,
    mapUrl: "https://maps.google.com/?q=Mitad+del+Mundo+Quito",
  },
  {
    id: 3,
    title: "Basílica del Voto Nacional",
    location: "QUITO, ECUADOR",
    image: basilica,
    mapUrl: "https://maps.google.com/?q=Basilica+del+Voto+Nacional+Quito",
  },
  {
    id: 4,
    title: "Malecón 2000",
    location: "GUAYAQUIL, ECUADOR",
    image: malecon,
    mapUrl: "https://maps.google.com/?q=Malecon+2000+Guayaquil",
  },
];

export default destinations;
