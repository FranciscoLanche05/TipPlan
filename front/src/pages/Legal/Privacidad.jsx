import React from 'react';

const Privacidad = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', lineHeight: '1.6' }}>
      <h1>Política de Privacidad</h1>
      <p><strong>Última actualización:</strong> Julio de 2026</p>
      
      <h2>1. Información que recopilamos</h2>
      <p>Cuando inicias sesión con Facebook u otros proveedores, TipPlan recibe tu perfil público (nombre y foto de perfil) y tu dirección de correo electrónico.</p>
      
      <h2>2. Uso de la información</h2>
      <p>Usamos tu información exclusivamente para crear y mantener tu cuenta en TipPlan, permitirte guardar tus itinerarios de viaje y personalizar tu experiencia. No vendemos ni compartimos tus datos con terceros.</p>
      
      <h2>3. Protección de datos</h2>
      <p>Tus datos están protegidos y almacenados de forma segura mediante los servicios de autenticación y bases de datos de Firebase (Google).</p>
      
      <h2>4. Contacto</h2>
      <p>Si tienes dudas sobre nuestra política, puedes contactarnos al correo de soporte técnico.</p>
    </div>
  );
};

export default Privacidad;
