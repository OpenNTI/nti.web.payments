import React from 'react';
import {Elements} from 'react-stripe-elements';

import StripeProvider from './StripeProvider';
import CreditCardCmp from './credit-card';

const ELEMENT_PROPS = {
	fonts: [
		{cssSrc:'https://fonts.googleapis.com/css?family=Open+Sans'}
	]
};


export const CreditCard = ({purchasable, onError, ...otherProps}) => {
	return (
		<StripeProvider purchasable={purchasable} onError={onError}>
			<Elements {...ELEMENT_PROPS} >
				<CreditCardCmp {...otherProps} />
			</Elements>
		</StripeProvider>
	);
};
