import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEmail from 'validator/lib/isEmail';

import CardForm from './CardForm';
import { injectStripe } from 'react-stripe-elements';
import { ControlLabel, FormGroup, FormControl } from 'react-bootstrap';

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
    const [props] = args;

    this.state = {
      ...initialSate,
      email: props.email
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.postDonation = this.postDonation.bind(this);
    this.resetDonation = this.resetDonation.bind(this);
  }

  handleEmailChange(e) {
    const newValue = e.target.value;
    return this.setState(state => ({
      ...state,
      email: newValue
    }));
  }

  handleSubmit(captchaResponse) {
    const { email } = this.state;
    if (!email || !isEmail(email)) {
      return this.setState(state => ({
        ...state,
        donationState: {
          ...state.donationState,
          error:
            'We need a valid email address to send your donation tax receipt to'
        }
      }));
    }
    if (!captchaResponse) {
      return this.setState(state => ({
        ...state,
        donationState: {
          ...state.donationState,
          error:
            'Something went wrong in validating the reCAPTCHA.'
        }
      }));
    }
    return this.props.stripe.createToken({ email }).then(({ error, token }) => {
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
      return this.postDonation(token, captchaResponse);
    });
  }

  postDonation(token, captchaResponse) {
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
      amount,
      captchaResponse
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
        }))
    );
  }

  renderDonateForm() {
    return (
      <Fragment>
        <div className='text-center'>
          <p>
            freeCodeCamp.org is a tiny nonprofit that's helping millions of
            people learn to code for free.
          </p>
          <p>
            Join <strong>4,745</strong> supporters.
          </p>
          <p>
            Your $5 / month donation will help keep tech education free and
            open.
          </p>
        </div>
        {this.renderEmailInput()}
        <CardForm
          amount={5}
          handleSubmit={this.handleSubmit}
        />
        {this.props.maybeButton()}
      </Fragment>
    );
  }

  renderEmailInput() {
    const { email } = this.state;
    return (
      <FormGroup className='donation-email-container'>
          <ControlLabel>
            Email (we'll send you a tax-deductible donation receipt):
          </ControlLabel>
          <FormControl
            onChange={this.handleEmailChange}
            placeholder='email@example.com'
            required={true}
            type='email'
            value={email}
          />
      </FormGroup>
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
