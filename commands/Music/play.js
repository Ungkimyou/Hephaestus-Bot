const { Util } = require('discord.js');
const ytdl = require('ytdl-core');
const parent = require('../../bot.js')
const youtubeAPI = parent.client.config.youtubeKey
const { google } = require('googleapis');
const getYoutubePlaylistId = require('get-youtube-playlist-id');
const Youtube = require('simple-youtube-api');
const youtube = new Youtube(youtubeAPI);


module.exports = {
    name: 'play',
    description: 'Plays / Queues a new song',
    usage: '[Video URL | Song Name | PlaylistURL]',
    args: true,
    cooldown: 3,
    aliases: ['p'],
    async execute(message, args) {


        //Permissions and checks
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
        if (!permissions.has('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');

        //Defines the requested song based on the args
        req_song = args.join(" ");

        //Regular Expressions to check URL
        urlCheck = new RegExp('^https://www.youtube.com/watch')
        playlistCheck = new RegExp('^https://www.youtube.com/playlist')


        async function playlist_scan() {

            //Gets playlist information based off the URL 
            youtube.getPlaylist(req_song)
                .then(playlist => {
                    playlist.getVideos()
                        .then(videos => {
                            videos.forEach((video) => {
                                const song = {
                                    title: video.title,
                                    url: video.url,
                                    channel: video.channel.title,
                                    duration: video.duration
                                };
                                try {
                                    play(song, true)
                                } catch (err) {
                                    console.log(err)
                                }
                            })
                        })
                })
        }

        async function play(song, isPlaylist) {


            //Creates server queue
            const serverQueue = message.client.queue.get(message.guild.id);

            //If a queue exists then add the song to the end of the queue
            if (serverQueue) {
                serverQueue.songs.push(song);
                if(!isPlaylist) message.channel.send(`** ${song.title} ** has been added to the queue`)
                console.log(serverQueue.songs);
                return
            }

            //Defines the structure for a queue
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: channel,
                connection: null,
                songs: [],
                volume: 4,
                playing: true
            };

            //Sets queue variable within the client class
            message.client.queue.set(message.guild.id, queueConstruct);
            queueConstruct.songs.push(song);
            if (isPlaylist) {
                message.channel.send("** Playlist ** has been added to the queue")
            } else {
                message.channel.send(`** ${song.title} ** has been added to the queue`)
            }

            //Play
            const play = async song => {
                const queue = message.client.queue.get(message.guild.id);
                if (!song) {
                    queue.voiceChannel.leave()
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


                    .on('disconnect', () => {

                        console.log("Disconnecting...")
                        queue.songs = [];
                        dispatcher.end('Stop command has been used!');

                    })


                parent.client.on('voiceStateUpdate', async newState => {

                    try {

                        if (!newState.connection && newState.member.user.bot) {
                            console.log("Not connected to a voice channel")

                            var serverQueue = message.client.queue.get(message.guild.id)
                            if (!serverQueue) return console.log("No songs in Queue")

                            serverQueue.songs = []
                            dispatcher.end();
                            console.log("Queue has been cleared because I got disconnected from the voiceChannel")
                        } else {

                            //console.log(`VOICE STATE UPDATED: ${newState.connection.status}`)

                        }

                    } catch (err) {
                        console.log(err)
                    }
                })
                    
                //Sets logarithmic volume
                dispatcher.setVolumeLogarithmic(queue.volume / 5);
                message.channel.send(`🎶 Start playing: **${song.title}** by **${song.channel}**`)
                    .then(msg => {
                        msg.delete({ timeout: 15000 })
                    }).catch(err => { console.log(err) });
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
                youtube.getVideo(song_string)
                    .then(video => {

                        const song = {

                            title: video.title,
                            url: video.url,
                            channel: video.channel.title,
                            duration: video.duration

                        };

                        try {
                            play(song,false)
                        } catch (err) {
                            console.log(err)
                        }

                    })

                    .catch(err => { console.log(err) });

            } else {

                //Searches through the YouTube API for video

                youtube.searchVideos(req_song, 1)
                    .then(results => {

                        result = results[0];

                        const song = {
                            title: result.title,
                            url: result.url,
                            channel: result.channel.title,
                        }

                        play(song,false)

                    })
                    .catch(err => {
                        console.log(err)
                    });
            }
        }

        if (playlistCheck.test(req_song)) {

            var id = getYoutubePlaylistId(req_song)
            playlist_scan(id)

        } else {

            searchYoutube(req_song)

        }

    }
};



