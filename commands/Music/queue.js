module.exports = {
	name: 'queue',
	description: 'Queue command.',
    cooldown: 5,
    aliases: ['q'],
    execute(message) {

        function queue_to_text(queue, num_songs) {
            data = []
            for (i = 0; i < num_songs; i++) {
                currentSong = queue.songs[i]
                data.push(`${i} - Song Title: ${currentSong.title} | Uploaded By - ${currentSong.channel} | Duration - ${currentSong.duration}\n`)
            }

            return data
        }

		const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('There is nothing playing.');
        queue_list = queue_to_text(serverQueue, 10)
        message.channel.send(`
            ${queue_list}
        `)
	}
};
