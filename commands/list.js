const fs = require('fs');
const { musicpath } = require('../config.json');
const files = fs.readdirSync(musicpath).filter(file => file.endsWith('.mp3')).map(function(fileName) {
    return fileName.substr(0, fileName.length - 4)
});
module.exports = {
    name: 'list',
    aliases: ['list', 'l'],
    description: 'List all songs! Lists 20 songs in each page',
    usage: '!<list|l> [offset]',
    guildOnly: false,
    args: false,
	async execute(message, args, changeListPage) {
        if (args.length == 0) {
            const filter = (reaction, user) => {
                return (reaction.emoji.name === '⬅️' || reaction.emoji.name === '➡️') && user.id === message.author.id;
            };
            let listMessage = undefined;
            async function listPages(listPage) {
                if (listMessage === undefined) {
                    listMessage = await message.channel.send(files.slice((listPage*10) + 0, (listPage*10) + 10));
                    listMessage.react('⬅️').then(() => listMessage.react('➡️'));
                } else {
                    listMessage.edit(files.slice((listPage*10) + 0, (listPage*10) + 10));
                }
                listMessage.awaitReactions(filter, { max: 1, time: 20000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first();
                        reaction.users.remove(message.author.id);
                        if (reaction.emoji.name === '⬅️') {
                            listPages(listPage-1);
                        } else if (reaction.emoji.name === '➡️') {
                            listPages(listPage+1);
                        }
                    })
                    .catch(() => {listMessage.delete()});
            }
            listPages(0);
        } else {
            if (isNaN(args[0])) {
                message.channel.send("Invalid offset");
                return;
            }
            message.author.send(files.slice(args[0], Number(args[0])+10));
            message.channel.send("List has been sent in DM");
        }
	},
};