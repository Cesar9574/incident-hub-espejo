# Analisis de dependencias

Se analizaron los paquetes con `npm audit` (base de datos de avisos de GitHub) el **24/10/2026**.

## Dependencias directas
**Backend (produccion):** express 4.22.3, cors 2.8.6, pg 8.23.1
**Backend (desarrollo):** eslint 9.39.5, globals 15.15.0
**Frontend (produccion):** react 18.3.1, react-dom 18.3.1
**Frontend (desarrollo):** vite 6.4.5, @vitejs/plugin-react 4.7.0, eslint 9.39.5, eslint-plugin-react 7.37.5, globals 15.15.0

## Resultado del analisis
| Proyecto | Comando | Resultado |
|----------|---------|-----------|
| backend | `npm audit` | 0 vulnerabilidades |
| frontend | `npm audit` | 0 vulnerabilidades |
| frontend (solo produccion) | `npm audit --omit=dev` | 0 vulnerabilidades |

## Politica de decision
| Severidad | Decision | Plazo |
|-----------|----------|-------|
| Critica / Alta | Bloquea el pipeline. Se actualiza el paquete o se reemplaza. | Antes del merge |
| Media | Se evalua si la ruta vulnerable se usa; se actualiza en el siguiente release. | Maximo 1 sprint |
| Baja | Se registra y se acepta si no afecta produccion. | Revision trimestral |

## Registro de hallazgos
| Fecha | Paquete | Severidad | Descripcion | Decision |
|-------|---------|-----------|-------------|----------|
| 24/10/2026 | (ninguno) | - | `npm audit` sin hallazgos en backend ni frontend | Sin accion. Se vuelve a ejecutar en cada pipeline y PR |

> Si aparece un hallazgo nuevo en el pipeline, agregarlo como fila aqui con paquete, severidad, version corregida y la decision tomada (actualizar / aceptar / reemplazar), enlazado a su Work Item.

## Automatizacion
- Azure Pipelines: pasos "Seguridad de dependencias" (backend y frontend).
- GitHub Actions: `npm-audit` en `ci.yml` y `dependency-review.yml` en cada PR.
- Los `package-lock.json` estan versionados y el pipeline usa `npm ci` para instalar exactamente lo auditado.
