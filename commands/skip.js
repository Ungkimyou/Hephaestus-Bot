const Discord = require('discord.js');
var maintenance = false;
const parent = require('../bot.js')
module.exports = {
    name: 'skip',
    description: 'Skips the current song',
    aliases: ['skip'],
    async execute(message, args) {
        let song = await parent.client.player.skip(message.guild.id);
        message.channel.send(`${song.name} skipped!`);
    }
};
