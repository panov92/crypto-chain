import React, { useState, useEffect } from 'react';
import Block from './Block';

const Blocks = () => {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3005/api/blocks')
      .then(response => response.json())
      .then(json => {
        setBlocks(json);
      })
  }, []);


  return (
    <div className="r">
      <h3>Blocks</h3>
      <div className="rounded rounded-3 border border-secondary px-3 py-2">
        {
          blocks.map((block, index) => {
            return (
              <div key={`key-${index}`} className="mb-2 border-bottom border-secondary">
                <Block key={block.hash} {...block} />
              </div>
            );
          })
        }
      </div>
    </div>
  )
}

export default Blocks;

