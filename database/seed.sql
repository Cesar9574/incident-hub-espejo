-- Datos de ejemplo (solo desarrollo)
INSERT INTO tecnicos (nombre) VALUES ('Ana Morales'), ('Luis Perez'), ('Marta Lopez')
ON CONFLICT (nombre) DO NOTHING;
