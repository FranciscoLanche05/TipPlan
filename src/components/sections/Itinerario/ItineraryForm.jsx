import { useState } from "react";
import { Check, X } from "lucide-react";
import styles from "./Itinerary.module.css";

const TIME_OPTIONS = ["Mañana", "Tarde", "Noche"];

export default function ItineraryForm({ initial, onCancel, onConfirm }) {
  const [draft, setDraft] = useState({
    time: initial.time || "Mañana",
    title: initial.title || "",
    place: initial.place || "",
  });

  function handleConfirm() {
    if (!draft.title.trim()) return;
    onConfirm(draft);
  }

  return (
    <div className={styles.form}>
      <select
        className={styles.formSelect}
        value={draft.time}
        onChange={(e) => setDraft({ ...draft, time: e.target.value })}
      >
        {TIME_OPTIONS.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <input
        className={styles.formInput}
        placeholder="Título de la actividad"
        value={draft.title}
        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
      />
      <input
        className={styles.formInputSmall}
        placeholder="Lugar"
        value={draft.place}
        onChange={(e) => setDraft({ ...draft, place: e.target.value })}
      />
      <div className={styles.formActions}>
        <button className={styles.cancelBtn} onClick={onCancel}><X size={14} /></button>
        <button className={styles.confirmBtn} onClick={handleConfirm}><Check size={14} /></button>
      </div>
    </div>
  );
}