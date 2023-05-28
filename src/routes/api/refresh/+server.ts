import type { RequestHandler } from './$types';
import { PUBLIC_DISCORD_OAUTH_ID } from '$env/static/public';
import { DISCORD_OAUTH_SECRET } from '$env/static/private';

export const POST = (async ({ request }) => {
  const refresh_token = (await request.json()).refresh_token;

  if (!refresh_token) {
    console.log('no refresh code found');
    return new Response(JSON.stringify({ error: 'no refresh code found' }), {
      status: 400
    });
  }

  // performing a Fetch request to Discord's token endpoint
  const discord_response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({ client_id: PUBLIC_DISCORD_OAUTH_ID, client_secret: DISCORD_OAUTH_SECRET, grant_type: 'refresh_token', refresh_token: refresh_token }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }).then((res) => res.json());

  // if there's an error, return it as json
  if (discord_response.error) {
    console.error('error => ', discord_response.error);
    return new Response(JSON.stringify(discord_response), {
      status: 500
    });
  }

  // if there's an access token, return it as json
  return new Response(JSON.stringify(discord_response), {
    status: 200
  });
}) satisfies RequestHandler;
