# Estrategia de release

## Versionado (Semantic Versioning 2.0.0)
`MAJOR.MINOR.PATCH`: MAJOR si rompe la API, MINOR si agrega funcionalidad compatible, PATCH si corrige errores.

| Version | Contenido | Tipo |
|---------|-----------|------|
| v0.1.0 | Esquema de BD y API de alta/consulta de incidentes | MINOR |
| v0.2.0 | Asignacion, cambio de estado y bitacora | MINOR |
| v0.3.0 | Frontend React y dashboard | MINOR |
| v0.4.0 | Pipeline de CI con artefacto y self-hosted agent | MINOR |
| v0.5.0 | Seguridad: secretos, audit y GitHub Actions | MINOR |
| v0.5.1 | Correccion del fallo de pipeline | PATCH |
| v0.6.0 | Resolucion de deuda tecnica DT-05 y DT-06 | MINOR |
| v1.0.0-rc.1 | Candidata a release, validada en QA | pre-release |
| v1.0.0 | Primera version estable | MAJOR |

Cada version es una etiqueta anotada sobre `main` (`devops/crear-tags-semver.sh`) y el `CHANGELOG.md` la describe.

## Ambientes
| Ambiente | Azure Environment | Se despliega cuando | Control |
|----------|-------------------|---------------------|---------|
| Desarrollo | (local) | Cada desarrollador, con `npm run dev` | Lint y pruebas locales |
| CI / PR | (pipeline de validacion) | Cada Pull Request | Build + pruebas + audit deben pasar |
| QA | `incident-hub-qa` | Automatico al integrar a `main` | Verificacion de arranque (Node y dependencias de produccion); `devops/smoke-test.sh`, que prueba la API, queda como mejora futura |
| Produccion | `incident-hub-prod` | Despues de QA exitoso | **Aprobacion manual** (Approvals and checks) |

## Flujo de liberacion
1. PR aprobado y con pipeline verde -> merge a `main`.
2. El pipeline construye **una sola vez** el artefacto `incident-hub-<build>.zip`; ese mismo artefacto se promueve de ambiente en ambiente (no se reconstruye).
3. Etapa QA: despliegue automatico + verificacion de arranque.
4. Etapa PROD: queda en espera; un aprobador revisa que QA este bien, el changelog y los work items, y aprueba o rechaza.
5. Se crea el tag SemVer y el release (GitHub Release / Azure Release notes) con el changelog.

## Configuracion necesaria en Azure DevOps
1. Pipelines -> Environments -> crear `incident-hub-qa` y `incident-hub-prod`.
2. En `incident-hub-prod` -> Approvals and checks -> **Approvals** -> agregar un aprobador distinto del autor (puede ser tu segundo usuario).
3. Pipelines -> Library -> crear `incident-hub-secrets` con `DATABASE_URL` marcada como secreta.
4. Permitir al pipeline usar el variable group y los environments (boton *Permit* la primera vez).

## Rollback
- El artefacto de la version anterior sigue disponible en Azure Pipelines.
- Para volver: re-ejecutar el despliegue de esa ejecucion a PROD (con aprobacion), o `git revert` del commit problematico y nuevo release PATCH.
- La estructura de la BD solo cambia con scripts compatibles hacia atras (DT-03 pendiente: migraciones versionadas).

## Criterios para pasar a v1.0.0
- [x] Funcionalidad completa del alcance (incidentes, operacion, seguimiento, filtros, dashboard, API + BD)
- [x] Pipeline verde en `main` y artefacto publicado
- [x] 0 vulnerabilidades altas/criticas
- [x] Documentacion completa en `docs/`
- [x] QA validado y aprobacion manual en PROD
