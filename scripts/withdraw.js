var solc = require('solc');
var fs = require('fs');
var assert = require('assert');
var BigNumber = require('bignumber.js');

// You must set this ENV VAR before running 
assert.notEqual(typeof(process.env.ETH_NODE),'undefined');

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_NODE));

function getContractAbi(contractName,cb){
     var file = './contracts/SquarEx.sol';

     fs.readFile(file, function(err, result){
          assert.equal(err,null);

          var source = result.toString();
          assert.notEqual(source.length,0);

          var output = solc.compile(source, 1);   // 1 activates the optimiser

          var abiJson = output.contracts[contractName].interface;

          var abi = JSON.parse(abiJson);
          var bytecode = output.contracts[contractName].bytecode;

          return cb(null,abi,bytecode,abiJson);
     });
}

// ************ READ THIS: ***********************
var creator = process.env.ETH_CREATOR_ADDRESS;

// 1 - get accounts
web3.eth.getAccounts(function(err, as) {
     if(err) {
          return;
     }

     // 2 - read ABI
     var contractName = ':PresaleToken';
     getContractAbi(contractName,function(err,abi,bytecode,abiJson){
          fs.writeFileSync('abi.out',abiJson);
          console.log('Wrote ABI to file: abi.out');

          setState(creator,abi,bytecode);
     });
});

function setState(creator,abi,bytecode){
     // TODO: set these params
     var contractAddress = '0xaF1fa2C1DE8938A23c901aC16264333D04d9E9Eb';
     var tokenManager = '0xb9Af8aA42c97f5A1F73C6e1a683c4Bf6353B83E7';

     var contract = web3.eth.contract(abi).at(contractAddress);
     contract.withdrawEther(
          {
               from: tokenManager,               
               gas: 2900000 
          },function(err,result){
               assert.equal(err,null);
          }
     );
}

