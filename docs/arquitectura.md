# Arquitectura de IT Incident Hub

## Resumen
Aplicacion web para reemplazar los reportes de incidentes que hoy llegan por llamadas, mensajes y correo. Todo queda registrado, con responsable e historial.

```
Usuario -> Frontend (React + Vite) -> API REST (Node.js + Express) -> PostgreSQL
```

| Capa | Tecnologia | Carpeta |
|------|-----------|---------|
| Frontend | React 18 + Vite | `frontend/` |
| Backend | Node.js 22 + Express 4 | `backend/` |
| Datos | PostgreSQL 16 | `database/` |
| Pruebas | node:test (runner nativo de Node) | `tests/` |
| CI/CD | Azure Pipelines + GitHub Actions | `azure-pipelines.yml`, `.github/workflows/` |

El enunciado dice que no se califica una tecnologia especifica, asi que elegi Node/React/PostgreSQL por ser el stack de referencia.

## Decisiones de diseno
1. **Patron repositorio.** `app.js` no sabe si los datos estan en PostgreSQL o en memoria. Hay dos implementaciones (`pgRepo.js` y `memoryRepo.js`) con la misma interfaz. Asi las pruebas y el smoke test corren rapido y sin base de datos.
2. **Maquina de estados.** El estado solo avanza `NUEVO -> ASIGNADO -> EN_PROCESO -> RESUELTO -> CERRADO` (y `RESUELTO -> EN_PROCESO` si se reabre). Cualquier otro salto responde 409.
3. **Bitacora automatica.** Cada asignacion y cambio de estado agrega un comentario de `sistema`, ademas de los comentarios manuales.
4. **Consultas parametrizadas.** Todas las consultas SQL usan `$1, $2...` (sin concatenar texto) para evitar inyeccion SQL.
5. **Configuracion por entorno.** `DATABASE_URL`, `PORT` y `CORS_ORIGIN` vienen de variables de entorno; nunca del repositorio.

## Modelo de datos
- `tecnicos(id, nombre)`
- `incidentes(id, titulo, descripcion, categoria, prioridad, usuario, estado, tecnico_id, fecha, actualizado)`
- `comentarios(id, incidente_id, autor, texto, fecha)`

Relaciones: un tecnico tiene muchos incidentes; un incidente tiene muchos comentarios. Los `CHECK` de la tabla repiten las listas validas de estado, prioridad y categoria.

## API REST
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/health` | Estado del servicio |
| GET | `/api/catalogos` | Estados, prioridades y categorias |
| GET | `/api/tecnicos` | Lista de tecnicos |
| POST | `/api/incidentes` | Crear incidente |
| GET | `/api/incidentes?estado=&prioridad=&categoria=&tecnicoId=` | Listar con filtros |
| GET | `/api/incidentes/:id` | Detalle |
| PATCH | `/api/incidentes/:id/asignar` | Asignar tecnico `{tecnicoId}` |
| PATCH | `/api/incidentes/:id/estado` | Cambiar estado `{estado}` |
| GET/POST | `/api/incidentes/:id/comentarios` | Bitacora |
| GET | `/api/dashboard` | Abiertos, cerrados, criticos, por categoria y por tecnico |

Codigos: 201 creado, 400 datos invalidos, 404 no existe, 409 transicion no permitida.

## Flujo de entrega
```
Azure Boards (Task) -> rama feature/* -> commit AB#ID -> Pull Request -> review -> main
   -> Azure Pipeline (build, pruebas, audit) -> artefacto .zip -> QA (auto) -> PROD (aprobacion manual)
```
Ver `docs/branching.md` y `docs/estrategia-release.md`.
