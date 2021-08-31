
const { Client, Message, MessageEmbed, CommandInteraction } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Show Bot Ping',
    cooldown : 5,

    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */

    run: async(client, interaction, args) => {
        try {
            let ping = new MessageEmbed()
            .setDescription(`🏓 Ping : ${client.ws.ping}`)
            .setColor('RANDOM')
            .setTimestamp()

            Interaction.followUp({embeds : [ping]})
        } catch (e) {
                console.log(e);
        }
    }
}