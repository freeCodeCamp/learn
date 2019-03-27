import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import Reaptcha from 'reaptcha';

import StripCardForm from './StripeCardForm';

const propTypes = {
  amount: PropTypes.number.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

class CardForm extends PureComponent {
  constructor(...props) {
    super(...props);

    this.state = {
      isFormValid: false,
      isCaptchaReady: false
    };

    this.captcha = React.createRef();

    this.getValidationState = this.getValidationState.bind(this);
    this.submit = this.submit.bind(this);
    this.onVerify = this.onVerify.bind(this);
    this.onLoad = this.onLoad.bind(this);
  }

  onVerify = (captchaToken) => {
    this.props.handleSubmit(captchaToken);
  };

  onLoad = () => {
    this.setState({
      isCaptchaReady: true
    });
  };

  submit(e) {
    e.preventDefault();
    this.captcha.current.execute();
  }

  getValidationState(isFormValid) {
    this.setState(state => ({
      ...state,
      isFormValid
    }));
  }

  render() {
    const { amount } = this.props;
    const { isFormValid, isCaptchaReady } = this.state;
    return (
      <Fragment>
      <form className='donation-form' onSubmit={this.submit}>
        <StripCardForm getValidationState={this.getValidationState} />
        <Button
          block={true}
          bsSize='lg'
          bsStyle='primary'
          disabled={!isFormValid || !isCaptchaReady}
          id='confirm-donation-btn'
          type='submit'
          >
          {`Confirm your donation of $${amount} / month`}
        </Button>
      </form>
      <div style={{display: 'none'}}>
        <Reaptcha
          onLoad={this.onLoad}
          onVerify={this.onVerify}
          ref={this.captcha}
          sitekey='6LfacJkUAAAAACGSu23khz5B_Vz4KOoaPrL2H4Pr'
          size='invisible'
        />
      </div>
      </Fragment>
    );
  }
}
CardForm.displayName = 'CardForm';
CardForm.propTypes = propTypes;

export default CardForm;
