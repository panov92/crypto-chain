import React from 'react';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {

  return (
    <div className="App pt-5">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-lg-6 mx-auto">
            <Header />
            {children}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Layout;
