const fetch = require('node-fetch');
const { Client, MessageAttachment } = require('discord.js');
const bot = new Client();

const botSecretToken = process.env.DISCORD_BOT_TOKEN;
bot.login(botSecretToken);

bot.on('ready', () => {
	console.log("Connected as", bot.user.tag);
});

bot.on('message', msg => {
	if (msg.content === 'ping') {
		msg.reply('pong');		// Replies with "@speaker, msg"
		msg.channel.send('pong');	// Replies with "msg"
	} else if (msg.content.startsWith('fx') || msg.content.startsWith('Fx')) {
		// Log user input.
		console.log(new Date, msg.content);
		const ticker = msg.content.split(' ')[1].toLowerCase();
		let url;
		let isUnknownTicker = false;
		switch(ticker) {
			case 'btc':
				url = 'http://api.coincap.io/v2/assets/bitcoin';
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

				if ((ticker === 'btc') && (p > vwap)) {
					// BTC rollercoaster up gif
					const gif = 'https://media.giphy.com/media/7FBY7h5Psqd20/giphy.gif'

					msg.channel.send(`${ticker.toUpperCase()}:\n$${p}`);
					msg.channel.send(new MessageAttachment(gif));
				} else if (ticker === 'btc') {
					// BTC rollercoaster down gif
					const gif = 'https://media.giphy.com/media/RgxAkfVQWwkjS/giphy.gif';

					msg.channel.send(`${ticker.toUpperCase()}:\n$${p}`);
					msg.channel.send(new MessageAttachment(gif));
				} else {
					msg.channel.send(`${ticker.toUpperCase()}:\n$${p}`);
				}
			})();
		}
	}
});

async function getData(url) {
	const r = await fetch(url);
	const j = await r.json();
	// Log when response returns.
	console.log(new Date, j);
	return j;
}

function getPrice(j) {
	return parseFloat(j.data.priceUsd).toFixed(2);
}

function getVwap(j) {
	return parseFloat(j.data.vwap24Hr).toFixed(2);
}

function getMarketCap(j) {
	return parseFloat(j.data.marketCapUsd).toFixed(2);
}
