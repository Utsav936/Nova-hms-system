const env = require('./config/env');
const app = require('./app');
require('./config/firebase'); // Initialize Firebase

const PORT = env.port;

app.listen(PORT, () => {
  console.log(`\n🏥 Nova HMS API Server [FIREBASE MODE]`);
  console.log(`   Environment : ${env.nodeEnv}`);
  console.log(`   Port        : ${PORT}`);
  console.log(`   Client URL  : ${env.clientUrl}`);
  console.log(`   Health      : http://localhost:${PORT}/api/health\n`);
});
