const { musicpath } = require('../config.json');
module.exports = {
    name: 'skip',
    aliases: ['skip', 'next'],
    description: 'Skip current song!',
    guildOnly: true,
    args: false,
	async execute(message, args, queue) {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            queue.shift();
            if (queue.length === 0) {
                message.channel.send("Queue empty, disconnecting!");
                connection.disconnect();
            } else {
                dispatcher = connection.play(musicpath + queue[0]);
            }
        }
	},
};