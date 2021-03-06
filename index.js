require('dotenv').config();
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const request = require('request');
const path = require('path');
const Blockchain = require('./blockchain/index');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const TransactionMiner = require('./app/transaction-miner');

const isDevelopment = process.env.ENV === 'development';
const isSSL = process.env.SSL === 'true';

const DEFAULT_PORT = process.env.PORT || 3005;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
let PEER_PORT;

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub })

app.use(bodyParser.json());
app.use(cors());

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({ data });

  pubsub.broadcastChain();

  res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
  const { amount, recipient } = req.body;

  let transaction = transactionPool
    .existingTransaction({ inputAddress: wallet.publicKey });

  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount })
    } else {
      transaction = wallet.createTransaction({
        recipient,
        amount,
        chain: blockchain.chain
      });
    }
  } catch (e) {
    return res.status(400).json({ type: 'error', message: e.message })
  }

  transactionPool.setTransaction(transaction);

  pubsub.broadcastTransaction(transaction)

  res.json({ type: 'success', transaction })
})

app.get('/api/transaction-pool-map', (req, res) => {
  res.json(transactionPool.transactionMap);
})

app.get('/api/mine-transactions', (req, res) => {
  transactionMiner.mineTransactions();

  res.redirect('/api/blocks');
});

app.get('/api/wallet-info', (req, res) => {
  const address = wallet.publicKey;
  res.json({
    address,
    balance: Wallet.calculateBalance({ chain: blockchain.chain, address })
  });
});

const syncWithRootState = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks`}, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);

      console.log("replace chain on a sync with", rootChain);
      blockchain.replaceChain(rootChain);
    }
  });

  request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map`}, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootTransactionPoolMap = JSON.parse(body);

      console.log('replace transaction pool map on a sync with', rootTransactionPoolMap)
      transactionPool.setMap(rootTransactionPoolMap);
    }
  });
}

if (isDevelopment) {
  const walletFoo = new Wallet();
  const walletBar = new Wallet();

  const generateWalletTransaction = ({ wallet, recipient, amount }) => {
    const transaction = wallet.createTransaction({
      recipient, amount, chain: blockchain.chain
    });

    transactionPool.setTransaction(transaction);
  }

  const walletAction = () => generateWalletTransaction({
    wallet, recipient: walletFoo.publicKey, amount: 5
  });

  const walletFooAction = () => generateWalletTransaction({
    wallet: walletFoo, recipient: walletBar.publicKey, amount: 10
  });

  const walletBarAction = () => generateWalletTransaction({
    wallet: walletBar, recipient: wallet.publicKey, amount: 15
  });

  for (let i = 0; i<10; i++) {
    if (i%3 === 0) {
      walletAction();
      walletFooAction();
    } else if (i%3 === 1) {
      walletAction();
      walletBarAction();
    } else {
      walletFooAction();
      walletBarAction();
    }

    transactionMiner.mineTransactions();
  }
}

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = process.env.PORT || PEER_PORT || DEFAULT_PORT;

if (isSSL) {
  const SSL_CERTIFICATE = process.env.SSL_CERTIFICATE;
  const SSL_CERTIFICATE_KEY = process.env.SSL_CERTIFICATE_KEY;

  var options = {
    key: fs.readFileSync(SSL_CERTIFICATE_KEY),
    cert: fs.readFileSync(SSL_CERTIFICATE),
  };

  https.createServer(options, app).listen(PORT, function(){
    console.log(`HTTPS listening at https://localhost:${PORT}`);

    if (PORT !== DEFAULT_PORT) {
      syncWithRootState();
    }
  });
} else {
  app.listen(PORT, err => {
    if (err) console.log(err);
    console.log(`listening at http://localhost:${PORT}`);

    if (PORT !== DEFAULT_PORT) {
      syncWithRootState();
    }
  })
}
