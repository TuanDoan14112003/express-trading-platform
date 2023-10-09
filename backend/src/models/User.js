const db = require("./DB");
const Joi = require("joi");
class User {
    constructor(first_name,last_name,email,password, wallet_address = "",public_key = "",private_key = "") {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.wallet_address = wallet_address;
        this.public_key = public_key;
        this.private_key = private_key;
    }
    static getRegisterValidationSchema() {
        return Joi.object({
            first_name: Joi.string().min(1).max(255).truncate().alphanum().required(),
            last_name:Joi.string().min(1).max(255).truncate().alphanum().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
            wallet_address:Joi.string(),
            public_key:Joi.string(),
            private_key: Joi.string()
        });
    }

    static getLoginValidationSchema() {
        return Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
        });
    }

    static register(user,callback) {
        db.query("INSERT INTO Users SET ?", user,
            (err, res) => {
                if (err) {
                    console.log(err);
                    callback(err,null);
                    return;
                }
                const newUser = {...user};
                newUser.password = undefined; // remove password from the returned message
                callback(null, { user_id: res.insertId, ...newUser });
        })
    }

    static findUserByEmail(email, callback) {
        db.query(`SELECT user_id,first_name,last_name,email,password FROM Users WHERE email='${email}'`, (err,res) => {
            if (err) {
                console.log(err);
                callback(err,null);
                return;
            }
            callback(null,  res);
        })
    }

    static findUserById(id, callback) {
        db.query(`SELECT user_id,first_name,last_name,email FROM Users WHERE user_id='${id}'`, (err,res) => {
            if (err) {
                console.log(err);
                callback(err,null);
                return;
            }
            callback(null,  res);
        })
    }

}

module.exports = User;