# Estrategia de ramas

Flujo basado en main protegida con ramas cortas.

| Rama | Uso | Ejemplo |
|------|-----|---------|
| main | Siempre estable. No se hace push directo. | |
| feature/* | Funcionalidad nueva | feature/api-incidentes |
| fix/* | Correccion de errores | fix/pipeline-fallo-controlado |
| refactor/* | Mejoras internas y deuda tecnica | refactor/deuda-tecnica |
| docs/* | Solo documentacion | docs/readme-branching-changelog |

## Reglas
1. Cada rama nace de main y vive pocos dias.
2. Todo commit relevante lleva el AB#ID del Work Item.
3. Todo cambio entra por Pull Request con descripcion, work item vinculado, revision, comentarios resueltos y pipeline de validacion en verde.
4. Se usa squash merge.
5. Las versiones se marcan con etiquetas SemVer vMAJOR.MINOR.PATCH sobre main.

## Politicas de main (Azure Repos)
Minimo 1 revisor, work item vinculado, comentarios resueltos, solo squash merge y build de validacion obligatorio.

## Revision en proyecto individual
La organizacion de Azure DevOps esta ligada al directorio de la universidad y rechaza usuarios externos, asi que no fue posible agregar un segundo usuario. La politica permite aprobar los propios cambios, pero el flujo exige comentario de revision, resolverlo, pipeline en verde y aprobacion explicita antes de completar cada PR. Se consulto al docente si esto es aceptable.

## Excepcion en el repo final
Los siete commits de correccion del pipeline (run 20261028.7 a 20261028.8) se subieron directo a main antes de activar las politicas en este repositorio. Quedo registrado en el Bug 38 y en docs/fallo-controlado.md. Desde ese momento todo cambio entra por PR.