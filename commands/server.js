const Discord = require('discord.js');
var maintenance = false;
module.exports = {
	name: 'server',
	description: 'Displays server information',
	execute(message, args) {
    const embed = new Discord.MessageEmbed()
      .setTitle('Server Information')
      .setDescription(`Information on ${message.guild.name}`)
      .addFields(
        { name: 'Server Name', value: message.guild.name },
        { name: 'Region', value: message.guild.region },
        { name: "Owner", value: message.guild.owner },
        { name: 'Number of Members', value: message.guild.memberCount },
        { name: 'Server Creation', value: message.guild.createdAt },
      );

      message.channel.send(embed);
	}
};
