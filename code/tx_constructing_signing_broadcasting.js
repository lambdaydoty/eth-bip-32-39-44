const bip39 = require('bip39')
const hdkey = require('hdkey')
const ethUtil = require('ethereumjs-util')
const ethTx = require('ethereumjs-tx')
const Web3 = require('web3')
const fs = require('fs')
require('dotenv').config()

// const MNEMONIC = bip39.generateMnemonic();
const {
  MNEMONIC,
  NONCE,
  PROVIDER,
  CHAIN_ID
} = process.env

/* function: mnemonic to address0 */
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

/* function: mnemonic to private-key0 */
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

function constructing (nonce) {
  params.nonce = Web3.utils.toHex(nonce)
  console.log(params)
  return function (params) {
    const tx = new ethTx(params)
    return tx
  }
}

function signing (priv) {
  return function (tx) {
    tx.sign(priv)
    const serializedTx = tx.serialize()
    return serializedTx
  }
}

function broadcasting (sTx) {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(PROVIDER)
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


function incEnvNonce() {
  const envfile = './.env'
  fs.readFile(envfile, 'utf8', function (err, data) {
    if (err) {
      return console.log(err)
    }

    let oldStr = `NONCE=${parseInt(NONCE, 10)}`
    let newStr = `NONCE=${parseInt(NONCE, 10)+1}`
    let result = data.replace(new RegExp(oldStr, 'g'), newStr)

    fs.writeFile(envfile, result, 'utf8', function (err) {
      if (err) {
        return console.log(err)
      }
    })
  })
}


const amountToSend = '0.008' // (Ether)
// const amountToSend = '0' // (Ether)
const accountToSend = '0xaF386d520D65fA60473cd893845d53e77a3A9DF6'
// const accountToSend = '0x65998E33686bF76b1Ee444a97883C85Dc5144DB2'
const params = {
  // nonce: NONCE,
  to: accountToSend,
  value: Web3.utils.toHex(
    Web3.utils.toWei(amountToSend, 'ether')
  ),
  gasPrice: 8000000000, // 8 Gwei
  gasLimit: 21000,
  chainId: parseInt(CHAIN_ID) // Ropsten
}


const web3 = new Web3(
  new Web3.providers.HttpProvider(PROVIDER)
)
web3.eth.net.isListening()
  .then(() => console.log('is connected'))
  .catch(e => console.log('sth wrong'))
web3.eth.getTransactionCount(m2a(MNEMONIC))
  .then(count => {
    console.log({count})
    console.log({count: parseInt(count, 16)})
    broadcasting(
      signing(m2priv(MNEMONIC))(
        constructing(NONCE+1)(
          params
        )
      )
    )
  })

// incEnvNonce()
