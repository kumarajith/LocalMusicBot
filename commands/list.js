const fs = require('fs');
const { musicpath } = require('../config.json');
const files = fs.readdirSync(musicpath).filter(file => file.endsWith('.mp3')).map(function(fileName) {
    return fileName.substr(0, fileName.length - 4)
});
module.exports = {
    name: 'list',
    aliases: ['list', 'l'],
    description: 'List all songs! Lists 20 songs in each page',
    usage: '!<list|l> offset',
    guildOnly: false,
    args: true,
	async execute(message, args, queue) { 
        if (isNaN(args[0])) {
            message.channel.send("Invalid offset");
            return;
        }
        message.author.send(files.slice(args[0], args[0]+20));
        message.channel.send("List has been sent in DM");
	},
};