# Estrategia de ramas

Uso un flujo basado en `main` protegida (trunk-based con ramas cortas).

| Rama | Para que | Ejemplo |
|------|---------|---------|
| `main` | Siempre estable y desplegable. Nadie hace push directo. | |
| `feature/*` | Funcionalidad nueva | `feature/api-incidentes` |
| `fix/*` | Correccion de errores | `fix/pipeline-fallo-controlado` |
| `refactor/*` | Mejoras internas / deuda tecnica | `refactor/deuda-tecnica` |
| `docs/*` | Solo documentacion | `docs/seguridad-dependencias` |
| `release/*` | Solo si hace falta estabilizar una version | `release/1.0` |

## Reglas
1. Cada rama nace de `main` y vive pocos dias.
2. Todo commit relevante lleva `AB#<id>` del Work Item (ej: `API: alta de incidentes AB#102`). Azure DevOps enlaza el commit y el PR al Work Item automaticamente.
3. Todo cambio entra por Pull Request con descripcion, Work Item vinculado, revision de otro usuario y pipeline en verde.
4. Se hace *squash merge* para que `main` quede con un commit por cambio.
5. Las versiones se marcan con tags SemVer `vMAJOR.MINOR.PATCH` sobre `main`.

## Politica de rama `main` (Azure Repos -> Branch policies)
- Requerir minimo 1 revisor (distinto al autor).
- Requerir Work Item vinculado.
- Requerir que el build de validacion (`azure-pipelines.yml`) pase.
- Resolver comentarios antes de completar.
- Merge type: squash.

## Convencion de commits
`<que cambia en imperativo> AB#<id>` — ejemplo: `Valida transiciones de estado AB#105`.
