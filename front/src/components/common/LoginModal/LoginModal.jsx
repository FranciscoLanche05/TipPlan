import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import styles from "./LoginModal.module.css";

const STEP_EMAIL = "EMAIL";
const STEP_LOGIN = "LOGIN";
const STEP_REGISTER = "REGISTER";

const LoginModal = () => {
  const {
    isLoginModalOpen,
    closeLoginModal,
    loginGoogle,
    checkEmailExists,
    login,
    register,
    authError,
    clearError,
  } = useAuth();
  
  const navigate = useNavigate();

  const [step, setStep] = useState(STEP_EMAIL);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Reiniciar estado cuando se abre/cierra
  useEffect(() => {
    if (!isLoginModalOpen) {
      setStep(STEP_EMAIL);
      setEmail("");
      setPassword("");
      setName("");
      setSubmitting(false);
    }
  }, [isLoginModalOpen]);

  if (!isLoginModalOpen) return null;

  const handleContinueWithEmail = async (e) => {
    e.preventDefault();
    if (!email) return;
    clearError();
    setSubmitting(true);
    
    // Validar si el correo existe
    const exists = await checkEmailExists(email);
    setSubmitting(false);

    if (exists === true) {
      setStep(STEP_LOGIN);
    } else if (exists === false) {
      setStep(STEP_REGISTER);
    } else {
      // Fallback si la verificación falla (ej. protección contra enumeración)
      setStep(STEP_LOGIN); 
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;
    setSubmitting(true);
    try {
      await login(email, password);
      closeLoginModal();
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      // error manejado en AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!password || !name) return;
    setSubmitting(true);
    try {
      await register(email, password, name);
      closeLoginModal();
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      // error manejado en AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginGoogle();
      navigate(ROUTES.DASHBOARD);
    } catch (err) {}
  };

  const goBack = () => {
    setStep(STEP_EMAIL);
    setPassword("");
    setName("");
    clearError();
  };

  return (
    <div className={styles.overlay} onMouseDown={closeLoginModal}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className={styles.header}>
          <div className={styles.logo}>
            Tip<span>Plan</span>
          </div>
          <button className={styles.closeBtn} onClick={closeLoginModal} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {step === STEP_EMAIL && (
            <>
              <h2 className={styles.title}>Inicia sesión o regístrate</h2>
              
              <div className={styles.socialButtons}>
                <button className={styles.socialBtn} onClick={handleGoogle}>
                  <span className={styles.iconGoogle}>G</span> Google
                </button>
              </div>

              <div className={styles.divider}>
                <span>o</span>
              </div>

              <form onSubmit={handleContinueWithEmail} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                
                {authError && <div className={styles.errorMsg}>{authError}</div>}

                <button 
                  type="submit" 
                  className={styles.submitBtn} 
                  disabled={!email || submitting}
                >
                  {submitting ? "Verificando..." : "Continuar con correo electrónico"}
                </button>
              </form>
            </>
          )}

          {step === STEP_LOGIN && (
            <>
              <h2 className={styles.title}>Ingresa tu contraseña</h2>
              <p className={styles.subtitle}>
                Iniciando sesión como <strong>{email}</strong>
                <button type="button" className={styles.editBtn} onClick={goBack}>Editar</button>
              </p>

              <form onSubmit={handleLoginSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>Contraseña</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoFocus
                    />
                    <button 
                      type="button" 
                      className={styles.eyeBtn}
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      {showPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </div>

                {authError && <div className={styles.errorMsg}>{authError}</div>}

                <button 
                  type="submit" 
                  className={styles.submitBtn} 
                  disabled={!password || submitting}
                >
                  {submitting ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>
              </form>

              <div className={styles.fallbackSwitch}>
                ¿No tienes cuenta? <button onClick={() => setStep(STEP_REGISTER)}>Regístrate</button>
              </div>
            </>
          )}

          {step === STEP_REGISTER && (
            <>
              <h2 className={styles.title}>Crea tu cuenta</h2>
              <p className={styles.subtitle}>
                Registrando el correo <strong>{email}</strong>
                <button type="button" className={styles.editBtn} onClick={goBack}>Editar</button>
              </p>

              <form onSubmit={handleRegisterSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>Nombre completo</label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Contraseña</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Crea una contraseña segura"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button 
                      type="button" 
                      className={styles.eyeBtn}
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      {showPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </div>

                {authError && <div className={styles.errorMsg}>{authError}</div>}

                <button 
                  type="submit" 
                  className={styles.submitBtn} 
                  disabled={!password || !name || submitting}
                >
                  {submitting ? "Creando cuenta..." : "Crear cuenta"}
                </button>
              </form>

              <div className={styles.fallbackSwitch}>
                ¿Ya tienes cuenta? <button onClick={() => setStep(STEP_LOGIN)}>Inicia sesión</button>
              </div>
            </>
          )}
        </div>

        <div className={styles.footer}>
          Al crear una cuenta, aceptas nuestro <a href="#">Aviso de privacidad</a> y nuestros <a href="#">Términos de uso</a>.
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
