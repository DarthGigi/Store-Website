import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
  cookies.delete('access_token', { path: '/' });
  cookies.delete('refresh_token', { path: '/' });
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/'
    }
  });
};
