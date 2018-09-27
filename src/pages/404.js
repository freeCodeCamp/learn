import React from 'react';
import Helmet from 'react-helmet';
import Spinner from 'react-spinkit';
import { Link } from 'gatsby';

import './404.css';
import notFoundLogo from '../../static/img/freeCodeCamp-404.svg';
import { quotes } from '../../static/json/quotes.json';

class NotFoundPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      randomQuote: null
    }
  }

  componentDidMount() {
    this.updateQuote();
  }

  updateQuote() {
    this.setState({
      randomQuote: quotes[Math.floor(Math.random() * quotes.length)]
    });
  }

  render() {
    return (
      <div className='notfound-page-wrapper'>
        <Helmet title='Page Not Found | freeCodeCamp' />
        <img alt='learn to code at freeCodeCamp 404' src={notFoundLogo} />
        <h1>NOT FOUND</h1>
        {
          this.state.randomQuote ? (
            <div>
              <p>
                We couldn&#x27;t find what you were looking for, but here is a
                quote:
              </p>
              <div className='quote-wrapper'>
                <p className='quote'>
                  <span>&#8220;</span>
                  {this.state.randomQuote.quote}
                </p>
                <p className='author'>- {this.state.randomQuote.author}</p>
              </div>
            </div>
          ) : (
            <Spinner color='#006400' name='ball-clip-rotate-multiple' />
          )
        }
        <Link className='btn-curriculum' to='/'>
          View the Curriculum
        </Link>
      </div>
    );
  }
}

export default NotFoundPage;
