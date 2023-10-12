const User = require("./../models/User");
const web3 = require("./../smart-contracts/Web3Instance");
const DigitalAsset = require("./../models/DigitalAsset");
const Joi = require("Joi").extend(require('@joi/date'));;
exports.getOneUser =  (req,res) => {
    User.findUserById(req.params.id, (err,data) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "cannot get the user"
            })
        }

        if (data.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "cannot find the user"
            })
        }
        return res.status(200).json({
            status: "success",
            data : {
                user : data[0]
            }
        })
    })

}

exports.getProfile =  (req, res) => {
    User.findUserById(req.user.id, async (err,data) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "cannot get profile"
            })
        }

        if (data.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "cannot find the user"
            })
        }
        let user = {...data[0]};
        user.private_key = undefined;

        DigitalAsset.getAllDigitalAssets({"owner_id": data[0].user_id},(err,assetData) => {
            if (err) {
                return res.status(500).json({
                    status: "err",
                    message: "cannot get user's digital assets"
                })
            }
            user.digital_assets = assetData
            return res.status(200).json({
                status: "success",
                data : {
                    user
                }
            })
        });

    })
}

exports.getBalance =  (req, res) => {
    User.findUserById(req.user.id, async (err,data) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "cannot get profile"
            })
        }

        if (data.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "cannot find the user"
            })
        }

        let balance = web3.utils.fromWei(await web3.eth.getBalance(data[0].wallet_address),"ether");
        return res.status(200).json({
            status: "success",
            data : {
                balance
            }
        })
    })
}

exports.depositCoins =  async (req, res) => {

    const bodySchema = Joi.object().keys({
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

    let bodyData = {...req.body};

    try {
        await bodySchema.validateAsync(bodyData);
    } catch (error) {
        let errorMessage = error.details.map(err => err.message.replace(/"/g,'')).join(", ");
        return res.status(400).json({
            status: "fail",
            message: errorMessage
        })
    }


    User.findUserById(req.user.id, async (err,data) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "cannot get profile"
            })
        }

        if (data.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "cannot find the user"
            })
        }
        let user = {...data[0]};

        const accounts = await web3.eth.getAccounts();
        try {
            await web3.eth.sendTransaction({
                from: accounts[0],
                to: user.wallet_address,
                value: web3.utils.toWei(bodyData.amount,"ether"),
            });
        } catch (err) {
            return res.status(500).json({
                status: "error",
                message: "cannot deposit coins to account"
            })
        }


        return res.status(200).json({
            status: "success"
        })
    })
}