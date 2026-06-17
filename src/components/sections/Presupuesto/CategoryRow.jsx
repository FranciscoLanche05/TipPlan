import { Home, Car, Utensils, Compass, MoreHorizontal } from "lucide-react";
import useAnimatedNumber from "../../../hooks/useAnimatedNumber";
import styles from "./Budget.module.css";

const ICONS = { aloj: Home, trans: Car, comida: Utensils, act: Compass, otros: MoreHorizontal };

export default function CategoryRow({ category, total, progress }) {
  const amount = Math.round((total * category.pct) / 100);
  const displayAmount = useAnimatedNumber(amount);
  const Icon = ICONS[category.id] || MoreHorizontal;

  return (
    <div className={styles.categoryRow}>
      <div className={styles.categoryIcon} style={{ background: category.color + "22" }}>
        <Icon size={16} style={{ color: category.color }} />
      </div>
      <div className={styles.categoryBody}>
        <div className={styles.categoryHeader}>
          <span>{category.label}</span>
          <span>${displayAmount.toLocaleString()}</span>
        </div>
        <div className={styles.barBg}>
          <div
            className={styles.barFill}
            style={{ width: `${progress * category.pct}%`, background: category.color }}
          />
        </div>
      </div>
    </div>
  );
}