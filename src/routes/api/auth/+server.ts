import { PUBLIC_DISCORD_OAUTH_ID, PUBLIC_REDIRECT_URI } from '$env/static/public';
import type { RequestHandler } from './$types';

const DISCORD_ENDPOINT = `https://discord.com/api/oauth2/authorize?client_id=${PUBLIC_DISCORD_OAUTH_ID}&redirect_uri=${encodeURIComponent(PUBLIC_REDIRECT_URI)}&response_type=code&scope=guilds.join%20guilds.members.read%20identify`;

export const GET: RequestHandler = async () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: DISCORD_ENDPOINT
    }
  });
};
