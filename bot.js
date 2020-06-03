
//GLOBAL VARIABLES

const Client = require('./struct/Client');
const client = new Client({ token: process.env.TOKEN, prefix: process.env.PREFIX });

const fs = require('fs');
const Discord = require('discord.js');
const Canvas = require('canvas');

const { Users, CurrencyShop } = require('./dbObjects');
const { Op } = require('sequelize');
const currency = new Discord.Collection();



const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();


//Fetches secret info from the environment variable
require('dotenv-flow').config();

//Defines functions which help with the running of the currency system
Reflect.defineProperty(currency, 'add', {
    value: async function add(id, amount) {
        const user = currency.get(id);
        if (user) {
            user.balance += Number(amount);
            return user.save();
        }
        const newUser = await Users.create({ user_id: id, balance: amount });
        currency.set(id, newUser);
        return newUser;
    },
});

Reflect.defineProperty(currency, 'getBalance', {
    value: function getBalance(id) {
        const user = currency.get(id);
        return user ? user.balance : 0;
    },
});

//Stores all the command js files into a map of the commands under the client object
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

//Function to load commands
function load_command_from_directory(command_category) {
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
   

//Upon successful compile
client.once('ready', async () => {
    const storedBalances = await Users.findAll();
    storedBalances.forEach(b => currency.set(b.user_id, b));
    console.log(`Signed in as: ${client.user.tag}`);
    console.log(`client.config.prefix: ${client.config.prefix}`);
});


//When a message has beens sent into a channel
client.on('message', async message => {


    if (!message.content.startsWith(client.config.prefix) || message.author.bot) return;

    const args = message.content.slice(client.config.prefix.length).split(' ');
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command);

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${client.config.prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');
    let fontSize = 70;

    do {
        ctx.font = `${fontSize -= 10}px sans-serif`;
    } while (ctx.measureText(text).width > canvas.width - 300);

    return ctx.font;
};


client.on('guildMemberAdd', async member => {


    console.log('Member Added');
    const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
    if (!channel) return console.log('Bot failed to find a "Welcome Channel". Please ensure a welcome channel is set');


    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');


    const background = await Canvas.loadImage('images/wallpaper.jpeg');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);


    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);


    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);


    ctx.font = applyText(canvas, `${member.displayName}!`);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);


    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();


    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
    ctx.drawImage(avatar, 25, 25, 200, 200);


    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');


    channel.send(`Welcome to the server, ${member}!`, attachment);


    let role = message.guild.roles.find(r => r.name === "Private Channels");
    console.log(`Role to be given: ${role}`);

    member.roles.add(role).catch(console.error);
});


client.login(client.config.token);


exports.client = client;
