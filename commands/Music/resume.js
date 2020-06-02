const Discord = require('discord.js');
var maintenance = false;
const parent = require('../../bot.js')
module.exports = {
    name: 'resume',
    description: 'Resumes the paused song',
    aliases: ['res'],
    async execute(message, args) {
        let song = await parent.client.player.resume(message.guild.id);
        message.channel.send(`${song.name} resumed!`);
    }
};
