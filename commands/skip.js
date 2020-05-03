const { musicpath } = require('../config.json');
const playCommand = require('./play.js');
module.exports = {
    name: 'skip',
    aliases: ['skip', 'next'],
    description: 'Skip current song!',
    guildOnly: true,
    args: false,
	async execute(message, args, queue) {
        if (message.member.voice.channel && queue.length > 0) {
            playCommand.execute(message, [], queue);
        }
	},
};