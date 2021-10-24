import React from 'react';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 rounded-3">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">CryptoChain</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Home</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header;
