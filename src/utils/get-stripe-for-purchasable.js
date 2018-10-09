import waitForStripe from './wait-for-stripe';

function getPublicKeyFromPurchasable (purchasable) {
	const stripeConnectKey = purchasable && purchasable.getStripeConnectKey();

	if (!stripeConnectKey || !stripeConnectKey.PublicKey) {
		throw new Error('Unable to get public key for purchasable: ', purchasable);
	}

	return stripeConnectKey.PublicKey;
}

export default async function getStripeForPurchasable (purchasable) {
	const key = getPublicKeyFromPurchasable(purchasable);
	const Stripe = await waitForStripe();

	return Stripe(key);
}
