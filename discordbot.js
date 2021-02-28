module.exports = {
  Start: function () {
    console.log('[DISCORD] Client is starting up...');
    client.login(process.env.DISCORD_TOKEN);
  },
  SendMessage: function(channel, message) {
    client.channels.cache.get(`809509282072100896`).send(message)
  }
};

require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
//const LCDController = require('./lcdcontroller');

client.once('ready', onReadyHandler);
client.on('message', onMessageHandler);

function onReadyHandler() {
  console.log('[DISCORD] Client is Ready!');
}

function onMessageHandler(msg)
{
  //LCDController.Clear();
  //LCDController.SetText(1, msg.author.username);
  //LCDController.SetText(2, msg.content);

  if (!msg.content.startsWith("!") || msg.author.bot) return;
  console.log('[DISCORD](' + msg.channel.id  + ') ' + msg.author.username + ": " + msg.content);

  const args = msg.content.slice(1).trim().split(' ');
  const command = args.shift().toLowerCase();

  switch (command)
  {
    case "joke":
    {
      msg.reply("Der Witz? Bist du!");
    }
    return;
  }
}
