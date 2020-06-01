const Discord = require('discord.js');
var maintenance = false;
const parent = require('../bot.js')
module.exports = {
    name: 'play',
    description: 'Plays the given song',
    aliases: ['pl','play'],
    async execute(message, args) {

        argument = args.join(' ')

        let alreadyPlaying = parent.client.player.isPlaying(message.guild.id);

        if (alreadyPlaying) {
            let song = await parent.client.player.addToQueue(message.guild.id, argument);
            message.channel.send(`${song.name} added to Queue!`);
            song.queue.on('end', () => {
                message.channel.send('The queue has finished. Hope you enjoyed the tunes!')
            });
        } else {
            let song = await parent.client.player.play(message.member.voice.channel, argument, message.member.user.tag);
            message.reply(`Currently playing ${song.name}! - Requested by ${song.requestedBy}`);
        }

        
    }
};
