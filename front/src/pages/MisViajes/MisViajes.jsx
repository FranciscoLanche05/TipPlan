import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getUserItineraries,
  deleteItinerary,
  getUserBudgets,
  deleteBudget,
} from "@back/services/firestoreService";
import Planner from "../../components/sections/Planificador/Planner";
import styles from "./MisViajes.module.css";

const formatDate = (ts) => {
  if (!ts) return "Sin fecha";
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "Sin fecha";
  }
};

export default function MisViajes() {
  const { user } = useAuth();
  const [tab, setTab] = useState("itinerarios");
  const [itinerarios, setItinerarios] = useState([]);
  const [presupuestos, setPresupuestos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Editor embebido
  const [editing, setEditing] = useState(null); // { type: "itinerario" | "presupuesto", doc: null | {} }
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const loadAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [its, buds] = await Promise.all([
        getUserItineraries(user.uid),
        getUserBudgets(user.uid),
      ]);
      setItinerarios(its);
      setPresupuestos(buds);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleDeleteItinerario = async (id) => {
    if (!window.confirm("¿Eliminar este itinerario?")) return;
    try {
      await deleteItinerary(id);
      setItinerarios((prev) => prev.filter((i) => i.id !== id));
      showToast("Itinerario eliminado");
    } catch (err) {
      console.error(err);
      showToast("Error al eliminar");
    }
  };

  const handleDeletePresupuesto = async (id) => {
    if (!window.confirm("¿Eliminar este presupuesto?")) return;
    try {
      await deleteBudget(id);
      setPresupuestos((prev) => prev.filter((p) => p.id !== id));
      showToast("Presupuesto eliminado");
    } catch (err) {
      console.error(err);
      showToast("Error al eliminar");
    }
  };

  const handleSaved = () => {
    setEditing(null);
    loadAll();
    showToast("Guardado correctamente ✓");
  };

  // ─── MODO EDICIÓN ─────────────────────────────────────
  if (editing) {
    const isItin = editing.type === "itinerario";
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.editorWrap}>
            <div className={styles.editorHeader}>
              <h2 className={styles.editorTitle}>
                {editing.doc ? `Editar ${isItin ? "itinerario" : "presupuesto"}` : `Nuevo ${isItin ? "itinerario" : "presupuesto"}`}
              </h2>
              <button className={styles.btnBack} onClick={() => setEditing(null)}>
                ← Volver
              </button>
            </div>

            <Planner
              userId={user.uid}
              mode={isItin ? "itinerario" : "presupuesto"}
              existingDoc={editing.doc}
              onSaved={handleSaved}
              embedded
            />
          </div>
        </div>
        {toast && <div className={styles.toast}>{toast}</div>}
      </div>
    );
  }

  // ─── MODO LISTA ───────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>TU ESPACIO PERSONAL</span>
          <h1 className={styles.title}>
            Mis <em>Viajes</em>
          </h1>
          <p className={styles.subtitle}>
            Gestiona tus itinerarios y presupuestos guardados
          </p>
        </div>

        {/* TABS */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "itinerarios" ? styles.tabActive : ""}`}
            onClick={() => setTab("itinerarios")}
          >
            📅 Itinerarios ({itinerarios.length})
          </button>
          <button
            className={`${styles.tab} ${tab === "presupuestos" ? styles.tabActive : ""}`}
            onClick={() => setTab("presupuestos")}
          >
            💰 Presupuestos ({presupuestos.length})
          </button>
        </div>

        {/* ACCIÓN: CREAR NUEVO */}
        <div className={styles.topActions}>
          <button
            className={styles.btnPrimary}
            onClick={() => setEditing({ type: tab === "itinerarios" ? "itinerario" : "presupuesto", doc: null })}
          >
            + Nuevo {tab === "itinerarios" ? "itinerario" : "presupuesto"}
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>Cargando...</div>
        ) : tab === "itinerarios" ? (
          itinerarios.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>📅</div>
              <h3 className={styles.emptyTitle}>Aún no tienes itinerarios</h3>
              <p className={styles.emptyText}>
                Crea tu primer itinerario y organízalo día por día.
              </p>
            </div>
          ) : (
            <div className={styles.list}>
              {itinerarios.map((it) => (
                <div key={it.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>📅</div>
                    <span className={styles.cardDate}>{formatDate(it.createdAt)}</span>
                  </div>
                  <h3 className={styles.cardTitle}>
                    {it.destination || "Itinerario sin destino"}
                  </h3>
                  <p className={styles.cardMeta}>
                    {(it.days || []).length} día(s) ·{" "}
                    {(it.days || []).reduce((acc, d) => acc + (d.items?.length || 0), 0)} actividades
                  </p>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.btnEdit}
                      onClick={() => setEditing({ type: "itinerario", doc: it })}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.btnDelete}
                      onClick={() => handleDeleteItinerario(it.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          presupuestos.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>💰</div>
              <h3 className={styles.emptyTitle}>Aún no tienes presupuestos</h3>
              <p className={styles.emptyText}>
                Crea tu primer presupuesto y calcula los gastos de tu viaje.
              </p>
            </div>
          ) : (
            <div className={styles.list}>
              {presupuestos.map((p) => (
                <div key={p.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>💰</div>
                    <span className={styles.cardDate}>{formatDate(p.createdAt)}</span>
                  </div>
                  <h3 className={styles.cardTitle}>
                    Presupuesto ${Number(p.total || 0).toLocaleString()}
                  </h3>
                  <p className={styles.cardMeta}>
                    {(p.categories || []).length} categorías de gasto
                  </p>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.btnEdit}
                      onClick={() => setEditing({ type: "presupuesto", doc: p })}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.btnDelete}
                      onClick={() => handleDeletePresupuesto(p.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
