module.exports = {
	name: 'ops',
	description: 'Instance operation metrics',
	execute(msg, arg) {
		e(msg, arg);
	},
};


const os = require('os');

function e(msg, arg) {
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
