const bip39 = require('bip39')
const hdkey = require('hdkey')
const ethUtil = require('ethereumjs-util')

function m2a (mnemonic) {
  const _pipe = (f,g) => x => g(f(x))
  const _toHexStr = x => x.toString('hex')
  const chain = [
    m => bip39.mnemonicToSeed(m),
    s => hdkey.fromMasterSeed(s),
    r => r.derive("m/44'/60'/0'/0/0"),
    x => x._privateKey,
    ethUtil.privateToPublic,
    ethUtil.publicToAddress,
    _toHexStr,
    ethUtil.toChecksumAddress,
  ].reduce(_pipe)

  return chain(mnemonic)
}

var result = [];
for (let i = 0; i < 10; ++i) {
  let mnemonic = bip39.generateMnemonic()
  let address = m2a(mnemonic)
  result.push({mnemonic, address})
}
console.log(result)
