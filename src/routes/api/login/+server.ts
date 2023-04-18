import type { RequestHandler } from './$types';
import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';

import { PUBLIC_CLIENT_ID } from '$env/static/public';

const DISCORD_REDIRECT_URI = dev ? 'http://localhost:5137/login/callback' : 'https://buy.sirius.menu/login/callback';
const DISCORD_ENDPOINT = `https://discord.com/oauth2/authorize?response_type=code&client_id=${PUBLIC_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=connections%20guilds.members.read%20identify&prompt=consent`;

console.log(PUBLIC_CLIENT_ID);

export const GET = (async ({}) => {
  throw redirect(302, DISCORD_ENDPOINT);
}) satisfies RequestHandler;
