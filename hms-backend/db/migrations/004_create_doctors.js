/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE doctors (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
      specialization VARCHAR(150) NOT NULL,
      phone VARCHAR(20),
      qualification VARCHAR(255),
      experience_years INTEGER DEFAULT 0,
      consultation_fee DECIMAL(10, 2) DEFAULT 0.00,
      avatar_url VARCHAR(500),
      bio TEXT,
      is_available BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
    );

    CREATE INDEX idx_doctors_user ON doctors(user_id) WHERE deleted_at IS NULL;
    CREATE INDEX idx_doctors_department ON doctors(department_id) WHERE deleted_at IS NULL;
    CREATE INDEX idx_doctors_specialization ON doctors(specialization) WHERE deleted_at IS NULL;
  `);
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE IF EXISTS doctors CASCADE;');
};
