const path = require("path");

module.exports = {
    client: "pg",
    connection: 'postgres://admin:admin@127.0.0.1:5432/codepulse',
    migrations: {
        directory: path.join(__dirname, "./migrations"),
    },
};