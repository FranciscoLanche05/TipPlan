import { useState } from "react";
import { Calendar, Wallet } from "lucide-react";
import Itinerary from "../Itinerario/Itinerary";
import Budget from "../Presupuesto/Budget";
import styles from "./Planner.module.css";

export default function Planner() {
  const [tab, setTab] = useState("itin");

  return (
    <section className={styles.planner}>
      <div className={styles.blobA} />
      <div className={styles.blobB} />

      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Tu viaje</p>
          <h2 className={styles.title}>Planifica sin complicarte</h2>
        </div>

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
            <Itinerary />
          </div>
        ) : (
          <div key="budget" className={styles.tabPanel}>
            <Budget />
          </div>
        )}
      </div>
    </section>
  );
}