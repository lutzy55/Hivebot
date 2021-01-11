const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();



module.exports = {
    name: "embed",
    //aliases: [""],
    description: "Send an embedded messaged",
    category: "Hive Utility",
    guildOnly: true,
    cooldown: 2,
    args: false,
    usage: "<usage>",
    execute(message, args) {

        let gameTitle = ""
        let gameDescription = ""
        let gameURL = ""
        let embedColor = ""
        let companyName = ""
        let gamePrice = ""
        



        const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('title')
    .setURL('https://discord.js.org/')
    .setAuthor('name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
    .setDescription('description')
    .setThumbnail('https://i.imgur.com/wSTFkRM.png')
    .addFields(
        { name: 'title', value: 'value', inline: false },
        { name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
    )
    .addField('Inline field title', 'Some value here', true)
    .setImage('https://i.imgur.com/wSTFkRM.png')
    .setTimestamp('timestamp')
    .setFooter('footer', 'https://i.imgur.com/wSTFkRM.png');

    message.channel.send(embed);
        
    },
};