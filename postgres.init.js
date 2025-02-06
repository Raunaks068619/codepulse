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
	connection: 'postgres://admin:admin@127.0.0.1:5432/codepulse',
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