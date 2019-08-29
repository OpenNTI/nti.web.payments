import React from 'react';
import PropTypes from 'prop-types';
import {Elements} from 'react-stripe-elements';

import StripeProvider from './StripeProvider';
import CreditCardCmp from './credit-card';

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
	return (
		<StripeProvider purchasable={purchasable} onError={onError}>
			<Elements {...ELEMENT_PROPS} >
				<CreditCardCmp {...otherProps} />
			</Elements>
		</StripeProvider>
	);
}
