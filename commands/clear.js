const Discord = require('discord.js');
var maintenance = false;
const parent = require('../bot.js')
module.exports = {
    name: 'clear',
    description: 'Clears music queue',
    aliases: ['clr'],
    async execute(message, args) {
        let song = await parent.client.player.clearQueue(message.guild.id);
        message.channel.send('Queue cleared!');
    }
};
