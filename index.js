const { Client, Collection } = require("discord.js");
const client = new Client({
    allowedMentions: {
      parse: ["roles", "users", "everyone"],
      repliedUser: true,
    },
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    intents: [
      "GUILDS",
      "GUILD_MEMBERS",
      "GUILD_BANS",
      "GUILD_EMOJIS_AND_STICKERS",
      "GUILD_MESSAGE_REACTIONS",
      "GUILD_MESSAGES",
    ],
  });
module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require("./config.json");

// Initializing the project
require("./handler")(client);

client.login(client.config.token);
