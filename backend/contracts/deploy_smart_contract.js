const ganache = require("ganache");
const { Web3 } = require('web3');
const { abi, evm } = require('./compile_smart_contract');


const options = {};
const GANACHE_PORT = 7545;
// start ganache server
const ganache_server = ganache.server(options);
ganache_server.listen(GANACHE_PORT, async err => {
    if (err) throw err;
    console.log(`ganache listening on port ${ganache_server.address().port}...`);
});

web3 = new Web3(ganache_server.provider);
exports.smart_contract = (async () => {
    const accounts = await web3.eth.getAccounts();
    // deploy smart contract
    console.log('Attempting to deploy from account', accounts[0]);
    return new web3.eth.Contract(abi)
        .deploy({data: evm.bytecode.object})
        .send({gas: '10000000', from: accounts[0]});

})();

exports.web3 = web3;

