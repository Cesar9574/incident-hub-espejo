// Repositorio en memoria: se usa en pruebas y en desarrollo sin base de datos.
function crearMemoryRepo() {
  let incidentes = [];
  let comentarios = [];
  let tecnicos = [
    { id: 1, nombre: 'Ana Morales' },
    { id: 2, nombre: 'Luis Perez' },
    { id: 3, nombre: 'Marta Lopez' }
  ];
  let sigIncidente = 1;
  let sigComentario = 1;

  const ahora = () => new Date().toISOString();
  const conTecnico = (i) => ({
    ...i,
    tecnico: i.tecnicoId ? tecnicos.find((t) => t.id === i.tecnicoId)?.nombre || null : null
  });

  return {
    async crearIncidente(d) {
      const inc = {
        id: sigIncidente++,
        titulo: d.titulo.trim(),
        descripcion: d.descripcion.trim(),
        categoria: d.categoria,
        prioridad: d.prioridad,
        usuario: d.usuario.trim(),
        estado: 'NUEVO',
        tecnicoId: null,
        fecha: ahora(),
        actualizado: ahora()
      };
      incidentes.push(inc);
      comentarios.push({ id: sigComentario++, incidenteId: inc.id, autor: 'sistema', texto: 'Incidente creado', fecha: ahora() });
      return conTecnico(inc);
    },
    async listarIncidentes(f = {}) {
      return incidentes
        .filter((i) => !f.estado || i.estado === f.estado)
        .filter((i) => !f.prioridad || i.prioridad === f.prioridad)
        .filter((i) => !f.categoria || i.categoria === f.categoria)
        .filter((i) => !f.tecnicoId || i.tecnicoId === Number(f.tecnicoId))
        .sort((a, b) => b.id - a.id)
        .map(conTecnico);
    },
    async obtenerIncidente(id) {
      const i = incidentes.find((x) => x.id === id);
      return i ? conTecnico(i) : null;
    },
    async actualizarEstado(id, estado) {
      const i = incidentes.find((x) => x.id === id);
      if (!i) return null;
      i.estado = estado;
      i.actualizado = ahora();
      return conTecnico(i);
    },
    async asignarTecnico(id, tecnicoId) {
      const i = incidentes.find((x) => x.id === id);
      if (!i) return null;
      i.tecnicoId = tecnicoId;
      i.actualizado = ahora();
      return conTecnico(i);
    },
    async listarTecnicos() {
      return tecnicos;
    },
    async obtenerTecnico(id) {
      return tecnicos.find((t) => t.id === id) || null;
    },
    async agregarComentario(incidenteId, autor, texto) {
      const c = { id: sigComentario++, incidenteId, autor: autor.trim(), texto: texto.trim(), fecha: ahora() };
      comentarios.push(c);
      return c;
    },
    async listarComentarios(incidenteId) {
      return comentarios.filter((c) => c.incidenteId === incidenteId);
    },
    async dashboard() {
      const abiertos = incidentes.filter((i) => i.estado !== 'CERRADO').length;
      const cerrados = incidentes.filter((i) => i.estado === 'CERRADO').length;
      const criticos = incidentes.filter((i) => i.prioridad === 'CRITICA' && i.estado !== 'CERRADO').length;
      const contar = (clave) => {
        const m = {};
        incidentes.forEach((i) => {
          const k = clave(i);
          m[k] = (m[k] || 0) + 1;
        });
        return Object.entries(m).map(([nombre, total]) => ({ nombre, total }));
      };
      return {
        abiertos,
        cerrados,
        criticos,
        porCategoria: contar((i) => i.categoria),
        porTecnico: contar((i) => conTecnico(i).tecnico || 'Sin asignar')
      };
    },
    async cerrar() {}
  };
}

module.exports = { crearMemoryRepo };
