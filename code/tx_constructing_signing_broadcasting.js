const bip39 = require('bip39')
const hdkey = require('hdkey')
const ethUtil = require('ethereumjs-util')
const ethTx = require('ethereumjs-tx')
const Web3 = require('web3')

// const MNEMONIC = bip39.generateMnemonic();
// const accX = {
//   mnemonic: "guitar buddy inflict rain robust near force type jeans social blush chunk",
//   address: "0x2f9C0Ebc27071904378984b4E69b1fB69C41E232"
// }
const MNEMONIC = require('fs').readFileSync('./mnemonic', 'utf8').trim()

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

function m2priv(mnemonic) {
  const _pipe = (f,g) => x => g(f(x))
  const _toHexStr = x => x.toString('hex')
  const chain = [
    m => bip39.mnemonicToSeed(m),
    s => hdkey.fromMasterSeed(s),
    r => r.derive("m/44'/60'/0'/0/0"),
    x => x._privateKey,
  ].reduce(_pipe)
  return chain(mnemonic)
}

function constructing(params) {
  const tx = new ethTx(params)
  return tx
}

function signing (priv) {
  return function (tx) {
    tx.sign(priv)
    const serializedTx = tx.serialize()
    return serializedTx
  }
}

function broadcasting (sTx) {
  const API_KEY = require('fs').readFileSync('./api_key', 'utf8').trim()
  const ENDPOINT = `https://ropsten.infura.io/${API_KEY}`
  const web3 = new Web3(
    new Web3.providers.HttpProvider(ENDPOINT)
  )
  web3.eth.net.isListening()
    .then(() => console.log('is connected'))
    .catch(e => console.log('sth wrong'))
  web3.eth.sendSignedTransaction(
    `0x${sTx.toString('hex')}`,
    (error, result) => {
      if (error) { console.log(`Error: ${error}`) }
      else { console.log(`Result: ${result}`) }
    }
  )
}


const amountToSend = '0.001' // in Ether!
const params = {
  nonce: 4, // inc
  to: '0x65998E33686bF76b1Ee444a97883C85Dc5144DB2',
  value: Web3.utils.toHex(
    Web3.utils.toWei(amountToSend, 'ether')
  ),
  gasPrice: 5000000000,
  gasLimit: 21000,
  chainId: 3 // Ropsten
}

broadcasting(
  signing(m2priv(MNEMONIC))(
    constructing(params)
  )
)
