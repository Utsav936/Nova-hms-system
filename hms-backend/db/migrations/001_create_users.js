/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.raw(`
    -- Enable UUID generation
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Create role enum
    DO $$ BEGIN
      CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'receptionist', 'patient');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role user_role NOT NULL DEFAULT 'patient',
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
    );

    -- Index for faster lookups
    CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
    CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;
  `);
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.raw(`
    DROP TABLE IF EXISTS users CASCADE;
    DROP TYPE IF EXISTS user_role;
  `);
};
