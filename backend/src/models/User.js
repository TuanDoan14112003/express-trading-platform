const db = require("./DB");
const Joi = require("joi");
const web3 = require("./../smart-contracts/Web3Instance");
const DigitalAssetMarketContract = require("./../smart-contracts/SmartContract");
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

    static async register(user,callback) {
        const web3Account = web3.eth.accounts.create();

        const {address:wallet_address,privateKey:private_key} = web3Account;

        const newUser = {...user,wallet_address:web3Account.address,private_key:web3Account.privateKey};
        console.log(web3Account);
        const accounts = await web3.eth.getAccounts();

        await web3.eth.sendTransaction({
            from: accounts[0],
            to: newUser.wallet_address,
            value: 10000000000000000000,
        });

        const balance = await web3.eth.getBalance(newUser.wallet_address);
        console.log("Balance:", web3.utils.fromWei(balance, 'ether'), "ether");
        db.query("INSERT INTO Users SET ?", newUser,
            async (err, res) => {
                if (err) {
                    console.log(err);
                    callback(err,null);
                    return;
                }

                DigitalAssetMarketContract.methods.createUser(res.insertId, newUser.last_name, newUser.email, newUser.wallet_address).send({
                    from: accounts[0],
                    gas: 1000000
                });
                // console.log(await DigitalAssetMarketContract.methods.users(res.insertId).call({
                //     from: accounts[0]
                // }))
                newUser.password = undefined; // remove password from the returned message
                newUser.private_key = undefined; // remove private key from the returned message
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
        db.query(`SELECT user_id,email,wallet_address,private_key FROM Users WHERE user_id='${id}'`, (err,res) => {
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