const Joi = require('joi').extend(require('@joi/date'));
const db = require("./DB");
const web3 = require("./../smart-contracts/Web3Instance");
const DigitalAssetMarketContract = require("./../smart-contracts/SmartContract");
class DigitalAsset {
    constructor(name,description,category,price,owner_id,image_name= null) {
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
                description: Joi.string().min(1).max(255).truncate().trim().required(),
                category: Joi.string().min(1).max(50).truncate().trim().required(),
                price: Joi.number().required(),
                owner_id: Joi.number().required()
        });
    }

    static createDigitalAsset(digitalAsset, callback) {
        db.query("INSERT INTO DigitalAssets SET ?", digitalAsset,
        async (err, res) => {
            if (err) {
                console.log(err);
                callback(err,null);
                return;
            }
             DigitalAssetMarketContract.methods.createDigitalAsset(res.insertId,digitalAsset.owner_id,digitalAsset.name,digitalAsset.description,digitalAsset.price,digitalAsset.category)
                .send({
                    from: (await web3.eth.getAccounts())[0],
                    gas: 1000000
                })
            // console.log(await DigitalAssetMarketContract.methods.digitalAssets(res.insertId).call({
            //     from: (await web3.eth.getAccounts())[0]
            // }));
            callback(null, { id: res.insertId, ...digitalAsset });
        })
    }

    static getAllDigitalAssets(query,callback) {
        // TODO: sanitise input
        const queryValidationSchema = Joi.object({
            max: Joi.number(),
            min: Joi.number(),
            start: Joi.date().format('YYYY-MM-DD').raw(),
            end: Joi.date().format('YYYY-MM-DD').raw(),
            category: Joi.string().max(255).truncate().trim(),
            name: Joi.string().max(255).truncate().trim(),
            owner_id: Joi.number()
        });

        const {value: validatedQuery, error} = queryValidationSchema.validate(query);
        if (error) {
            console.log(error);
            callback(error,null);
            return;
        }
        console.log(validatedQuery);

        let filter = [];
        if (validatedQuery.name) {
            filter.push(`name LIKE '%${validatedQuery.name}%'`);
        }
        if (validatedQuery.min) {
            filter.push(`price >= ${validatedQuery.min}`);
        }
        if (validatedQuery.max) {
            filter.push(`price <= ${validatedQuery.max}`)
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
        let filterMessage = filter.length === 0 ? "" : "WHERE " + filter.join(" AND ");
        console.log(filterMessage);
        db.query(`Select asset_id,name,price,description,category,owner_id,CONCAT(first_name,' ',last_name) as owner_name, creation_date,image_name, is_available 
                 FROM DigitalAssets 
                 INNER JOIN
                    Users ON DigitalAssets.owner_id = Users.user_id
                ${filterMessage}
                `,
            (err, res) => {
                if (err) {
                    console.log(err);
                    callback(err,null);
                    return;
                }
                for (const row of res) {
                    row.is_available = Boolean(Number(row.is_available));
                }
                callback(null, res);
        })
    }

    static getOneDigitalAsset(digitalAssetId,callback) {
        db.query(`Select asset_id,name,price,description,category,owner_id,CONCAT(first_name,' ',last_name) as owner_name, creation_date, image_name, is_available 
                FROM DigitalAssets 
                INNER JOIN
                    Users ON DigitalAssets.owner_id = Users.user_id
                WHERE asset_id='${digitalAssetId}
'`,
            (err, res) => {
                if (err) {
                    console.log(err);
                    callback(err,null);
                    return;
                }
                for (const row of res) {
                    row.is_available = Boolean(Number(row.is_available));
                }
                callback(null, res);
            })
    }
    static updateOwnership(digitalAssetId,newOwnerId,callback) {
        db.query("UPDATE DigitalAssets SET is_available = 0, owner_id = ? WHERE asset_id = ?", [newOwnerId,digitalAssetId],
            (err, res) => {
                if (err) {
                    console.log(err);
                    callback(err,null);
                    return;
                }
                callback(null, res);
            })
    }

}

module.exports = DigitalAsset;