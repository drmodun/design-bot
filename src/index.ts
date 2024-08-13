import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands";

const client = new Client({
  intents: ["Guilds", "GuildMessages"],
});

client.once("ready", () => {
  console.log("Designer bot is ready!");
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  }
});

// Adds the commands to the guild when the bot is added to a new guild

client.login(process.env.BOT_TOKEN);
