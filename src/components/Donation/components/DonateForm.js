import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import CardForm from './CardForm';
import { injectStripe } from 'react-stripe-elements';
import { postJSON$ } from '../../../templates/Challenges/utils/ajax-stream';

const propTypes = {
  email: PropTypes.string,
  maybeButton: PropTypes.func.isRequired,
  renderCompletion: PropTypes.func.isRequired,
  stripe: PropTypes.shape({
    createToken: PropTypes.func.isRequired
  })
};
const initialSate = {
  donationAmount: 500,
  donationState: {
    processing: false,
    success: false,
    error: ''
  }
};

class DonateForm extends PureComponent {
  constructor(...args) {
    super(...args);

    this.state = initialSate;

    this.buttonAmounts = [500, 1000, 3500, 5000, 25000];

    this.handleAmountClick = this.handleAmountClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isActive = this.isActive.bind(this);
    this.renderAmountButtons = this.renderAmountButtons.bind(this);
    this.postDonation = this.postDonation.bind(this);
    this.resetDonation = this.resetDonation.bind(this);
  }

  handleAmountClick(e) {
    e.preventDefault();
    const donationAmount = parseInt(e.target.id, 10);
    return this.setState(state => ({
      ...state,
      donationAmount
    }));
  }

  handleSubmit() {
    return this.props.stripe
      .createToken({ email: this.props.email })
      .then(({ error, token }) => {
        if (error) {
          return this.setState(state => ({
            ...state,
            donationState: {
              ...state.donationState,
              error:
                'Something went wrong processing your donation. Your card' +
                ' has not been charged.'
            }
          }));
        }
        return this.postDonation(token);
      });
  }

  isActive(amount) {
    return this.state.donationAmount === amount;
  }

  postDonation(token) {
    const { donationAmount: amount } = this.state;
    this.setState(state => ({
      ...state,
      donationState: {
        ...state.donationState,
        processing: true
      }
    }));
    return postJSON$('/external/donate/charge-stripe', {
      token,
      amount
    }).subscribe(
      res =>
        this.setState(state => ({
          ...state,
          donationState: {
            ...state.donationState,
            processing: false,
            success: true,
            error: res.error
          }
        })),
      err =>
        this.setState(state => ({
          ...state,
          donationState: {
            ...state.donationState,
            processing: false,
            success: false,
            error: err.error
          }
        })),
      () => console.log('COMPLETE?')
    );
  }

  renderAmountButtons() {
    return this.buttonAmounts.map(amount => (
      <li key={'amount-' + amount}>
        <a
          className={`amount-value ${this.isActive(amount) ? 'active' : ''}`}
          href=''
          id={amount}
          onClick={this.handleAmountClick}
          tabIndex='-1'
          >{`$${amount / 100}`}</a>
      </li>
    ));
  }

  renderDonateForm() {
    return (
      <Fragment>
        <p>
          freeCodeCamp is completely free. But is costs our nonprofit a lot of
          money to run it. Help us pay for servers. Set up a tax-deductible
          monthly donation you can afford.
        </p>
        <div id='donate-amount-panel'>
          <ul>{this.renderAmountButtons()}</ul>
        </div>
        <CardForm
          amount={this.state.donationAmount / 100}
          handleSubmit={this.handleSubmit}
        />
        {this.props.maybeButton()}
      </Fragment>
    );
  }

  resetDonation() {
    return this.setState(() => initialSate);
  }

  render() {
    const { donationState: { processing, success, error } } = this.state;
    const { renderCompletion } = this.props;
    if (processing || success || error) {
      return renderCompletion({
        processing,
        success,
        error,
        reset: this.resetDonation
      });
    }
    return this.renderDonateForm();
  }
}

DonateForm.displayName = 'DonateForm';
DonateForm.propTypes = propTypes;

export default injectStripe(DonateForm);
