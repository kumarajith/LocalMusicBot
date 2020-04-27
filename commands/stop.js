module.exports = {
    name: 'stop',
    aliases: ['stop'],
    description: 'Stop and disconnect!',
    guildOnly: true,
    args: false,
	async execute(message, args, queue) {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            queue.length = 0
            message.channel.send("Clearing queue and disconnecting!");
            connection.disconnect();
        }
	},
};