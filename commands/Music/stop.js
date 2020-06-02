const Discord = require('discord.js');
var maintenance = false;
const parent = require('../../bot.js')
module.exports = {
    name: 'stop',
    description: 'Stops the music player',
    aliases: ['st'],
    async execute(message, args) {
        let song = await parent.client.player.stop(message.guild.id);
        message.channel.send('Music stopped!');
    }
};
