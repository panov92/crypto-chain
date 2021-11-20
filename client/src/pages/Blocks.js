import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import Block from '../components/Block';

const Blocks = () => {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/blocks`)
      .then(response => response.json())
      .then(json => {
        setBlocks(json);
      })
  }, []);


  return (
    <Card className="bg-dark-30 text-white">
      <Card.Header>Blocks</Card.Header>
      <Card.Body>
        {
          blocks.map((block, index) => {
            return (
              <div key={`key-${index}`} className="mb-2">
                <Block key={block.hash} {...block} />
              </div>
            );
          })
        }
      </Card.Body>
    </Card>
  )
}

export default Blocks;

