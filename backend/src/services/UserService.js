const web3 = require("../smart-contracts/Web3Instance");
const User = require("../models/User");
const Joi = require("joi");
const DigitalAssetMarketContract = require("../smart-contracts/SmartContract");
const jwtUtils = require("../utils/JwtUtils");

class InvalidCredentialsError extends Error {
    constructor() {
        super("Invalid credentials");
        this.name = "InvalidCredentialsError";
    }
}



exports.createUser = async (first_name,last_name,email,password) => {
    const web3Account = web3.eth.accounts.create();
    const user = new User(first_name,last_name,email,password,web3Account.privateKey,web3Account.address);

    let newUser = await User.createUser(user);
    const accounts = await web3.eth.getAccounts();
    await DigitalAssetMarketContract.methods.createUser(newUser.user_id, newUser.last_name, newUser.email, newUser.wallet_address).send({
        from: accounts[0],
        gas: 1000000
    });

    return {
        user: newUser,
        access_token: jwtUtils.generateAccessToken(newUser.user_id,newUser.email)
    }
}

exports.login = async (email,password) => {
    let credentials = {email,password}

    await Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
    }).validateAsync(credentials);

    let users = await User.findUserByEmail(email)

    if (users.length === 0 || users[0].password !== password) {
        throw new InvalidCredentialsError();
    }

    const user = users[0];
    return jwtUtils.generateAccessToken(user.user_id, user.email)

}

exports.InvalidCredentialsError = InvalidCredentialsError;

