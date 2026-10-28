#!/usr/bin/env bash
# Ejecuta un plan de PRs: por cada linea crea rama, commit con AB#ID, push y Pull Request en Azure Repos.
# Uso: bash devops/nuevo-pr.sh devops/plan-prs-semana1.txt
# Formato de cada linea (separador |):  rama|AB_ID|mensaje del commit|rutas separadas por espacio
# Requiere: git remoto 'origin' apuntando a Azure Repos y `az login`.
# El merge NO se hace aqui: otro usuario revisa y aprueba el PR (regla de revision).
set -euo pipefail
PLAN="${1:?indica el archivo de plan}"
git checkout main && git pull --ff-only || true
while IFS='|' read -r rama ab mensaje rutas; do
  [[ -z "${rama// }" || "$rama" == \#* ]] && continue
  echo "==> $rama (AB#$ab)"
  git checkout main
  git checkout -b "$rama"
  # shellcheck disable=SC2086
  git add $rutas
  git commit -m "$mensaje AB#$ab"
  git push -u origin "$rama"
  az repos pr create --source-branch "$rama" --target-branch main \
    --title "$mensaje" \
    --description "Cambio: $mensaje

Work item: AB#$ab

Validacion: lint + pruebas + pipeline (adjuntar link del run)." \
    --work-items "$ab" --delete-source-branch true --squash true -o table
  git checkout main
done < "$PLAN"
