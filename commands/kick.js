const Discord = require('discord.js');
var maintenance = false;
const parent = require('../bot.js')
module.exports = {
    name: 'kick',
    description: 'Kicks a certain member',
    aliases: ['kick'],
    async execute(message, args) {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            const member = args[0];
            member.kick();
        } else {
            message.reply('You do not have permission to kick')
        }
    }
};
