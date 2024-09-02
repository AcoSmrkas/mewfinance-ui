export var prices = new Array();
export var pricesNames = new Array();
var gotPrices = false;
var callbackCalled = false;
var theCallback = undefined;
var pricesData = undefined;
var poolsData = undefined;
var erg24hDiff = null;

export async function getPrices(callback) {
	theCallback = callback;

    try {
        const ergResponse = await fetch('https://api.ergexplorer.com/tokens/getErgPrice');
        const ergData = await ergResponse.json();
        erg24hDiff = ergData.items[0].difference;
        prices['ERG'] = ergData.items[0].value;
        pricesNames['ERG'] = 'ERG';

        const marketResponse = await fetch('https://api.spectrum.fi/v1/price-tracking/markets');
        pricesData = await marketResponse.json();
        handlePrices();

        const poolsResponse = await fetch('https://api.spectrum.fi/v1/amm/pools/stats');
        poolsData = await poolsResponse.json();
        handlePrices();
    } catch (error) {
        doCallback();
    }
}

function handlePrices() {
	if (poolsData == undefined || pricesData == undefined) {
		return;
	}

	for (let i = 0; i < pricesData.length; i++) {
		let pairData = pricesData[i];
		if (pairData['baseSymbol'] == 'ERG') {
			if (prices[pairData['quoteId']] != undefined) continue;

			let skip = true;
			for (let j = 0; j < poolsData.length; j++) {
				let poolData = poolsData[j];

				if (poolData.lockedX.id == pairData['baseId']
					&& poolData.lockedY.id == pairData['quoteId']
					&& poolData.lockedX.amount / Math.pow(10, 9) >= 1000) {
					skip = false;
					break;
				}
			}
			if (skip) continue;
			
			let price = prices['ERG'] / pairData['lastPrice'];
			prices[pairData['quoteId']] = price;
			pricesNames[pairData['quoteSymbol']] = price;
		}
	}
	
	gotPrices = true;
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