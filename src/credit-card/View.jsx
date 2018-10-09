import React from 'react';
import PropTypes from 'prop-types';
import {
	injectStripe,
	CardElement
} from 'react-stripe-elements';

class NTICreditCardForm extends React.Component {
	static propTypes = {
		stripe: PropTypes.shape({
			createToken: PropTypes.func
		}),
		onChange: PropTypes.func
	}

	render () {
		return (
			<div>
				<CardElement />
			</div>
		);
	}
}

export default injectStripe(NTICreditCardForm);
