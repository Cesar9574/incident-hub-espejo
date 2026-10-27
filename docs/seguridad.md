# Seguridad

## Gestion de secretos
| Secreto | Donde vive | Como llega a la app |
|---------|-----------|---------------------|
| `DATABASE_URL` (incluye clave de BD) | Azure DevOps -> Pipelines -> Library -> variable group `incident-hub-secrets` (marcada con candado) | Variable de entorno en las etapas QA/PROD |
| PAT del agente autohospedado | Solo en la terminal al ejecutar el script (`AZP_TOKEN`) | No se guarda en archivos |
| `POSTGRES_PASSWORD` (Postgres local) | Variable de entorno del desarrollador | `docker-compose.yml` la lee con `${POSTGRES_PASSWORD}` |

Reglas aplicadas:
- `.gitignore` excluye `.env` y `.env.*` (solo se versiona `.env.example` sin valores reales).
- Los secretos del variable group estan marcados como *secret*, asi Azure los enmascara en los logs (`***`).
- En capturas y documentacion no aparecen tokens ni claves reales.
- Si un secreto llegara a subirse por error: se revoca/rota de inmediato y se limpia el historial. No basta con borrarlo en un commit nuevo.

## Controles en el codigo
- Consultas SQL parametrizadas (sin inyeccion SQL).
- Validacion de entrada en el servidor (`validators.js`) y listas cerradas para estado, prioridad y categoria.
- Limite de tamano del body JSON y CORS configurable (DT-05).
- Errores internos no exponen detalles al cliente (respuesta generica 500).
- React escapa el contenido por defecto, lo que evita XSS al mostrar comentarios.

## Controles en el pipeline
- `npm audit --audit-level=high` en backend y frontend: el pipeline falla si hay vulnerabilidades altas o criticas.
- GitHub Actions: `dependency-review-action` en cada PR.
- Permisos minimos en workflows (`permissions: contents: read`).
- La etapa PROD usa un *Environment* con aprobacion manual.

## Riesgos conocidos
Ver DT-01 en `docs/deuda-tecnica.md` (sin autenticacion).
