const User = require("./../models/User");
const web3 = require("./../smart-contracts/Web3Instance");
const DigitalAsset = require("./../models/DigitalAsset");
const Joi = require("joi").extend(require('@joi/date'));

const creditCardValidation = Joi.object().keys({
    amount: Joi.number().precision(2).sign('positive').max(10).required(),
    card_number: Joi.string().creditCard().required().messages({
        'string.creditCard': 'Invalid credit card number',
    }),
    card_holder: Joi.string().min(3).required(),
    expiry_date: Joi.date().format('MM-YYYY').raw().required(),
    cvv: Joi.string().length(3).pattern(/^[0-9]+$/).required().messages({
        'string.length': 'CVV must be 3 digits long',
        'string.pattern.base': 'CVV must contain only numbers',
    })
});

// exports.getOneUser =  async (req,res) => {
//
//     let users;
//     try {
//         users = await User.findUserById(req.params.id);
//     } catch (error) {
//         return res.status(500).json({
//             status: "error",
//             message: error
//         })
//     }
//
//     if (users.length === 0) {
//         return res.status(404).json({
//             status: "fail",
//             message: "cannot find the user"
//         })
//     }
//     let user = users[0];
//
//     return res.status(200).json({
//         status: "success",
//         data : {
//             user
//         }
//     })
// }

exports.getProfile =  async (req, res) => {
    let users;
    try {
        users = await User.findUserById(req.user.id);
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error
        })
    }
    if (users.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "Cannot find the user"
        })
    }

    let user = {...users[0]};
    user.private_key = undefined;

    let digitalAssets;
    try {
        digitalAssets = await DigitalAsset.getAllDigitalAssets({"owner_id": user.user_id});
    } catch (assetError) {
        return res.status(500).json({
            status: "error",
            message: assetError
        })
    }

    user.digital_assets = digitalAssets
    return res.status(200).json({
        status: "success",
        data : {
            user
        }
    })
}

exports.getBalance =  async (req, res) => {
    let users;
    try {
        users = await User.findUserById(req.user.id);
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error
        })
    }

    if (users.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "cannot find the user"
        })
    }
    let user = users[0];

    let balance = web3.utils.fromWei(await web3.eth.getBalance(user.wallet_address),"ether");
    return res.status(200).json({
        status: "success",
        data : {
            balance: Number(balance)
        }
    })
}

exports.depositCoins =  async (req, res) => {

    let bodyData = {...req.body};

    try {
        await creditCardValidation.validateAsync(bodyData);
    } catch (validationError) {
        let errorMessage = validationError.details.map(err => err.message.replace(/"/g,'')).join(", ");
        return res.status(400).json({
            status: "fail",
            message: errorMessage
        })
    }


    let users;
    try {
        users = await User.findUserById(req.user.id);
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error
        })
    }

    if (users.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "cannot find the user"
        })
    }
    let user = users[0];

    const accounts = await web3.eth.getAccounts();
    try {
        await web3.eth.sendTransaction({
            from: accounts[0],
            to: user.wallet_address,
            value: web3.utils.toWei(bodyData.amount,"ether"),
        });
    } catch (ether_error) {
        return res.status(500).json({
            status: "error",
            message: ether_error
        })
    }

    return res.status(200).json({
        status: "success"
    })
}