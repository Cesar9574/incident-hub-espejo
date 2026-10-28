# Backlog en Azure Boards

Proceso: Agile. Creado con `devops/create-backlog.sh` (2 Epics, 4 Features, 8 User Stories, 16 Tasks).

## Epic 1 - Gestion de incidentes de TI
### Feature 1.1 - Registro y consulta de incidentes
- **US1** Reportar un incidente (3 pts)
  - T: Disenar esquema de BD y script SQL (3h)
  - T: Endpoint POST /api/incidentes con validacion (4h)
- **US2** Consultar y filtrar incidentes (5 pts)
  - T: Endpoint GET /api/incidentes con filtros (4h)
  - T: UI lista de incidentes y filtros (5h)
### Feature 1.2 - Operacion, seguimiento e indicadores
- **US3** Asignar tecnico y cambiar estado (5 pts)
  - T: Endpoints asignar y cambiar estado (5h)
  - T: UI detalle con asignacion y estado (4h)
- **US4** Bitacora de comentarios (3 pts)
  - T: Endpoint de comentarios (3h)
  - T: UI bitacora (3h)
- **US5** Dashboard con indicadores (3 pts)
  - T: Endpoint /api/dashboard (3h)
  - T: UI dashboard (4h)

## Epic 2 - Plataforma DevOps y entrega continua
### Feature 2.1 - CI/CD, calidad y seguridad
- **US6** Pipeline de CI con artefacto (8 pts)
  - T: azure-pipelines.yml (6h)
  - T: Configurar self-hosted agent (4h)
- **US7** Proteger secretos y revisar dependencias (5 pts)
  - T: Variable group + npm audit (3h)
  - T: Workflow de GitHub Actions (3h)
### Feature 2.2 - Versionado y estrategia de release
- **US8** SemVer y liberacion controlada (5 pts)
  - T: Documentar estrategia de release (4h)
  - T: Etiquetar versiones hasta v1.0.0 (2h)

Responsables: tres usuarios del equipo (Dev1 = backend/frontend de incidentes, Dev2 = DevOps/pipelines, Dev3 = operacion/dashboard). Prioridades 1 (alta) a 3 (baja).
