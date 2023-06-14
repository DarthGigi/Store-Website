import { stripe } from '$lib/server/stripe';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const { sessionID } = params;

    // Retrieve the session data from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionID);

    const response = new Response(JSON.stringify(session), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

    return response;
  } catch (error) {
    console.error('Error retrieving session data:', error);

    // Construct an error response
    const errorResponse = new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });

    return errorResponse;
  }
};
