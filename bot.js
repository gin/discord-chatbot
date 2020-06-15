const dotenv = require('dotenv');
dotenv.config();
const fetch = require('node-fetch');
const { Client, Collection, MessageAttachment } = require('discord.js');
const bot = new Client();
bot.commands = new Collection();
const botCommands = require('./commands');

Object.keys(botCommands).map(key => {
	bot.commands.set(botCommands[key].name, botCommands[key]);
});

bot.login(process.env.DISCORD_BOT_TOKEN);

bot.on('ready', () => {
	console.log("Connected as", bot.user.tag);
});

bot.on('message', msg => {
	if (msg.content === 'ping') {
		//bot.commands.get('ping').execute(msg, 'ops');
		msg.reply('pong');		// Replies with "@speaker, msg"
		msg.channel.send('pong');	// Replies with "msg"
	} else if (msg.content.startsWith('fx') || msg.content.startsWith('Fx')) {
		// Log user input.
		console.log(new Date, msg.content);
		const ticker = msg.content.split(/ +/)[1].toLowerCase();
		bot.commands.get('fx').execute(msg, ticker);
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
			case 'help':
				msg.channel.send(`
				cpu
				mem
				hdd
				`);
				break;
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
