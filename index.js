const Twit = require('twit');
const robot = require('robotjs');
const cmd = require('node-cmd');
const configRyu = require('./config-ryu'); // stupidstreetryu, stupid street fighter ryu
const configKen = require('./config-ken'); // stupidstreetken, stupid street fighter ken

const T1 = new Twit(configRyu);
const T2 = new Twit(configKen);

// Setting up a user stream
const streamRyu = T1.stream('user');
const streamKen = T2.stream('user');

// Anytime someone follows me
streamRyu.on('tweet', tweetEvent);
streamKen.on('tweet', tweetEvent);

let player = (Math.random()*1 > 0.5) ? 0 : 1;

// cmd.run('open -a ZSNES');

// setInterval(function(){
// 	triggerCommand(0);
// 	triggerCommand(1);
// },1000);

const commands = new Map([
	['light kick',		['z', 'f']],
	['medium kick', 	['x', 'g']],
	['medium punch', 	['c', 'h']],
	['light punch',		['v', 'j']],
	['hard punch', 		['n', 'k']],
	['hard kick', 		['m', 'l']],
	['up', 				['up', 'w']],
	['down', 			['down', 's']],
	['left', 			['left', 'a']],
	['right', 			['right', 'd']],
	['combo', 			['q', 'e']]
]);

function tweetEvent(eventMsg) {
	
	writeToFile(eventMsg);

	var replyto = eventMsg.in_reply_to_screen_name;
	var text = eventMsg.text;
	var from = eventMsg.user.screen_name;
	
	console.log(replyto + ' ' + from);
	console.log(text);

	text = text.replace(/(@\S+)/gi,"");

	let command = getRandomItem(commands);
	var txt = '@' + from + ' ' + command[0] + ' ' + makeid();
	var tweet = {
		status: txt
	}

	setTimeout(function(){
		if (replyto === 'stupidstreetryu'){
			pressKey(command[1][0]);
			T1.post('statuses/update', tweet, tweeted);
		} else if (replyto === 'stupidstreetken'){
			pressKey(command[1][1]);
			T2.post('statuses/update', tweet, tweeted);
		}
	},500);

	function tweeted(err, data, response) {
		if (err) {
			console.error(err);
		} else {
			console.log(data);
		}
	}
}

function triggerCommand(player){
	let command = getRandomItem(commands);
	command = command[1][player];
	pressKey(command);
}

function pressKey(key) {
	for (var i = 0; i < 8; i++) {
		robot.keyToggle(key, 'down');
	}
	for (var i = 0; i < 8; i++) {
		robot.keyToggle(key, 'up');
	}
}

function getRandomItem(set) {
    let items = Array.from(set);
    return items[Math.floor(Math.random() * items.length)];
}

function writeToFile(data){
	var fs = require('fs');
	var json = JSON.stringify(data,null,2);
	fs.writeFile("tweet.json", json);
}

function makeid() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 5; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}