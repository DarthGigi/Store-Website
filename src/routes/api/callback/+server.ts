import { DISCORD_BOT_TOKEN, DISCORD_OAUTH_SECRET } from '$env/static/private';
import { PUBLIC_DISCORD_OAUTH_ID, PUBLIC_REDIRECT_URI, PUBLIC_SIRIUS_GUILD_ID } from '$env/static/public';
import type { RequestHandler } from './$types';
const DISCORD_API_URL = 'https://discord.com/api/v10';

export const GET = (async ({ url, cookies }) => {
  const returnCode = url.searchParams.get('code');

  const dataObject = {
    client_id: PUBLIC_DISCORD_OAUTH_ID,
    client_secret: DISCORD_OAUTH_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: PUBLIC_REDIRECT_URI,
    code: returnCode as string,
    scope: 'connections guilds.join guilds.members.read identify'
  };

  // performing a Fetch request to Discord's token endpoint
  const request = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams(dataObject),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  const response = await request.json();

  // redirect to front page in case of error
  if (response.error) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/'
      }
    });
  }

  // redirect user to front page with cookies set
  const access_token_expires_in = new Date(Date.now() + response.expires_in); // 10 minutes
  const refresh_token_expires_in = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  cookies.set('access_token', response.access_token, {
    expires: access_token_expires_in,
    path: '/'
  });

  cookies.set('refresh_token', response.refresh_token, {
    expires: refresh_token_expires_in,
    path: '/'
  });

  const discord_response = await fetch(`${DISCORD_API_URL}/users/@me`, {
    headers: {
      authorization: `Bearer ${response.access_token}`
    }
  }).then((res) => res.json());

  await fetch(`${DISCORD_API_URL}/guilds/${PUBLIC_SIRIUS_GUILD_ID}/members/${discord_response.id}`, {
    method: 'PUT',
    body: JSON.stringify({ refresh_token: cookies.get('refresh_token') }),
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bot ${DISCORD_BOT_TOKEN}`
    }
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/'
    }
  });
}) satisfies RequestHandler;
