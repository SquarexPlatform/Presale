var solc = require('solc');
var Web3 = require('web3');

var fs = require('fs');
var assert = require('assert');
var BigNumber = require('bignumber.js');

// You must set this ENV VAR before testing
//assert.notEqual(typeof(process.env.ETH_NODE),'undefined');
var web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_NODE));

var accounts;

var creator;
var escrow;
var buyer;

var initialBalanceCreator = 0;
var initialBalanceEscrow = 0;
var initialBalanceBuyer = 0;

var contractAddress;
var contract;

// init BigNumber
var unit = new BigNumber(Math.pow(10,18));

function getContractAbi(contractName,cb){
     var file = './contracts/SquarEx.sol';

     fs.readFile(file, function(err, result){
          assert.equal(err,null);

          var source = result.toString();
          assert.notEqual(source.length,0);

          var output = solc.compile(source, 1);   // 1 activates the optimiser
          var abi = JSON.parse(output.contracts[contractName].interface);
          return cb(null,abi);
     });
}

function deployContract(data,cb){
     var file = './contracts/SquarEx.sol';
     var contractName = ':PresaleToken';

     fs.readFile(file, function(err, result){
          assert.equal(err,null);

          var source = result.toString();
          assert.notEqual(source.length,0);

          assert.equal(err,null);

          var output = solc.compile(source, 0); // 1 activates the optimiser

          //console.log('OUTPUT: ');
          //console.log(output.contracts);

          var abi = JSON.parse(output.contracts[contractName].interface);
          var bytecode = output.contracts[contractName].bytecode;
          var tempContract = web3.eth.contract(abi);

          var alreadyCalled = false;

          tempContract.new(
               creator,
               escrow,
               buyer,
               {
                    from: creator, 
                    // should not exceed 5000000 for Kovan by default
                    gas: 4995000,
                    //gasPrice: 120000000000,
                    data: '0x' + bytecode
               }, 
               function(err, c){
                    assert.equal(err, null);

                    console.log('TX HASH: ');
                    console.log(c.transactionHash);

                    // TX can be processed in 1 minute or in 30 minutes...
                    // So we can not be sure on this -> result can be null.
                    web3.eth.getTransactionReceipt(c.transactionHash, function(err, result){
                         //console.log('RESULT: ');
                         //console.log(result);

                         assert.equal(err, null);
                         assert.notEqual(result, null);

                         contractAddress = result.contractAddress;
                         contract = web3.eth.contract(abi).at(contractAddress);

                         console.log('Contract address: ');
                         console.log(contractAddress);

                         if(!alreadyCalled){
                              alreadyCalled = true;

                              return cb(null);
                         }
                    });
               });
     });
}

describe('Contracts 0 - Deploy', function() {
     before("Initialize everything", function(done) {
          web3.eth.getAccounts(function(err, as) {
               if(err) {
                    done(err);
                    return;
               }

               accounts = as;
               creator = accounts[0];
               escrow = accounts[1];
               buyer = accounts[2];

               var contractName = ':PresaleToken';
               getContractAbi(contractName,function(err,abi){
                    ledgerAbi = abi;

                    done();
               });
          });
     });

     after("Deinitialize everything", function(done) {
          done();
     });

     it('should deploy token contract',function(done){
          var data = {};
          deployContract(data,function(err){
               assert.equal(err,null);

               done();
          });
     });

     it('should get initial balances',function(done){
          initialBalanceCreator = web3.eth.getBalance(creator);
          initialBalanceEscrow = web3.eth.getBalance(escrow);
          initialBalanceBuyer = web3.eth.getBalance(buyer);

          done();
     });

     it('should get initial token balances',function(done){
          var balance = contract.balanceOf(creator);
          assert.equal(balance,0);

          balance = contract.balanceOf(escrow);
          assert.equal(balance,0);

          balance = contract.balanceOf(buyer);
          assert.equal(balance,0);

          done();
     });

});


