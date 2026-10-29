# Deuda tecnica

Registro de deudas detectadas revisando el codigo de la primera version. Cada una tiene un Work Item (tipo Task o Bug con etiqueta `deuda-tecnica`) en Azure Boards.

| ID | Deuda | Impacto | Prioridad | Estado |
|----|-------|---------|-----------|--------|
| DT-01 | No hay autenticacion: el campo `usuario` es texto libre y cualquiera puede asignar o cerrar incidentes. | Seguridad / trazabilidad | Alta | Pendiente (se asume red interna en v1.0.0) |
| DT-02 | El listado de incidentes no tiene paginacion; con miles de registros se vuelve lento. | Rendimiento | Media | Pendiente |
| DT-03 | El esquema SQL se aplica a mano (`schema.sql`), no hay migraciones versionadas. | Mantenibilidad | Media | Pendiente |
| DT-04 | No hay pruebas automaticas contra PostgreSQL real ni del frontend; solo se prueba con el repositorio en memoria. | Calidad | Media | Pendiente |
| DT-05 | CORS abierto para cualquier origen y el body JSON sin limite de tamano. | Seguridad | Alta | Resuelta (PR !11, AB#36) |
| DT-06 | Crear un incidente hace dos `INSERT` (incidente + bitacora) sin transaccion; si falla el segundo queda un incidente sin historial. | Integridad de datos | Alta | Resuelta (PR !12, AB#37) |

## Deudas resueltas
- **DT-05**: `CORS_ORIGIN` configurable por entorno y `express.json({ limit: '100kb' })`. Parche: `devops/parches/dt-05-cors-y-limite-body.patch`.
- **DT-06**: `crearIncidente` en `pgRepo.js` usa `BEGIN/COMMIT/ROLLBACK`. Parche: `devops/parches/dt-06-transaccion-alta-incidente.patch`.

Los PR !11 (DT-05, AB#36) y !12 (DT-06, AB#37) se completaron en el repo incident-hub-semana2, con CI en PR en verde.

## Deudas aceptadas
DT-01 a DT-04 se dejan como backlog para la version 1.1+. DT-01 se acepta porque el sistema se desplegaria solo en la red interna del departamento de TI.
