//Require, Instantiate & Login Discord.js
const Discord = require('discord.js');
const client = new Discord.Client();
client.login('NDcwODU5NzAwMDc5MTY1NDUw.Dv3PFA.KYFvrrfgZyYnyh2C8SPzdJ-66qA');

//Musicbot
const ytdl = require('ytdl-core')
var opus = require('opusscript');
var YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey('AIzaSyClGTsC0x4-n-RJCSEGV63dlWVsGzQjltU');

//Databases
const Sequelize = require('sequelize');

const sequelize = new Sequelize('serverDatabase', 'Username', 'Password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'userData.sqlite',
});

const userData = sequelize.define('userDataTable', {
    userid:{
        type: Sequelize.INTEGER,
        unique: true,
    },
    warnings: Sequelize.INTEGER
});

//Important Vars

//Branding
var hexCode = 0x7289da;
var serverIcon = 'http://tascord.ga/wp-content/uploads/2018/12/cakeIcon.png?fit=128%2C128';

//Prefix
var prefix = "c!";

//Bot Activity (e.g Playing:  Epic Gamer123);
var activity = ` for commands: (${prefix})`;
var activity_type = "WATCHING"; //PLAYING, WATCHING, STREAMING or LISTENING

//Musicbot
var c_dispacher;
var c_queue = [];
var c_current;

//Command Lists
var chatCommands = ["**Help:** Shows you this!"];
var musicCommands = ["**Play: `[url / search term]`** Searches for, then queues a song", "**Skip:** Skip the current song", "**Queue:** What is playing next"]
var funCommand = ["**Preston:** Shows you god", "**Coin:** Flips a coin!", "**AliA:** Show's you an original thumbnail"];
var adminCommand = ["**Mute / Unmute `[user]`:** Mutes or unmutes the user tagged", "**Ci `[value]`:** Clears the specified number of messages"];

// ADMIN ID LIST, BE CAREFULL ADDING PEOPLE
var overideId = [205643558210895872, 205811939861856257];

//Mutes & Warns
var c_muteable = ["kys", "kill yourself", "kill urself", "discord.gg"];
var c_warnable = ["nigga", "cunt", "bitch", "fuck", "shit", "rape"];
var c_warningMax = 3;

//Channels
var c_guildId = 469773639437516810;
var c_announcements = 'announcements';
var c_qotd = 'qotd';
var c_modLog = 'mod-log';

//Roles
var c_adminRole = 'Admin';
var c_modRole = 'Moderator';
var c_helperRole = 'Helper';
var c_mutedRole = 'Muted';

//TBD Vars (To Be Declared)
var c_adminList;
var c_modList;
var c_helperList;
var c_mutedList;
var c_reactYes;
var c_reactNo;
var serverMembers;

//Emoji
var c_yes = 'yes';
var c_no = 'no';

//VIP List
var assignRole;

// VIP List Id's
var cake = 205643558210895872;
var telie = 205811939861856257;
var bread = 246156000707608576;

// VIP List Roles
var r_cake = "Cake's VIP";
var r_telie = "Telie's VIP";
var r_bread = "Bread's VIP";

//Misc
var prestonPics = ['2018/12/anger', '2018/12/funniexplode', '2018/12/noway', '2018/12/owch', '2018/12/pancake', '2018/12/pretty', '2018/12/rlly', '2018/12/shh', '2018/12/tense', '2018/12/thonk', '2018/12/ugh', '2018/12/wot', '2018/12/yey'];
var aliaPics = ['1', '2', '3', '4', '5'];

/** Rest Of Code **/

/**
Command Functions
**/

//Find Role
function findRole(roleName, message) {
   if (message.member.guild.roles.find(role => role.name === roleName)) return message.member.guild.roles.find(role => role.name === roleName);
   else console.log(`Invalid Role Name Provided In findRole Function : ${roleName}`);
}

function findChannel(channelName, message) {
   if (message.member.guild.channels.find(channel => channel.name === channelName)) return message.member.guild.channels.find(channel => channel.name === channelName);
   else console.log(`Invalid Role Name Provided In findRole Function : ${channelName}`);
}

//Check Users Permission
function staffLevel(message) {
  var c_adminList = findRole(c_adminRole, message).members.map(m=>m.user.id);
  var c_modList = findRole(c_modRole, message).members.map(m=>m.user.id);
  var c_helperList = findRole(c_helperRole, message).members.map(m=>m.user.id);

  for (var i in c_adminList) {
    if (c_adminList[i] === message.author.id) return "Admin";
  }

  for (var i in c_modList) {
    if (c_modList[i] === message.author.id) return "Mod";
  }

  for (var i in c_helperList) {
    if (c_helperList[i] === message.author.id) return "Helper";
  }

  return "None";

}

/**
Musicbot stuff
**/

function playSong(connection, message) {

  c_dispacher = connection.playStream(ytdl(c_queue[0], {filter: "audioonly"}));
  c_queue.shift();

  c_dispacher.on("end", function(message) {
    console.log('Ending');
    if(c_queue[0]) {
      console.log('Continuing');
      playSong(connection);
      message.member.voiceChannel.join().then(function(connection) { playSong(connection) });
    }
    else {
      connection.disconnect();
      console.log('Disconnecting');
    }
  })

}



//Log Mod Actions
function logMod(action, args, message) {

  args.shift();

  const embed = new Discord.RichEmbed()
    .setTitle(`${action} Log on ${message.member.guild.name}`)
    .setColor(hexCode)
    .addField(`User Affected: `, message.mentions.members.first().user.username + '#' + message.mentions.members.first().user.discriminator, true)
    .addField(`Staff Inforcer: `, message.author.tag, true)
    .addField('Reason: ', args.join(' '));
  findChannel(c_modLog, message).send({ embed });
  message.mentions.members.first().send({ embed });

}

//Text cleaning
function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

// Once Bot Is Ready
client.once('ready', () => {
  console.log(`Logged In As: ${client.user.tag}`);
  client.user.setActivity(activity, {type: activity_type});
  userData.sync();

  //Set GuildMembers
  guildMembers = client.guilds.map(g=>g)[0].members.map(m=>m);

  //Set Emoji
  c_reactYes = client.guilds.map(g=>g)[0].emojis.find(emoji => emoji.name == c_yes).id;
  c_reactNo = client.guilds.map(g=>g)[0].emojis.find(emoji => emoji.name == c_no).id;
  c_yes = `<:${c_yes}:${client.guilds.map(g=>g)[0].emojis.find(emoji => emoji.name == c_yes).id}>`;
  c_no = `<:${c_no}:${client.guilds.map(g=>g)[0].emojis.find(emoji => emoji.name == c_no).id}>`;

});

// On Message
client.on('message', async message => {

//Make sure things sending command is user
if (message.author.bot) return;

// Command and args setup
const args = message.content.slice(prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();

/**
  -=- Cake Only Code -=-
**/

try{
if (message.guild.id != 469773639437516810) {
  console.log("Leaving: " + message.guild.name + ". FFTC: " + message.guild.owner.tag);
  message.guild.leave();
}
} catch (e) {}
/**
  -=- Cake Only Code -=-
**/

//Make Sure Message Has Prefix
if (message.content.toLowerCase().indexOf(prefix) !== 0) return;

//Get Userdata if it exists
try {
    currentUserData = await userData.findOne({ where: { userid: message.author.id } });
} catch (e) { }

//Is User In The Overide List
for (var i = 0; i < overideId.length; i++) {
  if (message.author.id == overideId[i]) var userOveride = true;
}

//Test Command
if(command === "test") return;

/**
This Command Is By Far The Most Dangerous!
-=-
DO NOT MODIFY IT UNLESS YOU KNOW
EXACTLY WHAT YOUR DOING
**/

if (command === "eval") {
if (!userOveride) return message.reply(c_no + " You Can't Perform That Action");
  try {
    const code = args.join(" ");
    let evaled = eval(code);

      if (typeof evaled !== "string") {
        evaled = require("util").inspect(evaled);
        message.channel.send(clean(evaled), {code:"xl"});
      }

  } catch (err) {
    message.channel.send(`**Error Running Command:**\n${clean(err)}`);
  }
}

/**
End Of Dangerous Code
**/

if (command === "help") {
  const embed = new Discord.RichEmbed()
    .setTitle(`**${client.user.username} Help**\nBot prefix is '${prefix}'`)
    .setColor(hexCode)
    .setThumbnail(serverIcon)
    .addField('Chat Commands', chatCommands.join('\n'))
    .addField('Music Commands', musicCommands.join('\n'))
    .addField('Fun Commands', funCommand.join('\n'))
    .addField('Admin Commands', adminCommand.join('\n'));
  message.channel.send({ embed });
}

if (command === "mute") {
  if(staffLevel(message) == "None") return message.reply(c_no + "No Permission");
  if(!message.mentions.members.first()) return message.reply(c_no + "No User Specified");

  message.mentions.members.first().addRole(findRole(c_mutedRole, message));
  message.reply(`${c_yes} ${message.mentions.members.first()} has been **Muted**!`);
  if (!args[1]) var parsedArgs = [' ', "No Given Reason"];
  else var parsedArgs = args;

  logMod("Mute", parsedArgs, message);
}

if (command === "unmute") {
  if(staffLevel(message) == "None") return message.reply(c_no + "No Permission");
  if(!message.mentions.members.first()) return message.reply(c_no + "No User Specified");

  message.mentions.members.first().removeRole(findRole(c_mutedRole, message));
  message.reply(`${c_yes} ${message.mentions.members.first()} has been **Un-Muted**!`);
  if (!args[1]) var parsedArgs = [' ', "No Given Reason"];
  else var parsedArgs = args;
}

//Question Of The Day
if (command === "qotd") {

  if(staffLevel(message) != "Admin") return message.reply(c_no + "You Can't Perform That Action");
  if (!args[0]) return message.reply(c_no + "Please Provide A Question!");

  message.delete();

  findChannel(c_qotd, message).send(`@everyone\n\n**Question of the Day!**\n${args.join(" ")}`)
  .then(function (message) {
    message.react(c_reactNo)
    message.react(c_reactYes)
  });
}

if (command === "warning") {
  if (args[1]) return message.reply(c_no + 'Please provide a valid argument, `warning [none / user]`');

  if (!args[0]) {
    message.reply(`You have **${currentUserData.get('warnings')}** warning(s) / 3.`);
  }

  if (message.mentions.members.first()) {
    currentUserData = await userData.findOne({ where: { userid: message.mentions.members.first().id } });
    message.reply(`${message.mentions.members.first().user.username} has **${currentUserData.get('warnings')}** warning(s) / 3.`);
  }

}

if (command === "add") {
  if (message.author.id != cake && message.author.id != telie && message.author.id != bread) return message.reply(c_no + " You Can't Perform That Action");
  if (!message.mentions.members.first()) return message.reply(c_no + " Please Specify A Single User To Add And A Role");

  if (message.author.id == cake) assignRole = message.guild.roles.find("name", r_cake);
  if (message.author.id == telie) assignRole = message.guild.roles.find("name", r_telie);
  if (message.author.id == bread) assignRole = message.guild.roles.find("name", r_bread);

  message.mentions.members.first().addRole(assignRole);
  message.channel.send(`${c_yes} User ${message.mentions.members.first()} added to **${assignRole.name}** List`);
}

if (command === "remove") {
  if (message.author.id != cake && message.author.id != telie && message.author.id != bread) return message.reply(c_no + " You Can't Perform That Action");
  if (!message.mentions.members.first()) return message.reply(c_no + " Please Specify A Single User To Remove And A Role");

  if (message.author.id == cake) assignRole = message.guild.roles.find("name", r_cake);
  if (message.author.id == telie) assignRole = message.guild.roles.find("name", r_telie);
  if (message.author.id == bread) assignRole = message.guild.roles.find("name", r_bread);

  message.mentions.members.first().removeRole(assignRole);
  message.channel.send(`${c_yes} User ${message.mentions.members.first()} removed from **${assignRole.name}** List`);
}

if (command === "ci") {
  if (!args[0]) return message.reply(c_no + "Please specify an amount of messages to remove");
  if (args[0].isNaN) return message.reply(c_no + "Value provided is not a number");
  if (args[0] >= 100) return message.reply(c_no + "Value must be less than 100");

  let messagecount = parseInt(args[0]);
  message.channel.fetchMessages({limit: (messagecount + 1)}).then(messages => message.channel.bulkDelete(messages));
  message.reply(`${c_yes} **Cleared ${args[0]} messages.**`)
  .then(function (message) {
    setTimeout(function () {
      message.delete();
    }, 3000);
  });
}


if (command === "coin") {
    var flipres = Math.random() * (100 - 1) + 1;
    if (flipres > 51) {
        message.channel.send("**Heads!**");
    } else if (flipres < 49) {
        message.channel.send("**Tails!**");
    } else {
        message.channel.send("**It Landed On The Side!**");
    }
}

if (command === "preston") {
  message.delete();
  var prestonPicked = prestonPics[Math.floor(Math.random()*prestonPics.length)];
  const embed = new Discord.RichEmbed()
    .setTitle(`${message.author.username}'s Preston`)
    .setColor(hexCode)
    .setImage(`http://tascord.ga/wp-content/uploads/${prestonPicked}.png`)
    message.channel.send({ embed });
}

if (command === "alia") {
  message.delete();
  var aliaPicked = aliaPics[Math.floor(Math.random()*aliaPics.length)];
  const embed = new Discord.RichEmbed()
    .setTitle(`${message.author.username}'s Ali-A`)
    .setColor(hexCode)
    .setImage(`https://thecactivecake.com/wp-content/uploads/2018/12/${aliaPicked}.png`)
    message.channel.send({ embed });
}

if (command === "play") {
  if (!args[0]) return message.reply("Invalid URL / Search Term Provided");
  if (!message.member.voiceChannel) return message.reply("**You Aren't In A Voice Channel**");


  if (args[0].indexOf('youtube.com/watch?v=') > -1) {

    var searchTerm = args[0].slice(args[0].search("/watch") + 9);
    var title = "Searching with URL";

  } else {

     var searchTerm = args.join(" ");
     if (args.join(" ").length > 15) {
       var title = `Searching For: "${args.join(" ").slice(0, 20)}..."`;
     } else {
       var title = `Searching For: "${args.join(" ")}"`;
     }
  }

    youTube.search(searchTerm, 2, function(error, result) {

      if (!result.items[0]) return message.reply("Search Failed. Either Invalid URL Provided Or No Results Found");

      var hit = result.items[0].snippet;

      const embed = new Discord.RichEmbed()
        .setTitle(title)
        .setColor(hexCode)
        .setThumbnail(hit.thumbnails.default.url)
        .addField("Title:", hit.title)
        .addField("Channel:", hit.channelTitle)
        .addField("Link:", `https://www.youtube.com/watch?v=${result.items[0].id.videoId}`)

        message.channel.send({ embed });
        c_queue.push(`https://www.youtube.com/watch?v=${result.items[0].id.videoId}`);

        if (!message.guild.voiceConnection) {
          message.member.voiceChannel.join()
            .then(function(connection) {
            playSong(connection);
          })
        }

   });

}

if (command === "skip") {
  if(c_dispacher) {
    c_dispacher.end(message);
    message.reply(c_yes + "Skipped!");
  } else message.channel.send(c_no + "Nothing is playing!")
}

if (command === "earrape") {
  if(!c_dispacher) return message.reply(c_no + "Nothing is playing!");
  if(staffLevel(message) == "None") return;
  if(c_dispacher.volume === 2000) {
    c_dispacher.setVolume(1);
    message.channel.send('**Volume level:** Normal');
  } else {
    c_dispacher.setVolume(2000);
    message.reply('**Volume level:** F');
  }

}

//End commands
});

//Non Command Chat Triggers
client.on('message', async message => {

if (message.author.bot) return;
if (staffLevel(message) === "Admin") return;

//Create User Data If None Exists
try {
    const setupUserData = await userData.create({
        userid: message.author.id,
        warnings: 0
    });
    console.log(`${message.author.tag} added to Database`);
}
catch (e) {
    if (!e.name === 'SequelizeUniqueConstraintError') {
      console.log('Something went wrong with adding the server data.');
    }
}

try {
    currentUserData = await userData.findOne({ where: { userid: message.author.id } });
} catch (e) { }

var trigger = message.content;

for (var i = 0; i < c_warnable.length; i++) {
  if(trigger.indexOf(c_warnable[i]) > -1) {
    try { message.delete(); } catch (e) {}
    await userData.update({ warnings: currentUserData.get('warnings') + 1 }, { where: { userid: message.author.id } });
    if (currentUserData.get('warnings') > c_warningMax) {
      message.member.addRole(findRole(c_mutedRole, message));
      const embed = new Discord.RichEmbed()
        .setTitle(`CRB > AutoMute`)
        .setColor(hexCode)
        .addField(`User Muted: `, message.author.tag, true)
        .addField('Reason: ', `Surpassing ${c_warningMax} Warnings`);
      findChannel(c_modLog, message).send({ embed });
      message.author.send({ embed });
      findChannel(c_modLog, message).send('<@' + message.author.id + '>')
      .then(function (message) {
          message.delete();
      });
      await userData.update({ warnings: 0 }, { where: { userid: message.author.id } });
    } else {
      const embed = new Discord.RichEmbed()
        .setTitle(`CRB > AutoWarn`)
        .setColor(hexCode)
        .addField(`User Warned: `, message.author.tag, true)
        .addField('Reason: ', 'Inapropriate Language');
      findChannel(c_modLog, message).send({ embed });
      message.author.send({ embed });
      findChannel(c_modLog, message).send('<@' + message.author.id + '>')
      .then(function (message) {
          message.delete();
      });
    }

  }
}

for (var i = 0; i < c_muteable.length; i++) {
  if(trigger.indexOf(c_muteable[i]) > -1) {
    try { message.delete(); } catch (e) {}
    message.member.addRole(findRole(c_mutedRole, message));
    const embed = new Discord.RichEmbed()
      .setTitle(`CRB > AutoMute`)
      .setColor(hexCode)
      .addField(`User Muted: `, message.author.tag, true)
      .addField('Reason: ', 'Breach of rules');
    findChannel(c_modLog, message).send({ embed });
    message.author.send({ embed });
    findChannel(c_modLog, message).send('<@' + message.author.id + '>')
    .then(function (message) {
        message.delete();
    });
  }
}
});
