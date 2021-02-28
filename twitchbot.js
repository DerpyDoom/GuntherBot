module.exports = {
  Start: function () {
    console.log('[TWITCH] Client is starting up...');
    client.connect();
  },
  SendMessage: function (text) {
    client.say(process.env.CHANNEL_NAME, text);
  }
};

//ENV Setup
require('dotenv').config()

//Libraries und Weiteres
const db = require('./db');
const tmi = require('tmi.js');
const DiscordClient = require('./discordbot');
const HomeAssistant = require('homeassistant');
const hass = new HomeAssistant({
  // Your Home Assistant host
  // Optional, defaults to http://locahost
  host: process.env.HASS_URL,

  // Your Home Assistant port number
  // Optional, defaults to 8123
  port: process.env.HASS_PORT,

  // Your long lived access token generated on your profile page.
  // Optional
  token: process.env.HASS_TOKEN,

  // Your Home Assistant Legacy API password
  // Optional
  // password: 'api_password',

  // Ignores SSL certificate errors, use with caution
  // Optional, defaults to false
  ignoreCert: process.env.HASS_IGNORECERT
});

//Twitch Client
const opts = {
  options: {
    debug: false
  },
  connection: {
    reconnect: true
  },
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};

const client = new tmi.client(opts);

//Günther Funktionen
var QueueStatus = true; //Queue Status, False = Zu, True = Auf

//Events

client.on('connected', onConnectedHandler);
client.on('message', onMessageHandler);

//Handlers

function onConnectedHandler (addr, port) {
  hass.states.get('switch', 'psock1').then(function(switchState) {
    console.log("[HASSIO] Ventilator: " + switchState.state);
  }).catch(function(e) {
    throw e;
  });
  console.log('[TWITCH] Connected to Twitch Chat!');
//  client.say(process.env.CHANNEL_NAME, 'Schwenkt die Fahnen, Günther ist da!');
}

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function onMessageHandler (target, context, msg, self) {
  if (self) return;

  if(context["custom-reward-id"] === "eacf3f75-3b80-46f3-bdc8-de3d390be7e5")
  {
    console.log("Custom Reward detected! Id:" + context["custom-reward-id"]);

    hass.states.get('switch', 'psock1').then(function(switchState) {
      console.log("[HASSIO] Ventilator: " + switchState.state);
      if(switchState)
      {
        hass.services.call('turn_off', 'switch', 'psock1');
        client.say(process.env.CHANNEL_NAME, "Lasset Robby schwitzen! Der Ventilator ist nun AUS!");
      }
      else
      {
        client.say(process.env.CHANNEL_NAME, "Die 1000 Kanalpunkte hast du umsonst ausgegeben, denn der Ventilator ist aktuell aus.");
      }
    }).catch(function(e) {
      throw e;
    });

    return;
  }

  //console.log(context);
  console.log("[ CHAT ] " + context.username + ": " + msg);

  if (!msg.startsWith("!")) return;

  const commandArgs = msg.substring(1).split(' ');

  switch (commandArgs[0])
  {
    default:
    {
      db.FetchCommandText(commandArgs[0]).then(function(commandText) {
        client.say(process.env.CHANNEL_NAME, "@" + context.username + ", " + commandText);
      }).catch(function(e) {
        //handle error here
      });
    }
    return;
    case "ventilator":
    {

      if(commandArgs.length === 1)
      {
        if(context.username === "derpydoom_" || context.username === "dj_robby_")
        {
          switch(commandArgs[1])
          {
            case "an":
            {

            }
            return;
            case "aus":
            {

            }
            return;
          }
        }
      }
      hass.states.get('switch', 'psock1').then(function(switchState) {
        if(switchState.state === "on")
        {
          client.say(process.env.CHANNEL_NAME, "@" + context.username + ", der Ventilator ist aktuell an.");
        } else {
          client.say(process.env.CHANNEL_NAME, "@" + context.username + ", der Ventilator ist aktuell aus.");
        }
      }).catch(function(e) {
        throw e;
      });
    }
    return;
    case "love":
    {
      var user = msg.substring(5, msg.length);
      var percentage = randomIntFromInterval(0, 100);

      if(user === "")
      {
        client.say(process.env.CHANNEL_NAME, "@" + context.username + ", du musst einen Nutzer angeben um deine Liebe zu bewahrheiten. z.B !love DerOlleGuenther.");
        return;
      }

      if(context.username === user)
      {
        client.say(process.env.CHANNEL_NAME, "@" + context.username + ", sorry aber wer sich selbst liebt hat schon verloren.");
      }
      else
      {
        client.say(process.env.CHANNEL_NAME, "@" + context.username + ", deine Liebe zu " + user + " ist zu " + percentage + "% wahr.");
      }
    }
    return;
    case "adc":
    {
      if(context.username === "derpydoom_")
      {
        DiscordClient.SendMessage('#livestream', "@everyone Wir Sind Live! https://twitch.tv/ra_light_n_sound");
        client.say(process.env.CHANNEL_NAME, "Announcement wurde auf Discord gesendet.");
      }
    }
    return;
    case "addjoke":
    {
      const joke = msg.substring(8, msg.length);

      if(joke === "")
      {
        client.say(process.env.CHANNEL_NAME, '@' + context.username + ', du kannst der Witze Datenbank einen Witz hinzufügen in dem du schreibst !addjoke (dein Witz). z.B !addjoke Wie heißt ein Kranker JasTV? SarsTV LUL');
        return;
      }

      db.AddJoke(context.username, joke);
      client.say(process.env.CHANNEL_NAME, "@" + context.username + ", dein Witz wurde der Datebank hinzugefügt!");
    }
    return;
    case "joke":
    {

    }
    return;
    case "sr":
    {
      const songName = msg.substring(4, msg.length);

      if(songName === "")
      {
        client.say(process.env.CHANNEL_NAME, '@' + context.username + ' du kannst der Queue ein Song hinzufügen in dem du vor deinem Wunsch !sr eingibst. Beispiel: !sr Markus Becker - Das Rote Pferd');
        return;
      }

      if(QueueStatus)
      {
        DiscordClient.SendMessage('#sr-log', context.username + ': ' + songName);
        db.AddToQueue(context.username, songName);
        client.say(process.env.CHANNEL_NAME, '@' + context.username + ' ' + songName + ' wurde der Datenbank hinzugefügt.');
      }
      else
      {
        client.say(process.env.CHANNEL_NAME, '@' + context.username + ' die Queue ist geschlossen, es werden Aktuell keine Anfragen mehr angenommen. Sorry :/');
      }
    }
    return;
    case "queue":
    {
      const queueStatus = msg.substring(7, msg.length);
      if(context.username === "derpydoom_")
      {
        switch(queueStatus)
        {
          case "offen":
          case "auf":
          case "an":
          case "on":
          {
           QueueStatus = true;
            client.say(process.env.CHANNEL_NAME, 'Die Queue wurde geöffnet. Ihr könnt mit !sr euch nun Songs wünschen. Viel Spaß!');
          }
          return;
          case "geschlossen":
          case "aus":
          case "zu":
          case "off":
          {
            QueueStatus = false;
            client.say(process.env.CHANNEL_NAME, 'Die Queue ist geschlossen. Anfragen werden ab jetzt nicht mehr angenommen! KEINE AUSNAHMEN!!111');
          }
          return;
        }
      }
    }
    return;
  }
}
