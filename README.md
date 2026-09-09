# Glockta MVP

Plataforma integral de gestión de carrera: búsqueda agregada de empleo (múltiples proveedores),
matching de perfil-vacante, career score, y generación de rutas de aprendizaje mediante IA.

## Arquitectura

- **Backend**: Node.js + Express (API RESTful), capas Providers → Services → Routes.
- **Frontend**: React + Vite, componentes funcionales con Hooks.
- **Base de datos**: PostgreSQL vía Supabase (tablas `users`, `jobs`, `learning_paths`).

```
glockta_mvp/
├── backend/
│   └── src/
│       ├── providers/     # Fuentes externas de empleo (Adzuna, Jooble, Demo)
│       ├── services/      # Lógica de negocio (jobs, matching, career score, IA, pagos)
│       ├── server.js      # Definición de endpoints REST
│       └── supabase.js    # Cliente de base de datos
├── frontend/
│   └── src/
│       ├── components/    # JobSearch, JobCard, LearningPath
│       └── App.jsx
└── sql/
    └── schema.sql
```

## Requisitos

- Node.js 18+
- Cuenta de Supabase (gratuita) para persistencia real. Sin credenciales, el backend
  igual arranca pero avisa por consola que la persistencia está desactivada — no falla
  en silencio.

## Instalación

### 1. Base de datos
Ejecutar `sql/schema.sql` en el editor SQL de tu proyecto Supabase (o en cualquier PostgreSQL local).

### 2. Backend
```bash
cd backend
cp .env.example .env      # completar SUPABASE_URL, SUPABASE_KEY, etc.
npm install
npm run dev                # http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env       # VITE_API_URL=http://localhost:5000
npm install
npm run dev                # http://localhost:5173
```

## Endpoints de la API

| Método | Ruta                       | Descripción                                              |
|--------|----------------------------|-------------------------------------------------------------|
| GET    | `/api/jobs?q=`             | Busca empleos en todos los proveedores y los persiste       |
| GET    | `/api/jobs/history`        | Devuelve empleos ya guardados en Supabase                   |
| POST   | `/api/learning-path`       | Genera y guarda un plan de aprendizaje (IA simulada)         |
| POST   | `/api/match`               | Calcula score de coincidencia entre un job y skills          |
| POST   | `/api/career-score`        | Calcula score de empleabilidad de un perfil                  |
| POST   | `/api/payment/preference`  | Genera una preferencia de pago (stub)                        |
| GET    | `/api/external-links?q=`   | Enlaces de búsqueda directa a LinkedIn, Indeed, ZonaJobs y Computrabajo |

Todas las respuestas siguen el formato `{ success: boolean, data | message }`.

## Decisiones de alcance (MVP)

- `aiService.js` simula la generación de texto. En producción se reemplazaría por una
  llamada real a la API de OpenAI o Claude, manteniendo la misma interfaz
  (`generateText(prompt)`), sin tocar el resto del sistema.
- `paymentService.js` es un stub de Mercado Pago; se reemplaza por el SDK oficial cuando
  haya credenciales reales.
- Se eliminó el frontend alternativo en HTML/JS plano para no duplicar funcionalidad:
  el entregable único es el frontend en React.
- **LinkedIn, Indeed, ZonaJobs y Computrabajo no tienen API pública de vacantes**
  (LinkedIn y Indeed son solo para socios comerciales aprobados; ZonaJobs y Computrabajo
  nunca publicaron una). Por eso `externalLinksService.js` no trae datos de esos sitios:
  genera el enlace de búsqueda ya armado con el término del usuario, para que solo tenga
  que hacer clic en vez de escribir la búsqueda de nuevo en cada portal. Es la única
  integración estable y dentro de los Términos de Servicio de las cuatro plataformas.

## Pruebas realizadas antes de entregar

- `node --check` sobre cada archivo del backend (sintaxis).
- `npm install` + servidor real levantado (`node src/server.js`) y los 7 endpoints
  probados con `curl`, incluyendo casos de error (400 por validación, 404 de ruta
  inexistente).
- `npm install` + `npm run build` del frontend con Vite (compila JSX y detecta
  imports rotos).
- Backend y frontend corriendo en paralelo en puertos distintos, confirmando que el
  header `Access-Control-Allow-Origin` permite la llamada cross-origin real.

## Identidad de marca

- **Logo** (`frontend/public/logo.svg` y `favicon.svg`): tres nodos de distinto tamaño unidos
  por un trazo ascendente — representa perfiles diversos (edad, idioma, nivel técnico)
  progresando hacia una oportunidad. No usa un ícono genérico de maletín o lupa.
- **Paleta**: Ink `#152623`, Petróleo `#1F5C56` (color de marca), Ámbar `#E3A23D` (acento de
  progreso/CTA), Bruma `#EDF2EF` (fondo), Hueso `#FBFBF9` (superficie de tarjetas).
- **Tipografía**: Fraunces (titulares/wordmark) + IBM Plex Sans (UI y cuerpo).
- **Layout**: tabs subrayados en vez de botones-pastilla; tarjetas con acento lateral en vez
  de tarjetas redondeadas idénticas con sombra — el acento indica jerarquía, no decora.

## Seguridad

- Los mensajes de error hacia el cliente están sanitizados (nunca se expone el detalle
  interno del error); el detalle completo solo se imprime en el log del servidor.
- Un middleware dedicado captura los errores de JSON malformado en el body de la
  petición (que por defecto en Express devuelven una página HTML con el stack trace
  del servidor) y responde con un JSON de error limpio. Hay además un manejador de
  errores global al final de la cadena como red de seguridad ante cualquier error
  no controlado por una ruta específica.
- Las claves de Supabase y de los proveedores de empleo viven en `.env`, excluido de Git.
