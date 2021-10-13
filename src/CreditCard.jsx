import { useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
	useStripe,
	useElements,
	CardNumberElement,
	CardExpiryElement,
	CardCvcElement,
} from '@stripe/react-stripe-js';

import { Input } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import { generateToken } from './utils';

const t = scoped('payment.credit-card', {
	name: {
		placeholder: 'Name on Card',
		error: 'A name must be provided.',
	},
});

//#region styles

const Framer = type => ({ type: Type = type, className, ...props }) => ({
	className,
	children: <Type {...props} />,
});
const FrameType = type => props => ({ type, ...props });

const Flex = styled.div`
	display: flex;
`;

const NameOnCreditCard = styled(Input.Clearable).attrs(Framer(Input.Text))`
	width: 100%;
	margin-bottom: 0.25rem;

	input {
		width: 100%;

		&:placeholder-shown ~ .reset {
			display: none;
		}
	}
`;

const Field = styled('div').attrs(Framer())`
	border-radius: 2px;
	border: 1px solid var(--border-grey-light);
	background-color: var(--panel-background);
	padding: 0 0.625rem;
	min-height: 34px;
`;

const Number = styled(Field).attrs(FrameType(CardNumberElement))`
	flex: 1 1 auto;
	min-width: 44%;
`;

const Expiry = styled(Field).attrs(FrameType(CardExpiryElement))`
	flex: 0 0 auto;
	max-width: 95px;
	min-width: 78px;
	width: 18%;
	margin-left: 0.25rem;
`;

const Cvc = styled(Field).attrs(FrameType(CardCvcElement))`
	flex: 0 0 auto;
	max-width: 95px;
	min-width: 54px;
	width: 18%;
	margin-left: 0.25rem;
`;
//#endregion

const STRIPE_ELEMENT_PROPS = {
	options: {
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
					fontWeight: 400,
				},
			},
		},
	},
};

CreditCardForm.propTypes = {
	className: PropTypes.string,
	onChange: PropTypes.func,
};

export default function CreditCardForm({ className, onChange }) {
	// Get a reference to Stripe or Elements using hooks.
	const stripe = useStripe();
	const elements = useElements();
	const [name, setName] = useState('');
	const { current: data } = useRef({
		name: { empty: true },
		number: { empty: true },
		expiry: { empty: true },
		cvc: { empty: true },
	});

	const onCardChange = useCallback(() => {
		const complete =
			data.name.complete &&
			data.number.complete &&
			data.expiry.complete &&
			data.cvc.complete;
		const errors = getErrors(data.name, data.number, data.expiry, data.cvc);
		const values = getValues(data.name, data.number, data.expiry, data.cvc);

		onChange?.({
			complete,
			errors,
			isValid: !errors && complete,
			empty: getEmpty(data.name, data.number, data.expiry, data.cvc),
			values,
			brand: data.number.brand,
			createToken: async extraValues => {
				if (!complete) {
					throw new Error('Missing Credit Card Information');
				}
				if (errors) {
					throw new Error(
						(
							errors.name ||
							errors.number ||
							errors.expiry ||
							errors.cvc
						).message
					);
				}

				return generateToken(stripe, elements, {
					...extraValues,
					name: values.name,
				});
			},
		});
	}, [onChange, elements, stripe]);

	const onNameChange = useCallback(
		n => {
			data.name = getName(n);
			setName(n);
			onCardChange();
		},
		[onCardChange]
	);
	const onNumberChange = useCallback(
		e => {
			data.number = e;
			onCardChange();
		},
		[onCardChange]
	);
	const onExpiryChange = useCallback(
		e => {
			data.expiry = e;
			onCardChange();
		},
		[onCardChange]
	);
	const onCVCChange = useCallback(
		e => {
			data.cvc = e;
			onCardChange();
		},
		[onCardChange]
	);

	return (
		<div className={cx('nti-credit-card-form', className)}>
			{stripe && (
				<NameOnCreditCard
					className="name-input"
					name="ccname"
					autoComplete="cc-name"
					value={name}
					onChange={onNameChange}
					placeholder={t('name.placeholder')}
					required
				/>
			)}
			<Flex className="card-input">
				<Number
					className="card-number"
					onChange={onNumberChange}
					{...STRIPE_ELEMENT_PROPS}
				/>
				<Expiry
					className="card-expiry"
					onChange={onExpiryChange}
					{...STRIPE_ELEMENT_PROPS}
				/>
				<Cvc
					className="card-cvc"
					onChange={onCVCChange}
					{...STRIPE_ELEMENT_PROPS}
				/>
			</Flex>
		</div>
	);
}

function getName(n) {
	return {
		complete: !!n,
		empty: !n,
		error: n ? null : { message: t('name.error') },
		value: n,
	};
}

function getErrors(name, number, expiry, cvc) {
	if (!name.error && !number.error && !expiry.error && !cvc.error) {
		return null;
	}

	return {
		name: name.error,
		number: number.error,
		expiry: expiry.error,
		cvc: cvc.error,
	};
}

function getValues(name, number, expiry, cvc) {
	return {
		name: name.value,
		number: number.value,
		expiry: expiry.value,
		cvc: cvc.value,
	};
}

function getEmpty(name, number, expiry, cvc) {
	if (!name.empty && !number.empty && !expiry.empty && !cvc.empty) {
		return null;
	}

	return {
		name: name.empty,
		number: number.empty,
		expiry: expiry.empty,
		cvc: cvc.empty,
	};
}
