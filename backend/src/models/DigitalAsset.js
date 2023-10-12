const Joi = require("joi").extend(require("@joi/date"));
const db = require("./DB");
const web3 = require("./../smart-contracts/Web3Instance");
const DigitalAssetMarketContract = require("./../smart-contracts/SmartContract");
class DigitalAsset {
    constructor(
        name,
        description,
        category,
        price,
        owner_id,
        image_name = null,
    ) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.owner_id = owner_id;
        this.image_name = image_name;
    }

    static getValidationSchema() {
        return Joi.object({
            name: Joi.string().min(1).max(255).truncate().trim().required(),
            description: Joi.string()
                .min(1)
                .max(255)
                .truncate()
                .trim()
                .required(),
            category: Joi.string().min(1).max(50).truncate().trim().required(),
            price: Joi.number()
                .precision(2)
                .sign("positive")
                .less(1000000)
                .required(),
            owner_id: Joi.number().sign("positive").required(),
            image_name: Joi.string().allow(null)
        });
    }

    static createDigitalAsset(digitalAsset) {
        return new Promise(async (resolve, reject) => {
            try {
                await DigitalAsset.getValidationSchema().validateAsync(
                    digitalAsset,
                );
            } catch (validationError) {
                return reject(validationError);
            }
            console.log(digitalAsset);
            db.query(
                "INSERT INTO DigitalAssets SET ?",
                digitalAsset,
                (err, res) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    }
                    return resolve({ asset_id: res.insertId, ...digitalAsset });
                },
            );
        });
    }

    static getAllDigitalAssets(query) {
        // TODO: sanitise input

        return new Promise(async (resolve, reject) => {
            const queryValidationSchema = Joi.object({
                max: Joi.number(),
                min: Joi.number(),
                start: Joi.date().format("YYYY-MM-DD").raw(),
                end: Joi.date().format("YYYY-MM-DD").raw(),
                category: Joi.string().max(255).truncate().trim(),
                name: Joi.string().max(255).truncate().trim(),
                owner_id: Joi.number(),
            });
            let validatedQuery;

            try {
                validatedQuery =
                    await queryValidationSchema.validateAsync(query);
            } catch (validationError) {
                return reject(validationError);
            }

            let filter = [];
            if (validatedQuery.name) {
                filter.push(`name LIKE '%${validatedQuery.name}%'`);
            }
            if (validatedQuery.min) {
                filter.push(`price >= ${validatedQuery.min}`);
            }
            if (validatedQuery.max) {
                filter.push(`price <= ${validatedQuery.max}`);
            }
            if (validatedQuery.start) {
                filter.push(`creation_date >= '${validatedQuery.start}'`);
            }
            if (validatedQuery.end) {
                filter.push(`creation_date <= '${validatedQuery.end}'`);
            }
            if (validatedQuery.category) {
                filter.push(`category LIKE '%${validatedQuery.category}%'`);
            }
            if (validatedQuery.owner_id) {
                filter.push(`owner_id = ${validatedQuery.owner_id}`);
            }

            let filterMessage =
                filter.length === 0 ? "" : "WHERE " + filter.join(" AND ");
            console.log(filterMessage);
            db.query(
                `Select asset_id,name,price,description,category,owner_id,CONCAT(first_name,' ',last_name) as owner_name, creation_date,image_name, is_available 
                FROM DigitalAssets 
                INNER JOIN
                Users ON DigitalAssets.owner_id = Users.user_id
                ${filterMessage}
                `,
                (queryError, res) => {
                    if (queryError) {
                        console.log(queryError);
                        return reject(queryError);
                    }

                    for (const row of res) {
                        row.is_available = Boolean(Number(row.is_available));
                    }
                    return resolve(res);
                },
            );
        });
    }

    static getOneDigitalAsset(digitalAssetId) {
        return new Promise((resolve, reject) => {
            db.query(
                `Select asset_id,name,price,description,category,owner_id,CONCAT(first_name,' ',last_name) as owner_name, creation_date, image_name, is_available 
                FROM DigitalAssets 
                INNER JOIN
                    Users ON DigitalAssets.owner_id = Users.user_id
                WHERE asset_id='${digitalAssetId}'`,
                (err, res) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    }
                    for (const row of res) {
                        row.is_available = Boolean(Number(row.is_available));
                    }
                    return resolve(res);
                },
            );
        });
    }
    static updateOwnership(digitalAssetId, newOwnerId) {
        return new Promise((resolve, reject) => {
            db.query(
                "UPDATE DigitalAssets SET is_available = 0, owner_id = ? WHERE asset_id = ?",
                [newOwnerId, digitalAssetId],
                (err, res) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    }
                    return resolve(res);
                },
            );
        });
    }
}

module.exports = DigitalAsset;
