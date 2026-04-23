/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE staff (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      role_title VARCHAR(150) NOT NULL,
      contact_number VARCHAR(20),
      email VARCHAR(255),
      description TEXT,
      shift_timing VARCHAR(100),
      department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
    );

    CREATE INDEX idx_staff_user ON staff(user_id) WHERE deleted_at IS NULL;
    CREATE INDEX idx_staff_role ON staff(role_title) WHERE deleted_at IS NULL;
  `);
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE IF EXISTS staff CASCADE;');
};
