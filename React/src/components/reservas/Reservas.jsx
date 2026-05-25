import { useState } from "react";
import "./Reservas.css";

const RESULTS = {
  vuelos: [
    { logo:"✈️", bg:"rgba(0,100,200,0.15)",   name:"LATAM Airlines — UIO → LIM",         detail:"Quito → Lima · Ida y vuelta · 2h 30min · 1 parada",             badges:["ok","pop"], price:"$248", unit:"/persona", bookData:{ Tipo:"Vuelo", Ruta:"Quito (UIO) → Lima (LIM)", Fecha:"15 jul 2026", Clase:"Económica", Precio:"$248 por persona" } },
    { logo:"🛫", bg:"rgba(200,50,0,0.12)",    name:"Avianca — UIO → LIM",                detail:"Quito → Lima · Ida y vuelta · 3h 10min · 1 parada",             badges:["ok"],       price:"$215", unit:"/persona", bookData:{ Tipo:"Vuelo", Ruta:"Quito (UIO) → Lima (LIM)", Fecha:"15 jul 2026", Clase:"Económica", Precio:"$215 por persona" } },
    { logo:"🌐", bg:"rgba(50,150,50,0.12)",   name:"Copa Airlines — UIO → LIM",          detail:"Quito → Lima · Ida y vuelta · 4h 05min · 2 paradas",            badges:["new"],      price:"$189", unit:"/persona", bookData:{ Tipo:"Vuelo", Ruta:"Quito (UIO) → Lima (LIM) vía PTY", Fecha:"15 jul 2026", Clase:"Económica", Precio:"$189 por persona" } },
  ],
  hoteles: [
    { logo:"🏨", bg:"rgba(232,160,32,0.14)",  name:"Hotel Belmond Miraflores Park",       detail:"Lima, Perú · 5 estrellas · Vista al Pacífico · Desayuno incluido", badges:["pop"],      price:"$320", unit:"/noche", bookData:{ Tipo:"Hotel", Nombre:"Belmond Miraflores Park", Ciudad:"Lima, Perú", Fechas:"15 – 22 jul 2026", Precio:"$320 por noche" } },
    { logo:"🏩", bg:"rgba(46,139,87,0.12)",   name:"Casa Andina Premium Miraflores",      detail:"Lima, Perú · 4 estrellas · Spa · Restaurante incluido",          badges:["ok"],       price:"$148", unit:"/noche", bookData:{ Tipo:"Hotel", Nombre:"Casa Andina Premium", Ciudad:"Lima, Perú", Fechas:"15 – 22 jul 2026", Precio:"$148 por noche" } },
    { logo:"🌿", bg:"rgba(12,45,30,0.1)",     name:"Hotel B Barranco Design",             detail:"Lima, Perú · Boutique 4★ · Diseño exclusivo · Barranco artístico", badges:["new"],     price:"$195", unit:"/noche", bookData:{ Tipo:"Hotel", Nombre:"Hotel B Barranco", Ciudad:"Lima, Perú", Fechas:"15 – 22 jul 2026", Precio:"$195 por noche" } },
  ],
  tours: [
    { logo:"⛪", bg:"rgba(46,139,87,0.12)",   name:"Tour Centro Histórico + Panecillo",   detail:"Quito · City tour guiado · 6 horas · Transporte y guía incluidos", badges:["pop"],     price:"$45",  unit:"/persona", bookData:{ Tipo:"Tour", Nombre:"Centro Histórico + Panecillo", Ciudad:"Quito, Ecuador", Fecha:"16 jul 2026", Precio:"$45 por persona" } },
    { logo:"🌋", bg:"rgba(232,160,32,0.14)",  name:"Expedición Volcán Cotopaxi",          detail:"Quito · Aventura · Día completo · Equipo, refrigerio y guía incluidos", badges:["ok","pop"], price:"$89", unit:"/persona", bookData:{ Tipo:"Tour", Nombre:"Expedición Volcán Cotopaxi", Ciudad:"Cotopaxi, Ecuador", Fecha:"16 jul 2026", Precio:"$89 por persona" } },
    { logo:"🌊", bg:"rgba(0,150,200,0.12)",   name:"Galápagos — Navegación 4 días",       detail:"Santa Cruz · Naturaleza · 4 días · Todo incluido · Cupos limitados", badges:["new"],    price:"$1,200", unit:"/persona", bookData:{ Tipo:"Tour", Nombre:"Galápagos 4 días", Ciudad:"Islas Galápagos", Fecha:"16 jul 2026", Precio:"$1,200 por persona" } },
  ],
  transporte: [
    { logo:"🚗", bg:"rgba(12,45,30,0.1)",     name:"Sedan privado — Ejecutivo",           detail:"Aeropuerto → Centro Histórico · Hasta 3 pasajeros · A/C · WiFi", badges:["ok"],       price:"$28",  unit:"/viaje", bookData:{ Tipo:"Transporte", Vehículo:"Sedan Ejecutivo", Ruta:"Aeropuerto → Centro Histórico", Fecha:"15 jul 2026 14:30", Precio:"$28 por viaje" } },
    { logo:"🚐", bg:"rgba(232,160,32,0.14)",  name:"Van grupal — Aeropuerto Shuttle",     detail:"Aeropuerto → Zona Rosa · Hasta 8 pasajeros · Salidas cada 30 min", badges:["pop"],     price:"$8",   unit:"/persona", bookData:{ Tipo:"Transporte", Vehículo:"Van Shuttle", Ruta:"Aeropuerto → Zona Rosa", Fecha:"15 jul 2026 14:30", Precio:"$8 por persona" } },
    { logo:"🚙", bg:"rgba(46,139,87,0.12)",   name:"SUV 4x4 — Aventura off-road",         detail:"Quito → Cotopaxi → Quito · Guía incluido · 1 día completo",      badges:["new"],      price:"$95",  unit:"/día",    bookData:{ Tipo:"Transporte", Vehículo:"SUV 4x4", Ruta:"Quito ↔ Cotopaxi", Fecha:"16 jul 2026", Precio:"$95 por día" } },
  ],
};

const BADGE_MAP = {
  ok:  <span className="rc-badge badge-ok">✓ Disponible</span>,
  pop: <span className="rc-badge badge-pop">★ Popular</span>,
  new: <span className="rc-badge badge-new">✦ Nuevo</span>,
};

export default function Reservas() {
  const [activeTab,    setActiveTab]    = useState("vuelos");
  const [results,      setResults]      = useState({});
  const [modal,        setModal]        = useState(null);   // bookData object | null
  const [toast,        setToast]        = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  /* forms state */
  const [vuelos,     setVuelos]     = useState({ origen:"Quito (UIO)", destino:"Lima (LIM)", ida:"2026-07-15", regreso:"2026-07-22", clase:"Económica", pasajeros:"1 adulto" });
  const [hoteles,    setHoteles]    = useState({ destino:"Lima, Perú", checkin:"2026-07-15", checkout:"2026-07-22", habitaciones:"1 hab.", huespedes:"2 personas", categoria:"Cualquiera" });
  const [tours,      setTours]      = useState({ destino:"Quito, Ecuador", fecha:"2026-07-16", tipo:"Todos los tipos", personas:"2", duracion:"Día completo" });
  const [transporte, setTransporte] = useState({ recogida:"Aeropuerto Mariscal Sucre", destino:"Centro Histórico, Quito", fecha:"2026-07-15", hora:"14:30", vehiculo:"Estándar", pasajeros:"1 – 2" });

  const showToast = (msg) => {
    setToast(msg); setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3200);
  };

  const handleSearch = (cat) => {
    setResults(prev => ({ ...prev, [cat]: RESULTS[cat] }));
  };

  const handleBook = (item) => setModal(item.bookData);
  const closeModal = () => setModal(null);
  const confirmReserva = () => { closeModal(); showToast("¡Reserva confirmada! Recibirás un email con los detalles. ✓"); };

  const Field = ({ label, value, onChange, type="text", options }) => (
    <div className="rf-field">
      <label className="rf-label">{label}</label>
      {options
        ? <select className="rf-select" value={value} onChange={e => onChange(e.target.value)}>
            {options.map(o => <option key={o}>{o}</option>)}
          </select>
        : <input className="rf-input" type={type} value={value} onChange={e => onChange(e.target.value)} />
      }
    </div>
  );

  return (
    <section id="reservas" className="res-section">

      <div className="section-tag">Reserva sin complicaciones</div>
      <h2 className="section-title">Reserva tu <em>aventura</em> completa</h2>
      <p className="section-sub">Vuelos, hoteles, tours y transporte — todo en un solo lugar, con los mejores precios garantizados.</p>

      {/* Tabs */}
      <div className="res-tabs">
        {["vuelos","hoteles","tours","transporte"].map(cat => (
          <button key={cat} className={`res-tab${activeTab === cat ? " active" : ""}`} onClick={() => setActiveTab(cat)}>
            {{ vuelos:"✈️ Vuelos", hoteles:"🏨 Hoteles", tours:"🗺️ Tours", transporte:"🚗 Transporte" }[cat]}
          </button>
        ))}
      </div>

      {/* ── Panel Vuelos ── */}
      {activeTab === "vuelos" && (
        <div className="res-panel">
          <div className="res-form-card">
            <div className="rf-grid-4">
              <Field label="Origen"   value={vuelos.origen}   onChange={v => setVuelos({...vuelos, origen:v})} />
              <Field label="Destino"  value={vuelos.destino}  onChange={v => setVuelos({...vuelos, destino:v})} />
              <Field label="Ida"      value={vuelos.ida}      onChange={v => setVuelos({...vuelos, ida:v})} type="date" />
              <Field label="Regreso"  value={vuelos.regreso}  onChange={v => setVuelos({...vuelos, regreso:v})} type="date" />
            </div>
            <div className="rf-row-last">
              <Field label="Clase"     value={vuelos.clase}     onChange={v => setVuelos({...vuelos, clase:v})} options={["Económica","Business","Primera clase"]} />
              <Field label="Pasajeros" value={vuelos.pasajeros} onChange={v => setVuelos({...vuelos, pasajeros:v})} options={["1 adulto","2 adultos","2 adultos, 1 niño","Grupo (4+)"]} />
              <button className="rf-search-btn" onClick={() => handleSearch("vuelos")}>🔍 Buscar vuelos</button>
            </div>
          </div>
          <ResultList items={results.vuelos} onBook={handleBook} />
        </div>
      )}

      {/* ── Panel Hoteles ── */}
      {activeTab === "hoteles" && (
        <div className="res-panel">
          <div className="res-form-card">
            <div className="rf-grid-3">
              <Field label="Destino"   value={hoteles.destino}   onChange={v => setHoteles({...hoteles, destino:v})} />
              <Field label="Check-in"  value={hoteles.checkin}   onChange={v => setHoteles({...hoteles, checkin:v})} type="date" />
              <Field label="Check-out" value={hoteles.checkout}  onChange={v => setHoteles({...hoteles, checkout:v})} type="date" />
            </div>
            <div className="rf-row-last">
              <Field label="Habitaciones" value={hoteles.habitaciones} onChange={v => setHoteles({...hoteles, habitaciones:v})} options={["1 hab.","2 hab.","3+ hab."]} />
              <Field label="Huéspedes"    value={hoteles.huespedes}    onChange={v => setHoteles({...hoteles, huespedes:v})}    options={["1 persona","2 personas","Familia"]} />
              <Field label="Categoría"    value={hoteles.categoria}    onChange={v => setHoteles({...hoteles, categoria:v})}    options={["Cualquiera","★★★","★★★★","★★★★★"]} />
              <button className="rf-search-btn" onClick={() => handleSearch("hoteles")}>🔍 Buscar hoteles</button>
            </div>
          </div>
          <ResultList items={results.hoteles} onBook={handleBook} />
        </div>
      )}

      {/* ── Panel Tours ── */}
      {activeTab === "tours" && (
        <div className="res-panel">
          <div className="res-form-card">
            <div className="rf-grid-3">
              <Field label="Destino del tour" value={tours.destino}  onChange={v => setTours({...tours, destino:v})} />
              <Field label="Fecha"            value={tours.fecha}    onChange={v => setTours({...tours, fecha:v})} type="date" />
              <Field label="Tipo de tour"     value={tours.tipo}     onChange={v => setTours({...tours, tipo:v})} options={["Todos los tipos","Cultural / histórico","Aventura / naturaleza","Gastronómico","City tour"]} />
            </div>
            <div className="rf-row-last">
              <Field label="Personas" value={tours.personas}  onChange={v => setTours({...tours, personas:v})} options={["1","2","3 – 5","Grupo"]} />
              <Field label="Duración" value={tours.duracion}  onChange={v => setTours({...tours, duracion:v})} options={["Medio día","Día completo","Multi-día"]} />
              <button className="rf-search-btn" onClick={() => handleSearch("tours")}>🔍 Buscar tours</button>
            </div>
          </div>
          <ResultList items={results.tours} onBook={handleBook} />
        </div>
      )}

      {/* ── Panel Transporte ── */}
      {activeTab === "transporte" && (
        <div className="res-panel">
          <div className="res-form-card">
            <div className="rf-grid-4">
              <Field label="Recogida" value={transporte.recogida} onChange={v => setTransporte({...transporte, recogida:v})} />
              <Field label="Destino"  value={transporte.destino}  onChange={v => setTransporte({...transporte, destino:v})} />
              <Field label="Fecha"    value={transporte.fecha}    onChange={v => setTransporte({...transporte, fecha:v})} type="date" />
              <Field label="Hora"     value={transporte.hora}     onChange={v => setTransporte({...transporte, hora:v})} type="time" />
            </div>
            <div className="rf-row-last">
              <Field label="Tipo de vehículo" value={transporte.vehiculo}   onChange={v => setTransporte({...transporte, vehiculo:v})}   options={["Económico","Estándar","SUV / Camioneta","Van grupal"]} />
              <Field label="Pasajeros"        value={transporte.pasajeros} onChange={v => setTransporte({...transporte, pasajeros:v})} options={["1 – 2","3 – 4","5 – 7","8+"]} />
              <button className="rf-search-btn" onClick={() => handleSearch("transporte")}>🔍 Buscar transporte</button>
            </div>
          </div>
          <ResultList items={results.transporte} onBook={handleBook} />
        </div>
      )}

      {/* Features strip */}
      <div className="res-features">
        {[
          { icon:"🔒", title:"Pago seguro",           desc:"Transacciones cifradas con los más altos estándares de seguridad." },
          { icon:"🔄", title:"Cancelación flexible",  desc:"Cancela hasta 48 horas antes sin penalización en la mayoría de servicios." },
          { icon:"💬", title:"Soporte 24/7",           desc:"Nuestro equipo está disponible todo el día para ayudarte." },
          { icon:"🏅", title:"Mejor precio",           desc:"Comparamos opciones para darte el mejor precio disponible." },
        ].map(f => (
          <div className="res-feat" key={f.title}>
            <div className="rf-icon">{f.icon}</div>
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay open" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Confirmar reserva</h3>
            <p>Revisa los detalles antes de confirmar tu reserva.</p>
            <div className="modal-info">
              {Object.entries(modal).map(([k, v]) => (
                <div className="modal-info-row" key={k}>
                  <span className="k">{k}</span>
                  <span className="v">{v}</span>
                </div>
              ))}
            </div>
            <div className="modal-btns">
              <button className="modal-cancel"  onClick={closeModal}>Cancelar</button>
              <button className="modal-confirm" onClick={confirmReserva}>Confirmar ✈</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`toast${toastVisible ? " show" : ""}`}>{toast}</div>
    </section>
  );
}

/* ── Sub-componente ResultList ── */
function ResultList({ items, onBook }) {
  if (!items) return null;
  return (
    <div className="res-results">
      {items.map((r, i) => (
        <div className="res-card" key={i} onClick={() => onBook(r)}>
          <div className="rc-logo" style={{ background: r.bg }}>{r.logo}</div>
          <div className="rc-info">
            <div className="rc-name">{r.name}</div>
            <div className="rc-detail">{r.detail}</div>
            <div className="rc-badges">{r.badges.map(b => <span key={b}>{
              { ok: <span className="rc-badge badge-ok">✓ Disponible</span>,
                pop:<span className="rc-badge badge-pop">★ Popular</span>,
                new:<span className="rc-badge badge-new">✦ Nuevo</span> }[b]
            }</span>)}</div>
          </div>
          <div className="rc-price">
            <div className="rc-price-val">{r.price}</div>
            <div className="rc-price-unit">{r.unit}</div>
            <button className="rc-book-btn">Reservar →</button>
          </div>
        </div>
      ))}
    </div>
  );
}