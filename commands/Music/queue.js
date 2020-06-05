module.exports = {
	name: 'queue',
	description: 'Queue command.',
    cooldown: 5,
    aliases: ['q'],
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('There is nothing playing.');

        for (i = 0; i < 10; i++) {

        }

	}
};
