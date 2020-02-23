exports.run = (client, message, args, send, createEmbed, config, fs, Discord) => {

    send(createEmbed('', '', '', `Pong! ${Math.trunc(client.ping * 10) / 10}ms`));

}