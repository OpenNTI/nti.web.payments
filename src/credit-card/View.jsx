import React from 'react';
import PropTypes from 'prop-types';
import {
	injectStripe,
	CardNumberElement,
	CardExpiryElement,
	CardCVCElement
} from 'react-stripe-elements';
import {Input} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import {generateToken} from '../utils';

const t = scoped('payment.credit-card', {
	name: {
		placeholder: 'Name on Card',
		error: 'A name must be provided.'
	}
});

function getErrors (name, number, expiry, cvc) {
	if (!name.error && !number.error && !expiry.error && !cvc.error) { return null; }

	return {
		name: name.error,
		number: number.error,
		expiry: expiry.error,
		cvc: cvc.error
	};
}

function getValues (name, number, expiry, cvc) {
	return {
		name: name.value,
		number: number.value,
		expiry: expiry.value,
		cvc: cvc.value
	};
}

class NTICreditCardForm extends React.Component {
	static propTypes = {
		stripe: PropTypes.shape({
			createToken: PropTypes.func
		}),
		onChange: PropTypes.func
	}

	state = {name: ''}

	constructor (props) {
		super(props);

		this.name = {};
		this.number = {};
		this.expiry = {};
		this.cvc = {};
	}

	onCardChange = () => {
		const {onChange, stripe} = this.props;

		const complete = this.name.complete && this.number.complete && this.expiry.complete && this.cvc.complete;
		const errors = getErrors(this.name, this.number, this.expiry, this.cvc);
		const values = getValues(this.name, this.number, this.expiry, this.cvc);

		if (onChange) {
			onChange({
				complete,
				brand: this.number.brand,
				errors,
				values,
				createToken: async (extraValues) => {
					if (!complete) { throw new Error('Missing Credit Card Information'); }
					if (errors) { throw new Error((errors.name || errors.number || errors.expiry || errors.cvc).message); }

					return generateToken(stripe, {...extraValues, name: values.name});
				}
			});
		}
	}

	onNameChange = (name) => {
		this.setState({
			name
		});

		this.name = {
			complete: !!name,
			error: name ? null : {message: t('name.error')},
			value: name
		};
		this.onCardChange();
	}


	onCardNumberChange = (e) => {
		this.number = e;
		this.onCardChange();
	}

	onCardExpiryChange = (e) => {
		this.expiry = e;
		this.onCardChange();
	}


	onCardCVCChange = (e) => {
		this.cvc = e;
		this.onCardChange();
	}


	render () {
		const {stripe} = this.props;
		const {name} = this.state;

		return (
			<div className="nti-credit-card-form">
				{stripe && (
					<Input.Text
						className="name-input"
						name="ccname"
						autoComplete="cc-name"
						reguired
						value={name}
						onChange={this.onNameChange}
						placeholder={t('name.placeholder')}
					/>
				)}
				<div className="card-input">
					<CardNumberElement onChange={this.onCardNumberChange} />
					<CardExpiryElement onChange={this.onCardExpiryChange} />
					<CardCVCElement onChange={this.onCardCVCChange} />
				</div>
			</div>
		);
	}
}

export default injectStripe(NTICreditCardForm);
