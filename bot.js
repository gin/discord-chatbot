const fetch = require('node-fetch');
const { Client, MessageAttachment } = require('discord.js');
const bot = new Client();

require('./env');
const botSecretToken = process.env.DISCORD_BOT_TOKEN;

bot.login(botSecretToken);

bot.on('ready', () => {
	console.log("Connected as", bot.user.tag);
});

bot.on('message', msg => {
	if (msg.content === 'ping') {
		msg.reply('pong');		// Replies with "@speaker, msg"
		msg.channel.send('pong');	// Replies with "msg"
	} else if (msg.content.startsWith('fx')) {
		console.log(msg.content);
		const ticker = msg.content.split(' ')[1];
		if (ticker === 'btc') {
			const url = 'http://api.coincap.io/v2/assets/bitcoin';
			getData(url, msg)
		}
	}
});

async function getData(url, msg) {
	const r = await fetch(url);
	const j = await r.json();
	let p = j.data.priceUsd;
	let pvwap = j.data.vwap24Hr;
	p = Math.floor(p);
	pvwap = Math.floor(pvwap);

	const s = '$'+p+'/₿';
	if (p > pvwap) {
		// BTC rollercoaster up gif
		const attachment = new MessageAttachment('https://media.giphy.com/media/7FBY7h5Psqd20/giphy.gif');
		msg.channel.send(s);
		msg.channel.send(attachment);
	} else {
		// BTC rollercoaster down gif
		const attachment = new MessageAttachment('https://media.giphy.com/media/RgxAkfVQWwkjS/giphy.gif');
		msg.channel.send(s);
		msg.channel.send(attachment);
	}
}
