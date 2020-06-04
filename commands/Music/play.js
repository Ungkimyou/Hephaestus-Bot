const { Util } = require('discord.js');
const ytdl = require('ytdl-core');
const parent = require('../../bot.js')
const youtubeAPI = parent.client.config.youtubeKey
const { google } = require('googleapis');

module.exports = {
    name: 'play',
    description: 'Play command.',
    usage: '[command name]',
    args: true,
    cooldown: 5,
    async execute(message, args) {


        //Permissions and checks
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
        if (!permissions.has('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');

        //Defines the requested song based on the args
        req_song = args.join(" ");
        urlCheck = new RegExp('^https')

        
        async function play(song) {
        
            
            //Creates server queue
            const serverQueue = message.client.queue.get(message.guild.id);
            //If a queue exists
            if (serverQueue) {
                serverQueue.songs.push(song);
                console.log(serverQueue.songs.title);
                return message.channel.send(`**${song.title}** has been added to the queue`);
            }

            //Defines the structure for a queue
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: channel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            };

            //Sets queue variable within the client class
            message.client.queue.set(message.guild.id, queueConstruct);
            queueConstruct.songs.push(song);

            //Play
            const play = async song => {
                const queue = message.client.queue.get(message.guild.id);
                if (!song) {
                    message.client.queue.delete(message.guild.id);
                    return;
                }

                //Streams the song
                const dispatcher = queue.connection.play(ytdl(song.url))

                    //Once completed it moves the queue array
                    .on('finish', () => {
                        queue.songs.shift();
                        play(queue.songs[0]);
                    })
                    .on('error', error => console.error(error));

                //Sets logarithmic volume
                dispatcher.setVolumeLogarithmic(queue.volume / 5);
                queue.textChannel.send(`🎶 Start playing: **${song.title}**`);
            };

            //Instantiates the queue using the queueConstruct definitons and begins to play songs in the queue
            try {
                const connection = await channel.join();
                queueConstruct.connection = connection;
                play(queueConstruct.songs[0]);

            } catch (error) {
                console.error(`I could not join the voice channel: ${error}`);
                message.client.queue.delete(message.guild.id);
                await channel.leave();
                return message.channel.send(`I could not join the voice channel: ${error}`);
            }


        };

        async function searchYoutube(song_string) {

            if (urlCheck.test(song_string)) {

                console.log("URL")
                //Searches through the YouTube API for video
                var youtubeSearch = google.youtube('v3').search.list({
                    key: youtubeAPI,
                    part: "snippet",
                    q: song_string,
                    maxResults: 1,
                    type: "video",
                })

                    .then((response) => {

                    const { data } = response;
                    data.items.forEach((item) => {

                        console.log(`Song Title: ${item.snippet.title}.`)
                        console.log(`Video URL: ${song_string}`)

                        //Defines structure of a song.
                        const song = {
                            title: item.snippet.title,
                            url: song_string
                        };

                        play(song)

                    });
                });

            } else {

                console.log("Title")

                //Searches through the YouTube API for video
                var youtubeSearch = google.youtube('v3').search.list({
                    key: youtubeAPI,
                    part: "snippet",
                    q: song_string,
                    maxResults: 1,
                    type: "video",
                })

                    .then((response) => {

                        const { data } = response;
                        data.items.forEach((item) => {

                            console.log(`Song Title: ${item.snippet.title}.`)
                            console.log(`Video ID: ${item.id.videoId}`)

                            //Defines structure of a song.
                            const song = {
                                title: item.snippet.title,
                                url: "https://www.youtube.com/watch?v="+item.id.videoId,
                            };

                            play(song)

                        });
                    });


            }

        }

        searchYoutube(req_song)

    }
};
