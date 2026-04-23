/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('phone', 20).unique().nullable();
    table.string('otp_code', 10).nullable();
    table.timestamp('otp_expires_at', { useTz: true }).nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('phone');
    table.dropColumn('otp_code');
    table.dropColumn('otp_expires_at');
  });
};
