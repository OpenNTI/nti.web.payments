import React from 'react';
import ReactDOM from 'react-dom';
import {getService} from '@nti/web-client';

import {CreditCard} from '../../src';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

const PURCHASABLE = 'tag:nextthought.com,2011-10:NTI-purchasable_course-Spring2015_LSTD_1153';

class Test extends React.Component {
	state = {}

	async componentDidMount () {
		const service = await getService();
		const purchasable = await service.getObject(PURCHASABLE);

		this.setState({
			purchasable
		});
	}

	onChange = (info) => {
		this.creditCardInfo = info;
	}


	generateToken = async () => {
		if (this.creditCardInfo) {
			try {
				const {token} = await this.creditCardInfo.createToken();

				this.setState({token: token.id});
			} catch (e) {
				console.log('Failed to generate tokey: ', e);//eslint-disable-line
			}
		}
	}

	render () {
		const {purchasable, token} = this.state;

		if (!purchasable) { return null; }

		return (
			<div>
				<CreditCard purchasable={purchasable} onChange={this.onChange} />
				<button onClick={this.generateToken}>Generate Token</button>
				<span>{token || 'No Token'}</span>
			</div>
		);
	}
}

ReactDOM.render(
	<Test />,
	document.getElementById('content')
);
