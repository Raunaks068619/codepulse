const Knex = require("knex");
const pg = require("pg");

// Initialize knex.
pg.types.setTypeParser(1082, function(stringValue) {
	return stringValue;  //1082 for date type
});
const codePulseConnection = Knex({
	client: "pg",
	useNullAsDefault: true,
	debug:true,
	connection: process.env.DATABASE_URL,
});

module.exports = {
	/**
	 *
	 */
	getcodePulseConnection: () => {
		return codePulseConnection;
	},
	/**
	 *
	 */
	connect: async() => {
		return codePulseConnection.schema.hasTable(config.transactionsTableName);
	},
};