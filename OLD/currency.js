//Require, Instantiate & Login Discord.js
const Discord = require('discord.js');
const client = new Discord.Client();
client.login('NDIxMjQyMzk1MjM4MzM0NDY0.DwD8Jw.ZX8sZG7HK0KAO0mhNKaHf2uVgGU');



//Important Vars

//Branding
var hexCode = 0xffc740;
var serverIcon = 'http://tascord.ga/wp-content/uploads/2018/12/cakeIcon.png?fit=128%2C128';

//Shop Items
var c_items = require('./items.json');

//Prefix
var prefix = 'c$';

//Overide IDs
var overideId = [205643558210895872, 205811939861856257];

//Emoji
var c_dollar = "<:dollar:526363396166254592>";

//Help me
var helpCommands = ['**Bal:** Checks your balance', '**Shop / Store:** What you can buy from the store', '**Help:** What your looking at', '**Buy:** Buy something from the store'];

//End Of Important Vars



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
  balance: Sequelize.INTEGER
});



//Once Bot Ready
client.once('ready', () => {
  client.user.setActivity("the money: (c$)", {type: "WATCHING"});
  console.log(`Logged in as: ${client.user.tag}`);
  userData.sync();
});



//On Message
client.on('message', async message => {

//Return If Bot
if(message.author.bot) return;

//Setup userdata if none exists
try {
    const setupUserData = await userData.create({
        userid: message.author.id,
        balance: 0
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

//Give user currency per message
if(message.channel.name != "spam") await userData.update({balance: (currentUserData.get('balance') + 1)}, {where: {userid: message.author.id}});

//Get Commands & Args
if (message.content.toLowerCase().indexOf(prefix) !== 0) return;
const args = message.content.slice(prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();

//Commands
if (command === "balset") {
  if(message.author.id != 205643558210895872 && message.author.id != 205811939861856257) return;
  if(!args[1] || isNaN(args[1]) || !message.mentions.members.first()) return message.reply("Please specify both a user and an amount");
  try {
    await userData.update({balance: args[1]}, {where: {userid: message.mentions.members.first().id}});
  } catch (e) { message.reply('User hasnt got data'); }
  message.reply('Users balance updated');
}

if (command === "bal") {
  if(message.mentions.members.first()) {
    currentUserDataTwo = await userData.findOne({ where: { userid: message.mentions.members.first().id } })
    .then(function() {
      const embed = new Discord.RichEmbed()
        .setTitle(`**${message.mentions.members.first().user.username}'s Bank Account**`)
        .setColor(hexCode)
        .setThumbnail(message.mentions.members.first().user.avatarURL)
        .addField('Balance', `**${c_dollar}${currentUserDataTwo.get('balance')}**`)
      message.channel.send({ embed });
    });
  } else {
    const embed = new Discord.RichEmbed()
      .setTitle(`**${message.author.username}'s Bank Account**`)
      .setColor(hexCode)
      .setThumbnail(message.author.avatarURL)
      .addField('Balance', `**${c_dollar}${currentUserData.get('balance')}**`)
    message.channel.send({ embed });
  }
}

if (command === "shop" || command === "store") {
  var currentlyOnSale = [];
  for (var i in c_items) {
    currentlyOnSale.push(`**${c_items[i].name}**: $${c_items[i].price}`);
  }

  const embed = new Discord.RichEmbed()
    .setTitle(`**The General Store**`)
    .setColor(hexCode)
    .addField('Items On Sale', currentlyOnSale.join('\n'))
    .setFooter('Do c$buy to buy something from the store')
  message.channel.send({ embed });
}

if (command === "buy") {
  if(!args[0]) return message.reply("Please specify a product ID. For a list of products do **" + prefix + "store**");
  if(!c_items[args[0]]) return message.reply('Invalid item ID');
  if(c_items[args[0]].price > currentUserData.get('balance')) return message.reply('Insufficent funds.');

  if (c_items[args[0]].type == "role") {
    var assignRole = message.member.guild.roles.find(role => role.name === c_items[args[0]].rolename);
    if(!assignRole) return message.reply('Error in items.json, contant mods pls ty <3');
    await userData.update({balance: (currentUserData.get('balance') - c_items[args[0]].price)}, {where: {userid: message.author.id}});
    message.member.addRole(assignRole);
    message.reply(`You bought **${c_items[args[0]].name.slice(3)}**`);

  }
}

if (command === "pay") {
  if(!args[1] || !message.mentions.members.first() || isNaN(args[1])) return message.reply("Please specify a user and and an amount to pay");
  if(args[1] > currentUserData.get('balance')) return message.reply('Insufficent funds');
  currentUserDataTwo = await userData.findOne({ where: { userid: message.mentions.members.first().id } });
  await userData.update({balance: (currentUserData.get('balance') - args[1])}, {where: {userid: message.author.id}})
  await userData.update({balance: (currentUserDataTwo.get('balance') + args[1])}, {where: {userid: message.mentions.members.first().id}});
  message.channel.send(`<@${message.author.id}> sent $${args[1]} to ${message.mentions.members.first()}!`);
}

if (command === "help") {
  const embed = new Discord.RichEmbed()
    .setColor(hexCode)
    .setThumbnail(serverIcon)
    .addField('**CactiveCurrency Help**', helpCommands.join('\n'))
  message.channel.send({ embed });
}

});
