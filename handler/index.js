const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const { mongooseConnectionString } = require("../config.json");
const mongoose = require("mongoose");

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    // Command handler
    const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }
    });

    // Events handler
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));

    // Slash Commands handler
    const slashCommands = await globPromise(
        `${process.cwd()}/SlashCommands/*/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        if(file.userPermissions) file.defaultPermission = false;
        arrayOfSlashCommands.push(file);
    });
    client.on("ready", async () => {
        await client.application.commands.set(arrayOfSlashCommands);
    });
    //slash commands permissions(btw if you see this you cant use permissions to global so ou gotta put the server id)
    //example:  await client.guilds.cache.get("your guild id").commands.set(arrayOfSlashCommands);
 //   await guild.commands.set(arrayOfSlashCommands).then((cmd) => {
   //     const getRoles = (commandNames) => {
     ///       const permissions = arrayOfSlashCommands.find(x => x.name === commandName).userPermissions;
//
  //          if(!permissions) return null;
    //        return guild.roles.cache.filter(x => x.permissions.has(permissions) && !x.managed);
      //  };
//
  //      const fullPermissions = cmd.reduce((accumulator, x) => {
    //        const roles = getRoles(x.name);
      //      if(!roles) return accumulator;
//
  //          const permissions = roles.reduce((a, v) => {
    //            return [
      //              ...a,
        //            {
         //   /            id: v.id,
           //          type: "ROLE",
            //            permissions: true,s
          //          },
             //   ];
            //}, []);

 //           return [
   //             ...accumulator,
     //           {
       //             id: x.id,
         //           permissions,
           //     },
 //           ];
   //     }, []);
//
  //      guild.commands.permissions.set({ fullPermissions });
    //});
//
  // mongoose
    const { mongooseConnectionString } = require('../config.json')
    if (!mongooseConnectionString) return;

    mongoose.connect(mongooseConnectionString, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }).then(() => console.log('Connected to mongodb'));
};
