# IT Incident Hub

Aplicacion web para registrar y dar seguimiento a incidentes de TI. Proyecto integrador DevOps: desde el Work Item en Azure Boards hasta la version v1.0.0.

## Funcionalidades
- Crear y consultar incidentes (titulo, descripcion, categoria, prioridad, usuario, fecha, estado)
- Asignar tecnico y cambiar estado: NUEVO, ASIGNADO, EN_PROCESO, RESUELTO, CERRADO
- Bitacora de comentarios por incidente
- Filtros por estado, prioridad, categoria y tecnico
- Dashboard con abiertos, cerrados, criticos y distribucion por categoria y tecnico
- API REST conectada a PostgreSQL

## Requisitos
- Node.js 20 o superior
- Git
- PostgreSQL 14+ (opcional: sin DATABASE_URL la API usa memoria)
- Para el flujo DevOps: cuenta de Azure DevOps, Azure CLI con la extension azure-devops y cuenta de GitHub

## Instalacion y ejecucion
1. Backend: `cd backend`, `npm ci`, y `npm start` (http://localhost:3000/health). Para PostgreSQL define la variable de entorno DATABASE_URL (no se guarda en el repo).
2. Frontend: `cd frontend`, `npm ci`, y `npm run dev` (http://localhost:5173).
3. Base de datos: ejecutar `database/schema.sql` y `database/seed.sql`, o usar `database/docker-compose.yml`.

## Pruebas
- Backend: `cd backend`, `npm run lint` y `npm test`
- Frontend: `cd frontend`, `npm run lint` y `npm run build`

## Estructura
backend/, frontend/, database/, tests/, devops/, docs/, .github/workflows/, azure-pipelines.yml

## Documentacion
docs/arquitectura.md, docs/branching.md, docs/backlog.md, docs/deuda-tecnica.md, docs/seguridad.md, docs/dependencias.md, docs/fallo-controlado.md, docs/estrategia-release.md, docs/evidencias.md

## Responsables
Proyecto individual.

| Responsable | Rol | Responsabilidad |
|-------------|-----|-----------------|
| Cesar Luis Gonzalez Garcia (cgonzalezg30@miumg.edu.gt) | Desarrollo, DevOps y QA | Todo el proyecto: backlog, codigo, pipelines, seguridad y release |

La universidad no permite invitar un segundo usuario a la organizacion de Azure DevOps. Por eso los Pull Requests los revisa y aprueba el mismo usuario, con comentarios reales resueltos y con politicas de rama que obligan a tener revisor, work item vinculado y pipeline en verde. Esta decision esta documentada en docs/branching.md.

## Repositorios
Entrega en tres repositorios (uno por semana): incident-hub-semana1, incident-hub-semana2 e incident-hub-final. Espejo en GitHub para GitHub Actions: Cesar9574/incident-hub-espejo.