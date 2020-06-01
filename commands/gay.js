const Discord = require('discord.js');
module.exports = {
	name: 'gay',
	description: 'Displays server information',
	execute(message, args) {
    var i;
    for (i = 0; i < 5; i++) {
      message.reply(`${message.author.username} Gay`,{tts: true});
      console.log(i);
    }
	}
};
