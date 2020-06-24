module.exports = {
	name: 'fx',
	description: 'Cryptocurrency prices',
	execute(msg, ticker) {
		e(msg, ticker);
	},
};


const fetch = require('node-fetch');
const { MessageAttachment } = require('discord.js');

function e(msg, ticker) {
	let url;
	let chart;
	let isUnknownTicker = false;
	switch(ticker) {
		case 'help':
			msg.channel.send(`Tickers available are:
				btc
				eth
				atom
				`);
			break;
		case 'btc':
			url = 'http://api.coincap.io/v2/assets/bitcoin';
			chart = 'https://bitcoincharts.com/charts/chart.png?width=480&m=krakenUSD&SubmitButton=Draw&r=10&i=Hourly&c=0&s=&e=&Prev=&Next=&t=S&b=D&a1=SMA&m1=50&a2=SMA&m2=200&x=0&i1=RSI&i2=WilliamR&i3=&i4=&v=1&cv=1&ps=1&l=0&p=0&';
			break;
		case 'eth':
			url = 'http://api.coincap.io/v2/assets/ethereum';
			break;
		case 'atom':
			url = 'http://api.coincap.io/v2/assets/cosmos';
			break;
		default:
			isUnknownTicker = true;
			msg.reply(`I do not know what "${ticker}" is.`);
			break;
	}
	if (!isUnknownTicker) {
		// Async function IIFE is not needed if running with Deno
		(async function () {
			const d = await getData(url);
			const p = getPrice(d);
			const vwap = getVwap(d);

			if ((ticker === 'btc') && (p >= vwap)) {
				// BTC rollercoaster up gif
				const gif = 'https://media.giphy.com/media/7FBY7h5Psqd20/giphy.gif'

				msg.channel.send(`**${ticker.toUpperCase()}:\n$${p}**`);
				msg.channel.send(new MessageAttachment(gif));
				msg.channel.send(new MessageAttachment(chart));
			} else if (ticker === 'btc') {
				// BTC rollercoaster down gif
				const gif = 'https://media.giphy.com/media/RgxAkfVQWwkjS/giphy.gif';

				msg.channel.send(`**${ticker.toUpperCase()}:\n$${p}**`);
				msg.channel.send(new MessageAttachment(gif));
				msg.channel.send(new MessageAttachment(chart));
			} else {
				msg.channel.send(`**${ticker.toUpperCase()}:\n$${p}**`);
			}

		})();
	}
}

async function getData(url) {
	const r = await fetch(url);
	const j = await r.json();
	// Log when response returns.
	console.log(new Date, j);
	return j;
}

function getPrice(j) {
	return parseFloat(parseFloat(j.data.priceUsd).toFixed(2));
}

function getVwap(j) {
	return parseFloat(parseFloat(j.data.vwap24Hr).toFixed(2));
}

function getMarketCap(j) {
	return parseFloat(parseFloat(j.data.marketCapUsd).toFixed(2));
}
