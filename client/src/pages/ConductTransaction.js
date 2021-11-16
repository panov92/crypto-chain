import React, { useState } from 'react';
import { Button, FormLabel, FormGroup, FormControl, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

const Blocks = props => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0);
  const { history } = props;

  const handleRecipient = e => {
    setRecipient(e.target.value);
  }

  const handleAmount = e => {
    const val = +e.target.value;
    if (typeof val === 'number' && !isNaN(val)) setAmount(val);
  }

  const conductTransaction = async e => {
    e.preventDefault();

    if (!recipient || !recipient.length) {
      toast.error("Wrong recipient")
      return false;
    }

    if (typeof amount !== 'number' || amount <= 0) {
      toast.error("Not enough amount")
      return false;
    }

    await axios.post('http://localhost:3005/api/transact', {
      recipient,
      amount
    }).then(() => {
      toast.success("Sent!");
      history.push('/transaction-pool');
    }).finally(() => {
      setRecipient('');
      setAmount(0);
    });
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

export default withRouter(Blocks);

