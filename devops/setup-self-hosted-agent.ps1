# Instala y registra un agente autohospedado de Azure Pipelines en Windows.
# Ejecutar en PowerShell:
#   $env:AZP_URL   = "https://dev.azure.com/TU_ORGANIZACION"
#   $env:AZP_TOKEN = "<PAT con permiso Agent Pools (Read & manage)>"   # no lo guardes en archivos
#   .\setup-self-hosted-agent.ps1
param(
  [string]$Pool = "SelfHosted-Pool",
  [string]$AgentName = "agente-local-01",
  [string]$Version = "4.248.0"   # revisa la ultima version en GitHub: microsoft/azure-pipelines-agent
)
if (-not $env:AZP_URL -or -not $env:AZP_TOKEN) { throw "Define AZP_URL y AZP_TOKEN" }
$dir = "C:\azagent"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
Set-Location $dir
Invoke-WebRequest -Uri "https://download.agent.dev.azure.com/agent/$Version/vsts-agent-win-x64-$Version.zip" -OutFile agent.zip
Expand-Archive -Path agent.zip -DestinationPath $dir -Force
.\config.cmd --unattended --url $env:AZP_URL --auth pat --token $env:AZP_TOKEN `
  --pool $Pool --agent $AgentName --runAsService --replace
# Con --runAsService el agente queda corriendo como servicio. Sin esa opcion ejecuta .\run.cmd
# Tambien necesitas Git y (opcional) Node 22. Bash para los pasos 'script' lo trae Git for Windows.
