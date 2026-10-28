const { Pool } = require('pg');

// Repositorio PostgreSQL. Todas las consultas van parametrizadas ($1, $2...)
// para evitar inyeccion SQL.
function crearPgRepo(connectionString) {
  const pool = new Pool({ connectionString });

  const mapInc = (r) => ({
    id: r.id,
    titulo: r.titulo,
    descripcion: r.descripcion,
    categoria: r.categoria,
    prioridad: r.prioridad,
    usuario: r.usuario,
    estado: r.estado,
    tecnicoId: r.tecnico_id,
    tecnico: r.tecnico_nombre || null,
    fecha: r.fecha,
    actualizado: r.actualizado
  });

  const SELECT_BASE = `SELECT i.*, t.nombre AS tecnico_nombre
                       FROM incidentes i LEFT JOIN tecnicos t ON t.id = i.tecnico_id`;

  return {
    async crearIncidente(d) {
      // DT-06: alta del incidente + primera entrada de bitacora en una sola transaccion
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const { rows } = await client.query(
          `INSERT INTO incidentes (titulo, descripcion, categoria, prioridad, usuario)
           VALUES ($1,$2,$3,$4,$5) RETURNING id`,
          [d.titulo.trim(), d.descripcion.trim(), d.categoria, d.prioridad, d.usuario.trim()]
        );
        await client.query(
          `INSERT INTO comentarios (incidente_id, autor, texto) VALUES ($1,'sistema','Incidente creado')`,
          [rows[0].id]
        );
        await client.query('COMMIT');
        return this.obtenerIncidente(rows[0].id);
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    },
    async listarIncidentes(f = {}) {
      const cond = [];
      const val = [];
      if (f.estado) { val.push(f.estado); cond.push(`i.estado = $${val.length}`); }
      if (f.prioridad) { val.push(f.prioridad); cond.push(`i.prioridad = $${val.length}`); }
      if (f.categoria) { val.push(f.categoria); cond.push(`i.categoria = $${val.length}`); }
      if (f.tecnicoId) { val.push(Number(f.tecnicoId)); cond.push(`i.tecnico_id = $${val.length}`); }
      const where = cond.length ? `WHERE ${cond.join(' AND ')}` : '';
      const { rows } = await pool.query(`${SELECT_BASE} ${where} ORDER BY i.id DESC`, val);
      return rows.map(mapInc);
    },
    async obtenerIncidente(id) {
      const { rows } = await pool.query(`${SELECT_BASE} WHERE i.id = $1`, [id]);
      return rows[0] ? mapInc(rows[0]) : null;
    },
    async actualizarEstado(id, estado) {
      const r = await pool.query(
        'UPDATE incidentes SET estado = $1, actualizado = NOW() WHERE id = $2',
        [estado, id]
      );
      return r.rowCount ? this.obtenerIncidente(id) : null;
    },
    async asignarTecnico(id, tecnicoId) {
      const r = await pool.query(
        'UPDATE incidentes SET tecnico_id = $1, actualizado = NOW() WHERE id = $2',
        [tecnicoId, id]
      );
      return r.rowCount ? this.obtenerIncidente(id) : null;
    },
    async listarTecnicos() {
      const { rows } = await pool.query('SELECT id, nombre FROM tecnicos ORDER BY nombre');
      return rows;
    },
    async obtenerTecnico(id) {
      const { rows } = await pool.query('SELECT id, nombre FROM tecnicos WHERE id = $1', [id]);
      return rows[0] || null;
    },
    async agregarComentario(incidenteId, autor, texto) {
      const { rows } = await pool.query(
        `INSERT INTO comentarios (incidente_id, autor, texto) VALUES ($1,$2,$3)
         RETURNING id, incidente_id AS "incidenteId", autor, texto, fecha`,
        [incidenteId, autor.trim(), texto.trim()]
      );
      return rows[0];
    },
    async listarComentarios(incidenteId) {
      const { rows } = await pool.query(
        `SELECT id, incidente_id AS "incidenteId", autor, texto, fecha
         FROM comentarios WHERE incidente_id = $1 ORDER BY id`,
        [incidenteId]
      );
      return rows;
    },
    async dashboard() {
      const tot = await pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE estado <> 'CERRADO')::int AS abiertos,
          COUNT(*) FILTER (WHERE estado = 'CERRADO')::int AS cerrados,
          COUNT(*) FILTER (WHERE prioridad = 'CRITICA' AND estado <> 'CERRADO')::int AS criticos
        FROM incidentes`);
      const cat = await pool.query(
        'SELECT categoria AS nombre, COUNT(*)::int AS total FROM incidentes GROUP BY categoria ORDER BY categoria'
      );
      const tec = await pool.query(
        `SELECT COALESCE(t.nombre,'Sin asignar') AS nombre, COUNT(*)::int AS total
         FROM incidentes i LEFT JOIN tecnicos t ON t.id = i.tecnico_id
         GROUP BY t.nombre ORDER BY nombre`
      );
      return { ...tot.rows[0], porCategoria: cat.rows, porTecnico: tec.rows };
    },
    async cerrar() {
      await pool.end();
    }
  };
}

module.exports = { crearPgRepo };
