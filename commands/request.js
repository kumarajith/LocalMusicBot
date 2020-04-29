const fs = require('fs');
module.exports = {
    name: 'request',
    aliases: ['r', 'request'],
    description: 'Request a song!',
    guildOnly: true,
    args: true,
	async execute(message, args, queue) {
        fs.appendFile('requests.txt', args.join(' ') + '\n', function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        message.channel.send("Request will be taken into consideration");
	},
};