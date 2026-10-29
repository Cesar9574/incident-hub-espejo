# Fallo controlado del pipeline

El enunciado pide evidencia de un pipeline fallido, su diagnostico, correccion y ejecucion exitosa. Hubo dos ciclos reales.

## Ciclo 1 - repo incident-hub-semana2
| Item | Detalle |
|------|---------|
| Work item | Bug 31 |
| Run fallido | 20261027.1 (buildId 1), paso "Preparar contenido del paquete" |
| Error | cmd.exe: "cp" no se reconoce como un comando interno o externo |
| Causa | El paso script corre con cmd.exe en el agente Windows y el YAML tenia comandos de Linux (mkdir -p, cp -r, unzip) |
| Correccion | PR !10 (rama fix/pipeline-fallo-controlado): pasos pasados a powershell, Git Bash para el smoke test y .gitattributes con eol=lf |
| Run exitoso | 20261027.2 (buildId 2): Build, QA y Produccion con aprobacion manual |

## Ciclo 2 - repo incident-hub-final
| Item | Detalle |
|------|---------|
| Work item | Bug 38 |
| Run fallido | 20261028.7 (buildId 20), etapa QA, paso "Smoke test de QA" |
| Causa | Los pasos de QA todavia usaban comandos pensados para Linux/bash que no existen en el agente Windows |
| Correccion | Siete commits fix en main (58170f5 a 2b7a15a): Copy-Item, Expand-Archive, bloques powershell y smoke test con node -e |
| Run exitoso | 20261028.8 (buildId 21), commit 2b7a15a: Build, QA y Produccion tras aprobacion manual |

Nota: los siete commits del ciclo 2 se subieron directo a main porque las politicas de rama todavia no estaban activas en este repositorio. Se registro el Bug 38, se activaron las politicas y desde entonces todo entra por Pull Request.

## Evidencia
Runs 20261027.1, 20261027.2, 20261028.7 y 20261028.8 en Azure Pipelines (los de la semana 2 estan marcados como retenidos indefinidamente).