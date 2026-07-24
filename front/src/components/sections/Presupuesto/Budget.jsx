import { useState } from "react";
import { Save } from "lucide-react";
import BudgetForm from "./BudgetForm";
import BudgetDonut from "./BudgetDonut";
import CategoryRow from "./CategoryRow";
import useProgress from "../../../hooks/useProgress";
import {
  saveBudget,
  updateBudget,
} from "@back/services/firestoreService";
import styles from "./Budget.module.css";

export const categories = [
  { id: "aloj",   label: "Alojamiento",  pct: 35, color: "var(--text-primary)" },
  { id: "trans",  label: "Transporte",   pct: 20, color: "#e8a020" },
  { id: "comida", label: "Comida",       pct: 25, color: "#d45830" },
  { id: "act",    label: "Actividades",  pct: 15, color: "#3b82a0" },
  { id: "otros",  label: "Otros",        pct: 5,  color: "#8a8f98" },
];

/**
 * Budget
 * - Sin props: modo local (uso en Home).
 * - Con userId: modo persistente (uso en Mis Viajes), muestra botón guardar.
 */
export default function Budget({ userId, existingDoc, onSaved }) {
  const [total, setTotal] = useState(existingDoc?.total || 1200);
  const [saving, setSaving] = useState(false);
  const progress = useProgress(total);

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    try {
      const data = {
        userId,
        total,
        categories: categories.map((c) => ({
          id: c.id,
          label: c.label,
          pct: c.pct,
          amount: Math.round((total * c.pct) / 100),
        })),
      };
      if (existingDoc?.id) {
        await updateBudget(existingDoc.id, data);
      } else {
        await saveBudget(data);
      }
      onSaved?.();
    } catch (err) {
      console.error("Error guardando presupuesto:", err);
      alert("No se pudo guardar el presupuesto. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.card}>
      <BudgetForm total={total} onChange={setTotal} />

      <div className={styles.grid}>
        <div className={styles.donutWrap}>
          <BudgetDonut total={total} progress={progress} categories={categories} />
        </div>

        <div className={styles.categories}>
          {categories.map((cat) => (
            <CategoryRow key={cat.id} category={cat} total={total} progress={progress} />
          ))}
        </div>
      </div>

      {/* Botón guardar (solo modo persistente) */}
      {userId && (
        <button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={saving}
        >
          <Save size={16} /> {saving ? "Guardando..." : "Guardar presupuesto"}
        </button>
      )}
    </div>
  );
}
