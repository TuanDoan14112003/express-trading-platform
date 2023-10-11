const User = require("./../models/User");
const web3 = require("./../smart-contracts/Web3Instance");
const DigitalAsset = require("./../models/DigitalAsset");
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

exports.getCurrentUser =  (req,res) => {
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
        user.balance = (await web3.eth.getBalance(data[0].wallet_address)).toString();
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