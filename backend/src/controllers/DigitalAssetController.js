const DigitalAsset = require("./../models/DigitalAsset");

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

    const digitalAsset = new DigitalAsset(assetData.name,assetData.description,assetData.category,assetData.price,assetData.owner_id);
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
    DigitalAsset.getAllDigitalAssets( (err,data) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "Server Error: cannot get the digital asset list"
            })
        }
        if (data.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "cannot find any digital assets"
            })
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
        return res.status(200).json({
            status: "success",
            data : {
                digital_asset : data[0]
            }
        })
    });
}