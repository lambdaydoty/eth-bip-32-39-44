# eth-bip-32-39-44
JS example code following bip-32, bip-39, and bip-44 in Ethereum
* bip-32: ```npm install hdkey```
* bip-39: ```npm install bip39```
* bip-44: ```m/44'/60'/0'/0/0```
* provider: https://infura.io
* web3js: ```npm install web3``` (1.0.0)

## Reference
* [web3@1.x](https://web3js.readthedocs.io/en/1.0/getting-started.html): Async cb, Async **Promises** or event emitter [priv2account](https://ethereum.stackexchange.com/questions/30033/injecting-a-private-key-into-web3-js-execution-context)
* [web3@0.2](https://github.com/ethereum/wiki/wiki/JavaScript-API#getting-started): Sync HTTP or Async cb
* truffle-based
    * [truffle-hdwallet-provider](https://github.com/trufflesuite/truffle-hdwallet-provider#truffle-hdwallet-provider)
    * [truffle-contract](https://github.com/trufflesuite/truffle-contract) -> [truffle](https://truffleframework.com/docs/truffle/getting-started/interacting-with-your-contracts#executing-contract-functions)
    * https://medium.com/@blockchain101/interacting-with-deployed-ethereum-contracts-in-truffle-39d7c7040455
* https://medium.com/bitcraft/so-you-want-to-build-an-ethereum-hd-wallet-cb2b7d7e4998
    * From mnemonic to private keys, then to public keys, and then to addresses
    * **Constructing**, **Signing**, and **Broadcasting** (raw) Txs
* https://medium.com/pixelpoint/track-blockchain-transactions-like-a-boss-with-web3-js-c149045ca9bf
    * ETX Txs subscriptions (by Infura)
    * ETX Txs confirmations counting
    * ERC20 events tracking
* http://ethereum-php.org/dev/index.html https://github.com/digitaldonkey/ethereum-php
    * PHP interface to Ethereum JSON-RPC
* https://medium.com/coinmonks/interacting-with-ethereum-smart-contracts-through-web3-js-e0efad17977
    * Interfacing Ethereum on WEB UI
    
