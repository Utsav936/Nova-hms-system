/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE prescriptions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      medical_record_id UUID NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
      medication_name VARCHAR(200) NOT NULL,
      dosage VARCHAR(100) NOT NULL,
      frequency VARCHAR(100) NOT NULL,
      duration VARCHAR(100),
      instructions TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX idx_prescriptions_record ON prescriptions(medical_record_id);
  `);
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE IF EXISTS prescriptions CASCADE;');
};
