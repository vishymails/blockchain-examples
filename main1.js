const SHA256 = require('crypto-js/sha256');

class Block
{
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
  }

  
}


class Blockchain {
  constructor(){
    this.chain = [this.createGenesisBlock()];

  }

  createGenesisBlock() {
    return new Block(0, "05/09/2022", "Genesis Block", "0");
  }


  getLatestBlock() {
    return this.chain[this.chain.length - 1 ];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
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

bvrCoin.addBlock(new Block (1, "06/09/2022", {amount : 4 }));

bvrCoin.addBlock(new Block (2, "07/09/2022", {amount : 10 }));



console.log(JSON.stringify(bvrCoin));



console.log("Is Valid : " + bvrCoin.isChainValid());


bvrCoin.chain[1].data = {amount : 100};

bvrCoin.chain[1].hash = bvrCoin.chain[1].calculateHash();

console.log("----------------------------------------");

console.log(JSON.stringify(bvrCoin));


console.log("Is Valid : " + bvrCoin.isChainValid());
