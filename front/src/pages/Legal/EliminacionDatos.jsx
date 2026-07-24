import React from 'react';

const EliminacionDatos = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', lineHeight: '1.6' }}>
      <h1>Instrucciones para la Eliminación de Datos</h1>
      <p><strong>Última actualización:</strong> Julio de 2026</p>
      
      <p>De acuerdo con las reglas de Facebook y otras normativas de privacidad, tienes el derecho de solicitar la eliminación completa de tus datos de TipPlan. Si has iniciado sesión con Facebook en nuestra aplicación y deseas borrar tus datos, sigue estos pasos:</p>
      
      <h2>Opción 1: Desde TipPlan (Próximamente)</h2>
      <p>1. Inicia sesión en tu cuenta de TipPlan.</p>
      <p>2. Ve a la sección de Configuración o Perfil.</p>
      <p>3. Haz clic en "Eliminar Cuenta". Esto borrará permanentemente tus itinerarios y tu perfil de nuestra base de datos en Firebase.</p>

      <h2>Opción 2: Desde tu cuenta de Facebook</h2>
      <p>Puedes revocar el acceso de TipPlan y solicitar la eliminación de tu actividad directamente desde los ajustes de privacidad de Facebook:</p>
      <ol>
        <li>Ve al menú de "Configuración y privacidad" de tu cuenta de Facebook y haz clic en "Configuración".</li>
        <li>Busca la sección "Aplicaciones y sitios web" (Apps and Websites).</li>
        <li>Busca "TipPlan" en la lista de aplicaciones activas.</li>
        <li>Haz clic en el botón "Eliminar" junto al nombre de la aplicación.</li>
        <li>Opcionalmente, puedes enviarnos un correo solicitando que purguemos manualmente cualquier registro remanente asociado a tu ID.</li>
      </ol>
      
      <h2>Contacto</h2>
      <p>Si necesitas asistencia inmediata para borrar tus datos, puedes enviarnos un correo y procesaremos tu solicitud en un plazo máximo de 72 horas.</p>
    </div>
  );
};

export default EliminacionDatos;
