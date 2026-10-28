# Fallo controlado del pipeline

Objetivo del enunciado: conservar evidencia de un pipeline fallido, su diagnostico, la correccion y una ejecucion exitosa.

## Procedimiento seguido
1. Rama `fix/pipeline-fallo-controlado` desde `main`, ligada a un Work Item de tipo Bug.
2. **Commit 1 (provoca el fallo):** en `tests/api.test.js`, en la prueba "crear incidente devuelve 201 y estado NUEVO" se cambia `assert.equal(r.data.estado, 'NUEVO')` por `'ASIGNADO'`.
3. Se abre el PR: el pipeline de validacion corre y **falla** en el paso "Pruebas automatizadas". (Guardar link del run fallido y captura del log.)
4. **Diagnostico:** el log muestra `Expected values to be strictly equal: 'NUEVO' !== 'ASIGNADO'` en la prueba de creacion. Un incidente nuevo debe nacer en NUEVO segun el flujo definido, asi que el error esta en la prueba, no en la API.
5. **Commit 2 (correccion):** se restaura el valor `'NUEVO'`.
6. El pipeline vuelve a correr y **pasa** (link del run exitoso).
7. Se completa el PR con squash.

## Evidencia a registrar
| Item | Link / captura |
|------|----------------|
| Run fallido | (completar) |
| Paso que fallo y mensaje | Pruebas automaticas / `NUEVO !== ASIGNADO` |
| Commit que corrige | (completar hash) |
| Run exitoso | (completar) |
| PR | (completar) |
