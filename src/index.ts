import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";

const client = new Client({
  intents: ["Guilds", "GuildMessages"],
});

client.once("ready", () => {
  console.log("Designer bot is ready!");
});

client.on("guildCreate", async (guild) => {
  console.log("Deployed functions");
  await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    await commands[commandName as keyof typeof commands].execute(interaction); // Potentially replace with switch
    console.log("sucess");
  } catch (e) {
    console.log(e);
  }
});

// Adds the commands to the guild when the bot is added to a new guild

client.login(process.env.BOT_TOKEN);
