import React from 'react';
import {Elements} from 'react-stripe-elements';

import StripeProvider from './StripeProvider';
import CreditCardCmp from './credit-card';


export const CreditCard = ({purchasable, onError, ...otherProps}) => {
	return (
		<StripeProvider purchasable={purchasable} onError={onError}>
			<Elements>
				<CreditCardCmp {...otherProps} />
			</Elements>
		</StripeProvider>
	);
};
