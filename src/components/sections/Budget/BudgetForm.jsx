import useAnimatedNumber from "../../../hooks/useAnimatedNumber";
import styles from "./Budget.module.css";

export default function BudgetForm({ total, onChange }) {
  const displayTotal = useAnimatedNumber(total);

  return (
    <div className={styles.sliderRow}>
      <div className={styles.sliderHeader}>
        <span className={styles.sliderLabel}>Presupuesto total</span>
        <span className={styles.sliderValue}>${displayTotal.toLocaleString()}</span>
      </div>
      <input
        type="range"
        min="300"
        max="5000"
        step="50"
        value={total}
        onChange={(e) => onChange(Number(e.target.value))}
        className={styles.range}
      />
    </div>
  );
}
