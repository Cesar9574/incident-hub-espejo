#!/usr/bin/env bash
# Crea en Azure Boards: 2 Epics, 4 Features, 8 User Stories y 16 Tasks (proceso AGILE),
# con prioridad, estimacion, responsable, estado y jerarquia padre-hijo.
#
# Requisitos: Azure CLI + extension azure-devops, y haber hecho `az login`.
#   az extension add --name azure-devops
#   az devops configure --defaults organization=https://dev.azure.com/ORG project=IncidentHub
#
# Responsables (puedes poner tus 3 usuarios propios, uno por rol):
#   export DEV1="usuario1@correo.com" DEV2="usuario2@correo.com" DEV3="usuario3@correo.com"
set -euo pipefail
: "${DEV1:?define DEV1}" "${DEV2:?define DEV2}" "${DEV3:?define DEV3}"
OUT=backlog-ids.txt; : > "$OUT"
AREA_ITER=()   # si tu proyecto usa iteraciones, agrega: --iteration "IncidentHub\\Sprint 1"

mk() { # tipo titulo prioridad asignado [estimacion|puntos] [campo_estimacion] [estado] [padre]
  local tipo="$1" titulo="$2" prio="$3" quien="$4" est="${5:-}" campo="${6:-}" estado="${7:-New}" padre="${8:-}"
  local fields=("Microsoft.VSTS.Common.Priority=$prio")
  [ -n "$est" ] && fields+=("$campo=$est")
  local id
  id=$(az boards work-item create --type "$tipo" --title "$titulo" --assigned-to "$quien" \
        --fields "${fields[@]}" --query id -o tsv)
  [ "$estado" != "New" ] && az boards work-item update --id "$id" --state "$estado" -o none
  [ -n "$padre" ] && az boards work-item relation add --id "$id" --relation-type parent --target-id "$padre" -o none
  echo "$tipo|$id|$titulo" | tee -a "$OUT" >&2
  echo "$id"
}
PTS=Microsoft.VSTS.Scheduling.StoryPoints
HRS=Microsoft.VSTS.Scheduling.OriginalEstimate

E1=$(mk Epic "Gestion de incidentes de TI" 1 "$DEV1")
E2=$(mk Epic "Plataforma DevOps y entrega continua" 1 "$DEV2")

F1=$(mk Feature "Registro y consulta de incidentes" 1 "$DEV1" "" "" Active "$E1")
F2=$(mk Feature "Operacion, seguimiento e indicadores" 2 "$DEV1" "" "" Active "$E1")
F3=$(mk Feature "CI/CD, calidad y seguridad" 1 "$DEV2" "" "" Active "$E2")
F4=$(mk Feature "Versionado y estrategia de release" 2 "$DEV3" "" "" New "$E2")

S1=$(mk "User Story" "Como usuario quiero reportar un incidente para que TI lo atienda" 1 "$DEV1" 3 $PTS Active "$F1")
S2=$(mk "User Story" "Como tecnico quiero consultar y filtrar incidentes para priorizar mi trabajo" 1 "$DEV1" 5 $PTS Active "$F1")
S3=$(mk "User Story" "Como coordinador quiero asignar un tecnico y cambiar el estado del incidente" 1 "$DEV3" 5 $PTS New "$F2")
S4=$(mk "User Story" "Como tecnico quiero una bitacora de comentarios por incidente" 2 "$DEV3" 3 $PTS New "$F2")
S5=$(mk "User Story" "Como jefe de TI quiero un dashboard con indicadores" 2 "$DEV3" 3 $PTS New "$F2")
S6=$(mk "User Story" "Como equipo quiero un pipeline de CI con artefacto versionado" 1 "$DEV2" 8 $PTS Active "$F3")
S7=$(mk "User Story" "Como equipo quiero proteger secretos y revisar dependencias" 1 "$DEV2" 5 $PTS New "$F3")
S8=$(mk "User Story" "Como equipo quiero versionar con SemVer y liberar de forma controlada" 2 "$DEV2" 5 $PTS New "$F4")

mk Task "Disenar esquema de BD y script SQL" 1 "$DEV1" 3 $HRS Closed "$S1" >/dev/null
mk Task "Endpoint POST /api/incidentes con validacion" 1 "$DEV1" 4 $HRS Active "$S1" >/dev/null
mk Task "Endpoint GET /api/incidentes con filtros" 1 "$DEV1" 4 $HRS Active "$S2" >/dev/null
mk Task "UI: lista de incidentes y filtros" 2 "$DEV1" 5 $HRS New "$S2" >/dev/null
mk Task "Endpoints asignar tecnico y cambiar estado" 1 "$DEV3" 5 $HRS New "$S3" >/dev/null
mk Task "UI: detalle con asignacion y cambio de estado" 2 "$DEV3" 4 $HRS New "$S3" >/dev/null
mk Task "Endpoint de comentarios y bitacora" 2 "$DEV3" 3 $HRS New "$S4" >/dev/null
mk Task "UI: bitacora por incidente" 3 "$DEV3" 3 $HRS New "$S4" >/dev/null
mk Task "Endpoint /api/dashboard" 2 "$DEV3" 3 $HRS New "$S5" >/dev/null
mk Task "UI: dashboard con indicadores" 3 "$DEV3" 4 $HRS New "$S5" >/dev/null
mk Task "Crear azure-pipelines.yml (build, test, artefacto)" 1 "$DEV2" 6 $HRS Active "$S6" >/dev/null
mk Task "Configurar self-hosted agent" 1 "$DEV2" 4 $HRS Active "$S6" >/dev/null
mk Task "Variable group de secretos y npm audit en pipeline" 1 "$DEV2" 3 $HRS New "$S7" >/dev/null
mk Task "Workflow de GitHub Actions (PR, lint, dependencias)" 2 "$DEV2" 3 $HRS New "$S7" >/dev/null
mk Task "Documentar estrategia de release y ambientes" 2 "$DEV2" 4 $HRS New "$S8" >/dev/null
mk Task "Etiquetar versiones SemVer hasta v1.0.0" 2 "$DEV2" 2 $HRS New "$S8" >/dev/null

echo "Listo. IDs guardados en $OUT"
