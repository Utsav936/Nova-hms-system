/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.raw(`
    DO $$ BEGIN
      CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE appointment_type AS ENUM ('consultation', 'follow_up', 'emergency', 'routine_checkup');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE TABLE appointments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
      doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
      appointment_date DATE NOT NULL,
      appointment_time TIME NOT NULL,
      status appointment_status NOT NULL DEFAULT 'scheduled',
      type appointment_type NOT NULL DEFAULT 'consultation',
      reason TEXT,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
    );

    CREATE INDEX idx_appointments_patient ON appointments(patient_id) WHERE deleted_at IS NULL;
    CREATE INDEX idx_appointments_doctor ON appointments(doctor_id) WHERE deleted_at IS NULL;
    CREATE INDEX idx_appointments_date ON appointments(appointment_date) WHERE deleted_at IS NULL;
    CREATE INDEX idx_appointments_status ON appointments(status) WHERE deleted_at IS NULL;
  `);
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.raw(`
    DROP TABLE IF EXISTS appointments CASCADE;
    DROP TYPE IF EXISTS appointment_type;
    DROP TYPE IF EXISTS appointment_status;
  `);
};
