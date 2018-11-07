const bip39 = require('bip39')
const hdkey = require('hdkey')
const ethUtil = require('ethereumjs-util')
const fs = require('fs')

const mnemonic = bip39.generateMnemonic();

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

var data = [
  'owner',
  'holder1',
  'holder2',
  'holder3',
  'holder4',
  'startup',
  'angelfund',
  'technics',
  'dont-use',
].map(tag => {
  let o = {}
  o.tag = tag
  o.mnemonic = bip39.generateMnemonic()
  o.account0 = m2a(o.mnemonic)
  return o
})

console.log(data)
var now = new Date()
var isotime = now.toISOString().substring(0, 19)
var timestamp = Math.floor(now / 1000)
var count = data.length
var filename1 = `./${isotime}-accounts.json`
var filename2 = `./${isotime}-accounts.env`
var meta = {isotime, timestamp, count}

fs.writeFile(
  filename1,
  JSON.stringify({meta, data}),
  'utf8',
  (err) => {
    if (err) {
      return console.log(err)
    }
    console.log(`${filename1} was saved!`)
  }
)

var logger = fs.createWriteStream(
  filename2,
  {flags: 'a'}
)
logger.write(`ACCOUNTS_TIMESTAMP=${timestamp}\n`)
data.forEach(acc => {
  if (acc.tag === 'dont-use') {
    return
  }
  if (acc.tag === 'owner') {
    logger.write(`MNEMONIC_OWNER="${acc.mnemonic}"\n`)
  }
  logger.write(`${acc.tag.toUpperCase()}=${acc.account0}\n`)
})
logger.end()
console.log(`${filename2} was saved!`)

