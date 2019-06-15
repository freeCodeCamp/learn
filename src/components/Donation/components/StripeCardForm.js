import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  CardElement
} from 'react-stripe-elements';
import { ControlLabel, FormGroup } from 'react-bootstrap';

const propTypes = {
  getValidationState: PropTypes.func.isRequired
};

const style = {
  base: {
    color: '#006400',
    fontSize: '18px'
  }
};

class StripCardForm extends PureComponent {
  constructor(...props) {
    super(...props);

    this.state = {
      validation: {
        card: {
          complete: false,
          error: null
        }
      }
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.isValidInput = this.isValidInput.bind(this);
  }

  componentDidMount() {
    this.props.getValidationState(this.isValidInput());
  }

  handleInputChange(event) {
    const { elementType, error, complete } = event;
    return this.setState(
      state => ({
        ...state,
        validation: {
          ...state.validation,
          [elementType]: {
            error,
            complete
          }
        }
      }),
      () => this.props.getValidationState(this.isValidInput())
    );
  }

  isValidInput() {
    const { validation } = this.state;
    return Object.keys(validation)
      .map(key => validation[key])
      .every(({ complete, error }) => complete && !error);
  }

  render() {
    return (
      <div className='donation-elements'>
        <FormGroup>
          <ControlLabel>Card Details:</ControlLabel>
          <CardElement
            className='form-control donate-input-element'
            onChange={this.handleInputChange}
            style={style}
          />
        </FormGroup>
      </div>
    );
  }
}

StripCardForm.displayName = 'StripCardForm';
StripCardForm.propTypes = propTypes;

export default StripCardForm;
