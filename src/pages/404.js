import React from 'react';
import Helmet from 'react-helmet';

import './404.css';
import notFoundLogo from '../../static/img/freeCodeCamp-404.svg';

const NotFoundPage = () => (
  <div className='notfound-page-wrapper'>
    <Helmet title='Page Not Found | freeCodeCamp' />
    <img alt='learn to code at freeCodeCamp 404' src={notFoundLogo} />
    <h1>NOT FOUND</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </div>
);

export default NotFoundPage;
