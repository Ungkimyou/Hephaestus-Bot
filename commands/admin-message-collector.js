const Discord = require('discord.js');
const parent = require('../bot.js');
const { ownerID } = require('../config.json');
var maintenance = false;
module.exports = {
    name: 'admin-message-collector',
    description: 'Collects all the messages in the given channel',
    aliases: ['msg-col'],
    execute(message, args) {
        if (message.author.id === ownerID) {

            const filter = m => m.content.includes('d');
            const collector = message.channel.createMessageCollector(filter);

            collector.on('collect', m => {
                console.log(`Collected: ${m.content}`);
            });

            collector.on('end', collected => {
                console.log(`Collected: ${collected.size} items`)
            })
        } else {
            message.reply("You cannot execute this command without being a bot admin, dimwit!");
            console.log("ERROR: Someone has tried executing **ADMIN-MESSAGE-COLLECTOR** and does not have admin rights");
        }
    }
};
