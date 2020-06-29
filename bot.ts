import {
  Client,
  Message,
  Ready,
  Ratelimit,
} from "https://deno.land/x/cordeno/mod.ts";

const client = new Client({
  token: "",
});

console.log(`Running cordeno v${client.version}`);

for await (const ctx of client) {
  switch (ctx.event) {
    case "READY": {
      const ready: Ready = ctx;

      console.log("Cordeno is now ready!");
      console.log("Discord websocket API version is " + ready.v);
      break;
    }
    case "RATELIMIT": {
      const ratelimit: Ratelimit = ctx;
      console.log(`A rate limit was hit for the route: ${ratelimit.route}`);
      // deno-fmt-ignore
      console.log(`The ratelimit will reset in ${Math.round(ratelimit.resetIn / 1000 * 10) / 10} seconds`);
      break;
    }
    case "MESSAGE_CREATE": {
      const msg: Message = ctx;

      if (msg.author.id !== client.user.id) {
        if (msg.content === "!ping") {
          await msg.reply(`Pong!`);
          await msg.reply(`Message author: ${msg.author.username}`);
          await msg.reply(`Created at: ${msg.createdAt}`);
          continue;
        }
        if (msg.content === "!cordeno") {
          await msg.reply(`Cordeno version: v${client.version}`);
        }
	if (msg.content.startsWith("fx")) {
		console.log(new Date, msg.content);
		const ticker = msg.content.split(/ +/)[1].toLowerCase();
		let url: string;
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
			const json = await getData('http://api.coincap.io/v2/assets/bitcoin');
			//const j = await fetch('http://api.coincap.io/v2/assets/bitcoin');
			//const j = await fetch('http://api.coincap.io/v2/assets/bitcoin');
			//const json = await j.json();
			await msg.reply(`${ticker}`);
			//await msg.reply(json.data.priceUsd);
			msg.reply(json.priceUsd);
			console.log(new Date, json.priceUsd);
		}

	}
      }
      break;
    }
  }
}

async function getData(url: string) {
	const j = await fetch('http://api.coincap.io/v2/assets/bitcoin');
	const json = await j.json();
	const p = await json.data;
	return p
}

//async function getData(url: string) {
//	const r = await fetch(url);
//	const j = await r.json();
//	// Log when response returns.
//	console.log(new Date, j);
//	return j;
//}
//
//function getPrice(j: string) {
//	return parseFloat(parseFloat(j.data.priceUsd).toFixed(2));
//}
//
//function getVwap(j: string) {
//	return parseFloat(parseFloat(j.data.vwap24Hr).toFixed(2));
//}
//
//function getMarketCap(j: string) {
//	return parseFloat(parseFloat(j.data.marketCapUsd).toFixed(2));
//}
