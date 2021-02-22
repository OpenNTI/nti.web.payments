import React, { useReducer, useRef } from 'react';

import { CreditCard } from '../index';

const purchasable = {
	getStripeConnectKey() {
		return {
			PublicKey: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
		};
	},
};

export default {
	title: 'Credit Card Form',
};

const generateToken = async info => await info?.createToken();

const merge = (state, action) => ({ ...state, ...action });

export function GenerateToken() {
	const creditCardInfo = useRef();
	const [{ token, error }, dispatch] = useReducer(merge, {});
	const onChange = info => {
		creditCardInfo.current = info;
	};

	const generate = async () => {
		try {
			dispatch({ token: await generateToken(creditCardInfo.current) });
		} catch (e) {
			dispatch({ error: e });
		}
	};

	return (
		<>
			<CreditCard purchasable={purchasable} onChange={onChange} />
			<button onClick={generate}>Generate Token</button>
			<pre>
				{error?.message ||
					(token && JSON.stringify(token, null, 2)) ||
					'No Token'}
			</pre>
		</>
	);
}
