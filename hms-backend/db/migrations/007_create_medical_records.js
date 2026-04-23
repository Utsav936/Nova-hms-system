/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE medical_records (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
      doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
      appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
      diagnosis TEXT,
      symptoms TEXT,
      treatment TEXT,
      notes TEXT,
      record_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
    );

    CREATE INDEX idx_records_patient ON medical_records(patient_id) WHERE deleted_at IS NULL;
    CREATE INDEX idx_records_doctor ON medical_records(doctor_id) WHERE deleted_at IS NULL;
    CREATE INDEX idx_records_date ON medical_records(record_date) WHERE deleted_at IS NULL;
  `);
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE IF EXISTS medical_records CASCADE;');
};
