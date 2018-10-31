const bip39 = require('bip39')
const hdkey = require('hdkey')
const ethUtil = require('ethereumjs-util')

const mnemonic = bip39.generateMnemonic();

const seed = bip39.mnemonicToSeed(mnemonic);

const root = hdkey.fromMasterSeed(seed);
const masterPrivateKey = root.privateKey.toString('hex');

const addrNode = root.derive("m/44'/60'/0'/0/0")
const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
const addr = ethUtil.publicToAddress(pubKey).toString('hex');
const address = ethUtil.toChecksumAddress(addr);

const _pipe = (f,g) => x => g(f(x))
const chain = [
	x => root.derive(`m/44'/60'/0'/0/${x}`),
	x => x._privateKey,
	ethUtil.privateToPublic,
	ethUtil.publicToAddress,
	x => x.toString('hex'),
	ethUtil.toChecksumAddress,
].reduce(_pipe)

console.log({mnemonic})
for (let i = 0; i < 20; ++i) {
  console.log(chain(i))
}
