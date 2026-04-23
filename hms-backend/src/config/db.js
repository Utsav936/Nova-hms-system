const knex = require('knex');
const knexConfig = require('../../knexfile');
const env = require('./env');

const environment = env.nodeEnv || 'development';
const config = knexConfig[environment];

// ⚠️ LEGACY SQL DATABASE (Being phased out for Firebase)
// We are silencing this check during migration to keep logs clean.
const db = knex(config);

/*
db.raw('SELECT 1')
  .then(() => {
    if (env.isDevelopment) {
      console.log(`✅ Legacy Database connected`);
    }
  })
  .catch((err) => {
    // Silenced during Firebase migration
  });
*/

module.exports = db;

