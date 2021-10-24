import React, { Component } from 'react';
import Blocks from './Blocks';
import Header from './Header';
import WalletInfo from './WalletInfo';

class App extends Component {

  render() {

    return (
      <div className="App pt-5">
        <div className="container">
          <Header />
          <WalletInfo />
          <Blocks />
        </div>
      </div>
    );
  }
}

export default App;
