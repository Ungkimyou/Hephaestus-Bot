const Discord = require('discord.js');
var maintenance = false;
module.exports = {
	name: 'troll',
    description: 'Spams user 5 times',
    cooldown: 10,
    aliases: ['troll', 'spam'],
	execute(message, args) {
    var i;
    for (i = 0; i < 25; i++) {
      message.reply(`${message.author.username}`,{tts: true});
      console.log(i);
    }
	}
};
