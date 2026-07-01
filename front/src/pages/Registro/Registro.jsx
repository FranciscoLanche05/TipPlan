import styles from "./Registro.module.css";

const Registro = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Registro de Personas</h1>
      <p className={styles.subtitle}>Complete el formulario para agregar un nuevo registro</p>

      <form className={styles.form}>
        <div>
          <label className={styles.label}>Nombres</label>
          <input
            className={styles.input}
            type="text"
            name="nombres"
            placeholder="Ingrese nombres"
          />
        </div>
        <div>
          <label className={styles.label}>Apellidos</label>
          <input
            className={styles.input}
            type="text"
            name="apellidos"
            placeholder="Ingrese apellidos"
          />
        </div>
        <div>
          <label className={styles.label}>Cédula</label>
          <input
            className={styles.input}
            type="text"
            name="cedula"
            placeholder="Ingrese cédula"
          />
        </div>
        <div>
          <label className={styles.label}>Ciudad</label>
          <input
            className={styles.input}
            type="text"
            name="ciudad"
            placeholder="Ingrese ciudad"
          />
        </div>
        <div>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="Ingrese email"
          />
        </div>
        <div>
          <label className={styles.label}>Teléfono</label>
          <input
            className={styles.input}
            type="tel"
            name="telefono"
            placeholder="Ingrese teléfono"
          />
        </div>
        <div className={styles.fieldFull}>
          <label className={styles.label}>Observaciones</label>
          <textarea
            className={styles.textarea}
            name="observaciones"
            placeholder="Ingrese observaciones"
          />
        </div>
        <button className={styles.btnSubmit} type="submit">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default Registro;
