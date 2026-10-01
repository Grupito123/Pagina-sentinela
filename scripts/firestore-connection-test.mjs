/**
 * Prueba mínima de conexión a Firestore contra el proyecto real `centinela-2b390`.
 *
 * Usa el servidor de Vite para cargar el código de `src/Firebase` tal cual lo usa
 * la web, sin necesidad de herramientas extra ni de compilar la app.
 *
 *   node scripts/firestore-connection-test.mjs
 */
import { createServer } from 'vite';

const MODULE_ID = '/src/Firebase/index.ts';

const server = await createServer({
  configFile: false,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

let exitCode = 0;

try {
  const { db, firebaseConfig, testFirestoreConnection, CONNECTION_PROBE } = await server.ssrLoadModule(MODULE_ID);

  console.log('--- Firebase Client SDK ---');
  console.log('projectId :', firebaseConfig.projectId);
  console.log('appId     :', firebaseConfig.appId);
  console.log('db        :', db.constructor.name);

  console.log('\n--- Lectura real ---');
  console.log(`doc       : ${CONNECTION_PROBE.collection}/${CONNECTION_PROBE.documentId}`);

  const result = await testFirestoreConnection();
  console.log('status    :', result.status);
  console.log('exists    :', result.exists);
  console.log('data      :', result.data ? JSON.stringify(result.data, null, 2) : null);
  if (result.error) console.log('error     :', result.error);

  if (result.status === 'error') exitCode = 1;
} catch (error) {
  console.error('Fallo la prueba de conexión:', error);
  exitCode = 1;
} finally {
  await server.close();
}

process.exit(exitCode);
