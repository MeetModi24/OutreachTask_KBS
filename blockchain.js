const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    /* index = at what position the block is created in the chain 
       timestamp = time on which it is created
    */

    constructor(index, timestamp,transactions, previousHash = ' '){
        this.index = index;                                            
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = ' ';
        this.nonce = 0;
    }
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }
    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = calculateHash();
        }
       console.log("Block mined : " + this.hash); 
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.CreateGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
    CreateGenesisBlock(){
        return new Block(0,"23/06/23","Genesis Block","0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    // addBlock(newBlock){
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }
    
    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(),this.pendingTransactions);
        block.mineBlock(this.difficulty);
        console.log("Block successfully mined");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction (null,miningRewardAddress,this.miningReward)
        ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address) balance -= trans.amount;
                if(trans.toAddress === address) balance += trans.amount;
            }
        }
        return balance;
    }

    chainValidity(){
        for(let i= 1;i< this.chain.length;i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            if(currentBlock.hash !== currentBlock.calculateHash())
            return false;
            if(currentBlock.previousHash !== previousBlock.hash)
            return false;
        }
        return true;
    }
}

// let trial1 = new Blockchain();
// trial.addBlock(new Block(1,"24/06/23","Transaction Done"));
// trial.addBlock(new Block(2,"25/06/23","Task1 Done"));

// console.log("Is Blockchain valid? " + trial.chainValidity());
// console.log(JSON.stringify(trial));

let trial2 = new Blockchain();
trial2.createTransaction(new Transaction('address1','address2',500));
trial2.createTransaction(new Transaction('address2','address3',100));

console.log("Starting the miner...");
trial2.minePendingTransactions('mineraddress');
console.log('Balance of miner is ' , trial2.getBalanceOfAddress('mineraddress'));

console.log("Starting the miner again...");
trial2.minePendingTransactions('mineraddress');
console.log('Balance of miner is ' , trial2.getBalanceOfAddress('mineraddress'));
