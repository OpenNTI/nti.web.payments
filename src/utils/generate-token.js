const KNOWN_OPTIONS = [
	'name',
	'address_line1',
	'address_line2',
	'address_city',
	'address_state',
	'address_zip',
	'address_country'
];

export async function generateToken (stripe, data) {
	const options = KNOWN_OPTIONS.reduce((acc, option) => {
		if (data[option] != null) {
			acc[option] = data[option];
		}

		return acc;
	}, {});

	const {token, error} = await stripe.createToken(options);

	if (error) {
		throw error;
	}

	return token;
}
