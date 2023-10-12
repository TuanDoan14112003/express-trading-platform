const User = require("./../models/User");
const jwtUtils = require("./../utils/JwtUtils");
const web3 = require("../smart-contracts/Web3Instance");
const DigitalAssetMarketContract = require("../smart-contracts/SmartContract");
const Joi = require("joi");
exports.register = async (req,res) => {
    const web3Account = web3.eth.accounts.create();
    const user = new User(req.body.first_name,req.body.last_name,req.body.email,req.body.password,web3Account.privateKey,web3Account.address);
    let newUser;
    console.log(web3Account);
    try {
        newUser = await User.createUser(user);
    } catch (error) {
        if (error instanceof Joi.ValidationError) {
            let errorMessage = error.details
                .map((err) => err.message.replace(/"/g, ""))
                .join(", ");
            return res.status(400).json({
                status: "fail",
                message: errorMessage,
            });
        }

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                status: "fail",
                message: "An user with the email already exists"
            })
        } else {
            return res.status(500).json({
                status: "error",
                message: "cannot register a new user"
            })
        }
    }

    const accounts = await web3.eth.getAccounts();

    try {
        await DigitalAssetMarketContract.methods.createUser(newUser.user_id, newUser.last_name, newUser.email, newUser.wallet_address).send({
            from: accounts[0],
            gas: 1000000
        });
    } catch (eth_error) {
        console.log(eth_error);
        return  res.status(500).json({
            status: "error",
            message: eth_error
        });
    }

    return res.status(200).json({
        status: "success",
        data : {
            user: newUser,
            access_token: jwtUtils.generateAccessToken(newUser.user_id,newUser.email)
        }
    })

}


exports.login = async (req,res) => {
    try {
        await Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
        }).validateAsync(req.body);
    } catch (validationError) {
        let errorMessage = validationError.details.map(err => err.message.replace(/"/g,'')).join(", ");
        return res.status(400).json({
            status: "fail",
            message: errorMessage
        })
    }

    const email = req.body.email;
    const password = req.body.password;

    let users;
    try {
        users = await User.findUserByEmail(email)
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error
        })
    }

    if (users.length === 0 || users[0].password !== password) {
        return res.status(404).json({
            status: "error",
            message: "Wrong credentials"
        })
    }

    const user = users[0];

    return res.status(200).json({
        status: "success",
        data : {
            access_token: jwtUtils.generateAccessToken(user.user_id,user.email)
        }
    })
}