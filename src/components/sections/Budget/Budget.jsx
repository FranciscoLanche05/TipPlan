import { useState } from "react";
import BudgetForm from "./BudgetForm";
import BudgetDonut from "./BudgetDonut";
import CategoryRow from "./CategoryRow";
import useProgress from "../../../hooks/useProgress";
import styles from "./Budget.module.css";

export const categories = [
  { id: "aloj",   label: "Alojamiento",  pct: 35, color: "#1f5c3a" },
  { id: "trans",  label: "Transporte",   pct: 20, color: "#e8a020" },
  { id: "comida", label: "Comida",       pct: 25, color: "#d45830" },
  { id: "act",    label: "Actividades",  pct: 15, color: "#3b82a0" },
  { id: "otros",  label: "Otros",        pct: 5,  color: "#8a8f98" },
];

export default function Budget() {
  const [total, setTotal] = useState(1200);
  const progress = useProgress(total);

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
    </div>
  );
}