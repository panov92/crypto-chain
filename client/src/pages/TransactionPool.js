import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import Transaction from '../components/Transaction';
import { toast } from 'react-toastify';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

const TransactionPool = props => {
  const { history } = props;

  const [transactionPoolMap, setTransactionPoolMap] = useState({});

  const fetchTransactionPoolMap = async () => {
    const res = await axios.get('http://localhost:3005/api/transaction-pool-map');
    setTransactionPoolMap(res.data);
  }

  const fetchMineTransactions = async () => {
    const res = await axios.get('http://localhost:3005/api/mine-transactions');

    if (res.status === 200) {
      toast.success("Success");
      history.push('/blocks');
    } else {
      toast.error("The mine-transactions block request did not complete");
    }
  }

  useEffect(() => {
    fetchTransactionPoolMap();
  }, []);

  return (
    <div className="ConductTransaction">
      <Card className="bg-dark-30 text-white">
        <Card.Header>Transaction Pool</Card.Header>
        <Card.Body>
          {Object.keys(transactionPoolMap).length ? (
            (() => {
              return (
                <>
                  {Object.values(transactionPoolMap).map(transaction => {
                    return (
                      <div key={transaction.id}>
                        <Transaction transaction={transaction} />
                        <hr />
                      </div>
                    )
                  })}
                  <div className="d-flex justify-content-center">
                    <Button onClick={fetchMineTransactions}>
                      Mine blocks
                    </Button>
                  </div>
                </>
              )
            })()
          ) : 'No transactions'}
        </Card.Body>
      </Card>
    </div>
  )
}

export default withRouter(TransactionPool);

