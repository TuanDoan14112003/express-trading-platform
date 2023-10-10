const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'DigitalAssetMarket.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'DigitalAssetMarket.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    'DigitalAssetMarket.sol'
    ].DigitalAssetMarket;
