import React, { useEffect, useState } from 'react';

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
      <h3>Wallet info</h3>
      <div className="rounded rounded-3 border border-secondary px-3 py-2">
        <div>Address: {`${address.slice(0, 10)}...${address.slice(-10)}`}</div>
        <div>Balance: {balance}</div>
      </div>
    </div>
  )
}

export default WalletInfo;
