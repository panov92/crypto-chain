import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import Block from './Block';

const WalletInfo = () => {

  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    fetch('http://localhost:3005/api/wallet-info')
      .then(response => response.json())
      .then(json => {
        setAddress(json.address);
        setBalance(json.balance);
      })
  }, []);

  return (
    <div className="WalletInfo mb-4">
      <Card className="bg-dark-30 text-white">
        <Card.Header>Wallet info</Card.Header>
        <Card.Body>
          <div>Address: {`${address.slice(0, 10)}...${address.slice(-10)}`}</div>
          <div>Balance: {balance}</div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default WalletInfo;
