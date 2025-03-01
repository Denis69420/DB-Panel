// backend/utils/discordApi.js
const fetch = require('node-fetch');

async function getDiscordUser(accessToken) {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.json();
}

async function getDiscordGuildMember(accessToken, guildId) {
  const response = await fetch(`https://discord.com/api/users/@me/guilds/${guildId}/member`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.json();
}

module.exports = { getDiscordUser, getDiscordGuildMember };
