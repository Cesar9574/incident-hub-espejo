# Changelog
Formato basado en Keep a Changelog; versionado SemVer. (Ajustar las fechas a las reales de tus tags.)

## [1.0.0] - 2026-11-14
### Added
- Primera version estable: incidentes, operacion, bitacora, filtros, dashboard, API REST + PostgreSQL.
- Estrategia de release con ambientes QA/PROD y aprobacion manual.

## [1.0.0-rc.1] - 2026-11-10
### Changed
- Candidata a release validada en QA con smoke test.

## [0.6.0] - 2026-11-05
### Changed
- DT-05: CORS configurable y limite de tamano del body.
- DT-06: alta de incidente transaccional en PostgreSQL.

## [0.5.1] - 2026-11-02
### Fixed
- Pipeline: prueba de creacion de incidente corregida tras fallo controlado.

## [0.5.0] - 2026-10-31
### Added
- Variable group de secretos, `npm audit` en pipeline, workflows de GitHub Actions.

## [0.4.0] - 2026-10-29
### Added
- `azure-pipelines.yml` con build, pruebas, empaquetado y artefacto; self-hosted agent.

## [0.3.0] - 2026-10-27
### Added
- Frontend React y dashboard.

## [0.2.0] - 2026-10-26
### Added
- Asignacion de tecnico, cambio de estado con transiciones y bitacora.

## [0.1.0] - 2026-10-25
### Added
- Esquema de BD y endpoints de alta y consulta de incidentes.
