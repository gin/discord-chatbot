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
		msg.reply('pong');		// Replies with "@speaker, msg"
		msg.channel.send('pong');	// Replies with "msg"
	} else if (msg.content.startsWith('fx') || msg.content.startsWith('Fx')) {
		// Log user input.
		console.log(new Date, msg.content);
		const ticker = msg.content.split(/ +/)[1].toLowerCase();
		bot.commands.get('fx').execute(msg, ticker);
	} else if (msg.content.startsWith('!ops') || msg.content.startsWith('!Ops')) {
		// Log user input.
		console.log(new Date, msg.content);
		const arg = msg.content.split(/ +/)[1].toLowerCase();
		bot.commands.get('ops').execute(msg, arg);
	}
});
