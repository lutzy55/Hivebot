const fs = require('fs');
const Discord = require('discord.js');
require('dotenv').config();


const { prefix, HiveMindCooridnatorID } = require('./config.json');
//let { HivemindParentCategoryID, HivemindAlertsChannelID, GoogleLinkBotToken } = require('./config.json');
const HivemindParentCategoryID = process.env.HIVEMIND_PARENT_CATEGORY_ID;
const HivemindAlertsChannelID = process.env.HIVEMIND_ALERTS_CHANNEL_ID;
const GoogleLinkBotToken = process.env.GOOGLE_LINK_BOT_TOKEN;
const { time } = require('console');
const { resolve } = require('path');
const { stringify } = require('querystring');
const { isNull } = require('util');
//const { name } = require('./commands/purge-all-channels');
 //console.log (process.env.DISCORD_TOKEN);
 //console.log (HivemindParentCategoryID);
 //console.log (HivemindAlertsChannelID);
 //console.log (GoogleLinkBotToken);
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
	
	// If message is from the Hivemind Google Form Webhook, create the alerts and game channels
	if (message.webhookID === GoogleLinkBotToken){
				if (!HivemindAlertsChannelID) {
					let hivemindAlertsChannel = message.guild.channels.cache.find(channel => channel.name.toLowerCase() === "hive-alerts");
					HivemindAlertsChannelID = hivemindAlertsChannel.id
					//console.log(hivemindAlertsChannel)
				}
		
				if (!HivemindParentCategoryID) {
					let hivemindParentCategory = message.guild.channels.cache.find(channel => channel.name.toLowerCase() === "hivemind");
				
					HivemindParentCategoryID = hivemindParentCategory.id
					//console.log(hivemindParentCategory.id)
				}
		
				const alertChannel = message.guild.channels.cache.get(HivemindAlertsChannelID);	
				//console.log(alertChannel)


				// Gets the first embed of the message just sent to the channel and returns as a collections
				let embedObject = message.embeds[0];
			   

				function getGameTitle(embedObject) {
					let gameTitleField = embedObject.fields.find(fields => fields.name === "Game Title")
					console.log(`Game Title from Google Form: ${gameTitleField.value}`);
					return gameTitleField.value
				}
				
				let gameName = getGameTitle (embedObject);
				
				//let gameName = "Tdam"
			   // let HivemindParentCategoryID = '794980558782332988';
				let channelTopic = `This is a game review channel for: ${gameName}`;

		
				
				function addReviewerSignupField() {
					let reviewers = '\u200B';
					//let reviewers = "Moose"
					message.embeds[0].addField("Reviewer Signup", reviewers, true)
				}

				function sendAlert(gameChannelID) {
					
					function sendAlert() {
						return alertChannel.send(embedObject)
					}

					// Sends embed prior to adding Discord Channel and Reviewer fields
					gameChannelID.send(embedObject)
					.then(message => message.pin ({ reason: `Game Annoucement`}))

					addDiscordChannelToEmbed(gameChannelID)
					addReviewerSignupField()
					sendAlert()
					.then(async embedMessage => { 
						await embedMessage.react("👍");
						await embedMessage.react("👎");
						await embedMessage.pin ({ reason: `Game Annoucement`})
					})
					//.then(() => message.pin ({ resason: `Game Annoucement`}))
					//gameChannelID.send(embedObject)
					//.then(message => message.pin ({ reason: `Game Annoucement`}))
				  }

				function addDiscordChannelToEmbed(gameChannelID){
					(message.embeds[0].addField("Discord Channel", `${gameChannelID}`, true))
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
			
	// Check message for bot command
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLocaleLowerCase();
	
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	// Check if Guild Only command
	if (command.guildOnly && message.channel.type === 'dm') {
			return message.reply(`I can\'t execute that command inside DMs!`);
	}

	// Check for permissions
	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.channel.reply(`You don't have permssions for this`);
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
		message.reply(`there was an error trying to execute that command!`);
	}

});


client.on('messageReactionAdd', (messageReaction, user) => {
	//const filter = (reaction, user) => reaction.emoji.name === '👍' && user.id !== client.user.id;
	//if (messageReaction.message.member) return;
	//console.log(client.user.id)
	const embedToEdit = messageReaction.message.embeds[0];
	const reactionUser = messageReaction.users.cache.get(user.id)
	const userReactions = messageReaction.message.reactions.cache.filter(reaction => reaction.users.cache.has(reactionUser));
	console.log("User Reactions:" + userReactions)

	// If the embed being reacted to isn't a Hivemind Review Request, return
	if (!embedToEdit.title == "Hivemind Review Request") return;

	function addGameReviewerFieldValues(reviewer, currentReviewersList, gameReviwerFieldName) {
		
		// If message was reacted to by a bot, exit.
		if (messageReaction.users.cache.get(user.id).bot) return;

		// Add the reacting user to the Reviewer List field
		embedToEdit.fields.find(fields => fields.name === `${gameReviwerFieldName}`).value += `\n${reviewer}`

		// Performs embed edit with a promise
		let editedEmbed = messageReaction.message.edit(embedToEdit)
	
		return editedEmbed 
	}

	function removeGameReviewerFieldValues(filteredSplitReviewerList,gameReviwerFieldName) {
		
		// If message was reacted to by a bot, exit.
		if (messageReaction.users.cache.get(user.id).bot) return;

		// Remove the reacting user to the Reviewer List field
		embedToEdit.fields.find(fields => fields.name === `${gameReviwerFieldName}`).value = `\n${filteredSplitReviewerList}`
		
		// Performs embed edit with a promise
		let editedEmbed = messageReaction.message.edit(embedToEdit)
	
		return editedEmbed 
	}

	function editReivewRequestEmbed(reactionUser){
		if (messageReaction.users.cache.get(user.id).bot || messageReaction.message.channel.id != HivemindAlertsChannelID) return;

	
		let gameReviwerFieldName = "Reviewer Signup"
		let currentReviewersList = embedToEdit.fields.find(fields => fields.name === `${gameReviwerFieldName}`).value
		console.log(`Current Game Reviwer List: ${currentReviewersList}`)
		console.log(`Current reaction user ${reactionUser}`)
		let splitReviewerList = currentReviewersList.split("\n");
		console.log(`Split Reviewer List: ${splitReviewerList}`)
		let filteredSplitReviewerList = "empty"

		// Filters the reaction user from the reviewer list array 
		filteredSplitReviewerList = splitReviewerList.filter(e => e !== `${reactionUser}`)

		// Converts the filtered list to a string and then replaces the separating commas with new lines.
		filteredSplitReviewerList = filteredSplitReviewerList.toString().replace(/,/g, '\n');

		console.log(`Filtered list: ${filteredSplitReviewerList}`)
		
		if(messageReaction.emoji.name === '👍') {
		
				if (currentReviewersList.includes(user.id)) return; 			
			console.log ("Embed to be edited: " + embedToEdit.fields)


			let editedEmbed = addGameReviewerFieldValues(reactionUser, currentReviewersList, gameReviwerFieldName)
			console.log ("Edited Embed: " + editedEmbed)
			
			
			messageReaction.message.edit(editedEmbed)

			//Sends DM to Hivemind Coordinator about person signing up for game
			client.users.cache.get(HiveMindCooridnatorID).send(`${reactionUser} Has signed up for a review here: https://discord.com/channels/${messageReaction.message.guild.id}/${messageReaction.message.channel.id}/${messageReaction.message.id}`)
			
			return editedEmbed
		}

		else if (messageReaction.emoji.name === '👎')
		{
			
			if (currentReviewersList.includes(user.id) == false){
				console.log(`${reactionUser} could not be removed from list because they were not on it`)
			 return;
			} 

			removeGameReviewerFieldValues(filteredSplitReviewerList,gameReviwerFieldName)
			console.log(`${reactionUser} has been removed from the game reviwer list`)
			//Sends DM to Hivemind Coordinator about person dropping out for game
			client.users.cache.get(HiveMindCooridnatorID).send(`${reactionUser} Has been REMOVED from the reviewer list here: https://discord.com/channels/${messageReaction.message.guild.id}/${messageReaction.message.channel.id}/${messageReaction.message.id}`)
		}
	}

	try {editReivewRequestEmbed(reactionUser) }
	catch (error) {
		console.error(error);
		// expected output: ReferenceError: nonExistentFunction is not defined
		// Note - error messages will vary depending on browser
	  }
});

client.login();