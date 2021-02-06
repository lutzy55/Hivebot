const fs = require('fs');
const Discord = require('discord.js');
require('dotenv').config(
	
);


const { prefix, HiveMindCooridnatorID } = require('./config.json');
//let { HivemindParentCategoryID, HivemindAlertsChannelID, GoogleLinkBotToken } = require('./config.json');
const HivemindParentCategoryID = process.env.HIVEMIND_PARENT_CATEGORY_ID;
const HivemindAlertsChannelID = process.env.HIVEMIND_ALERTS_CHANNEL_ID;
const GoogleLinkBotToken = process.env.GOOGLE_LINK_BOT_TOKEN;
const { time } = require('console');
const { resolve } = require('path');
//const { name } = require('./commands/purge-all-channels');
// console.log (process.env.DISCORD_TOKEN);
// console.log (HivemindParentCategoryID);
// console.log (HivemindAlertsChannelID);
// console.log (GoogleLinkBotToken);
const client = new Discord.Client();
client.commands = new Discord.Collection();

// Reads .js files from the commands folder and creates an array
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
	console.log('Ready!');
});



client.on('message', message => {
	console.log(message.content);
	//(message.embeds[0].addField("Test Field", "Discord Test", true));
	if (message.webhookID === GoogleLinkBotToken){
				if (!HivemindAlertsChannelID) {
					let hivemindAlertsChannel = message.guild.channels.cache.find(channel => channel.name.toLowerCase() === "hivemind-alerts");
					HivemindAlertsChannelID = hivemindAlertsChannel.id
					//console.log(hivemindAlertsChannel)
				}
		
				if (!HivemindParentCategoryID) {
					let hivemindParentCategory = message.guild.channels.cache.find(channel => channel.name.toLowerCase() === "hivemind");
				
					HivemindParentCategoryID = hivemindParentCategory.id
					console.log(hivemindParentCategory.id)
				}
		
				// Gets the first embed of the message just sent to the channel and returns as a collections
				let embedObject = message.embeds[0];
				console.log("Embeded" + embedObject);
			   

				function getGameTitle(embedObject) {
					let gameTitleField = embedObject.fields.find(fields => fields.name === "Game Title")
					console.log(gameTitleField.value)
					return gameTitleField.value
				}
				
				let gameName = getGameTitle (embedObject);
				
				//let gameName = "Tdam"
			   // let HivemindParentCategoryID = '794980558782332988';
				let channelTopic = `This is a game review channel for: ${gameName}`;
				
			   const alertChannel = message.guild.channels.cache.get(HivemindAlertsChannelID)	
				//console.log(alertChannel)
		
				
				function addReviewerSignupField() {
					let reviewers = '\u200B';
					//let reviewers = "Moose"
					message.embeds[0].addField("Reviewer Signup", reviewers, true)
				}

				function sendAlert(gameChannelID, gameChannel) {
					addDiscordChannelToEmbed(gameChannelID)
					addReviewerSignupField()
					function sendAlert() {
						return alertChannel.send(embedObject)
					}
					sendAlert()
					.then(async embedMessage => { 
						await embedMessage.react("👍");
						//await embedMessage.react("👎");
						await embedMessage.pin ({ resason: `Game Annoucement`})
					})
					//.then(() => message.pin ({ resason: `Game Annoucement`}))
					gameChannelID.send(embedObject)
					.then(message => message.pin ({ resason: `Game Annoucement`}))
				  }
		
				function addDiscordChannelToEmbed(gameChannelID){
					(message.embeds[0].addField("Discord Channel", "<#" + gameChannelID +">", true))
					return gameChannelID}


				async function createGameChannel(gameChannel) {  
					gameChannel = await message.guild.channels.create(gameName, { 
						type: 'text', 
						parent: HivemindParentCategoryID,
						topic: channelTopic
						//reason: "Do I need one?"
						})
						.then(sendAlert)
				
				}
				
		createGameChannel();
	}
			
			

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLocaleLowerCase();
	
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	// Check if Guild Only command
	if (command.guildOnly && message.channel.type === 'dm') {
			return message.reply('I can\'t execute that command inside DMs!');
	}

	// Check for permissions
	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.channel.reply("You don't have permssions for this");
		}
	}

	// Check for required arguments
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be \`${prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}

	/*
	// Check for cooldowns
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
	*/

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}

});


client.on('messageReactionAdd', (messageReaction, user) => {
	const filter = (reaction, user) => reaction.emoji.name === '👍' && user.id !== client.user.id;
	
	//if (messageReaction.message.member) return;

	const embedToEdit = messageReaction.message.embeds[0];


function updateGameReviewerFieldValues(newSignupUser) {
	if (messageReaction.users.cache.get(user.id).bot) return;
	let gameReviwerFieldName = "Reviewer Signup"
	//let gameReviewerField = embedToEdit.fields.find(fields => fields.name === `${gameReviwerFieldName}`).value = "Please Work"

	
	embedToEdit.fields.find(fields => fields.name === `${gameReviwerFieldName}`).value += `\n${newSignupUser}`
	let editedEmbed = messageReaction.message.edit(embedToEdit)
	
	return editedEmbed 
}

	function editThisEmbed(){
		let newSignupUser = messageReaction.users.cache.get(user.id)
		console.log ("Embed to be edited: " + embedToEdit.fields)
		let editedEmbed = updateGameReviewerFieldValues(newSignupUser)
		console.log ("Edited Embed: " + editedEmbed)
		messageReaction.message.edit(editedEmbed)
		console.log(`${newSignupUser} "Has singed up for a review here: https://discord.com/channels/${messageReaction.message.guild.id}/${messageReaction.message.channel.id}/${messageReaction.message.id}`)
		client.users.cache.get(HiveMindCooridnatorID).send(`${newSignupUser} "Has singed up for a review here: https://discord.com/channels/${messageReaction.message.guild.id}/${messageReaction.message.channel.id}/${messageReaction.message.id}`)
		
		return editedEmbed
	}
	
	try {editThisEmbed() }
	catch (error) {
		console.error(error);
		// expected output: ReferenceError: nonExistentFunction is not defined
		// Note - error messages will vary depending on browser
	  }
	
});

//client.login(token);
client.login();