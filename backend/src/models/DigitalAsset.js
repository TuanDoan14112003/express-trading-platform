const Joi = require('joi');
const db = require("./DB");

class DigitalAsset {
    constructor(name,description,category,price,owner_id) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.owner_id = owner_id;
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
        (err, res) => {
            if (err) {
                console.log(err);
                callback(err,null);
                return;
            }
            callback(null, { id: res.insertId, ...digitalAsset });
        })
    }

    static getAllDigitalAssets(callback) {
        db.query("Select asset_id,name,price,description,category,owner_id, creation_date, is_available FROM DigitalAssets",
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
        db.query(`Select asset_id,name,price,description,category,owner_id, creation_date, is_available FROM DigitalAssets WHERE asset_id='${digitalAssetId}'`,
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


}

module.exports = DigitalAsset;