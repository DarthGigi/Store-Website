import { PUBLIC_DISCORD_OAUTH_ID, PUBLIC_REDIRECT_URI } from '$env/static/public';
import type { RequestHandler } from './$types';

const DISCORD_ENDPOINT = `https://discord.com/oauth2/authorize?response_type=code&client_id=${PUBLIC_DISCORD_OAUTH_ID}&scope=connections%20guilds.members.read%20identify&redirect_uri=${encodeURIComponent(PUBLIC_REDIRECT_URI)}&prompt=consent&state=decf3e511b40011b9`;

export const GET: RequestHandler = async () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: DISCORD_ENDPOINT
    }
  });
};
