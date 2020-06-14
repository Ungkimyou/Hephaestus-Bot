
//PACKAGES
const Discord = require('discord.js');
const Canvas = require('canvas');
const fs = require('fs');

//Fetches secret info from the environment variable
require('dotenv-flow').config();

//Global Variables
const Client = require('./struct/Client');
const client = new Client({ token: process.env.TOKEN, prefix: process.env.PREFIX, youtubeKey: process.env.YOUTUBE_KEY , ownerID: process.env.OWNER_ID});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// load events
fs.readdir("./events", (err, files) => { // read the events folter
    if (err) {
        return console.error(err);
    }
    files.forEach(file => { // for each js file, require it
        if (!file.endsWith(".js")) return;
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
        console.log(`Successfully loaded: ${eventName} | Event`)
        delete require.cache[require.resolve(`./events/${file}`)];
    });
});


//Stores all the command js files into a map of the commands under the client object
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`Successfully loaded: ${command.name} | Command`)
}
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

//Dict storing command categories as defined in the sub-directories of the commands folder
var command_categories = {
    music: "Music",
    admin: "Admin",
    moderation: "Moderation",
    general: "General",
}

//Iterates through 
for (var command in command_categories) {
    var value = command_categories[command];
    load_command_from_directory(value)
}

client.login(client.config.token);


exports.client = client;
