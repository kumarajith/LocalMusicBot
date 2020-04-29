const fs = require('fs');
const { musicpath } = require('../config.json');
const files = fs.readdirSync(musicpath).filter(file => file.endsWith('.mp3')).map(function(fileName) {
    return fileName.substr(0, fileName.length - 4)
});
const playCommand = require('./play.js');
module.exports = {
    name: 'list',
    aliases: ['list', 'l'],
    description: 'List all songs! Lists 20 songs in each page',
    usage: '!<list|l> [offset]',
    guildOnly: true,
    args: false,
	async execute(message, args, queue) {
        const adjustPageNumber = (number) => {
            if (number > (files.length/10)) {
                number = Math.round(files.length/10) - 1;
            } else if (number < 0) {
                number = 0;
            }
            return number;
        }
        let offset = 0;
        if (args.length !== 0 && !isNaN(args[0])) {
            offset = adjustPageNumber(args[0]);
        }
        const emojiMap = ['1⃣','2⃣','3⃣','4⃣','5⃣','6⃣','7⃣','8⃣','9⃣','🔟'];
        const filter = (reaction, user) => {
            return (reaction.emoji.name === '⬅️' || reaction.emoji.name === '➡️' || emojiMap.includes(reaction.emoji.name)) && user.id === message.author.id;
        };
        let listMessage = undefined;
        async function listPages(listPage) {
            listPage = adjustPageNumber(listPage);
            let fileSlice = files.slice((listPage*10) + 0, (listPage*10) + 10);
            let fileSliceFormatted = fileSlice.map((currElement, index) => {
                return (index+1) + '. ' + currElement;
            });
            if (listMessage === undefined) {
                listMessage = await message.channel.send(fileSliceFormatted);
                listMessage.react('⬅️')
                    .then(() => listMessage.react('1⃣'))
                    .then(() => listMessage.react('2⃣'))
                    .then(() => listMessage.react('3⃣'))
                    .then(() => listMessage.react('4⃣'))
                    .then(() => listMessage.react('5⃣'))
                    .then(() => listMessage.react('6⃣'))
                    .then(() => listMessage.react('7⃣'))
                    .then(() => listMessage.react('8⃣'))
                    .then(() => listMessage.react('9⃣'))
                    .then(() => listMessage.react('🔟'))
                    .then(() => listMessage.react('➡️'));
            } else {
                listMessage.edit(fileSliceFormatted);
            }
            listMessage.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();
                    reaction.users.remove(message.author.id);
                    if (reaction.emoji.name === '⬅️') {
                        listPages(listPage-1);
                    } else if (reaction.emoji.name === '➡️') {
                        listPages(listPage+1);
                    } else {
                        itemNumber = emojiMap.indexOf(reaction.emoji.name);
                        playCommand.execute(message, [fileSlice[itemNumber]], queue);
                        listPages(listPage);
                    }
                })
                .catch(() => {listMessage.delete()});
        }
        listPages(offset);
	},
};