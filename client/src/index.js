import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import history from './history';
import Layout from './layout';
import Home from './pages/Home';
import Blocks from './pages/Blocks';

import './index.css';

ReactDOM.render(
  <Router history={history()}>
    <Layout>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/blocks" component={Blocks} />
      </Switch>
    </Layout>
  </Router>,
  document.getElementById('root')
);
