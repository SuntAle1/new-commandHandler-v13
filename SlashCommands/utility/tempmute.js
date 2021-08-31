const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "mute",
    description: "mutes the target member",
    options: [
        {
            name: "target",
            description: "select a target to mute",
            type: "USER",
            required: true,
        },
        {
            name: "reason",
            description: "provide a reason for the mute",
            type: "STRING",
            required: false,
        },
        {
            name: "preset-time",
            description: "select a pre set time. This is **OPTIONAL**",
            type: "STRING",
            required: false,
            choices: [
                {
                    name: "1 Hour",
                    value: "1h"
                },
                {
                    name: "3 Hours",
                    value: "3h"
                },
                {
                    name: "5 Hours",
                    value: "5h"
                },
                {
                    name: "12 Hours",
                    value: "12h"
                },
                {
                    name: "1 Day",
                    value: "1d"
                },
                {
                    name: "5 Seconds",
                    description: "You really don't need this unless you are testing",
                    value: "5s" 
                }
            ]
        },
        {
            name: "custom-time",
            description: "provide a custom time to mute. Examples: (1s/1m/1h/1d).",
            type: "STRING",
            required: false
        }
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args
     */
        run: async(client, interaction, args) => {

        const Target = interaction.options.getMember("target");
        const Reason = interaction.options.getString("reason") || "No reason given";
        const Time = interaction.options.getString("preset-time") || interaction.options.getString("custom-time") || "14d";

        let muteRole = interaction.guild.roles.cache.find(r => r.name === "Muted");
 
        await Target.roles.add(muteRole.id)
        setTimeout(async () => {
            if(!Target.roles.cache.has(muteRole)) return;
            await Target.roles.remove(muteRole)
        }, ms(Time))

        let embed = new MessageEmbed()
        .setColor("GREEN")
        .setDescription(`✅ ${Target} has been muted for ${Time} | ||${Target.id}||`)
        .setTimestamp()
        interaction.followUp({ embeds: [embed] })
    }
}