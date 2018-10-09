import React from 'react';
import PropTypes from 'prop-types';
import Logger from '@nti/util-logger';
import {StripeProvider} from 'react-stripe-elements';

import {getStripeForPurchasable} from './utils';

const logger = Logger.get('nti-payments:stripe-provider');

export default class StripeContextProvider extends React.Component {
	static propTypes = {
		purchasable: PropTypes.shape({
			getStripeConnectKey: PropTypes.func.isRequired
		}).isRequired,
		onError: PropTypes.func
	}


	state = {stripe: null}


	componentDidMount () {
		this.setupFor(this.props);
	}


	componentDidUpdate (prevProps) {
		const {purchasable} = this.props;
		const {purchasable:prevPurchasable} = prevProps;

		if (purchasable !== prevPurchasable) {
			this.setupFor(this.props);
		}
	}

	async setupFor (props) {
		const {purchasable, onError} = props;

		this.setState({
			stripe: null
		});

		try {
			const stripe = await getStripeForPurchasable(purchasable);

			this.setState({
				stripe
			});
		} catch (e) {
			if (onError) {
				onError(e);
			}
			logger.error('Failed to load Stripe: ', e);
		}
	}


	render () {
		const {stripe} = this.state;
		const props = {...this.props};

		delete props.purchasable;
		delete props.onError;

		return (
			<StripeProvider {...props} stripe={stripe} />
		);
	}
}
