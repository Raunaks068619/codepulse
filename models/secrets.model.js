const _ = require("lodash");
const { Model } = require("objection");
const { getcodePulseConnection } = require("../postgres.init");
const { application } = require("express");
const codePulseConnection = getcodePulseConnection();

class Secrets extends Model {
    // Table name is the only required property.
    static get tableName() {
        return "secrets";
    }

    static get idColumn() {
        return "id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["companyId", "instagramBusinessId", "accessToken"],
            properties: {
                id: { type: "string", format: "uuid" },
                companyId: { type: "string", minLength: 1 },
                clientId: { type: "string" },
                clientSecret: { type: "string" },
                instagramBusinessId: { type: "string", minLength: 1 },
                accessToken: { type: "string", minLength: 1 },
            },
        };
    }

    static async create(rawTemplate) {
        const existingRecord = await this.query().where({
            companyId: rawTemplate.companyId,
            applicationId: rawTemplate.applicationId
        }).first();
        if (existingRecord) {
            return { error: true, message: "Record with the same companyId and applicationId already exists." };
        }
        return this.query().insert(rawTemplate).returning("*");
    }

    static getById(id) {
        return this.query().where({ id });
    }
    static getByCompanyAndAppId({ companyId, applicationId }) {
        return this.query().where({ companyId, applicationId }).first();

    }

    static deleteAll() {
        return this.query().where({}).del();
    }

    $beforeInsert() {
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    $beforeUpdate() {
        this.updatedAt = new Date().toISOString();
        delete this.createdAt;
    }

    $formatJson(json) {
        // Remember to call the super class's implementation.
        json = super.$formatJson(json);
        // Do your conversion here.
        return _.omit(json, ["hash", "salt"]);
    }
}

module.exports = Secrets.bindKnex(codePulseConnection);