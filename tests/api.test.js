const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { crearApp } = require('../backend/src/app');
const { crearMemoryRepo } = require('../backend/src/repositories/memoryRepo');
const { validarIncidente } = require('../backend/src/validators');

let server;
let base;

const valido = {
  titulo: 'No hay internet en recepcion',
  descripcion: 'El switch del primer piso no responde',
  categoria: 'RED',
  prioridad: 'CRITICA',
  usuario: 'jperez'
};

async function http(metodo, ruta, cuerpo) {
  const r = await fetch(base + ruta, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined
  });
  return { status: r.status, data: await r.json() };
}

before(async () => {
  server = crearApp(crearMemoryRepo()).listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test('health responde ok', async () => {
  const r = await http('GET', '/health');
  assert.equal(r.status, 200);
  assert.equal(r.data.status, 'ok');
});

test('validador rechaza incidente vacio', () => {
  assert.ok(validarIncidente({}).length >= 5);
  assert.equal(validarIncidente(valido).length, 0);
});

test('crear incidente devuelve 201 y estado NUEVO', async () => {
  const r = await http('POST', '/api/incidentes', valido);
  assert.equal(r.status, 201);
  assert.equal(r.data.estado, 'NUEVO');
  assert.ok(r.data.fecha);
});

test('crear incidente invalido devuelve 400', async () => {
  const r = await http('POST', '/api/incidentes', { titulo: 'x' });
  assert.equal(r.status, 400);
  assert.ok(Array.isArray(r.data.errores));
});

test('flujo completo: asignar, en proceso, resolver, cerrar', async () => {
  const { data: inc } = await http('POST', '/api/incidentes', valido);
  let r = await http('PATCH', `/api/incidentes/${inc.id}/asignar`, { tecnicoId: 1 });
  assert.equal(r.data.estado, 'ASIGNADO');
  assert.equal(r.data.tecnico, 'Ana Morales');
  for (const e of ['EN_PROCESO', 'RESUELTO', 'CERRADO']) {
    r = await http('PATCH', `/api/incidentes/${inc.id}/estado`, { estado: e });
    assert.equal(r.status, 200);
    assert.equal(r.data.estado, e);
  }
});

test('no permite saltar estados', async () => {
  const { data: inc } = await http('POST', '/api/incidentes', valido);
  const r = await http('PATCH', `/api/incidentes/${inc.id}/estado`, { estado: 'CERRADO' });
  assert.equal(r.status, 409);
});

test('no permite EN_PROCESO sin tecnico', async () => {
  const { data: inc } = await http('POST', '/api/incidentes', valido);
  // se fuerza estado ASIGNADO sin tecnico no es posible por API, asi que se valida el salto directo
  const r = await http('PATCH', `/api/incidentes/${inc.id}/estado`, { estado: 'EN_PROCESO' });
  assert.equal(r.status, 409);
});

test('asignar tecnico inexistente da 400', async () => {
  const { data: inc } = await http('POST', '/api/incidentes', valido);
  const r = await http('PATCH', `/api/incidentes/${inc.id}/asignar`, { tecnicoId: 999 });
  assert.equal(r.status, 400);
});

test('bitacora registra eventos y comentarios', async () => {
  const { data: inc } = await http('POST', '/api/incidentes', valido);
  await http('POST', `/api/incidentes/${inc.id}/comentarios`, { autor: 'ana', texto: 'Voy en camino' });
  const r = await http('GET', `/api/incidentes/${inc.id}/comentarios`);
  assert.equal(r.status, 200);
  assert.equal(r.data.length, 2);
  assert.equal(r.data[1].texto, 'Voy en camino');
});

test('comentario invalido da 400', async () => {
  const { data: inc } = await http('POST', '/api/incidentes', valido);
  const r = await http('POST', `/api/incidentes/${inc.id}/comentarios`, { autor: 'a', texto: '' });
  assert.equal(r.status, 400);
});

test('filtros por prioridad, categoria y tecnico', async () => {
  const { data: a } = await http('POST', '/api/incidentes', { ...valido, prioridad: 'BAJA', categoria: 'SOFTWARE' });
  await http('PATCH', `/api/incidentes/${a.id}/asignar`, { tecnicoId: 2 });
  const p = await http('GET', '/api/incidentes?prioridad=BAJA');
  assert.ok(p.data.every((i) => i.prioridad === 'BAJA'));
  const c = await http('GET', '/api/incidentes?categoria=SOFTWARE');
  assert.ok(c.data.length >= 1 && c.data.every((i) => i.categoria === 'SOFTWARE'));
  const t = await http('GET', '/api/incidentes?tecnicoId=2');
  assert.ok(t.data.length >= 1 && t.data.every((i) => i.tecnicoId === 2));
  const e = await http('GET', '/api/incidentes?estado=ASIGNADO');
  assert.ok(e.data.every((i) => i.estado === 'ASIGNADO'));
});

test('filtro con valor invalido da 400', async () => {
  const r = await http('GET', '/api/incidentes?estado=XYZ');
  assert.equal(r.status, 400);
});

test('incidente inexistente da 404 e id malo da 400', async () => {
  assert.equal((await http('GET', '/api/incidentes/9999')).status, 404);
  assert.equal((await http('GET', '/api/incidentes/abc')).status, 400);
});

test('dashboard cuenta abiertos, cerrados y criticos', async () => {
  const r = await http('GET', '/api/dashboard');
  assert.equal(r.status, 200);
  assert.ok(r.data.abiertos >= 1);
  assert.ok(r.data.cerrados >= 1);
  assert.ok(r.data.criticos >= 1);
  assert.ok(Array.isArray(r.data.porCategoria));
  assert.ok(Array.isArray(r.data.porTecnico));
});
