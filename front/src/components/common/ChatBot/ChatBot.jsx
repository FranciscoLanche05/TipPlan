import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Loader2, MessageSquare } from 'lucide-react';
import { geminiModel } from '@back/config/firebase';
import { vuelosRealistas, hotelesRealistas, actividadesPorCiudad } from '../../../services/datos/serviciosData';
import styles from './ChatBot.module.css';

// Simulamos la búsqueda de vuelos
const buscarVuelos = (origen, destino) => {
  const normalize = (str) => str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return vuelosRealistas.filter(v => 
    (!origen || normalize(v.origen).includes(normalize(origen))) &&
    (!destino || normalize(v.destino).includes(normalize(destino)))
  ).slice(0, 5); // Max 5 resultados para no gastar tokens
};

// Simulamos la búsqueda de hoteles
const buscarHoteles = (ciudad) => {
  const normalize = (str) => str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return hotelesRealistas.filter(h => normalize(h.ciudad).includes(normalize(ciudad))).slice(0, 5);
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  
  // 1. Estado para el input actual
  const [inputValue, setInputValue] = useState('');
  
  // 2. Estado para saber si la IA está procesando
  const [isLoading, setIsLoading] = useState(false);

  // 3. Historial de mensajes (inicia con un saludo de la IA)
  const [mensajes, setMensajes] = useState([
    {
      id: '1',
      rol: 'ia',
      texto: '¡Hola! Soy tu asistente de viajes de TipPlan. Cuéntame, ¿qué destino te interesa o qué vuelos estás buscando?'
    }
  ]);

  const [chatSession, setChatSession] = useState(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggleChat', handleToggle);
    return () => window.removeEventListener('toggleChat', handleToggle);
  }, []);

  // Inicializar chat con Function Calling (Tools)
  useEffect(() => {
    if (isOpen && !chatSession && geminiModel) {
      try {
        const session = geminiModel.startChat({
          tools: [{
            functionDeclarations: [
              {
                name: "buscar_vuelos",
                description: "Busca los vuelos disponibles en la plataforma desde un origen a un destino.",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    origen: { type: "STRING", description: "Ciudad de origen (opcional)" },
                    destino: { type: "STRING", description: "Ciudad de destino" }
                  },
                  required: ["destino"]
                }
              },
              {
                name: "buscar_hoteles",
                description: "Busca los hoteles disponibles en una ciudad específica.",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    ciudad: { type: "STRING", description: "Ciudad donde se busca el hotel" }
                  },
                  required: ["ciudad"]
                }
              }
            ]
          }],
          history: [
            {
              role: "user",
              parts: [{ text: "Eres el asistente inteligente de TipPlan. Responde de forma amable, clara y concisa. Tienes acceso a herramientas para buscar vuelos y hoteles reales de la plataforma. Si el usuario te pregunta por precios, vuelos, etc., usa SIEMPRE tus herramientas (buscar_vuelos, buscar_hoteles) para responder con los datos reales en lugar de inventarlos." }],
            },
            {
              role: "model",
              parts: [{ text: "Entendido. Soy el asistente de TipPlan y usaré mis herramientas de búsqueda para proveer información real y precisa sobre los vuelos y hoteles de la plataforma." }],
            }
          ],
        });
        setChatSession(session);
      } catch (err) {
        console.error("Error al inicializar el chat de Gemini:", err);
      }
    }
  }, [isOpen, chatSession]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [mensajes, isOpen, isLoading]);

  const handleEnviarMensaje = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || !chatSession || isLoading) return;

    const userText = inputValue.trim();
    setInputValue(''); 
    setMensajes((prev) => [...prev, { id: Date.now().toString(), rol: 'usuario', texto: userText }]);
    setIsLoading(true);

    try {
      let result = await chatSession.sendMessage(userText);
      let responseObj = result.response;
      let calls = typeof responseObj.functionCalls === 'function' ? responseObj.functionCalls() : responseObj.functionCalls;

      // Si Gemini decide usar una función
      if (calls && calls.length > 0) {
        const call = calls[0];
        let data = null;

        if (call.name === "buscar_vuelos") {
          data = buscarVuelos(call.args.origen, call.args.destino);
        } else if (call.name === "buscar_hoteles") {
          data = buscarHoteles(call.args.ciudad);
        }

        // Devolvemos el resultado a Gemini para que construya la frase natural
        result = await chatSession.sendMessage([{
          functionResponse: {
            name: call.name,
            response: { resultados: data }
          }
        }]);
        responseObj = result.response;
      }

      const botResponse = responseObj.text();
      setMensajes((prev) => [...prev, { id: Date.now().toString(), rol: 'ia', texto: botResponse }]);

    } catch (error) {
      console.error("Error al obtener respuesta:", error);
      setMensajes((prev) => [...prev, { id: Date.now().toString(), rol: 'ia', texto: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      {isOpen && (
        <div className={styles.chatWindowWrapper}>
          <div className={styles.chatWindow}>
            
            <div className={styles.header}>
            <div className={styles.headerInfo}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shrink-0">
                <Sparkles size={16} className="text-[#f4a02c]" />
              </div>
              <div>
                <h3 className={styles.headerTitle}>Asistente TipPlan</h3>
                <span className={styles.headerStatus}>
                  <span className={styles.statusDot}></span> En línea
                </span>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className={styles.messagesArea} ref={messagesContainerRef}>
            {mensajes.map((msg) => (
              <div key={msg.id} className={`${styles.messageWrapper} ${msg.rol === 'usuario' ? styles.wrapperUsuario : styles.wrapperIa}`}>
                
                {msg.rol === 'ia' && (
                  <div className={styles.avatarIa}>
                    <Sparkles size={14} className={styles.iconIa} />
                  </div>
                )}

                <div className={`${styles.messageBubble} ${msg.rol === 'usuario' ? styles.bubbleUsuario : styles.bubbleIa}`}>
                  {msg.texto}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.messageWrapper} ${styles.wrapperIa}`}>
                <div className={styles.avatarIa}>
                  <Sparkles size={14} className={styles.iconIa} />
                </div>
                <div className={styles.typingIndicator}>
                  <Loader2 size={16} className={styles.spin} />
                  <span>Pensando...</span>
                </div>
              </div>
            )}
          </div>

          <form className={styles.inputContainer} onSubmit={handleEnviarMensaje}>
            <div className={styles.inputBoxWrapper}>
              <div className={styles.inputBox}>
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Pregúntale a la IA o dale detalles de tu viaje..."
                  className={styles.inputField}
                  disabled={isLoading}
                />
                <button 
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className={styles.sendBtn}
                >
                  <Send size={18} className={styles.sendIcon} />
                </button>
              </div>
            </div>
          </form>
          </div>
        </div>
      )}
    </div>
  );
}
