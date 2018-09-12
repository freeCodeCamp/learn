import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';

import './404.css';
import notFoundLogo from '../../static/img/freeCodeCamp-404.svg';
import { quotes } from '../../static/json/quotes.json';

var Spinner = require('react-spinkit');
let randomQuote: any;

class NotFoundPage extends React.Component {
  componentDidMount() {
    randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  }

  render() {
    if (randomQuote !== undefined) {
      return (
        <div className='notfound-page-wrapper'>
          <Helmet title='Page Not Found | freeCodeCamp' />

          <img alt='learn to code at freeCodeCamp 404' src={notFoundLogo} />
          <h1>NOT FOUND</h1>
          <p>
            We couldn&#x27;t find what you were looking for, but here is a quote:
          </p>
          <div className='quote-wrapper'>
            <p className='quote'>
              <span>&#8220;</span>
              {randomQuote.quote}
            </p>
            <p className='author'>- {randomQuote.author}</p>
          </div>
          <Link className='btn-curriculum' to='/'>
            View the Curriculum
          </Link>
        </div>
      );
    } else {
      return (
        <div className='notfound-page-wrapper'>
          <Helmet title='Page Not Found | freeCodeCamp' />

          <img alt='learn to code at freeCodeCamp 404' src={notFoundLogo} />
          <h1>NOT FOUND</h1>
          <p>
            We couldn&#x27;t find what you were looking for, but here is a quote:
          </p>
          <Spinner color='#006400' name='ball-clip-rotate-multiple' />
          <Link className='btn-curriculum' to='/'>
            View the Curriculum
          </Link>
        </div>
      );
    }
  }
}

export default NotFoundPage;
