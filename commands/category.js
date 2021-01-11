module.exports = {
    name: "category",
    //aliases: [""],
    description: "Creates a channel category based on Team name",
    category: "category",
    guildOnly: true,
    cooldown: 2,
    args: true,
    usage: '<Team Name>,\nTeam names with multiple words should be joined with hyphens "Team-Name"',
    execute(message, args) {
        let teamName = args[0];


        const channelStack = message.guild.channels.create(teamName, { 
            type: 'category', })

            channelStack.then((channelStack) => {
                message.guild.channels.create(teamName, { 
                    type: 'text',
                    parent: channelStack.id,

                }),
                message.guild.channels.create('Clue-Room', { 
                    type: 'text',
                    parent: channelStack.id,

                }),
                message.guild.channels.create('Team Video', { 
                    type: 'voice',
                    parent: channelStack.id,

                }),
                console.log(channelStack)
            }),
        message.channel.send('Category Made')
    },

};