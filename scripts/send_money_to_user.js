var solc = require('solc');
var fs = require('fs');
var assert = require('assert');
var BigNumber = require('bignumber.js');

// You must set this ENV VAR before running 
assert.notEqual(typeof(process.env.ETH_NODE),'undefined');

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_NODE));

function getContractAbi(contractName,cb){
     var file = './contracts/EthLend.sol';

     fs.readFile(file, function(err, result){
          assert.equal(err,null);

          var source = result.toString();
          assert.notEqual(source.length,0);

          var output = solc.compile(source, 1);   // 1 activates the optimiser
          var abi = JSON.parse(output.contracts[contractName].interface);
          return cb(null,abi);
     });
}

// 1 - get accounts
web3.eth.getAccounts(function(err, as) {
     if(err) {
          return;
     }

     // TODO: change this 
     var from = '0xb9af8aa42c97f5a1f73c6e1a683c4bf6353b83e7';

     // to Anton's MetaMask account
     var to = '0xaF1fa2C1DE8938A23c901aC16264333D04d9E9Eb';

     var amountWei = web3.toWei(0.39,'ether');
     console.log('WEI: ', amountWei);

     web3.eth.sendTransaction(
          {
               from: from,               
               to: to,
               value: amountWei,
               gas: 2900000 
          },function(err,result){
               assert.equal(err,null);

               console.log('TX: ' + result);
          }
     );
});

