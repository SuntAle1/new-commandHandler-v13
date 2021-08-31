const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'List of all the commands!',

        /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */

    run: async(client, interaction, args) => {

        const directories = [...new Set(client.commands.map(cmd => cmd.directory))];

        const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`

        const categories = directories.map((directories) => {
            const getCommands = client.commands.filter((cmd) => cmd.directory === directories).map(cmd =>{
                return {
                    name: cmd.name || "Command has no name!",
                    description: cmd.description || "Command has no description!",
                };
            });

            return {
                directory: formatString(directories),
                commands: getCommands,
            };
        });

        const embed = new MessageEmbed()
        .setDescription('Please choose a category from the dropdown menu!')
        .setColor('RANDOM')
        .setTimestamp()

        const components = (state) => [
            new MessageActionRow().addComponents(
                new MessageSelectMenu()
                .setCustomId('help-menu')
                .setPlaceholder('Please select a category!')
                .setDisabled(state)
                .addOptions(
                    categories.map((cmd) => {
                        return {
                            label: cmd.directory,
                            value: cmd.directory.toLowerCase(),
                            description: `Commands rom ${cmd.directory} category!`,                            
                        };
                    })
                )
            ),
        ];

        const intialMessage = await interaction.followUp({
            embeds: [embed],
            components: components(false),
        });

        const filter = (interaction) => interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            componentType: "SELECT_MENU",
        });

        collector.on('collect', (interaction) => {
            const [ directory ] = interaction.values;
            const category = categories.find((x) => x.directory.toLowerCase() === directory);


            const embed1 = new MessageEmbed()
            .setTimestamp()
            .setColor('RANDOM')
            .setTitle(`${directory} commands!`)
            .setDescription('Here is the list of commands!')
            .addFields( category.commands.map((cmd) => {
                return {
                    name: `\`${cmd.name}\``,
                    value: `${cmd.description}`,
                    inline: true,
                }
            })
        );
            interaction.update({ embeds: [embed1] });
        });

        collector.on('end', () => {
            intialMessage.edit({ components: components(true) });
        })
    },
};