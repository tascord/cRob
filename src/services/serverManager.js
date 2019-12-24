const fs = require('fs');
const Canvas = require('canvas');
const Discord = require('discord.js');

if(!fs.existsSync('./src/services/servers/servers.json')) fs.writeFileSync('./src/services/servers/servers.json', '[]');
var servers = JSON.parse(fs.readFileSync('./src/services/servers/servers.json'));

function getServer(serverID) {

    for(var i = 0; i < servers.length; i++) {
        if(servers[i].id === serverID) return servers[i];
    }

    return false;

}

function createServer(server) {

    for(var i = 0; i < servers.length; i++) {
        if(servers[i].id === server.id) return false;
    }


    if(!server.id || !server.ownerId) return false;

    servers.push(server);
    update();

    return server;

}

function modifyServer(serverID, server) {

    var _servers = [];

    for(var i = 0; i < servers.length; i++) {
        if(servers[i].id != serverID) _servers.push(servers[i]);
        else _servers.push(server);
    }

    servers = _servers;
    update();

}

function update() {
    fs.writeFileSync('./src/services/servers/servers.json', JSON.stringify(servers, null, 4));
}

function sendModMessage(client, serverID, modMessage) {

    var server = getServer(serverID);
    if(server === false) return false;

    var guild   = client.guilds.get(server.id);
    var channel = guild.channels.get(server.modLog);

    const embed = new Discord.RichEmbed()
    .setColor(0x7289da);
        
    if(!client.guilds.get(server.id).me.permissions.has(['SEND_MESSAGES']) || !channel) {
        embed.setTitle("Can't send message!");
        embed.setDescription("Hello!\nEither you haven't specified a ModLog channel, or the channel specified dosen't exist. Either way, I need to deliver a message to you.\n\n" + modMessage);
        return client.users.get(server.ownerId).send(embed);
    }
    
    embed.setTitle("New ModLog");
    embed.setDescription(modMessage);

    channel.send(embed);
    

}


async function sendWelcomeMessage(client, serverID, topText, middleText, bottomText, memberName, memberImage, memberCount, sizing) {

    const applyText = (canvas, text) => {
        const ctx = canvas.getContext('2d');
        let fontSize = 70;
    
        do {
            ctx.font = `${fontSize -= 5}px sans-serif`;
        } while (ctx.measureText(text).width > canvas.width - 300);
    
        return ctx.font;
        
    };

    var server = getServer(serverID);
    if(server === false) return false;
    if(!server.welcome.channel || !client) return false;

    if(!topText || !middleText || !bottomText) return false;

    if(!memberName) memberName = "";
    if(!memberCount) memberCount = 0;
    if(!memberImage) memberImage = client.user.avatarURL;

    if(!sizing) sizing = [];
    if(!sizing[0]) sizing = [3.5, 1.75, 1.3];
    if(!sizing[1]) sizing[1] = 1.75;
    if(!sizing[2]) sizing[2] = 1.3;

    if(typeof topText != "message") topText    = `${topText}`;
    if(typeof topText != "message") middleText = `${middleText}`;
    if(typeof topText != "message") bottomText = `${bottomText}`;

    var countText = `${memberCount + 1}`;
    if(countText[countText.length] == "1")      countText += "st"; 
    else if(countText[countText.length] == "2") countText += "nd"; 
    else if(countText[countText.length] == "3") countText += "rd"; 
    else                                        countText += "th"; 
    
    while(topText.indexOf('%c') > -1 || middleText.indexOf('%c') > -1 || bottomText.indexOf('%c') > -1) {
        topText    = topText.replace('%c', countText);
        middleText = middleText.replace('%c', countText);
        bottomText = bottomText.replace('%c', countText);
    }

    while(topText.indexOf('%n') > -1 || middleText.indexOf('%n') > -1 || bottomText.indexOf('%n') > -1) {
        topText    = topText.replace('%n', memberName);
        middleText = middleText.replace('%n', memberName);
        bottomText = bottomText.replace('%n', memberName);
    }   

    var backgroundURL = server.welcome.image || "http://tascord.ai/media/default_member_join.png";

    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');
    
    background = await Canvas.loadImage(backgroundURL);
            
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
    ctx.font = applyText(canvas, topText);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(topText, canvas.width / 2.5, canvas.height / sizing[0]);
    
    ctx.font = applyText(canvas, middleText);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(middleText, canvas.width / 2.5, canvas.height / sizing[1]);
    
    ctx.font = applyText(canvas, bottomText);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(bottomText, canvas.width / 2.5, canvas.height / sizing[2]);
       
    if(memberImage != undefined) {
        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await Canvas.loadImage(memberImage);
        ctx.drawImage(avatar, 25, 25, 200, 200);
    }
    
    const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');
    
    var channel = client.guilds.find(g => g.id === server.id).channels.get(server.welcome.channel);
    if(!channel) return sendModMessage(client, server.id, "The welcome channel you've provided, no longer exists!");
    
    channel.send('', attachment);

}

// Triggerable Functions
exports.modifyServer       = modifyServer;
exports.getServer          = getServer;
exports.createServer       = createServer;
exports.sendModMessage     = sendModMessage;
exports.sendWelcomeMessage = sendWelcomeMessage;