#!/usr/bin/env bash
# Instala y registra un agente autohospedado de Azure Pipelines (Linux/WSL/macOS).
# Uso:
#   export AZP_URL=https://dev.azure.com/TU_ORGANIZACION
#   export AZP_TOKEN=<PAT con permiso Agent Pools (Read & manage)>   # NO lo escribas en archivos
#   export AZP_POOL=SelfHosted-Pool
#   export AZP_AGENT_NAME=agente-local-01
#   bash setup-self-hosted-agent.sh
set -euo pipefail
: "${AZP_URL:?falta AZP_URL}" "${AZP_TOKEN:?falta AZP_TOKEN}"
POOL=${AZP_POOL:-SelfHosted-Pool}
NAME=${AZP_AGENT_NAME:-agente-local-01}
VERSION=${AGENT_VERSION:-4.248.0}   # revisa la ultima en https://github.com/microsoft/azure-pipelines-agent/releases
OS=linux-x64; [ "$(uname)" = "Darwin" ] && OS=osx-x64

mkdir -p "$HOME/azagent" && cd "$HOME/azagent"
curl -fsSL -o agent.tar.gz "https://download.agent.dev.azure.com/agent/${VERSION}/vsts-agent-${OS}-${VERSION}.tar.gz"
tar zxf agent.tar.gz
./config.sh --unattended --url "$AZP_URL" --auth pat --token "$AZP_TOKEN" \
  --pool "$POOL" --agent "$NAME" --acceptTeeEula --replace
# Requisitos del agente: git, curl, unzip y Node 22 (o deja que NodeTool lo descargue)
./run.sh
