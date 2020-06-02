const Discord = require('discord.js');
var maintenance = false;
const parent = require('../../bot.js')
module.exports = {
    name: 'nowplaying',
    description: 'Stops the music player',
    aliases: ['np'],
    async execute(message, args) {
        let song = await parent.client.player.nowPlaying(message.guild.id);
        message.channel.send(`Currently playing ${song.name}...`);
    }
};
