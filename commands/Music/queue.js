const { MessageEmbed } = require('discord.js');
const colours = require('../../colours.json');
const parent = require('../../bot.js')
module.exports = {
	name: 'queue',
	description: 'Queue command.',
    cooldown: 3,
    aliases: ['q'],
    execute(message) {
        currentGuild = message.guild

        function queue_to_text(queue) {
            queueSize = queue.songs.length
            data = new MessageEmbed({type: "rich"})
                .setTitle(`Music Queue`)
                .setColor(colours.gold)
                .setDescription('These are the next 10 songs of the playlist')
                .setThumbnail(currentGuild.iconURL())
                .addField(`**NOW PLAYING**`, `${queue.songs[0].title} by ${queue.songs[0].channel}\n---------------------------------------------------`)

                .setFooter(`Powered by Hephaestus Music | ${queueSize-10} songs left`, parent.client.user.displayAvatarURL())
            for (i = 1; i < 11; i++) {
                currentSong = queue.songs[i]
                data.addField(`#${i} `,`Song Title: **${currentSong.title}** by **${currentSong.channel}**`)
            }
            return data
        }

        const serverQueue = message.client.queue.get(message.guild.id);

        if (!serverQueue) return message.channel.send('There is nothing playing.');
        queue_embed= queue_to_text(serverQueue)
        message.channel.send(queue_embed)
	}
};
