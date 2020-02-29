const fs = require('fs');
const Canvas = require('canvas');
const Discord = require('discord.js');

const db = require('quick.db');
const servers = new db.table('servers');

function getServer(serverID) {

    if(servers.has(serverID)) return servers.get(serverID);
    return createServer({id: serverID, ownerID: '000000000000000', rolepicker: [], roles: [], channels: [], pallettes: [], welcome: {channel: '', image: ''}, modifyUsers: []});

}

function createServer(server) {
  
    if(servers.has(server.id)) return false; 
    servers.set(server.id, server); 

    return server;

}

function modifyServer(serverID, server) {
    servers.set(serverID, server);
}

function update() {
    fs.writeFileSync('./src/services/servers/servers.json', JSON.stringify(servers, null, 4));
}

function sendModMessage(client, serverID, modMessage) {

    if(!servers.has(serverID)) return false;
    var server = servers.get(serverID);

    var guild   = client.guilds.get(server.id);
    var channel = guild.channels.get(server.modLog);

    const embed = new Discord.RichEmbed()
        .setColor(0x7289da);

        
    if(!client.guilds.get(server.id).me.permissions.has(['SEND_MESSAGES']) || !channel) {
        embed.setTitle("Can't send message!");
        embed.setDescription("Hello!\nEither you haven't specified a ModLog channel, or the channel specified dosen't exist. Either way, I need to deliver this message to you:\n\n" + modMessage);
        return client.users.get(server.ownerID).send(embed);
    }
    
    embed.setTitle("New ModLog");
    embed.setDescription(modMessage);

    channel.send(embed);

}


async function sendWelcomeMessage(client, serverID, topText, middleText, bottomText, memberName, memberImage, memberCount, sizing) {

    Canvas.registerFont('./src/fonts/OSr.ttf', { family: 'Open Sans' });

    const applyText = (canvas, text) => {
        const ctx = canvas.getContext('2d');
        let fontSize = 60;
    
        do {
            ctx.font = `${fontSize -= 5}px Open Sans`;
        } while (ctx.measureText(text).width > canvas.width - 300);
    
        return ctx.font;
        
    };

    if(!servers.has(serverID)) return false;
    var server = servers.get(serverID);
    
    if(!server.welcome.channel || !client) return false;

    if(!topText || !middleText || !bottomText) return false;

    if(!memberName) memberName = "";
    if(!memberCount) memberCount = 0;
    if(!memberImage) memberImage = client.user.avatarURL;

    if(!sizing) sizing = [];
    if(!sizing[0]) sizing = [2.75, 1.85, 1.4];
    if(!sizing[1]) sizing[1] = 1.85;
    if(!sizing[2]) sizing[2] = 1.4;

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

    var backgroundURL = server.welcome.image || "https://raw.githubusercontent.com/tascord/CRob/master/src/Default%20Header.png";

    const canvas = Canvas.createCanvas(1092, 468);
    const ctx = canvas.getContext('2d');
    
    background = await Canvas.loadImage(backgroundURL);
            
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
    ctx.font = applyText(canvas, topText);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(topText, canvas.width / 4, canvas.height / sizing[0]);
    
    ctx.font = applyText(canvas, middleText);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(middleText, canvas.width / 4, canvas.height / sizing[1]);
    
    ctx.font = applyText(canvas, bottomText);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(bottomText, canvas.width / 4, canvas.height / sizing[2]);
       

    if(memberImage != undefined) {
        ctx.beginPath();
        ctx.arc(150, 225, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await Canvas.loadImage(memberImage);
        ctx.drawImage(avatar, 50, 125, 200, 200);
    }
    
    const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');
    
    var channel = client.guilds.find(g => g.id === server.id).channels.get(server.welcome.channel);
    if(!channel) return sendModMessage(client, server.id, "The welcome channel you've provided, no longer exists!");
    
    channel.send('', attachment);

}

function getServersByModify(userID) {

    var serversOutput = []; 
    var serverList = servers.all();

    for(var i = 0; i < serverList.length; i++) {

        var server = servers.get(serverList[i].ID);

        for(var j = 0; j < server.modifyUsers.length; j++) {
            if(server.modifyUsers[j] == userID) serversOutput.push(server);
        }
    }

    return serversOutput;

}

// Triggerable Functions
exports.modifyServer       = modifyServer;
exports.getServer          = getServer;
exports.createServer       = createServer;
exports.sendModMessage     = sendModMessage;
exports.sendWelcomeMessage = sendWelcomeMessage;
exports.getServersByModify = getServersByModify;