module.exports = {
    name: "purge-all-channels",
    aliases: ["delete-all-channels"],
    description: "this is used for development servers to delete all guild channels",
    category: "Dev Tool",
    guildOnly: true,
    cooldown: 2,
    args: false,
    usage: "",
    execute(message, args) {
        message.guild.channels.cache.forEach(channel => channel.delete())
    },
};