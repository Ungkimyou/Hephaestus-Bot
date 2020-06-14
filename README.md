# 🔥 Hephaestus Bot 🔥

> Hephaestus is a newly developed bot for Discord made using the discordJS Library. This is my first bot I have developed so some of the code could be optimised and improved upon.

![](src/images/logo.png) 
 
## Commands List 👾

| Command        |Description           |Usage  |
| ------------- |:-------------:| -----:|
| admin-member-add      |Mimicks a member joining |!admin-member-add |
| help      |Displays help on commands      |!help / !help <command> |
| join |Joins vc      |!join |
| leave|Leaves vc |!leave |
| ping |Gives user ping| !ping|
| prune|Deletes n most recent messages| !prune <message count>|
| server|Displays info on server| !server|
| troll| Spams the user for lols| !troll|
| addRole| Adds given role to given user| !addRole <mention member><mention role|
| kick| Kicks mentioned user| !kick <mention member> |
| ban| Bans mentioned user| !ban <mention member |
| np| Displays currently playing song| !np |
| pause| Pauses player| !pause |
| resume| Resumes player| !resume |
| play| Plays song| !play <Title/PlaylistURL/VideoURL> |
| queue| Displays queue| !queue|
| shuffle| Shuffles the queue| !shuffle|
| skip | Skips N songs| !skip <song amount>|
| stop| Stops the player| !stop|
| volume| Adjusts player volume| !volume <newVolume> |
 
## Music Player 🎼
The music playing functionality for Hephaestus requires an interaction between your client and the YoutubeAPI. This is so the bot can get information on specific videos and play them successfully

The implementation of the music features require access to the Youtube Data API V3.

Currently the music player is limited to YouTube songs only since the Spotify API and DiscordJS have conflicts when playing spotify songs by their URL. I may add this functionality later by converting playlists to their youtube equivalents.

## Moderation 🔨
This bot has some moderation features. With time will come further updates expanding Hephaestus' capabilities in managing your Discord Server but right now, Hephaestus, has support for kicking and banning aswell as role management.

To use the moderation features you need to __mention__ the user and/or role you wish to operate on
## Dynamic Implementation of Commands
The most useful implementation which I have made with Hephaestus is my dynamic commands and their command handler.

As you can see from the directory, their is the main `bot.js` file accompanied by a `commands folder`. Every Javascript file in the commands folder and the subsequent subdirectories are a separate command and the main command handler in the `bot.js` file iterates through these folders adding each command and its name to a map within the `client` class.

```javascript

//Function to load commands
async function load_command_from_directory(command_category) {
    fs.readdir(`./commands/${command_category}`, (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
            let adminCommands = require(`./commands/${command_category}/${file}`);
            //console.log(`ATTEMPTING TO LOAD: ${adminCommands.name} `);
            client.commands.set(adminCommands.name, adminCommands);
        });
    });
}


```

The command handler then proceeds on to use a try/catch statement in order to attempt the execution whilst providing informative error handling to the Terminal and End User upon an error

```javascript
107 - try {
108 -     command.execute(message, args);
109 - } catch (error) {
110 -    console.error(error);
111 -    message.reply('there was an error trying to execute that command!');
112 - }
```
## Release History ⌚

* 1.0
   * RELEASED: Music Player BETA and Basic Moderation
* 1.1
   * RELEASED: Full YouTube Music Player
* 1.2
   * TBA

## Adding more commands
Before adding more commands, I recommend you read through the [DiscordJS Documentation](https://discord.js.org/#/docs/main/stable/general/welcome) and the [DiscordJS Dev Guide](https://discordjs.guide/#before-you-begin).

The Dynamic Command handler on Hephaestus means that the implementation and addition of new commands is automatic and simple. 
Simply create a new file in the format `YOUR_COMMAND.js` under the `commands` directory. The JavaScript file needs to be layed out as follows 
 ```javascript
module.exports = {
    name: STRING '', 
    description: STRING, 
    aliases: ARRAY [],
    cooldown: INT, 
    usage: <prefix><command name><args>,
    execute(message, args) { 
        //Code for the command
    }
};
```

Once you have created the js file as shown above you can start developing your desired command. 
Below is a fully worked example using the above template for the `d!ping` command.

```javascript
const Discord = require('discord.js');
var maintenance = false;
module.exports = {
    name: 'ping',
    description: 'Ping!',
    aliases: ['pi'],
    execute(message, args) {
        message.channel.send("Pinging...") //Placeholder for ping
            .then((msg) => {
                msg.edit("Ping: " + (Date.now() - msg.createdTimestamp))
            });
    }
};
```

## Adding Hephaestus to your bot

Adding Hephaestus to your own bot is simple. For privacy and security reasons, I have not uploaded the `config.json` file along with some other files. 
Simply create a `.env` and structure it as follows
```
TOKEN = YOUR_BOT_TOKEN
OWNER_ID = YOUR_USER_ID
PREFIX = COMMAND PREFIX
YOUTUBE_KEY = YOUTUBE_API_KEY
```
## Information on Dev
Donald Jennings - [@donald_jenningz](https://twitter.com/donald_jenningz) - donald.jennings2020@gmail.com

[https://github.com/DonaldJennings/Hephaestus-Bot](https://github.com/DonaldJennings)
