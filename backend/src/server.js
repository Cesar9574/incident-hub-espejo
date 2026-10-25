const { crearApp } = require('./app');
const { crearMemoryRepo } = require('./repositories/memoryRepo');

const port = process.env.PORT || 3000;
let repo;

if (process.env.DATABASE_URL) {
  const { crearPgRepo } = require('./repositories/pgRepo');
  repo = crearPgRepo(process.env.DATABASE_URL);
  console.log('Usando PostgreSQL');
} else {
  repo = crearMemoryRepo();
  console.log('DATABASE_URL no definida: usando repositorio en memoria (solo desarrollo)');
}

const server = crearApp(repo).listen(port, () => console.log(`API escuchando en puerto ${port}`));

process.on('SIGTERM', async () => {
  server.close();
  await repo.cerrar();
});
