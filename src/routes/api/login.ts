import type { RequestHandler } from '@sveltejs/kit';
import { dev } from '$app/environment';

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_REDIRECT_URI = dev ? 'http://localhost:5137/login/callback' : 'https://buy.sirius.menu/login/callback';
const DISCORD_ENDPOINT = `"https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${DISCORD_REDIRECT_URI}&response_type=code&scope=connections%20guilds.members.read%20identify"`;

export async function get() {
  return {
    headers: { Location: DISCORD_ENDPOINT },
    status: 302
  };
}
