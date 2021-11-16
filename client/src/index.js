import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import history from './history';
import Layout from './layout';
import Home from './pages/Home';
import Blocks from './pages/Blocks';
import ConductTransaction from './pages/ConductTransaction';
import TransactionPool from './pages/TransactionPool';

import './index.css';

ReactDOM.render(
  <Router history={history()}>
    <Layout>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/blocks" component={Blocks} />
        <Route path="/conduct-transaction" component={ConductTransaction} />
        <Route path="/transaction-pool" component={TransactionPool} />
      </Switch>
    </Layout>
  </Router>,
  document.getElementById('root')
);
