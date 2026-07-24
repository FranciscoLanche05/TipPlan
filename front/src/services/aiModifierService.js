import { geminiModel } from '@back/config/firebase';
import { vuelosRealistas, hotelesRealistas, restaurantesRealistas, autosRealistas } from './datos/serviciosData';

/**
 * Solicita a la IA que modifique un viaje existente evaluando las reservas actuales.
 */
export const generateModification = async (userPrompt, currentReservations, tripDestination) => {
  if (!geminiModel) {
    throw new Error('Gemini no está configurado en Firebase.');
  }

  const catalogue = {
    vuelos: vuelosRealistas.map(v => ({ id: v.id, aerolinea: v.aerolinea, destino: v.destino, precio: v.precio, proveedor: v.proveedor })),
    hoteles: hotelesRealistas.map(h => ({ id: h.id, nombre: h.nombre, ciudad: h.ciudad, estrellas: h.estrellas, precioNoche: h.precioNoche })),
    restaurantes: restaurantesRealistas.map(r => ({ id: r.id, nombre: r.nombre, ciudad: r.ciudad, precioPromedio: r.precioPromedio })),
    autos: autosRealistas.map(a => ({ id: a.id, empresa: a.empresa, modelo: a.modelo, ciudad: a.ciudad, precioDia: a.precioDia }))
  };

  const systemInstruction = `
Eres un agente de viajes experto asistiendo a un usuario que YA tiene un viaje planeado a ${tripDestination}.
El usuario quiere hacer una modificación a sus reservas actuales.
Reservas actuales del usuario:
${JSON.stringify(currentReservations)}

Catálogo disponible:
${JSON.stringify(catalogue)}

Debes analizar qué quiere cambiar el usuario (ej. un vuelo, un hotel, un restaurante o un auto).
1. Identifica en las "Reservas actuales" el ID de la reserva que el usuario quiere reemplazar (oldReservationId).
2. Busca en el "Catálogo disponible" el ID del nuevo servicio que mejor se adapte a lo que pide (newServiceId).
3. Asegúrate que el nuevo servicio esté en la misma ciudad del viaje (${tripDestination}).

IMPORTANTE: DEBES RESPONDER ESTRICTAMENTE EN FORMATO JSON, sin texto adicional (sin bloques markdown como \`\`\`json).
Tu respuesta JSON debe tener esta estructura:
{
  "message": "Un mensaje amigable (máximo 2 oraciones) indicando el cambio que encontraste.",
  "modification": {
    "hasModification": true,
    "type": "vuelo" | "hotel" | "restaurante" | "auto",
    "oldReservationId": "ID de la reserva actual a borrar en firestore (es el campo 'id' dentro del objeto de reservas actuales, no el ID del catalogo)",
    "newServiceId": "El ID del NUEVO servicio en el catálogo (ej. 'v14', 'h29', 'a21')"
  }
}

Si el usuario pregunta algo que no implica modificar, o no encuentras una alternativa en el catálogo, pon "hasModification": false.
El "oldReservationId" debe ser el ID del documento de la reserva actual, que viene en la lista proporcionada.
`;

  try {
    const prompt = `${systemInstruction}\n\nUsuario dice: ${userPrompt}`;
    const result = await geminiModel.generateContent(prompt);
    let textResult = result.response.text();
    textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(textResult);
  } catch (error) {
    console.error("Error al generar modificación con IA:", error);
    throw error;
  }
};
