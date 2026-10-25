import { useEffect, useState, useCallback } from 'react';
import { api } from './api.js';

const SIGUIENTE = { ASIGNADO: 'EN_PROCESO', EN_PROCESO: 'RESUELTO', RESUELTO: 'CERRADO' };
const fmt = (f) => new Date(f).toLocaleString('es-GT');

function Dashboard({ datos }) {
  if (!datos) return null;
  const barras = (lista) => {
    const max = Math.max(1, ...lista.map((x) => x.total));
    return lista.map((x) => (
      <div className="barra" key={x.nombre}>
        <span>{x.nombre}</span>
        <div className="pista"><div className="relleno" style={{ width: `${(x.total / max) * 100}%` }} /></div>
        <b>{x.total}</b>
      </div>
    ));
  };
  return (
    <section className="dashboard">
      <div className="kpis">
        <div><b>{datos.abiertos}</b> abiertos</div>
        <div><b>{datos.cerrados}</b> cerrados</div>
        <div className="critico"><b>{datos.criticos}</b> críticos sin cerrar</div>
      </div>
      <div className="graficas">
        <div><h3>Por categoría</h3>{barras(datos.porCategoria)}</div>
        <div><h3>Por técnico</h3>{barras(datos.porTecnico)}</div>
      </div>
    </section>
  );
}

function Formulario({ cat, onCreado, onError }) {
  const vacio = { titulo: '', descripcion: '', categoria: 'SOFTWARE', prioridad: 'MEDIA', usuario: '' };
  const [f, setF] = useState(vacio);
  const cambiar = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const enviar = async (e) => {
    e.preventDefault();
    try {
      await api.crear(f);
      setF(vacio);
      onCreado();
    } catch (err) {
      onError(err.message);
    }
  };
  return (
    <form className="panel" onSubmit={enviar}>
      <h2>Reportar incidente</h2>
      <label>Título<input value={f.titulo} onChange={cambiar('titulo')} /></label>
      <label>Descripción<textarea rows="3" value={f.descripcion} onChange={cambiar('descripcion')} /></label>
      <div className="fila">
        <label>Categoría
          <select value={f.categoria} onChange={cambiar('categoria')}>{cat.categorias.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
        <label>Prioridad
          <select value={f.prioridad} onChange={cambiar('prioridad')}>{cat.prioridades.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
      </div>
      <label>Usuario que reporta<input value={f.usuario} onChange={cambiar('usuario')} /></label>
      <button>Crear incidente</button>
    </form>
  );
}

function Detalle({ id, tecnicos, onCambio, onError }) {
  const [inc, setInc] = useState(null);
  const [coms, setComs] = useState([]);
  const [com, setCom] = useState({ autor: '', texto: '' });

  const cargar = useCallback(async () => {
    try {
      setInc(await api.incidente(id));
      setComs(await api.comentarios(id));
    } catch (e) {
      onError(e.message);
    }
  }, [id, onError]);

  useEffect(() => { cargar(); }, [cargar]);

  const accion = async (fn) => {
    try { await fn(); await cargar(); onCambio(); } catch (e) { onError(e.message); }
  };

  if (!inc) return null;
  return (
    <aside className="panel detalle">
      <h2>#{inc.id} {inc.titulo}</h2>
      <p>{inc.descripcion}</p>
      <p className="meta">{inc.categoria} · <span className={`pri ${inc.prioridad}`}>{inc.prioridad}</span> · {inc.estado} · reportó {inc.usuario}</p>
      <div className="fila">
        <label>Técnico
          <select value={inc.tecnicoId || ''} onChange={(e) => accion(() => api.asignar(id, Number(e.target.value)))} disabled={inc.estado === 'CERRADO'}>
            <option value="" disabled>Sin asignar</option>
            {tecnicos.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
        </label>
        {SIGUIENTE[inc.estado] && (
          <button onClick={() => accion(() => api.estado(id, SIGUIENTE[inc.estado]))}>Pasar a {SIGUIENTE[inc.estado]}</button>
        )}
      </div>
      <h3>Bitácora</h3>
      <ul className="bitacora">
        {coms.map((c) => <li key={c.id}><b>{c.autor}</b> <small>{fmt(c.fecha)}</small><br />{c.texto}</li>)}
      </ul>
      <form className="fila" onSubmit={(e) => { e.preventDefault(); accion(async () => { await api.comentar(id, com); setCom({ ...com, texto: '' }); }); }}>
        <input placeholder="Tu nombre" value={com.autor} onChange={(e) => setCom({ ...com, autor: e.target.value })} />
        <input placeholder="Comentario" value={com.texto} onChange={(e) => setCom({ ...com, texto: e.target.value })} />
        <button>Agregar</button>
      </form>
    </aside>
  );
}

export default function App() {
  const [cat, setCat] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [lista, setLista] = useState([]);
  const [dash, setDash] = useState(null);
  const [filtros, setFiltros] = useState({ estado: '', prioridad: '', categoria: '', tecnicoId: '' });
  const [sel, setSel] = useState(null);
  const [error, setError] = useState('');

  const refrescar = useCallback(async () => {
    try {
      setLista(await api.incidentes(filtros));
      setDash(await api.dashboard());
    } catch (e) { setError(e.message); }
  }, [filtros]);

  useEffect(() => {
    Promise.all([api.catalogos(), api.tecnicos()]).then(([c, t]) => { setCat(c); setTecnicos(t); }).catch((e) => setError(e.message));
  }, []);
  useEffect(() => { refrescar(); }, [refrescar]);

  if (!cat) return <p className="cargando">{error || 'Cargando...'}</p>;
  const f = (k) => (e) => setFiltros({ ...filtros, [k]: e.target.value });
  const opciones = (arr) => [<option key="" value="">Todos</option>, ...arr.map((x) => <option key={x}>{x}</option>)];

  return (
    <div className="app">
      <header><h1>IT Incident Hub</h1></header>
      {error && <div className="error" role="alert" onClick={() => setError('')}>{error}</div>}
      <Dashboard datos={dash} />
      <main>
        <div>
          <Formulario cat={cat} onCreado={refrescar} onError={setError} />
          <div className="panel">
            <h2>Incidentes</h2>
            <div className="filtros">
              <label>Estado<select value={filtros.estado} onChange={f('estado')}>{opciones(cat.estados)}</select></label>
              <label>Prioridad<select value={filtros.prioridad} onChange={f('prioridad')}>{opciones(cat.prioridades)}</select></label>
              <label>Categoría<select value={filtros.categoria} onChange={f('categoria')}>{opciones(cat.categorias)}</select></label>
              <label>Técnico
                <select value={filtros.tecnicoId} onChange={f('tecnicoId')}>
                  <option value="">Todos</option>
                  {tecnicos.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>
              </label>
            </div>
            <table>
              <thead><tr><th>#</th><th>Título</th><th>Prioridad</th><th>Estado</th><th>Técnico</th></tr></thead>
              <tbody>
                {lista.length === 0 && <tr><td colSpan="5">No hay incidentes con esos filtros. Crea el primero en el formulario.</td></tr>}
                {lista.map((i) => (
                  <tr key={i.id} className={sel === i.id ? 'activa' : ''} onClick={() => setSel(i.id)}>
                    <td>{i.id}</td><td>{i.titulo}</td><td><span className={`pri ${i.prioridad}`}>{i.prioridad}</span></td><td>{i.estado}</td><td>{i.tecnico || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {sel && <Detalle id={sel} tecnicos={tecnicos} onCambio={refrescar} onError={setError} />}
      </main>
    </div>
  );
}
