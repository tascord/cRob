var games = [];

exports.run = (client, message, args, send, createEmbed, config, fs, Discord) => {
   
    if(message.deletable) message.delete();

    if(!games[message.author.id]) {
        if (args[0] != "start") return send(createEmbed("You don't have a game started yet. Try `count start`."), 10);
        else {
            send(createEmbed("Starting!\n", {}, null, client.user.username + " vs " + message.author.username), 5);
            games[message.author.id] = {"turn": false, count: 0};
            return send(createEmbed("Aim **21**\nIncrement by: *1*, *2* or *3*\n\nIncrease with `count <number>`", {}, null, client.user.username + " vs " + message.author.username), 60);
        }
    } else {
        var game = games[message.author.id];
    }
    
    if (!args[0]) {
        return send(createEmbed("You didn't provide a number to increase by", {}, null, client.user.username + " vs " + message.author.username), 60);
    } else if (isNaN(args[0]) || parseInt(args[0]) > 3 || parseInt(args[0]) < 1) {
        return send(createEmbed("'" + args[0] + "' isn't a valid number or is outside of range [1 - 3]", {}, null, client.user.username + " vs " + message.author.username), 60);
    }


    game.count += parseInt(args[0]);
    
    if(game.count >= "21") {
        games[message.author.id] = null;
        return send(createEmbed("You beat me! GG"));
    }

    send(createEmbed("**Count:** *" + game.count + "*, **Target:** *21* | It's my turn", 120));  
    
    var cnt = (21 - game.count) % (1 + 3);
    if(cnt == 0) cnt = 3;

    send(createEmbed("I increment by **" + cnt + "**", {}, null, client.user.username + " vs " + message.author.username), 120);
    game.count += cnt;

    if(game.count >= "21") {
        games[message.author.id] = null;
        return send(createEmbed("I appear to have bested you. Good Game", {}, null, client.user.username + " vs " + message.author.username), 60);
    }

    send(createEmbed("**Count:** *" + game.count + "*, **Target:** *21* | It's your turn", {}, null, client.user.username + " vs " + message.author.username), 60);  

}

