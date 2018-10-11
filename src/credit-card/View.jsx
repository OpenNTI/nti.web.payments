import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
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

const STRIPE_ELEMENT_PROPS = {
	style: {
		base: {
			color: '#757474',
			fontWeight: 400,
			fontSize: 14,
			fontFamily: '"OpenSans", sans-serif',
			lineHeight: 2.2,
			// font: 'normal 400 0.875rem/2.2 "OpenSans", "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif'
			'::placeholder': {
				color: '#b8b8b8',
				fontStyle: 'italic',
				fontSize: 14,
				fontWeight: 400
			}
		}
	}
};

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


function getEmpty (name, number, expiry, cvc) {
	return name.empty && number.empty && expiry.empty && cvc.empty;
}

class NTICreditCardForm extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		stripe: PropTypes.shape({
			createToken: PropTypes.func
		}),
		onChange: PropTypes.func
	}

	state = {name: ''}

	constructor (props) {
		super(props);

		this.name = {empty: true};
		this.number = {empty: true};
		this.expiry = {empty: true};
		this.cvc = {empty: true};
	}

	onCardChange = () => {
		const {onChange, stripe} = this.props;
		const complete = this.name.complete && this.number.complete && this.expiry.complete && this.cvc.complete;
		const errors = getErrors(this.name, this.number, this.expiry, this.cvc);
		const values = getValues(this.name, this.number, this.expiry, this.cvc);

		if (onChange) {
			onChange({
				complete,
				errors,
				isValid: !errors,
				empty: getEmpty(this.name, this.number, this.expiry, this.cvc),
				values,
				brand: this.number.brand,
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
			empty: !name,
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
		const {stripe, className} = this.props;
		const {name} = this.state;

		return (
			<div className={cx('nti-credit-card-form', className)}>
				{stripe && (
					<Input.Clearable className="name-input-clearable">
						<Input.Text
							className="name-input"
							name="ccname"
							autoComplete="cc-name"
							reguired
							value={name}
							onChange={this.onNameChange}
							placeholder={t('name.placeholder')}
						/>
					</Input.Clearable>
				)}
				<div className="card-input">
					<div className="card-number">
						<CardNumberElement onChange={this.onCardNumberChange} {...STRIPE_ELEMENT_PROPS} />
					</div>
					<div className="card-expiry">
						<CardExpiryElement onChange={this.onCardExpiryChange} {...STRIPE_ELEMENT_PROPS} />
					</div>
					<div className="card-cvc">
						<CardCVCElement onChange={this.onCardCVCChange} {...STRIPE_ELEMENT_PROPS} />
					</div>
				</div>
			</div>
		);
	}
}

export default injectStripe(NTICreditCardForm);
