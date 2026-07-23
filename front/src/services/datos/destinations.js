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
import viajeros from "../../imagenes/viajeros_11zon.webp";
import cotopaxi from "../../imagenes/cotopaxi.webp";

const destinations = [
  {
    id: 1,
    title: "Islas Galápagos",
    location: "GALÁPAGOS, ECUADOR",
    image: "/images/Galapagos.jpg",
    mapUrl: "https://maps.google.com/?q=Islas+Galapagos",
  },
  {
    id: 2,
    title: "Torre Eiffel",
    location: "PARÍS, FRANCIA",
    image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=600&auto=format&fit=crop",
    mapUrl: "https://maps.google.com/?q=Torre+Eiffel+Paris",
  },
  {
    id: 3,
    title: "Virgen del Panecillo",
    location: "QUITO, ECUADOR",
    image: panecillo,
    mapUrl: "https://maps.google.com/?q=Virgen+del+Panecillo+Quito",
  },
  {
    id: 4,
    title: "Santuario Fushimi Inari",
    location: "KIOTO, JAPÓN",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop",
    mapUrl: "https://maps.google.com/?q=Fushimi+Inari+Kioto",
  },
  {
    id: 5,
    title: "Mitad del Mundo",
    location: "QUITO, ECUADOR",
    image: mitadMundo,
    mapUrl: "https://maps.google.com/?q=Mitad+del+Mundo+Quito",
  },
  {
    id: 6,
    title: "Estatua de la Libertad",
    location: "NUEVA YORK, EE.UU.",
    image: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?q=80&w=600&auto=format&fit=crop",
    mapUrl: "https://maps.google.com/?q=Estatua+de+la+Libertad+Nueva+York",
  },
  {
    id: 7,
    title: "Laguna de Quilotoa",
    location: "COTOPAXI, ECUADOR",
    image: "/images/quilotoa-view.webp",
    mapUrl: "https://maps.google.com/?q=Laguna+de+Quilotoa",
  },
  {
    id: 8,
    title: "Coliseo Romano",
    location: "ROMA, ITALIA",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=600&auto=format&fit=crop",
    mapUrl: "https://maps.google.com/?q=Coliseo+Roma",
  },
  {
    id: 9,
    title: "Centro Histórico Cuenca",
    location: "AZUAY, ECUADOR",
    image: "/images/cuenca.jpg",
    mapUrl: "https://maps.google.com/?q=Cuenca+Ecuador",
  },
  {
    id: 10,
    title: "Malecón 2000",
    location: "GUAYAQUIL, ECUADOR",
    image: malecon,
    mapUrl: "https://maps.google.com/?q=Malecon+2000+Guayaquil",
  },
  {
    id: 11,
    title: "Basílica del Voto Nacional",
    location: "QUITO, ECUADOR",
    image: basilica,
    mapUrl: "https://maps.google.com/?q=Basilica+del+Voto+Nacional+Quito",
  }
];

export default destinations;
