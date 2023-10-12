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
};

exports.getOneDigitalAsset = async (req, res) => {
    const digitalAssetId = req.params.id;
    let assets;
    try {
        assets = await DigitalAsset.getOneDigitalAsset(digitalAssetId);
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err
        });
    }

    if (assets.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "Cannot find the digital asset",
        });
    }

    let asset = { ...assets[0] };

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
};

exports.purchaseDigitalAsset = async (req, res) => {
    let assets;
    try {
        assets = await DigitalAsset.getOneDigitalAsset(req.params.id);
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err
        });
    }

    if (assets.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "Cannot find the digital asset",
        });
    }

    let asset = { ...assets[0] };
    let users;
    try {
        users = await User.findUserById(req.user.id);
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err
        });
    }

    if (users.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "Cannot find user",
        });
    }

    let user = users[0];
    let seller_id = asset.owner_id;
    let buyer_id = req.user.id;
    let userWallet = user.wallet_address;

    if (buyer_id === asset.owner_id) {
        return res.status(400).json({
            status: "fail",
            message: "You already own this item"
        });
    }

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
    let transaction_hash = null;

    try {
        let signedTx = await web3.eth.accounts.signTransaction(
            tx,
            user.private_key,
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

    try {
        await DigitalAsset.updateOwnership(asset.asset_id,buyer_id);
    } catch (updateOwnershipError) {
        return res.status(500).json({
            status: "error",
            message: updateOwnershipError
        });
    }

    let transaction = new Transaction(
        transaction_hash,
        buyer_id,
        seller_id,
        asset.asset_id,
    );

    try {
        await Transaction.createTransaction(transaction);
    } catch (transactionError) {
        if (transactionError instanceof Joi.ValidationError) {
            let errorMessage = transactionError.details
                .map((err) => err.message.replace(/"/g, ""))
                .join(", ");
            return res.status(400).json({
                status: "fail",
                message: errorMessage
            });
        }
        return res.status(500).json({
            status: "error",
            message: transactionError,
        });
    }

    return res.status(200).json({
        status: "success"
    });
};
