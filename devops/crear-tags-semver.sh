#!/usr/bin/env bash
# Crea una etiqueta anotada SemVer sobre el commit actual de main.
# Uso: bash devops/crear-tags-semver.sh v0.1.0 "Esquema de BD y API de alta/consulta"
set -euo pipefail
TAG="${1:?version, ej. v0.1.0}"; MSG="${2:?mensaje}"
[[ "$TAG" =~ ^v[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.]+)?$ ]] || { echo "No cumple SemVer"; exit 1; }
git checkout main && git pull --ff-only
git tag -a "$TAG" -m "$MSG"
git push origin "$TAG"
echo "Etiqueta $TAG publicada"
