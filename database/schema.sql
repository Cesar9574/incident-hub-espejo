-- Esquema de IT Incident Hub (PostgreSQL 14+)
CREATE TABLE IF NOT EXISTS tecnicos (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS incidentes (
  id          SERIAL PRIMARY KEY,
  titulo      VARCHAR(120) NOT NULL,
  descripcion TEXT NOT NULL,
  categoria   VARCHAR(20) NOT NULL CHECK (categoria IN ('HARDWARE','SOFTWARE','RED','ACCESOS','OTRO')),
  prioridad   VARCHAR(10) NOT NULL CHECK (prioridad IN ('BAJA','MEDIA','ALTA','CRITICA')),
  usuario     VARCHAR(80) NOT NULL,
  estado      VARCHAR(12) NOT NULL DEFAULT 'NUEVO'
              CHECK (estado IN ('NUEVO','ASIGNADO','EN_PROCESO','RESUELTO','CERRADO')),
  tecnico_id  INTEGER REFERENCES tecnicos(id),
  fecha       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comentarios (
  id           SERIAL PRIMARY KEY,
  incidente_id INTEGER NOT NULL REFERENCES incidentes(id) ON DELETE CASCADE,
  autor        VARCHAR(80) NOT NULL,
  texto        TEXT NOT NULL,
  fecha        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incidentes_estado ON incidentes(estado);
CREATE INDEX IF NOT EXISTS idx_incidentes_prioridad ON incidentes(prioridad);
CREATE INDEX IF NOT EXISTS idx_incidentes_tecnico ON incidentes(tecnico_id);
CREATE INDEX IF NOT EXISTS idx_comentarios_incidente ON comentarios(incidente_id);
