const _ = require("lodash");
const { Model } = require("objection");
const { getcodePulseConnection } = require("../postgres.init");
const { application } = require("express");
const codePulseConnection = getcodePulseConnection();

class Advertise extends Model {
    static get tableName() {
        return "advertise";
    }

    static get idColumn() {
        return "id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["ctaType", "budget", "minAge", "maxAge", "campaignName", "productId"],
            properties: {
                id: { type: "string", format: "uuid" },
                secretsId: { type: "string", minLength: 1 },
                productId: { type: "string", },
                ctaType: { type: "string", minLength: 1 },
                budget: { type: "number" },
                minAge: { type: "integer", minimum: 13 },
                maxAge: { type: "integer" },
                campaignName: { type: "string", minLength: 1 },
                websiteUrl: { type: "string" },
                postId: { type: "string" },
                permaLink: { type: "string" },
                campaignId: { type: "string" },
                adsetId: { type: "string" },
                adCreativeId: { type: "string" },
                adId: { type: "string" }
            },
        };
    }

    static async create(rawTemplate) {
        return this.query().insert(rawTemplate).returning("*");
    }

    static getById(id) {
        return this.query().where({ id });
    }

    static getBySecretsId(secretsId) {
        return this.query().where({ secretsId });
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
        json = super.$formatJson(json);
        return json;
    }
}

module.exports = Advertise.bindKnex(codePulseConnection);