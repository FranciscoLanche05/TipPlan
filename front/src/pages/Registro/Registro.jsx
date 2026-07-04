import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Registro.module.css";

const Registro = () => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Paso 1: datos personales
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [cedula, setCedula] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [observaciones, setObservaciones] = useState("");

  // Paso 2: credenciales
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const { register, authError, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya hay sesión
  useEffect(() => {
    if (isAuthenticated) navigate("/mis-viajes", { replace: true });
  }, [isAuthenticated, navigate]);

  const validateStep1 = () => {
    if (!nombres.trim()) return "Ingresa tus nombres.";
    if (!apellidos.trim()) return "Ingresa tus apellidos.";
    if (!cedula.trim()) return "Ingresa tu cédula.";
    if (!ciudad.trim()) return "Ingresa tu ciudad.";
    if (!email.trim()) return "Ingresa tu correo electrónico.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "El correo no es válido.";
    if (!telefono.trim()) return "Ingresa tu teléfono.";
    return null;
  };

  const validateStep2 = () => {
    if (!password) return "Ingresa una contraseña.";
    if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
    if (password !== confirmPassword) return "Las contraseñas no coinciden.";
    if (!aceptaTerminos) return "Debes aceptar los términos y condiciones.";
    return null;
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) {
      setFormError(err);
      return;
    }
    setFormError(null);
    clearError();
    setStep(2);
  };

  const handleBack = () => {
    setFormError(null);
    clearError();
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) {
      setFormError(err);
      return;
    }

    setFormError(null);
    setSubmitting(true);

    const displayName = `${nombres.trim()} ${apellidos.trim()}`;
    const profileData = {
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      cedula: cedula.trim(),
      ciudad: ciudad.trim(),
      telefono: telefono.trim(),
      observaciones: observaciones.trim(),
    };

    try {
      await register(email.trim(), password, displayName, profileData);
      navigate("/mis-viajes", { replace: true });
    } catch (err) {
      // el mensaje queda en authError
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Crear cuenta</h1>
      <p className={styles.subtitle}>
        Únete a TipPlan y empieza a planificar tus viajes
      </p>

      {/* INDICADOR DE PASOS */}
      <div className={styles.steps}>
        <div className={`${styles.step} ${step === 1 ? styles.stepActive : ""}`}>
          <span className={styles.stepNumber}>1</span> Datos personales
        </div>
        <div className={styles.stepDivider} />
        <div className={`${styles.step} ${step === 2 ? styles.stepActive : ""}`}>
          <span className={styles.stepNumber}>2</span> Credenciales
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {formError && <div className={styles.errorMsg}>{formError}</div>}
        {authError && <div className={styles.errorMsg}>{authError}</div>}

        {step === 1 && (
          <>
            <div>
              <label className={styles.label}>Nombres</label>
              <input
                className={styles.input}
                type="text"
                name="nombres"
                placeholder="Ingrese nombres"
                value={nombres}
                onChange={(e) => { setNombres(e.target.value); setFormError(null); }}
              />
            </div>
            <div>
              <label className={styles.label}>Apellidos</label>
              <input
                className={styles.input}
                type="text"
                name="apellidos"
                placeholder="Ingrese apellidos"
                value={apellidos}
                onChange={(e) => { setApellidos(e.target.value); setFormError(null); }}
              />
            </div>
            <div>
              <label className={styles.label}>Cédula</label>
              <input
                className={styles.input}
                type="text"
                name="cedula"
                placeholder="Ingrese cédula"
                value={cedula}
                onChange={(e) => { setCedula(e.target.value); setFormError(null); }}
              />
            </div>
            <div>
              <label className={styles.label}>Ciudad</label>
              <input
                className={styles.input}
                type="text"
                name="ciudad"
                placeholder="Ingrese ciudad"
                value={ciudad}
                onChange={(e) => { setCiudad(e.target.value); setFormError(null); }}
              />
            </div>
            <div>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                type="email"
                name="email"
                placeholder="Ingrese email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFormError(null); }}
              />
            </div>
            <div>
              <label className={styles.label}>Teléfono</label>
              <input
                className={styles.input}
                type="tel"
                name="telefono"
                placeholder="Ingrese teléfono"
                value={telefono}
                onChange={(e) => { setTelefono(e.target.value); setFormError(null); }}
              />
            </div>
            <div className={styles.fieldFull}>
              <label className={styles.label}>Observaciones</label>
              <textarea
                className={styles.textarea}
                name="observaciones"
                placeholder="Ingrese observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
            </div>
            <div className={styles.actionsRow}>
              <button
                type="button"
                className={styles.btnSubmit}
                onClick={handleNext}
              >
                Continuar →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className={styles.label}>Correo electrónico</label>
              <input
                className={styles.input}
                type="email"
                value={email}
                disabled
              />
            </div>
            <div>
              <label className={styles.label}>Contraseña</label>
              <input
                className={styles.input}
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFormError(null); clearError(); }}
              />
            </div>
            <div className={styles.fieldFull}>
              <label className={styles.label}>Confirmar contraseña</label>
              <input
                className={styles.input}
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setFormError(null); clearError(); }}
              />
            </div>
            <div className={styles.termsRow}>
              <input
                type="checkbox"
                id="terminos"
                checked={aceptaTerminos}
                onChange={(e) => { setAceptaTerminos(e.target.checked); setFormError(null); }}
              />
              <label htmlFor="terminos">
                Acepto los términos y condiciones y la política de privacidad
              </label>
            </div>
            <div className={styles.actionsRow}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={handleBack}
                disabled={submitting}
              >
                ← Volver
              </button>
              <button
                type="submit"
                className={styles.btnSubmit}
                disabled={submitting}
              >
                {submitting ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </div>
            <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" style={{ color: "rgb(229, 169, 59)", fontWeight: 700, textDecoration: "none" }}>
                Inicia sesión
              </Link>
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default Registro;
