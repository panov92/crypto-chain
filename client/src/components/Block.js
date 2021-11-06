import React, {useCallback, useState} from 'react';
import {Button, Card} from 'react-bootstrap';
import Transaction from './Transaction';

const Block = props => {
  const { block } = props;
  const { timestamp, hash, data } = props;

  const [displayTransaction, setDisplayTransaction] = useState(false);

  const toggleTransaction = () => {
    setDisplayTransaction(!displayTransaction);
  }

  const transactionInfo = useCallback(() => {
    const stringifiedData = JSON.stringify(data);
    const dataDisplay = stringifiedData.length <= 35 ? stringifiedData : `${stringifiedData.substring(0, 35)}...`;
    return <div>Data: {dataDisplay}</div>;
  }, [displayTransaction]);

  const hashDisplay = `${hash.substring(0, 15)}...`;

  return (
    <div className="Block">
      <Card className="bg-dark-50 text-white">
        <Card.Body>
          <div>Hash: {hashDisplay}</div>
          <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>
          {displayTransaction ? (() => {
            return (
              <div>
                <div>Data:</div>
                {data.map(transaction => {
                  return (
                    <div key={transaction.id}>
                      <hr />
                      <Transaction transaction={transaction} />
                    </div>
                  );
                })}
              </div>
            );
          })() : transactionInfo()}
          {data.length ? (
            <Button onClick={toggleTransaction} className="mt-2" variant="primary" size="sm">
              {displayTransaction ? "Show less" : "Show more"}
            </Button>
          ): null}
        </Card.Body>
      </Card>

    </div>
  )
}

export default Block;
