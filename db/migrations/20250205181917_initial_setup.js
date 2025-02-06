/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('secrets', function (table) {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));;
        table.string('companyId').notNullable();
        table.string('applicationId').notNullable();
        table.string('clientId').nullable();
        table.string('clientSecret').nullable();
        table.string('instagramBusinessId').notNullable();
        table.text('accessToken').notNullable();
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('secrets');
};

