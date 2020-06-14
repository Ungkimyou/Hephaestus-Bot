const Discord = require('discord.js');
const parent = require('../../bot.js');
var maintenance = false;
module.exports = {
    name: 'admin-member-add',
    description: 'Mimicks a new member joining!',
    aliases: ['userAdd'],
    execute(message, args) {
        if (message.author.id === parent.client.config.ownerID) {
            try {
                parent.client.emit('guildMemberAdd', message.member)
                console.log("Member Added")
            } catch (err) {
                console.log(err)
                message.reply('There was an error while trying to mimick join')
            }
        } else {
            message.reply("You're not the owner you dimwit.")
        }
        
    }
};

