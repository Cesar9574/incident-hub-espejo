# Changelog
Formato basado en Keep a Changelog. Versionado SemVer.

## [1.0.0] - 2026-10-28
### Added
- Primera version estable: incidentes, asignacion, estados, bitacora, filtros, dashboard y API REST con PostgreSQL.
- Pipeline completo Build, QA y Produccion con aprobacion manual en agente autohospedado Windows.
### Fixed
- Pipeline del repo final adaptado a PowerShell nativo (Copy-Item, Expand-Archive, node -e) para el agente Windows.

## [1.0.0-rc.1] - 2026-10-28
### Changed
- Candidata a release validada en QA con smoke test.

## [0.6.0] - 2026-10-28
### Changed
- DT-05: CORS configurable por variable de entorno y limite de tamano del body.
- DT-06: alta de incidente transaccional en PostgreSQL.

## [0.5.1] - 2026-10-28
### Fixed
- Pipeline: pasos corregidos para el agente Windows tras el fallo controlado.

## [0.5.0] - 2026-10-28
### Added
- Variable group de secretos, npm audit en el pipeline, workflows de GitHub Actions y documentacion de seguridad.

## [0.4.0] - 2026-10-28
### Added
- azure-pipelines.yml con build, pruebas, empaquetado y artefacto; agente autohospedado.

## [0.3.0] - 2026-10-25
### Added
- Frontend React y documentacion de arquitectura.

## [0.2.0] - 2026-10-25
### Added
- API REST de incidentes: alta, consulta, filtros, asignacion, estados y bitacora.

## [0.1.0] - 2026-10-25
### Added
- Esquema de base de datos y datos semilla.