const path = require("path");

module.exports = {
    client: "pg",
    // connection: 'postgres://admin:admin@127.0.0.1:5432/codepulse',
    connection: 'postgresql://postgres.vdxqdkaujsuypkcmvzfk:Codepulse_fynd123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
    migrations: {
        directory: path.join(__dirname, "./migrations"),
    },
};