const bip39 = require('bip39')
const hdkey = require('hdkey')
const ethUtil = require('ethereumjs-util')
require('dotenv').config()

// const MNEMONIC = bip39.generateMnemonic();
const { MNEMONIC } = process.env
const seed = bip39.mnemonicToSeed(MNEMONIC);
const ROOT = hdkey.fromMasterSeed(seed);

const masterPrivateKey = ROOT.privateKey.toString('hex');

const addrNode = ROOT.derive("m/44'/60'/0'/0/0")
const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
const addr = ethUtil.publicToAddress(pubKey).toString('hex');
const address = ethUtil.toChecksumAddress(addr);

/* refactor... */
const _pipe = (f,g) => x => g(f(x))
const chain = [
	x => ROOT.derive(`m/44'/60'/0'/0/${x}`),
	x => x._privateKey,
	ethUtil.privateToPublic,
	ethUtil.publicToAddress,
	x => x.toString('hex'),
	ethUtil.toChecksumAddress,
].reduce(_pipe)

console.log({MNEMONIC})
for (let i = 0; i < 20; ++i) {
  console.log(chain(i))
}
