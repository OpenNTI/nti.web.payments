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

	render () {
		const {purchasable} = this.state;

		if (!purchasable) { return null; }

		return (
			<CreditCard purchasable={purchasable} />
		);
	}
}

ReactDOM.render(
	<Test />,
	document.getElementById('content')
);
