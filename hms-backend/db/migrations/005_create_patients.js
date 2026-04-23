/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.raw(`
    -- Create enums
    DO $$ BEGIN
      CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE blood_group_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE TABLE patients (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      date_of_birth DATE,
      gender gender_type,
      blood_group blood_group_type,
      phone VARCHAR(20),
      email VARCHAR(255),
      address TEXT,
      emergency_contact_name VARCHAR(200),
      emergency_contact_phone VARCHAR(20),
      avatar_url VARCHAR(500),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
    );

    CREATE INDEX idx_patients_user ON patients(user_id) WHERE deleted_at IS NULL;
    CREATE INDEX idx_patients_name ON patients(first_name, last_name) WHERE deleted_at IS NULL;
    CREATE INDEX idx_patients_phone ON patients(phone) WHERE deleted_at IS NULL;
  `);
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.raw(`
    DROP TABLE IF EXISTS patients CASCADE;
    DROP TYPE IF EXISTS blood_group_type;
    DROP TYPE IF EXISTS gender_type;
  `);
};
