import React from 'react';
import { Link } from 'react-router-dom';
import '../../../public/styles/dashboard.scss';


import ConnectedNav from '../nav/ConnectedNav';


const NotFound = () => (
  <div id="not-found" className="canvas2">
    <div className="container3">
      <header className="header extra">
        <ConnectedNav />
      </header>
      <div>
        <h3> Sorry, the page you are looking for does not exist</h3>
        <h4> <Link to="/">Go Home</Link></h4>
      </div>
    </div>
  </div>
);

export default NotFound;

