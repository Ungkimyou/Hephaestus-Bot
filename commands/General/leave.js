const Discord = require('discord.js');
var maintenance = false;
module.exports = {
    name: 'leave',
    description: 'Leaves the current voice channel',
    execute(message, args) {
        if (message.member.voice.channel) {
            message.member.voice.channel.leave();
        } else {
            message.reply("You cannot kick me if you are not in the vc")
        }
    }
};
