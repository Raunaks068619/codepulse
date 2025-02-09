/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('advertise', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid("secretsId").references("id").inTable("secrets");
    table.string('productId').notNullable();
    table.string('ctaType').notNullable();
    table.decimal('budget').notNullable();
    table.integer('minAge').notNullable();
    table.integer('maxAge').notNullable();
    table.string('campaignName').notNullable();
    table.string('websiteUrl');
    table.string('postId');
    table.string('permaLink');
    table.string('campaignId');
    table.string('adsetId');
    table.string('adCreativeId');
    table.string('adId');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('advertise');
};
