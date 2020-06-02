const Discord = require('discord.js');
var maintenance = false;
const parent = require('../../bot.js')
module.exports = {
    name: 'pause',
    description: 'Pauses the current song',
    aliases: ['pause'],
    async execute(message, args) {
        let song = await parent.client.player.pause(message.guild.id);
        message.channel.send(`${song.name} paused!`);
    }
};
