import { useState } from "react";
import { Calendar, Wallet } from "lucide-react";
import Itinerary from "../Itinerario/Itinerary";
import Budget from "../Presupuesto/Budget";
import styles from "./Planner.module.css";

/**
 * Planner
 * Props (todas opcionales — para uso embebido en Mis Viajes):
 *  - userId: habilita modo persistente (guardar/cargar en Firestore)
 *  - mode: "itinerario" | "presupuesto" — tab inicial al editar
 *  - existingDoc: documento a editar (carga datos iniciales)
 *  - onSaved: callback tras guardar
 *  - embedded: oculta encabezado/blobs cuando se usa dentro de otra página
 */
export default function Planner({ userId, mode, existingDoc, onSaved, embedded }) {
  const [tab, setTab] = useState(mode === "presupuesto" ? "budget" : "itin");

  return (
    <section id="planificador" className={styles.planner}>
      {!embedded && (
        <>
          <div className={styles.blobA} />
          <div className={styles.blobB} />
        </>
      )}

      <div className={styles.inner}>
        {!embedded && (
          <div className={styles.header}>
            <p className={styles.eyebrow}>Tu viaje</p>
            <h2 className={styles.title}>Planifica sin complicarte</h2>
          </div>
        )}

        <div className={styles.tabSwitch}>
          <div
            className={styles.indicator}
            style={{ left: tab === "itin" ? "4px" : "calc(50% + 0px)" }}
          />
          <button
            className={`${styles.tabBtn} ${tab === "itin" ? styles.tabBtnActive : ""}`}
            onClick={() => setTab("itin")}
          >
            <Calendar size={16} /> Itinerario
          </button>
          <button
            className={`${styles.tabBtn} ${tab === "budget" ? styles.tabBtnActive : ""}`}
            onClick={() => setTab("budget")}
          >
            <Wallet size={16} /> Presupuesto
          </button>
        </div>

        {tab === "itin" ? (
          <div key="itin" className={styles.tabPanel}>
            <Itinerary
              userId={userId}
              existingDoc={mode === "itinerario" ? existingDoc : undefined}
              onSaved={onSaved}
            />
          </div>
        ) : (
          <div key="budget" className={styles.tabPanel}>
            <Budget
              userId={userId}
              existingDoc={mode === "presupuesto" ? existingDoc : undefined}
              onSaved={onSaved}
            />
          </div>
        )}
      </div>
    </section>
  );
}
