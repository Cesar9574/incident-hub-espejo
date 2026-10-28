const { ESTADOS, PRIORIDADES, CATEGORIAS } = require('./constants');

function validarIncidente(body) {
  const errores = [];
  const b = body || {};
  if (typeof b.titulo !== 'string' || b.titulo.trim().length < 3 || b.titulo.length > 120) {
    errores.push('titulo: texto de 3 a 120 caracteres');
  }
  if (typeof b.descripcion !== 'string' || b.descripcion.trim().length < 5) {
    errores.push('descripcion: minimo 5 caracteres');
  }
  if (!CATEGORIAS.includes(b.categoria)) {
    errores.push(`categoria: debe ser una de ${CATEGORIAS.join(', ')}`);
  }
  if (!PRIORIDADES.includes(b.prioridad)) {
    errores.push(`prioridad: debe ser una de ${PRIORIDADES.join(', ')}`);
  }
  if (typeof b.usuario !== 'string' || b.usuario.trim().length < 2) {
    errores.push('usuario: minimo 2 caracteres');
  }
  return errores;
}

function validarEstado(estado) {
  return ESTADOS.includes(estado);
}

function validarComentario(body) {
  const b = body || {};
  const errores = [];
  if (typeof b.autor !== 'string' || b.autor.trim().length < 2) errores.push('autor: minimo 2 caracteres');
  if (typeof b.texto !== 'string' || b.texto.trim().length < 1) errores.push('texto: no puede ir vacio');
  return errores;
}

module.exports = { validarIncidente, validarEstado, validarComentario };
