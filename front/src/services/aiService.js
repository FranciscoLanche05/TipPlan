import { geminiModel } from '@back/config/firebase';
import { vuelosRealistas, hotelesRealistas, restaurantesRealistas, autosRealistas } from './datos/serviciosData';

/**
 * Llama a Gemini para generar un itinerario de viaje estructurado en JSON.
 * @param {string} userPrompt - La petición del usuario (ej. "Vuelo a Madrid con hotel por 3 días")
 * @returns {Promise<Object>} - El JSON parseado con la respuesta de la IA.
 */
export const generateItinerary = async (userPrompt) => {
  if (!geminiModel) {
    throw new Error('Gemini no está configurado en Firebase.');
  }

  // Preparamos un catálogo simplificado para no exceder los tokens (aunque Gemini 1.5/3.5 tiene contexto gigante)
  const catalogue = {
    vuelos: vuelosRealistas.map(v => ({ id: v.id, aerolinea: v.aerolinea, destino: v.destino, precio: v.precio, proveedor: v.proveedor })),
    hoteles: hotelesRealistas.map(h => ({ id: h.id, nombre: h.nombre, ciudad: h.ciudad, estrellas: h.estrellas, precioNoche: h.precioNoche })),
    restaurantes: restaurantesRealistas.map(r => ({ id: r.id, nombre: r.nombre, ciudad: r.ciudad, precioPromedio: r.precioPromedio })),
    autos: autosRealistas.map(a => ({ id: a.id, empresa: a.empresa, modelo: a.modelo, ciudad: a.ciudad, precioDia: a.precioDia }))
  };

  const todayDate = new Date().toISOString().split('T')[0];

  const systemInstruction = `
Eres un agente de viajes experto e inteligente. Tu tarea es ayudar al usuario a planificar un viaje.
El usuario te dará instrucciones en lenguaje natural (ej. "Necesito ir a Madrid con hotel 3 días").
Debes buscar en el siguiente catálogo de datos disponibles y seleccionar la mejor coincidencia para su viaje:

CATÁLOGO:
${JSON.stringify(catalogue)}

IMPORTANTE: DEBES RESPONDER ESTRICTAMENTE EN FORMATO JSON, SIN TEXTO ADICIONAL ANTES NI DESPUÉS (sin bloques de código markdown como \`\`\`json).
Tu respuesta JSON debe tener exactamente esta estructura:
{
  "message": "Un mensaje amigable y corto (máximo 2 oraciones) diciéndole al usuario lo que encontraste.",
  "itinerary": {
    "destination": "Ciudad principal de destino",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "flightId": "El ID del vuelo seleccionado del catálogo",
    "hotelId": "El ID del hotel seleccionado del catálogo",
    "restaurantId": "El ID del restaurante seleccionado del catálogo",
    "carId": "El ID del auto seleccionado del catálogo (o null si no lo pide)"
  }
}
REGLAS ESTRICTAS PARA LA IA:
1. CONSISTENCIA DE CIUDAD: El hotel, el restaurante, el auto y el vuelo de destino DEBEN estar ubicados en la MISMA ciudad ("destination"). Si el usuario pide ir a París, NO PUEDES seleccionar un restaurante en Quito ni un hotel en Madrid.
2. Si no encuentras un vuelo, hotel, restaurante o auto para la ciudad de destino en el catálogo proporcionado, simplemente deja ese campo de ID como nulo (null) o asume un ID inventado lógico, pero JAMÁS devuelvas el ID de otra ciudad diferente.
3. FECHAS: HOY es ${todayDate}. La "startDate" debe ser una fecha futura realista a partir de hoy (por ejemplo el próximo mes). La "endDate" debe calcularse sumando la cantidad de días ("days") a la "startDate".
`;

  try {
    const prompt = `${systemInstruction}\n\nUsuario: ${userPrompt}`;
    const result = await geminiModel.generateContent(prompt);
    let textResult = result.response.text();
    
    // Limpiamos los backticks de markdown por si la IA los incluye a pesar de la instrucción
    textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(textResult);
  } catch (error) {
    console.error("Error al generar itinerario con IA:", error);
    throw error;
  }
};
