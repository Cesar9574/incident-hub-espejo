#!/usr/bin/env bash
# Levanta la API (modo memoria) y comprueba /health y un alta de incidente.
set -euo pipefail
PORT=${SMOKE_PORT:-3999}
unset DATABASE_URL
PORT=$PORT node src/server.js > smoke.log 2>&1 &
PID=$!
trap 'kill $PID 2>/dev/null || true' EXIT
for i in $(seq 1 20); do
  if curl -fs "http://127.0.0.1:$PORT/health" >/dev/null; then break; fi
  sleep 0.5
done
curl -fs "http://127.0.0.1:$PORT/health" | grep -q '"ok"'
curl -fs -X POST "http://127.0.0.1:$PORT/api/incidentes" \
  -H 'Content-Type: application/json' \
  -d '{"titulo":"smoke test","descripcion":"prueba de humo","categoria":"OTRO","prioridad":"BAJA","usuario":"pipeline"}' \
  | grep -q '"NUEVO"'
echo "Smoke test OK"
