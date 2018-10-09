const STRIPE_URL = 'https://js.stripe.com/v3/';

let loadedStripe = null;

function injectScript () {
	return new Promise((fulfill, reject) => {
		const script = document.createElement('script');

		script.async = true;//Do not block the UI thread while loading.
		script.defer = true;// legacy async
		script.charset = 'utf-8';
		script.type = 'text/javascript';
		script.src = STRIPE_URL;

		script.onerror = reject;
		script.onload = fulfill;

		document.body.appendChild(script);
	});
}

async function loadStripe () {
	await injectScript();
	return global.Stripe;
}

export default function waitForStripe () {
	if (typeof document === 'undefined' || !document.body) { throw new Error('Cannot load stripe in non-browser context.'); }

	if (!loadedStripe) {
		loadedStripe = loadStripe();
	}

	return loadedStripe;
}
