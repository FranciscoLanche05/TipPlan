import { useState } from "react";
import "./Planificador.css";

const TYPE_META = {
  actividad:   { icon: "🎯", bg: "rgba(46,139,87,0.1)" },
  transport:   { icon: "🚗", bg: "rgba(12,45,30,0.09)" },
  alojamiento: { icon: "🏨", bg: "rgba(232,160,32,0.12)" },
  comida:      { icon: "🍽️", bg: "rgba(212,88,48,0.1)" },
};

const INITIAL_DAYS = [
  {
    label: "Quito", date: "Lunes, 15 jul 2026",
    activities: [
      { time:"08:00", ampm:"AM", icon:"🚗", iconBg:"rgba(12,45,30,0.09)", title:"Transfer aeropuerto → hotel", desc:"Vehículo privado desde Mariscal Sucre al centro histórico", tags:["transport"] },
      { time:"10:30", ampm:"AM", icon:"🏨", iconBg:"rgba(232,160,32,0.12)", title:"Check-in Hotel Casa Gangotena", desc:"Hotel boutique en el corazón del centro histórico de Quito", tags:["alojamiento"] },
      { time:"12:00", ampm:"PM", icon:"🍽️", iconBg:"rgba(212,88,48,0.1)", title:"Almuerzo: Café del Fraile", desc:"Restaurante tradicional ecuatoriano — menú del día", tags:["comida"] },
      { time:"02:00", ampm:"PM", icon:"⛪", iconBg:"rgba(46,139,87,0.1)", title:"Visita Basílica del Voto Nacional", desc:"Tour guiado por la basílica más grande de Ecuador", tags:["actividad"] },
    ],
  },
  {
    label: "Cotopaxi", date: "Martes, 16 jul 2026",
    activities: [
      { time:"05:30", ampm:"AM", icon:"🚐", iconBg:"rgba(12,45,30,0.09)", title:"Salida en van hacia el Cotopaxi", desc:"Transporte grupal desde Quito al Parque Nacional Cotopaxi", tags:["transport"] },
      { time:"09:00", ampm:"AM", icon:"🌋", iconBg:"rgba(46,139,87,0.1)", title:"Trekking al refugio José Rivas", desc:"Caminata guiada hasta 4,800 msnm, equipo incluido", tags:["actividad"] },
      { time:"01:00", ampm:"PM", icon:"🍽️", iconBg:"rgba(212,88,48,0.1)", title:"Almuerzo en refugio", desc:"Sopa caliente y bebidas en el refugio de montaña", tags:["comida"] },
      { time:"05:00", ampm:"PM", icon:"🏨", iconBg:"rgba(232,160,32,0.12)", title:"Check-in Hacienda El Porvenir", desc:"Hacienda histórica junto al volcán Cotopaxi", tags:["alojamiento"] },
    ],
  },
  {
    label: "Cuenca", date: "Miércoles, 17 jul 2026",
    activities: [
      { time:"07:00", ampm:"AM", icon:"✈️", iconBg:"rgba(12,45,30,0.09)", title:"Vuelo Quito → Cuenca", desc:"Vuelo doméstico LATAM, 45 minutos. Terminal nacional", tags:["transport"] },
      { time:"10:30", ampm:"AM", icon:"🏛️", iconBg:"rgba(46,139,87,0.1)", title:"Catedral Nueva de Cuenca", desc:"Visita a la icónica catedral con cúpulas azules, Patrimonio UNESCO", tags:["actividad"] },
    ],
  },
];

export default function Planificador() {
  const [days, setDays] = useState(INITIAL_DAYS);
  const [currentDay, setCurrentDay] = useState(0);
  const [aaTitle, setAaTitle] = useState("");
  const [aaType, setAaType]   = useState("actividad");
  const [aaTime, setAaTime]   = useState("09:00");
  const [toast, setToast]     = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3200);
  };

  const addDay = () => {
    const labels = ["Ciudad nueva", "Aventura", "Descanso", "Exploración", "Regreso"];
    const n = days.length;
    setDays([...days, { label: labels[n % labels.length], date: `Día ${n + 1} del viaje`, activities: [] }]);
    setCurrentDay(n);
    showToast(`Día ${n + 1} agregado al itinerario`);
  };

  const addActivity = () => {
    if (!aaTitle.trim()) { showToast("Escribe el nombre de la actividad"); return; }
    const [h, m] = aaTime.split(":");
    const hr = parseInt(h);
    const ampm = hr >= 12 ? "PM" : "AM";
    const time = `${hr > 12 ? hr - 12 : hr || 12}:${m}`;
    const meta = TYPE_META[aaType];
    const newAct = { time, ampm, icon: meta.icon, iconBg: meta.bg, title: aaTitle.trim(), desc: "", tags: [aaType] };
    const updated = days.map((d, i) =>
      i === currentDay ? { ...d, activities: [...d.activities, newAct] } : d
    );
    setDays(updated);
    setAaTitle("");
    showToast("Actividad agregada ✓");
  };

  const deleteActivity = (idx) => {
    const updated = days.map((d, i) =>
      i === currentDay ? { ...d, activities: d.activities.filter((_, ai) => ai !== idx) } : d
    );
    setDays(updated);
  };

  const all   = days.flatMap(d => d.activities);
  const day   = days[currentDay];
  const total = day.activities.length;

  return (
    <section id="itinerary" className="itin-section">

      {/* Header */}
      <div className="itin-header">
        <div>
          <div className="section-tag">Organiza tu viaje</div>
          <h2 className="section-title">Planificador de <em>Itinerarios</em></h2>
          <p className="section-sub">Organiza actividades, fechas, transporte y alojamiento día por día.</p>
        </div>
        <button className="itin-btn-add" onClick={addDay}>+ Agregar día</button>
      </div>

      {/* Summary pills */}
      <div className="itin-summary">
        <div className="sum-pill"><span className="sp-icon">📅</span><div><div className="sp-val">{days.length}</div><div className="sp-label">Días planificados</div></div></div>
        <div className="sum-pill"><span className="sp-icon">🎯</span><div><div className="sp-val">{all.filter(a => a.tags.includes("actividad") || a.tags.includes("comida")).length}</div><div className="sp-label">Actividades</div></div></div>
        <div className="sum-pill"><span className="sp-icon">🏨</span><div><div className="sp-val">{all.filter(a => a.tags.includes("alojamiento")).length}</div><div className="sp-label">Alojamientos</div></div></div>
        <div className="sum-pill"><span className="sp-icon">🚗</span><div><div className="sp-val">{all.filter(a => a.tags.includes("transport")).length}</div><div className="sp-label">Transportes</div></div></div>
      </div>

      {/* Main layout */}
      <div className="itin-layout">

        {/* Sidebar */}
        <div className="day-sidebar">
          <div className="day-sidebar-head"><h4>Días del viaje</h4></div>
          <div className="day-list">
            {days.map((d, i) => (
              <div key={i} className={`day-tab${i === currentDay ? " active" : ""}`} onClick={() => setCurrentDay(i)}>
                <div className="day-num">{String(i + 1).padStart(2, "0")}</div>
                <div className="day-info">
                  <div className="day-label">Día {i + 1} – {d.label}</div>
                  <div className="day-date">{d.date.split(",")[0]}</div>
                </div>
                <div className="day-dot" />
              </div>
            ))}
          </div>
          <button className="day-add-btn" onClick={addDay}>+ Nuevo día</button>
        </div>

        {/* Panel */}
        <div className="day-panel">
          <div className="day-panel-head">
            <div>
              <div className="day-panel-title">Día {currentDay + 1} – {day.label}</div>
              <div className="day-panel-date">{day.date}</div>
            </div>
            <div className="panel-progress-label">{total} actividad{total !== 1 ? "es" : ""}</div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: total ? "100%" : "0%" }} />
          </div>

          <div className="activities">
            {total === 0 ? (
              <div className="act-empty">
                <div className="em-icon">🗺️</div>
                <p>No hay actividades aún.<br />Agrega la primera usando el campo de abajo.</p>
              </div>
            ) : (
              day.activities.map((a, ai) => (
                <div className="activity-card" key={ai}>
                  <div className="ac-time">
                    <div className="ac-icon-wrap" style={{ background: a.iconBg }}>{a.icon}</div>
                    <div className="ac-hour">{a.time}</div>
                    <div className="ac-ampm">{a.ampm}</div>
                  </div>
                  <div className="ac-body">
                    <div className="ac-title">{a.title}</div>
                    {a.desc && <div className="ac-desc">{a.desc}</div>}
                    <div className="ac-tags">
                      {a.tags.map(t => <span key={t} className={`ac-tag tag-${t}`}>{t}</span>)}
                    </div>
                  </div>
                  <div className="ac-actions">
                    <button className="ac-act-btn del" onClick={() => deleteActivity(ai)}>✕</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add activity bar */}
          <div className="add-activity-bar">
            <input className="aa-input" placeholder="Ej: Visita al Cotopaxi..." value={aaTitle} onChange={e => setAaTitle(e.target.value)} />
            <select className="aa-select" value={aaType} onChange={e => setAaType(e.target.value)}>
              <option value="actividad">🎯 Actividad</option>
              <option value="transport">🚗 Transporte</option>
              <option value="alojamiento">🏨 Alojamiento</option>
              <option value="comida">🍽️ Comida</option>
            </select>
            <input className="aa-input aa-time" type="time" value={aaTime} onChange={e => setAaTime(e.target.value)} />
            <button className="aa-btn" onClick={addActivity}>Agregar</button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className={`toast${toastVisible ? " show" : ""}`}>{toast}</div>
    </section>
  );
}