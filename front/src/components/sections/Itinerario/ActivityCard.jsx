import { Sunrise, Sun, Moon, MapPin, Pencil, Trash2 } from "lucide-react";
import ItineraryForm from "./ItineraryForm";
import styles from "./Itinerary.module.css";

const TIME_ICONS = { "Mañana": Sunrise, "Tarde": Sun, "Noche": Moon };

export default function ActivityCard({
  item, index, isLast, isEditing, onEdit, onCancelEdit, onConfirmEdit, onRemove,
}) {
  const Icon = TIME_ICONS[item.time] || Sunrise;

  return (
    <div className={styles.row} style={{ animationDelay: `${index * 0.08}s` }}>
      <div className={styles.iconCol}>
        <div className={styles.iconCircle}>
          <Icon size={18} color="#e8a020" />
        </div>
        {!isLast && <div className={styles.connector} />}
      </div>

      <div className={`${styles.card2} ${isEditing ? styles.card2Editing : ""}`}>
        {isEditing ? (
          <ItineraryForm initial={item} onCancel={onCancelEdit} onConfirm={onConfirmEdit} />
        ) : (
          <div className={styles.cardContent}>
            <div className={styles.cardText}>
              <span className={styles.timeLabel}>{item.time}</span>
              <div className={styles.itemTitle}>{item.title}</div>
              {item.place && (
                <div className={styles.itemPlace}>
                  <MapPin size={11} /> <span>{item.place}</span>
                </div>
              )}
            </div>
            <div className={styles.cardActions}>
              <button className={styles.iconBtn} onClick={onEdit}>
                <Pencil size={13} />
              </button>
              <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} onClick={onRemove}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}