const Discord = require('discord.js');
var maintenance = false;
const parent = require('../bot.js')
module.exports = {
    name: 'getQueue',
    description: 'Stops the music player',
    aliases: ['queue'],
    async execute(message, args) {
        let queue = await parent.client.player.getQueue(message.guild.id);
        message.channel.send('Server queue:\n' + (queue.songs.map((song, i) => {
            return `${i === 0 ? 'Current' : `#${i + 1}`} - ${song.name} | ${song.author}`
        }).join('\n')));

    }
};
