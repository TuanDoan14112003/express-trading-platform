const DigitalAsset = require("./../models/DigitalAsset");
const Joi = require('joi');
const web3 = require("./../smart-contracts/Web3Instance");
const DigitalAssetMarketContract = require("./../smart-contracts/SmartContract");
const User = require("./../models/User");
// const {Contract} = require("web3");
const Transaction = require("./../models/Transaction");
exports.createDigitalAsset = async (req,res) => {
    let assetData = req.body;
    assetData.owner_id = req.user.id;
    try {
        await DigitalAsset.getValidationSchema().validateAsync(assetData);
    } catch (error) {
        let errorMessage = error.details.map(err => err.message.replace(/"/g,'')).join(", ");
        return res.status(400).json({
            status: "fail",
            message: errorMessage
        })
    }

    const digitalAsset = new DigitalAsset(assetData.name,assetData.description,assetData.category,assetData.price,assetData.owner_id, req.fileName);
    DigitalAsset.createDigitalAsset(digitalAsset, (err,data) => {
        if (err) {
            res.status(500).json({
                status: "error",
                message: "cannot create a new digital asset"
            })
        } else {
            res.status(200).json({
                status: "success",
                data : {
                    digital_asset: data
                }
            })
        }
    });
}

exports.getAllDigitalAssets = (req,res) => {
    DigitalAsset.getAllDigitalAssets(req.query, (err,data) => {
        if (err) {
            if (err instanceof Joi.ValidationError) {
                let errorMessage = err.details.map(err => err.message.replace(/"/g,'')).join(", ");
                return res.status(404).json({
                    status: "fail",
                    message: errorMessage
                })
            }
            return res.status(500).json({
                status: "error",
                message: "cannot get the digital asset list"
            })
        }
        if (data.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "cannot find any digital assets"
            })
        }
        for (let row of data) {
            if (row.image_name) {
                row.image_name = req.protocol + '://' + req.get('host') + "/" + row.image_name;
            }
        }

        return res.status(200).json({
            status: "success",
            data : {
                digital_assets : data
            }
        })
    });
}

exports.getOneDigitalAsset = (req,res) => {
    const digitalAssetId = req.params.id;
    DigitalAsset.getOneDigitalAsset(digitalAssetId, (err,data) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "cannot get the digital asset"
            })
        }

        if (data.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "cannot find the digital asset"
            })
        }

        let asset = {...data[0]};

        if (asset.image_name) {
            asset.image_name = req.protocol + '://' + req.get('host') + "/" + asset.image_name;
        }
        return res.status(200).json({
            status: "success",
            data : {
                digital_asset : asset
            }
        })
    });
}

exports.purchaseDigitalAsset =  (req, res) => {
    DigitalAsset.getOneDigitalAsset(req.params.id,  async (err,assetData) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "cannot get the digital asset"
            })
        }

        if (assetData.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "cannot find the digital asset"
            })
        }

        User.findUserById(req.user.id, async (userError, userData) => {
            if (userError) {
                return res.status(500).json({
                    status: "error",
                    message: "cannot find the user"
                })
            }

            if (userData.length === 0) {
                return res.status(404).json({
                    status: "fail",
                    message: "cannot find the user"
                })
            }

            let asset = assetData[0];
            let seller_id = asset.owner_id;
            let buyer_id = req.user.id;
            let userWallet = userData[0].wallet_address;
            let tx = {
                from: userWallet,
                to: DigitalAssetMarketContract.options.address,
                data: await DigitalAssetMarketContract.methods.purchaseDigitalAsset(req.params.id).encodeABI(),
                value: asset.price,
                gasLimit: 600000,
                gasPrice: web3.utils.toWei('3', 'gwei')
            };
            //TODO: Change ownership
            let transaction_hash = null;
            try {
                let signedTx = await web3.eth.accounts.signTransaction(tx, userData[0].private_key);
                transaction_hash = (await web3.eth.sendSignedTransaction(signedTx.rawTransaction)).transactionHash;
            } catch (solidity_error) {
                throw solidity_error;
            }
            DigitalAsset.updateOwnership(asset.asset_id,req.user.id, (updateOwnershipError,updateOwnershipResult) => {
                if (err) {
                    return res.status(500).json({
                        status: "error",
                        message: "cannot purchase"
                    })
                }
                let transaction = new Transaction(transaction_hash,buyer_id,seller_id,asset.asset_id)
                Transaction.createTransaction(transaction, (transactionError, transactionData) => {
                    return res.status(200).json({
                        status: "success"
                    })
                });

            })

        });
    });
}