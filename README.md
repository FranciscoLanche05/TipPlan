# Sistema de Viajes EPN

Proyecto desarrollado con una arquitectura moderna basada en **React** y **Vite**.

## Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- Gestor de paquetes: `npm` (incluido con Node.js)

## Instalación

1. Clona el repositorio y ubícate en el directorio del proyecto.
2. Instala las dependencias necesarias:

```bash
npm install
```

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm run dev`

Inicia el servidor de desarrollo. Vite ofrece una recarga de módulos en caliente (HMR) ultrarrápida.

### `npm run build`

Construye la aplicación para producción en la carpeta `dist`. Optimiza los archivos para obtener el mejor rendimiento.

### `npm run preview`

Arranca un servidor web estático para probar localmente la versión de producción generada por `build`.

## Estructura de Directorios

El código fuente principal se encuentra estructurado en el directorio `src/`:

- **assets/**: Recursos estáticos como fuentes e íconos SVG.
- **styles/**: Hojas de estilo globales, normalización y variables CSS.
- **core/**: Dominio puro (modelos y utilidades) agnóstico al framework.
- **services/**: Manejo de llamadas a APIs externas y datos simulados/estáticos.
- **hooks/**: Custom hooks de React (scroll, menús, calculadoras, etc.).
- **layouts/**: Estructura base que envuelve el contenido de las páginas.
- **components/**: Componentes de UI modulares y reutilizables.
  - **ui/**: Átomos y elementos base (botones, insignias).
  - **common/**: Componentes compartidos por múltiples páginas (Navbar, Footer).
  - **sections/**: Secciones grandes de contenido para armar las páginas.
- **pages/**: Vistas de alto nivel que representan rutas completas.
- **router/**: Configuración de rutas (usando `react-router-dom`).
- **constants/**: Archivos de configuración y constantes estáticas.

## Tecnologías Principales

- **React 18+**
- **Vite**
- **React Router DOM**
- **CSS Modules** (Para estilos por componente)
