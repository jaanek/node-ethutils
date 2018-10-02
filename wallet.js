const Web3 = require("web3");
const bip39 = require("bip39");
const hdkey = require("ethereumjs-wallet/hdkey");

const wallet_hdpath = "m/44'/60'/0'/0/";
// const web3 = new Web3("http://localhost:7545/");
const web3 = new Web3('http://eth.oja.me:3304/');

async function getWallet(mnemonic, max) {
  const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
  const addresses = [];

  for (let i = 0; i < max; i++) {
    const wallet = hdwallet.derivePath(wallet_hdpath + i).getWallet();
    const addr = '0x' + wallet.getAddress().toString('hex');
    const priv = wallet.getPrivateKey().toString('hex');
    console.log(`Address: `, addr, ` Private: `, priv);
    addresses.push({
      address: addr,
      private: priv
    });
  }
  return {
    addresses: addresses
  };
}

async function showBalances(mnemonic) {
  const wallet = await getWallet(mnemonic, 1);

  for (let i = 0; i < wallet.addresses.length; i++) {
    const addr = wallet.addresses[i];
    const balance = await web3.eth.getBalance(addr.address);
    console.log(`Balance: ${balance}`);
  }
}

async function newMnemonic() {
  const mnemonic = bip39.generateMnemonic();
  console.log(mnemonic);
}

async function tmp(mnemonic) {
  const seed = bip39.mnemonicToSeed(mnemonic);
  console.log(`Seed: `, seed);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length <= 0) {
    console.log(`Usage: node wallet.js <operation>`);
    return;
  }
  const operation = args[0];
  console.log(`Args: `, args);

  switch (operation) {
  case "balance": {
    const mnemonic = args[1];
    if (!mnemonic) {
      throw new Error(`Mnemonic not provided!`);
    }
    await showBalances(mnemonic);
    break;
  }
  case "mnemonic": {
    await newMnemonic();
    break;
  }
  case "tmp": {
    const mnemonic = args[1];
    if (!mnemonic) {
      throw new Error(`Mnemonic not provided!`);
    }
    await tmp(mnemonic);
    break;
  }
  }
}

main().then(()=> {}).catch((err) => {
  console.log(`Error while executing main!`, err);
});
