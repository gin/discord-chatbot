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
		const ticker = msg.content.split(/ +/)[1].toLowerCase();
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

					msg.channel.send(`**${ticker.toUpperCase()}:\n$${p}**`);
					msg.channel.send(new MessageAttachment(gif));
				} else if (ticker === 'btc') {
					// BTC rollercoaster down gif
					const gif = 'https://media.giphy.com/media/RgxAkfVQWwkjS/giphy.gif';

					msg.channel.send(`**${ticker.toUpperCase()}:\n$${p}**`);
					msg.channel.send(new MessageAttachment(gif));
				} else {
					msg.channel.send(`**${ticker.toUpperCase()}:\n$${p}**`);
				}
			})();
		}
	} else if (msg.content.startsWith('!ops') || msg.content.startsWith('!Ops')) {
		const os = require('os');

		// Log user input.
		console.log(new Date, msg.content);
		const cmd = msg.content.split();
		let arg = '';
		if (cmd.length > 1) {
			arg = msg.content.split(/ +/)[1].toLowerCase();
		}
		let s = '';
		switch(arg) {
			case 'cpu':
				let cpuLoad = os.loadavg();
				function toPercent(n) { return (parseFloat(n)*100).toFixed(0); }
				[cpuLoad[0], cpuLoad[1], cpuLoad[2]] = [toPercent(cpuLoad[0]), toPercent(cpuLoad[1]), toPercent(cpuLoad[2])];
				s = `**CPU (average load):\n\`\`\` 1 min:\t${cpuLoad[0]}%\n 5 min:\t${cpuLoad[1]}%\n15 min:\t${cpuLoad[2]}%\`\`\`**`;
				msg.channel.send(s);
				console.log(new Date, s);
				break;
			case 'mem':
				const memFree = os.freemem();
				const memTotal = os.totalmem();
				const memPercent = ((memTotal - memFree)/memTotal*100).toFixed(2);

				s = `**Memory usage (free):**\n\`\`\`${memPercent}%\n(${(memFree/1024/1024).toFixed(0)} MB)\`\`\``;
				msg.channel.send(s);
				console.log(new Date, s);
				break;
			case 'hdd':
				// Async function IIFE not needed in Deno.
				(async function () {
					const disk = require('diskusage');
					const diskInfo = await disk.check('/');

					function toGB(x) { return (x / (1024*1024*1024)).toFixed(1); }
					const diskPercent = ((diskInfo.total - diskInfo.available) / diskInfo.total * 100).toFixed(0);

					s = `**Storage usage (free):**\n\`\`\`${diskPercent}%\n(${toGB(diskInfo.available)}GB)\`\`\``;
					msg.channel.send(s);
					console.log(new Date, s);
				})();
				break;
			default:
				break;
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
