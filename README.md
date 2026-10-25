# IT Incident Hub

Aplicacion web para registrar y dar seguimiento a incidentes de TI, construida como proyecto integrador DevOps: del Work Item en Azure Boards hasta una version `v1.0.0` lista para liberar.

## Funcionalidades
- Crear y consultar incidentes (titulo, descripcion, categoria, prioridad, usuario, fecha, estado)
- Asignar tecnico y cambiar estado: NUEVO -> ASIGNADO -> EN_PROCESO -> RESUELTO -> CERRADO
- Bitacora de comentarios por incidente
- Filtros por estado, prioridad, categoria y tecnico
- Dashboard: abiertos, cerrados, criticos y distribucion por categoria/tecnico
- API REST conectada a PostgreSQL

## Requisitos
- Node.js 20 o superior (probado con 22)
- Git
- PostgreSQL 14+ (o Docker para levantarlo) — opcional: sin `DATABASE_URL` la API usa memoria
- Para DevOps: cuenta de Azure DevOps, Azure CLI con la extension `azure-devops`, cuenta de GitHub

## Instalacion y ejecucion
```bash
# 1) Base de datos (opcional, con Docker)
export POSTGRES_PASSWORD=<elige_una_clave>
docker compose -f database/docker-compose.yml up -d

# 2) Backend
cd backend
cp .env.example .env     # edita DATABASE_URL con tu clave (el .env no se sube a git)
npm ci
export DATABASE_URL=postgresql://incident_user:<tu_clave>@localhost:5432/incident_hub   # o deja vacio para modo memoria
npm start                # http://localhost:3000/health

# 3) Frontend (otra terminal)
cd frontend
npm ci
npm run dev              # http://localhost:5173
```
Sin Docker: crea la BD `incident_hub` y ejecuta `database/schema.sql` y `database/seed.sql` con `psql`.

## Pruebas, lint y build
```bash
cd backend  && npm run lint && npm test
cd frontend && npm run lint && npm run build
```

## Estructura
```
incident-hub/
  backend/      API REST (Express)
  frontend/     React + Vite
  database/     schema.sql, seed.sql, docker-compose.yml
  tests/        pruebas de la API
  devops/       scripts: agente, backlog, PRs, tags, smoke test, parches
  docs/         arquitectura, branching, deuda, seguridad, dependencias, release
  .github/workflows/   GitHub Actions
  azure-pipelines.yml
```

## Documentacion
[Arquitectura](docs/arquitectura.md) · [Branching](docs/branching.md) · [Backlog](docs/backlog.md) · [Deuda tecnica](docs/deuda-tecnica.md) · [Seguridad](docs/seguridad.md) · [Dependencias](docs/dependencias.md) · [Fallo controlado](docs/fallo-controlado.md) · [Estrategia de release](docs/estrategia-release.md) · [Evidencias](docs/evidencias.md)

## Responsables del equipo
Proyecto individual; el trabajo se reparte entre tres usuarios propios para evidenciar contribuciones.

| Usuario | Rol | Responsabilidad |
|---------|-----|-----------------|
| (usuario 1) | Desarrollo | Base de datos, API de incidentes, frontend de lista |
| (usuario 2) | DevOps | Pipelines, self-hosted agent, GitHub Actions, seguridad, release |
| (usuario 3) | Desarrollo / QA | Operacion, bitacora, dashboard, pruebas |

## Variables de entorno
| Variable | Uso |
|----------|-----|
| `PORT` | Puerto de la API (3000) |
| `DATABASE_URL` | Conexion a PostgreSQL. **Secreta**, no va en el repo |
| `CORS_ORIGIN` | Origenes permitidos (a partir del parche DT-05) |
| `VITE_API_URL` | URL base de la API para el frontend en produccion |
