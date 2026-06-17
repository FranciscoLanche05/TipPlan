import { useState, useRef, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight, X } from "lucide-react";
import ActivityCard from "./ActivityCard";
import ItineraryForm from "./ItineraryForm";
import styles from "./Itinerary.module.css";

const initialItinerary = [
  { day: 1, items: [
    { id: "seed-1", time: "Mañana", title: "Llegada y check-in", place: "Hotel Centro" },
    { id: "seed-2", time: "Tarde", title: "Recorrido histórico", place: "Centro colonial" },
    { id: "seed-3", time: "Noche", title: "Cena de bienvenida", place: "Restaurante local" },
  ]},
  { day: 2, items: [
    { id: "seed-4", time: "Mañana", title: "Tour de aventura", place: "Reserva natural" },
    { id: "seed-5", time: "Tarde", title: "Mercado artesanal", place: "Plaza central" },
    { id: "seed-6", time: "Noche", title: "Vida nocturna", place: "Zona La Ronda" },
  ]},
  { day: 3, items: [
    { id: "seed-7", time: "Mañana", title: "Excursión al volcán", place: "Parque nacional" },
    { id: "seed-8", time: "Tarde", title: "Spa y relajación", place: "Hotel" },
    { id: "seed-9", time: "Noche", title: "Cena de despedida", place: "Mirador panorámico" },
  ]},
];

export default function Itinerary() {
  const [itinerary, setItinerary] = useState(initialItinerary);
  const [day, setDay] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [addingItem, setAddingItem] = useState(false);
  const idRef = useRef(0);

  const current = itinerary.find((d) => d.day === day) || itinerary[0];

  useEffect(() => { setAddingItem(false); setEditingId(null); }, [day]);

  function genId() {
    idRef.current += 1;
    return `item-${idRef.current}-${Date.now()}`;
  }

  function addDay() {
    setItinerary((prev) => {
      const maxDay = prev.length ? Math.max(...prev.map((d) => d.day)) : 0;
      setDay(maxDay + 1);
      return [...prev, { day: maxDay + 1, items: [] }];
    });
  }

  function removeDay(dNum) {
    setItinerary((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((d) => d.day !== dNum).map((d, i) => ({ ...d, day: i + 1 }));
    });
    setDay(1);
  }

  function addItem(draft) {
    if (!draft.title.trim()) return;
    const newItem = { id: genId(), time: draft.time, title: draft.title.trim(), place: draft.place.trim() };
    setItinerary((prev) =>
      prev.map((d) => (d.day === current.day ? { ...d, items: [...d.items, newItem] } : d))
    );
    setAddingItem(false);
  }

  function updateItem(itemId, patch) {
    setItinerary((prev) =>
      prev.map((d) =>
        d.day === current.day
          ? { ...d, items: d.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)) }
          : d
      )
    );
    setEditingId(null);
  }

  function removeItem(itemId) {
    setItinerary((prev) =>
      prev.map((d) =>
        d.day === current.day ? { ...d, items: d.items.filter((it) => it.id !== itemId) } : d
      )
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.dayRow}>
        <button className={styles.navBtn} onClick={() => setDay((d) => Math.max(1, d - 1))}>
          <ChevronLeft size={18} />
        </button>

        {itinerary.map((d) => (
          <div key={d.day} className={styles.dayPillWrap}>
            <button
              className={`${styles.dayPill} ${day === d.day ? styles.dayPillActive : ""}`}
              onClick={() => setDay(d.day)}
            >
              {d.day}
            </button>
            {day === d.day && itinerary.length > 1 && (
              <button className={styles.removeDayBtn} onClick={() => removeDay(d.day)}>
                <X size={11} />
              </button>
            )}
          </div>
        ))}

        <button className={styles.addDayBtn} onClick={addDay}>
          <Plus size={18} />
        </button>

        <button className={styles.navBtn} onClick={() => setDay((d) => Math.min(itinerary.length, d + 1))}>
          <ChevronRight size={18} />
        </button>
      </div>

      <div key={day} className={styles.timeline}>
        {current.items.map((item, i) => (
          <ActivityCard
            key={item.id}
            item={item}
            index={i}
            isLast={i === current.items.length - 1}
            isEditing={editingId === item.id}
            onEdit={() => setEditingId(item.id)}
            onCancelEdit={() => setEditingId(null)}
            onConfirmEdit={(patch) => updateItem(item.id, patch)}
            onRemove={() => removeItem(item.id)}
          />
        ))}

        {addingItem ? (
          <div className={styles.addFormWrap}>
            <ItineraryForm
              initial={{ time: "Mañana", title: "", place: "" }}
              onCancel={() => setAddingItem(false)}
              onConfirm={addItem}
            />
          </div>
        ) : (
          <button className={styles.addItemBtn} onClick={() => setAddingItem(true)}>
            <Plus size={16} /> Agregar actividad
          </button>
        )}
      </div>
    </div>
  );
}