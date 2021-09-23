const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const Blockchain = require('./blockchain/index');
const PubSub = require('./app/pubsub');
const DEFAULT_PORT = 3005;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
let PEER_PORT;

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

app.use(bodyParser.json());

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({ data });

  pubsub.broadcastChain();

  res.redirect('/api/blocks');
});

const syncChain = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks`}, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);

      blockchain.replaceChain(rootChain);
    }
  });
}

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT, err => {
  if (err) console.log(err);
  console.log(`listening at http://localhost:${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    syncChain();
  }
})
