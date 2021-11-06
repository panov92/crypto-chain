import React, { Component } from 'react';
import Blocks from './Blocks';
import Header from './Header';
import WalletInfo from './WalletInfo';

class App extends Component {

  render() {

    return (
      <div className="App pt-5">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-lg-6 mx-auto">
              <Header />
              <WalletInfo />
              <Blocks />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
