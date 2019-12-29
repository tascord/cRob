exports.run = (client, message, args, send, createEmbed, config, fs, Discord) => {

   send(createEmbed(``, [], `[Invite Me To Your Server!](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=0)`))


}