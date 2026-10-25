export var prices = new Array();
export var pricesNames = new Array();
var callbackCalled = false;
var theCallback = undefined;
var erg24hDiff = null;

// The layout waits on this before rendering, so a slow source must never hold it up.
const PRICE_TIMEOUT_MS = 6000;

export async function getPrices(callback) {
	theCallback = callback;

	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), PRICE_TIMEOUT_MS);

	try {
		const ergResponse = await fetch('https://api.ergexplorer.com/tokens/getErgPrice', { cache: 'no-store', signal: controller.signal });
		const ergData = await ergResponse.json();
		erg24hDiff = ergData.items[0].difference;
		prices['ERG'] = ergData.items[0].value;
		pricesNames['ERG'] = 'ERG';
	} catch (error) {
		// Leave the ERG price unset; pages show no USD value instead of a wrong one.
	} finally {
		clearTimeout(timer);
	}

	doCallback();
}

function doCallback() {
	if (callbackCalled) {
		return;
	}

	if (theCallback) {
		theCallback();
	}
}
