const DigitalAssetMarket = artifacts.require("DigitalAssetMarket");
const fs = require("fs");

module.exports = function(deployer) {
    deployer.deploy(DigitalAssetMarket).then(() => {
        fs.writeFileSync("./src/smart-contracts/DigitalAssetMarketContract.json",JSON.stringify({abi: DigitalAssetMarket.abi, address: DigitalAssetMarket.address}));
    });
};