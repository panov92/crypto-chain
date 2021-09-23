const cryptoHash = require('../util/crypto-hash');
const Blockchain = require('./index');
const Block = require('./block');

describe('Blockchain', () => {
  let blockchain;
  let newChain;
  let originalChain;
  let errorMock;

  beforeEach(() => {
    blockchain = new Blockchain(); //before each test we reset the blockchain to a new instance, this way any changes to it for test is not carried over
    newChain = new Blockchain();
    originalChain = blockchain.chain;

    errorMock = jest.fn();
    global.console.error = errorMock;
  });

  it('contains a `chain` Array instance', () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it('starts with the genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it('adds a new block to the chain', () => {
    const newData = 'foo bar';
    blockchain.addBlock({ data: newData });

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe('isValidChain()', () => {
    describe("when the chain does not start with the genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = { data: "fake-genesis" };

        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false); //the chain will be false since we have created the "fake genesis block"
      });
    });
    describe("when the chain does start with the genesis block and has multiple blocks", () => {

      beforeEach(() => { //this will add few blocks to each of the tests below
        blockchain.addBlock({ data: "foo-data"}); //adding few blocks to validate
        blockchain.addBlock({ data: "foo-bears"});
        blockchain.addBlock({ data: "foo-horses"});
      });

      describe("and a lastHash reference has changed", () => { //in this case the lastHash is not correct
        it("returns false", () => {

          blockchain.chain[2].lastHash = "broken-last-hash"; //replacing a lastHash value with an invalid one

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });
      describe("and the chain contains a block with an invalid field", () => {
        it("returns false", () => {

          blockchain.chain[2].data = "foo-and-bad-data"; //creating some invalid data to replace the existing one

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with a jump difficulty", () => {
        it("returns false", () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1];
          const lastHash = lastBlock.hash;
          const timestamp = Date.now();
          const nonce = 0;
          const data = [];
          const difficulty = lastBlock.difficulty -3;
          const hash = cryptoHash(timestamp, lastHash, nonce, data, difficulty);

          const badBlock = new Block({ timestamp, lastHash, hash, nonce, data, difficulty });

          blockchain.chain.push(badBlock);

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("the chain does not contain any invalid blocks", () => {
        it("returns true", () => {

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      })
    });
  });

  describe("replaceChain()", () => {
    let logMock;

    beforeEach(() => {
      logMock = jest.fn();

      global.console.log = logMock; //when we call log we will call the special jest.fn()
    });

    describe("when the new chain is not longer", () => {

      beforeEach(() => {
        newChain.chain[0] = { new: "chain" };

        blockchain.replaceChain(newChain.chain);
      });

      it("does not replace the chain", () => {
        expect(blockchain.chain).toEqual(originalChain);
      });

      it("logs an error", () => {
        expect(errorMock).toHaveBeenCalled();
      });

    });

    describe("when the new chain is longer", () =>  {

      beforeEach(() => { //this will add few blocks to each of the tests below
        newChain.addBlock({ data: "foo-data"}); //adding few blocks to validate
        newChain.addBlock({ data: "foo-bears"});
        newChain.addBlock({ data: "foo-horses"});
      });

      describe("and the new chain is invalid", () => {
        beforeEach(() => {
          newChain.chain[2].hash = "some-fake-hash"

          blockchain.replaceChain(newChain.chain);
        });

        it("does not replace the chain", () => {
          expect(blockchain.chain).toEqual(originalChain);
        });

        it("logs an error", () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe("and the new chain is valid", () => {
        beforeEach(() => {
          blockchain.replaceChain(newChain.chain);
        });

        it("does replace the chain", () => {
          expect(blockchain.chain).toEqual(newChain.chain);
        });

        it("logs about the chain replacement", () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });

    /*describe("and the `validateTransactions` flag is true", () => {
      it("calls validTransactionData()", () => {
        const validTransactionDataMock = jest.fn();

        blockchain.validTransactionData = validTransactionDataMock;

        newChain.addBlock({ data: "foo" });

        blockchain.replaceChain(newChain.chain, true); //we need to pass the true value in order to execute the method

        expect(validTransactionDataMock).toHaveBeenCalled();
      });
    });*/
  });
});
