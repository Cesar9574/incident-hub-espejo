const express = require('express');
const cors = require('cors');
const { TRANSICIONES, ESTADOS, PRIORIDADES, CATEGORIAS } = require('./constants');
const { validarIncidente, validarEstado, validarComentario } = require('./validators');

function crearApp(repo) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const idParam = (req) => {
    const n = Number(req.params.id);
    return Number.isInteger(n) && n > 0 ? n : null;
  };
  // Envuelve handlers async para mandar los errores al middleware final
  const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.get('/api/catalogos', (_req, res) =>
    res.json({ estados: ESTADOS, prioridades: PRIORIDADES, categorias: CATEGORIAS })
  );

  app.get('/api/tecnicos', wrap(async (_req, res) => res.json(await repo.listarTecnicos())));

  app.get('/api/dashboard', wrap(async (_req, res) => res.json(await repo.dashboard())));

  app.post('/api/incidentes', wrap(async (req, res) => {
    const errores = validarIncidente(req.body);
    if (errores.length) return res.status(400).json({ errores });
    res.status(201).json(await repo.crearIncidente(req.body));
  }));

  app.get('/api/incidentes', wrap(async (req, res) => {
    const { estado, prioridad, categoria, tecnicoId } = req.query;
    if (estado && !ESTADOS.includes(estado)) return res.status(400).json({ errores: ['estado invalido'] });
    if (prioridad && !PRIORIDADES.includes(prioridad)) return res.status(400).json({ errores: ['prioridad invalida'] });
    if (categoria && !CATEGORIAS.includes(categoria)) return res.status(400).json({ errores: ['categoria invalida'] });
    res.json(await repo.listarIncidentes({ estado, prioridad, categoria, tecnicoId }));
  }));

  app.get('/api/incidentes/:id', wrap(async (req, res) => {
    const id = idParam(req);
    if (!id) return res.status(400).json({ errores: ['id invalido'] });
    const inc = await repo.obtenerIncidente(id);
    if (!inc) return res.status(404).json({ errores: ['incidente no encontrado'] });
    res.json(inc);
  }));

  app.patch('/api/incidentes/:id/asignar', wrap(async (req, res) => {
    const id = idParam(req);
    if (!id) return res.status(400).json({ errores: ['id invalido'] });
    const inc = await repo.obtenerIncidente(id);
    if (!inc) return res.status(404).json({ errores: ['incidente no encontrado'] });
    if (inc.estado === 'CERRADO') return res.status(409).json({ errores: ['no se puede asignar un incidente cerrado'] });
    const tecnico = await repo.obtenerTecnico(Number(req.body && req.body.tecnicoId));
    if (!tecnico) return res.status(400).json({ errores: ['tecnico no existe'] });
    await repo.asignarTecnico(id, tecnico.id);
    // Al asignar un incidente NUEVO pasa automaticamente a ASIGNADO
    const actualizado = inc.estado === 'NUEVO' ? await repo.actualizarEstado(id, 'ASIGNADO') : await repo.obtenerIncidente(id);
    await repo.agregarComentario(id, 'sistema', `Asignado a ${tecnico.nombre}`);
    res.json(actualizado);
  }));

  app.patch('/api/incidentes/:id/estado', wrap(async (req, res) => {
    const id = idParam(req);
    if (!id) return res.status(400).json({ errores: ['id invalido'] });
    const nuevo = req.body && req.body.estado;
    if (!validarEstado(nuevo)) return res.status(400).json({ errores: ['estado invalido'] });
    const inc = await repo.obtenerIncidente(id);
    if (!inc) return res.status(404).json({ errores: ['incidente no encontrado'] });
    if (!TRANSICIONES[inc.estado].includes(nuevo)) {
      return res.status(409).json({ errores: [`transicion no permitida: ${inc.estado} -> ${nuevo}`] });
    }
    if (nuevo === 'EN_PROCESO' && !inc.tecnicoId) {
      return res.status(409).json({ errores: ['asigna un tecnico antes de pasar a EN_PROCESO'] });
    }
    const actualizado = await repo.actualizarEstado(id, nuevo);
    await repo.agregarComentario(id, 'sistema', `Estado: ${inc.estado} -> ${nuevo}`);
    res.json(actualizado);
  }));

  app.get('/api/incidentes/:id/comentarios', wrap(async (req, res) => {
    const id = idParam(req);
    if (!id) return res.status(400).json({ errores: ['id invalido'] });
    if (!(await repo.obtenerIncidente(id))) return res.status(404).json({ errores: ['incidente no encontrado'] });
    res.json(await repo.listarComentarios(id));
  }));

  app.post('/api/incidentes/:id/comentarios', wrap(async (req, res) => {
    const id = idParam(req);
    if (!id) return res.status(400).json({ errores: ['id invalido'] });
    if (!(await repo.obtenerIncidente(id))) return res.status(404).json({ errores: ['incidente no encontrado'] });
    const errores = validarComentario(req.body);
    if (errores.length) return res.status(400).json({ errores });
    res.status(201).json(await repo.agregarComentario(id, req.body.autor, req.body.texto));
  }));

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ errores: ['error interno del servidor'] });
  });

  return app;
}

module.exports = { crearApp };
