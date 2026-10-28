const BASE = import.meta.env.VITE_API_URL || '';

async function pedir(ruta, opciones = {}) {
  const r = await fetch(BASE + ruta, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((data.errores || ['Error de red']).join(', '));
  return data;
}

export const api = {
  catalogos: () => pedir('/api/catalogos'),
  tecnicos: () => pedir('/api/tecnicos'),
  dashboard: () => pedir('/api/dashboard'),
  incidentes: (f) => pedir('/api/incidentes?' + new URLSearchParams(Object.entries(f).filter(([, v]) => v))),
  incidente: (id) => pedir(`/api/incidentes/${id}`),
  crear: (d) => pedir('/api/incidentes', { method: 'POST', body: JSON.stringify(d) }),
  asignar: (id, tecnicoId) => pedir(`/api/incidentes/${id}/asignar`, { method: 'PATCH', body: JSON.stringify({ tecnicoId }) }),
  estado: (id, estado) => pedir(`/api/incidentes/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) }),
  comentarios: (id) => pedir(`/api/incidentes/${id}/comentarios`),
  comentar: (id, d) => pedir(`/api/incidentes/${id}/comentarios`, { method: 'POST', body: JSON.stringify(d) })
};
