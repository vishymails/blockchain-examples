const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const key = ec.genKeyPair();

const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');


console.log();
console.log('Your Public key (also your wallet address, freely sharable) \n', publicKey );


console.log();
console.log('Your private key (keep this secret to sign transaction)\n', privateKey);
