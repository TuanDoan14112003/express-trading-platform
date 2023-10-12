const DigitalAsset = require("./../models/DigitalAsset");
const Joi = require("joi");
const web3 = require("./../smart-contracts/Web3Instance");
const DigitalAssetMarketContract = require("./../smart-contracts/SmartContract");
const User = require("./../models/User");

const Transaction = require("./../models/Transaction");
exports.createDigitalAsset = async (req, res) => {
    let assetData = req.body;
    assetData.owner_id = req.user.id;

    const digitalAsset = new DigitalAsset(
        assetData.name,
        assetData.description,
        assetData.category,
        assetData.price,
        assetData.owner_id,
        req.fileName,
    );

    let newAsset;
    try {
        newAsset = await DigitalAsset.createDigitalAsset(digitalAsset);
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
        return res.status(500).json({
            status: "error",
            message: error,
        });
    }

    try {
        await DigitalAssetMarketContract.methods
            .createDigitalAsset(
                newAsset.asset_id,
                newAsset.owner_id,
                newAsset.name,
                newAsset.description,
                web3.utils.toWei(newAsset.price, "ether"),
                newAsset.category,
            )
            .send({ from: (await web3.eth.getAccounts())[0], gas: 1000000 });
    } catch (ether_error) {
        return res.status(500).json({
            status: "error",
            message: ether_error,
        });
    }

    return res.status(200).json({
        status: "success",
        data: {
            digital_asset: newAsset,
        },
    });

    // DigitalAsset.createDigitalAsset(digitalAsset, (err,data) => {
    //     if (err) {
    //         res.status(500).json({
    //             status: "error",
    //             message: "cannot create a new digital asset"
    //         })
    //     } else {
    //         try {
    //             DigitalAssetMarketContract.methods.createDigitalAsset(res.insertId,digitalAsset.owner_id,digitalAsset.name,digitalAsset.description,web3.utils.toWei(digitalAsset.price,"ether"),digitalAsset.category)
    //                 .send({
    //                     from: (await web3.eth.getAccounts())[0],
    //                     gas: 1000000
    //                 })
    //         } catch (eth_error) {
    //             console.log(eth_error);
    //             return;
    //         }
    //         res.status(200).json({
    //             status: "success",
    //             data : {
    //                 digital_asset: data
    //             }
    //         })
    //     }
    // });
};

exports.getAllDigitalAssets = async (req, res) => {
    let assets;
    try {
        assets = await DigitalAsset.getAllDigitalAssets(req.query);
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
        return res.status(500).json({
            status: "error",
            message: error,
        });
    }

    if (assets.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "Cannot find any digital assets",
        });
    }

    for (let row of assets) {
        if (row.image_name) {
            row.image_name =
                req.protocol + "://" + req.get("host") + "/" + row.image_name;
        }
    }

    return res.status(200).json({
        status: "success",
        data: {
            digital_assets: assets,
        },
    });

    // DigitalAsset.getAllDigitalAssets(req.query, (err,data) => {
    //     if (err) {
    //         if (err instanceof Joi.ValidationError) {
    //             let errorMessage = err.details.map(err => err.message.replace(/"/g,'')).join(", ");
    //             return res.status(404).json({
    //                 status: "fail",
    //                 message: errorMessage
    //             })
    //         }
    //         return res.status(500).json({
    //             status: "error",
    //             message: "cannot get the digital asset list"
    //         })
    //     }
    //     if (data.length === 0) {
    //         return res.status(404).json({
    //             status: "fail",
    //             message: "cannot find any digital assets"
    //         })
    //     }
    //     for (let row of data) {
    //         if (row.image_name) {
    //             row.image_name = req.protocol + '://' + req.get('host') + "/" + row.image_name;
    //         }
    //     }
    //
    //     return res.status(200).json({
    //         status: "success",
    //         data : {
    //             digital_assets : data
    //         }
    //     })
    // });
};

exports.getOneDigitalAsset = (req, res) => {
    const digitalAssetId = req.params.id;
    DigitalAsset.getOneDigitalAsset(digitalAssetId, (err, data) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "cannot get the digital asset",
            });
        }

        if (data.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "cannot find the digital asset",
            });
        }

        let asset = { ...data[0] };

        if (asset.image_name) {
            asset.image_name =
                req.protocol + "://" + req.get("host") + "/" + asset.image_name;
        }
        return res.status(200).json({
            status: "success",
            data: {
                digital_asset: asset,
            },
        });
    });
};

exports.purchaseDigitalAsset = (req, res) => {
    DigitalAsset.getOneDigitalAsset(req.params.id, async (err, assetData) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "cannot get the digital asset",
            });
        }

        if (assetData.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "cannot find the digital asset",
            });
        }

        User.findUserById(req.user.id, async (userError, userData) => {
            if (userError) {
                return res.status(500).json({
                    status: "error",
                    message: "cannot find the user",
                });
            }

            if (userData.length === 0) {
                return res.status(404).json({
                    status: "fail",
                    message: "cannot find the user",
                });
            }

            let asset = assetData[0];
            let seller_id = asset.owner_id;
            let buyer_id = req.user.id;
            let userWallet = userData[0].wallet_address;
            let tx = {
                from: userWallet,
                to: DigitalAssetMarketContract.options.address,
                data: await DigitalAssetMarketContract.methods
                    .purchaseDigitalAsset(req.params.id)
                    .encodeABI(),
                value: web3.utils.toWei(asset.price, "ether"),
                gasLimit: 600000,
                gasPrice: await web3.eth.getGasPrice(),
            };

            //TODO: Change ownership
            let transaction_hash = null;

            try {
                let signedTx = await web3.eth.accounts.signTransaction(
                    tx,
                    userData[0].private_key,
                );
                transaction_hash = (
                    await web3.eth.sendSignedTransaction(
                        signedTx.rawTransaction,
                    )
                ).transactionHash;
            } catch (eth_error) {
                return res.status(500).json({
                    status: "error",
                    message: eth_error,
                });
            }

            DigitalAsset.updateOwnership(
                asset.asset_id,
                req.user.id,
                (updateOwnershipError, updateOwnershipResult) => {
                    if (err) {
                        return res.status(500).json({
                            status: "error",
                            message: "cannot update ownership",
                        });
                    }
                    let transaction = new Transaction(
                        transaction_hash,
                        buyer_id,
                        seller_id,
                        asset.asset_id,
                    );
                    Transaction.createTransaction(
                        transaction,
                        (transactionError, transactionData) => {
                            return res.status(200).json({
                                status: "success",
                            });
                        },
                    );
                },
            );
        });
    });
};
