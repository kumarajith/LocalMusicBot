const fs = require('fs');
const { musicpath } = require('../config.json');
const playCommand = require('./play.js');
const files = fs.readdirSync(musicpath).filter(file => file.endsWith('.mp3'));
module.exports = {
    name: 'random',
    aliases: ['random', 'rand'],
    description: 'Skip current song!',
    guildOnly: true,
    args: false,
	async execute(message, args, queue) {

        for (let i = files.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [files[i], files[j]] = [files[j], files[i]];
        }
        if (message.member.voice.channel) {
            queue.push(...files);
            playCommand.execute(message, [], queue);
        }
	},
};