const fuse = require('fuse.js')
const fs = require('fs');
const { musicpath, prefix } = require('../config.json');
const files = fs.readdirSync(musicpath).filter(file => file.endsWith('.mp3')).map(function(fileName) {
    return {name: fileName}
});
const options = {
    // isCaseSensitive: false,
    // includeScore: false,
    // shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    threshold: 0.3,
    // distance: 100,
    // useExtendedSearch: false,
    keys: ['name']
};
const fuseInstance = new fuse(files, options)
module.exports = {
    name: 'play',
    aliases: ['p', 'play'],
    description: 'Play music!',
    guildOnly: true,
    args: true,
    usage: `${prefix}<play | p> <search terms>`,
	async execute(message, args, queue) {
        const customMessages = {
        }
        if (message.author.id in customMessages) 
        {
            message.channel.send(customMessages[message.author.id]);
        }
        if (message.member.voice.channel) {
            if (args.length > 0) {
                let searchTerm = args.join(' ');
                let matches = fuseInstance.search(searchTerm);
                let fileName = '';
                if (matches.length == 0) {
                    message.channel.send("No matching songs found. Use " + prefix + "r to request the song!");
                    return;
                }
                fileName = matches[0].item.name;
                queue.push(fileName);
                if (queue.length !== 1) {
                    message.channel.send("Added to queue: " + fileName.substr(0, fileName.length - 4));
                }
            } else {
                //Skipping, cannot be accessed using command
                queue.shift();
            }
            const connection = await message.member.voice.channel.join();
            connection.on('error', error => {
                console.log("error in voice connection");
                console.log(error);
                message.channel.send("Error, disconnecting!");
                connection.disconnect();
            })
            let dispatcher = connection.dispatcher;
            if (!dispatcher || args.length === 0) {
                dispatcher = connection.play(musicpath + queue[0]);
                setEvents(dispatcher);
                function setEvents(dispatcher)
                {
                    dispatcher.on('start', () => {
                        message.channel.send("Now playing: " + queue[0].substr(0, queue[0].length-4));
                    });
    
                    dispatcher.on('finish', () => {
                        queue.shift();
                        if (queue.length === 0) {
                            message.channel.send("Queue empty, disconnecting!");
                            connection.disconnect();
                        } else {
                            dispatcher = connection.play(musicpath + queue[0]);
                            setEvents(dispatcher)
                        }
                    });
                }
            }
        } else {
            message.channel.send("You need to be in a voice channel to use this!");
        }
	},
};