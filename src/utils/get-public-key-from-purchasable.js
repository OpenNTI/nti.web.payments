
export function getPublicKeyFromPurchasable (purchasable) {
	const stripeConnectKey = purchasable?.getStripeConnectKey();

	if (!stripeConnectKey?.PublicKey) {
		throw new Error('Unable to get public key for purchasable: ', purchasable);
	}

	return stripeConnectKey.PublicKey;
}
