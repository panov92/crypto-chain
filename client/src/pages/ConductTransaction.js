import React, { useState } from 'react';
import { Button, FormLabel, FormGroup, FormControl, Card } from 'react-bootstrap';
import axios from 'axios';

const Blocks = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0);

  const handleRecipient = e => {
    setRecipient(e.target.value);
  }

  const handleAmount = e => {
    setAmount(e.target.value);
  }

  const conductTransaction = async e => {
    e.preventDefault();

    const res = await axios.post('http://localhost:3005/api/transact', {
      recipient,
      amount
    });

    console.log(res.data);
  }

  return (
    <div className="ConductTransaction">
      <Card className="bg-dark-30 text-white">
        <Card.Header>Conduct transaction</Card.Header>
        <Card.Body>
          <form onSubmit={conductTransaction}>
            <FormGroup className="mb-2">
              <FormLabel>Recipient</FormLabel>
              <FormControl input="text" placeholder="Recipient" value={recipient} onChange={handleRecipient} />
            </FormGroup>
            <FormGroup className="mb-2">
              <FormLabel>Amount</FormLabel>
              <FormControl input="number" placeholder="Amount" value={amount} onChange={handleAmount} />
            </FormGroup>
            <div>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Blocks;

