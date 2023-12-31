const SHA256 = require('crypto-js/sha256');

class Transaction {
  constructor (fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block
{
  constructor(timestamp, transactions, previousHash = '') {

    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256( this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;

      this.hash = this.calculateHash();
    }

    console.log ("Block mined : " + this.hash);
  }

}


class Blockchain {
  constructor(){
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 10;

  }

  createGenesisBlock() {
    return new Block("05/09/2020", "Genesis Block", "0");
  }


  getLatestBlock() {
    return this.chain[this.chain.length - 1 ];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log('Block Sucessfully mined ');

    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

   createTransaction(transaction) {
     this.pendingTransactions.push(transaction);
   }

   getBalanceOfAddress(address) {
     let balance = 0;

     for(const block of this.chain) {
       for (const trans of block.transactions) {
         if(trans.fromAddress === address){
           balance -= trans.amount;
         }

         if(trans.toAddress === address){
           balance += trans.amount;
         }

       }
     }
     return balance;
   }

  isChainValid(){
    for(let i=1; i< this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i-1];

      if(currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if(currentBlock.previousHash !== previousBlock.hash) {
        return false ;
      }
    }
    return true
  }
}



let bvrCoin = new Blockchain();
/*
console.log("Mining BlockBlock 1 ...");

bvrCoin.addBlock(new Block (1, "06/09/2020", {amount : 4 }));


console.log("Mining BlockBlock 2 ...");
bvrCoin.addBlock(new Block (2, "07/09/2020", {amount : 10 }));
*/


bvrCoin.createTransaction(new Transaction('address1', 'address2', 100));
bvrCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log("Start Mining");
bvrCoin.minePendingTransactions('rao-address');

console.log("Balance of Rao is : " + bvrCoin.getBalanceOfAddress('rao-address'));

console.log("Start Mining");
bvrCoin.minePendingTransactions('rao-address');

console.log("Balance of Rao is : " + bvrCoin.getBalanceOfAddress('rao-address'));
