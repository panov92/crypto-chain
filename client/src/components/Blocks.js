import React, { Component } from 'react';

class Blocks extends Component {
  state = { blocks: [] };

  componentDidMount() {
    fetch('http://localhost:3005/api/blocks')
      .then(response => response.json())
      .then(json => this.setState({ blocks: json }))
  }

  render() {

    return (
      <div>
        <h3>Blocks</h3>
        {
          this.state.blocks.map((block, index) => {
            return (
              <div key={`key-${index}`}>{block.hash}</div>
            );
          })
        }
      </div>
    )
  }
}

export default Blocks;

