# Indice de evidencias

Base: https://dev.azure.com/cgonzalezg30/IncidentHub

| Requisito | Evidencia | Link |
|-----------|-----------|------|
| Azure Boards (2/4/8/16) | Backlog y tablero (work items 1 al 40) | https://dev.azure.com/cgonzalezg30/IncidentHub/_boards |
| Git: ramas feature/fix/refactor/docs | Branches de cada repo | https://dev.azure.com/cgonzalezg30/IncidentHub/_git/incident-hub-semana2/branches |
| Trazabilidad AB#ID | PR con work items vinculados (ej. PR 12 con Task 37) | https://dev.azure.com/cgonzalezg30/IncidentHub/_git/incident-hub-semana2/pullrequests?_a=completed |
| Pull Requests (min. 6) con revision | 16 PR completados: semana1 (1 al 5), semana2 (6 al 13), final (14 al 16) | https://dev.azure.com/cgonzalezg30/IncidentHub/_git/incident-hub-semana1/pullrequests?_a=completed |
| Deuda tecnica (6 registradas, 2 resueltas) | docs/deuda-tecnica.md, PR 11 (AB#36) y PR 12 (AB#37) | https://dev.azure.com/cgonzalezg30/IncidentHub/_workitems/edit/37 |
| Azure Pipelines completo | Run exitoso Build, QA y PROD con artefacto | https://dev.azure.com/cgonzalezg30/IncidentHub/_build/results?buildId=21 |
| Fallo controlado | Ciclo 1: run 1 fallido y run 2 exitoso (semana2). Ciclo 2: run 20 fallido y run 21 exitoso (final). Detalle en docs/fallo-controlado.md | https://dev.azure.com/cgonzalezg30/IncidentHub/_build/results?buildId=20 |
| Self-hosted agent | Pool SelfHosted-Pool, agente-local-01 | https://dev.azure.com/cgonzalezg30/IncidentHub/_settings/agentpools |
| Secretos protegidos | Library: incident-hub-secrets (valores ocultos) | https://dev.azure.com/cgonzalezg30/IncidentHub/_library |
| GitHub Actions | Workflows en el repo espejo | https://github.com/Cesar9574/incident-hub-espejo/actions |
| Dependencias | docs/dependencias.md y npm audit en el pipeline | docs/dependencias.md |
| SemVer hasta v1.0.0 | v0.1.0 a v0.3.0 en semana1, v0.4.0 a v0.6.0 en semana2, v1.0.0-rc.1 y v1.0.0 en final (runs 30 y 31); CHANGELOG.md | https://dev.azure.com/cgonzalezg30/IncidentHub/_git/incident-hub-final/tags |
| Estrategia de release y aprobacion | docs/estrategia-release.md y aprobacion manual en incident-hub-prod | https://dev.azure.com/cgonzalezg30/IncidentHub/_environments |
| Politicas de rama | Branch policies de main | https://dev.azure.com/cgonzalezg30/IncidentHub/_settings/repositories |