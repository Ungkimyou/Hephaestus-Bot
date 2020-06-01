const Discord = require('discord.js');
var maintenance = false;
const parent = require('../bot.js')
module.exports = {
    name: 'add role',
    description: 'Adds a role to user',
    aliases: ['addrole'],
    async execute(message, args) {
        if (message.member.hasPermission('MANAGE_ROLES')) {
            const role = guild.roles.cache.find(role => role.name === args[1]);
            const member = args[0];
            member.roles.add(role);
        } else {
            message.reply('You do not have permission to do this')
        }
    }
};
