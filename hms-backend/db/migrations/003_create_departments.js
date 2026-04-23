/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE departments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
    );

    CREATE INDEX idx_departments_name ON departments(name) WHERE deleted_at IS NULL;
  `);
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE IF EXISTS departments CASCADE;');
};
