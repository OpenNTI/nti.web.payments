import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js/pure';

import CreditCardCmp from './credit-card';
import {getPublicKeyFromPurchasable} from './utils';

const ELEMENT_PROPS = {
	fonts: [
		{cssSrc:'https://fonts.googleapis.com/css?family=Open+Sans'}
	]
};

CreditCard.propTypes = {
	purchasable: PropTypes.any,
	onError: PropTypes.func,
};
export function CreditCard ({purchasable, onError, ...otherProps}) {
	const [stripe, setStripe] = useState(null);
	useEffect(() => {
		setStripe(!purchasable ? null :
			loadStripe(getPublicKeyFromPurchasable(purchasable))
				.catch(e => {
					onError?.(e);
					throw e;
				})
		);
	}, [purchasable]);

	return !stripe ? null : (
		<Elements {...ELEMENT_PROPS} stripe={stripe} >
			<CreditCardCmp {...otherProps} />
		</Elements>
	);
}
