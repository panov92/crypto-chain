import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import Transaction from '../components/Transaction';
import axios from 'axios';

const TransactionPool = () => {
  const [transactionPoolMap, setTransactionPoolMap] = useState({});

  const fetchTransactionPoolMap = async () => {

    const res = await axios.get('http://localhost:3005/api/transaction-pool-map');

    setTransactionPoolMap(res.data);
  }

  useEffect(() => {
    fetchTransactionPoolMap();
  }, []);

  return (
    <div className="ConductTransaction">
      <Card className="bg-dark-30 text-white">
        <Card.Header>Transaction Pool</Card.Header>
        <Card.Body>
          {
            Object.values(transactionPoolMap).map(transaction => {
              return (
                <div key={transaction.id}>
                  <Transaction transaction={transaction} />
                  <hr />
                </div>
              )
            })
          }
          {!Object.keys(transactionPoolMap).length && 'No transactions'}
        </Card.Body>
      </Card>
    </div>
  )
}

export default TransactionPool;

