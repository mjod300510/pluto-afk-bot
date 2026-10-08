const { Client, GatewayIntentBits } = require('discord.js');
const {
  joinVoiceChannel,
  VoiceConnectionStatus
} = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const VOICE_CHANNEL_ID = '1542851015144112178';

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const channel = await client.channels.fetch(VOICE_CHANNEL_ID);

  if (!channel || !channel.isVoiceBased()) {
    console.log('Voice channel not found');
    return;
  }

  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfDeaf: true
  });

  connection.on(VoiceConnectionStatus.Disconnected, () => {
    setTimeout(() => {
      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: true
      });
    }, 5000);
  });
});

client.login(process.env.DISCORD_TOKEN);
