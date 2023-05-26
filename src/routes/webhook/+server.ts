import type { RequestHandler } from './$types';
import type Stripe from 'stripe';
import { STRIPE_WEBHOOK_SECRET, WEBHOOK_URL, ROBLOX_WEBHOOK_SECRET } from '$env/static/private';
import { stripe } from '$lib/server/stripe';

export const POST: RequestHandler = async ({ request, fetch }) => {
  if (request.headers.get('user-agent')?.includes('Stripe')) {
    // Retrieve the event by verifying the signature
    const sig = request.headers.get('stripe-signature');

    // Verify the event by fetching it from Stripe
    let webhookEvent;
    try {
      // Construct the event
      if (sig == null) {
        throw new Error('Stripe signature is missing');
      }
      webhookEvent = stripe.webhooks.constructEvent(await request.text(), sig, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      // On error, log and return the error message
      if (err instanceof Error) {
        return new Response(err.message, { status: 400 });
      }
      return new Response('Unknown error', { status: 400 });
    }

    // Handle the checkout.session.completed event
    if (webhookEvent.type === 'checkout.session.completed') {
      // Get the all the data from the event
      const payment_intent_id = (webhookEvent.data.object as Stripe.Checkout.Session).payment_intent;
      const payment_intent = await stripe.paymentIntents.retrieve(payment_intent_id as string);
      const charge_id = payment_intent.latest_charge;
      const charge = await stripe.charges.retrieve(charge_id as string);
      const receiptUrl = charge.receipt_url;
      const session: Stripe.Checkout.Session = webhookEvent.data.object as Stripe.Checkout.Session;
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      // Store the data in variables for later use when sending the webhook
      // Email
      const customerEmail = session.customer_email || session.customer_details?.email || 'contact@gigi.asap';

      // Discord ID
      const discordUser = `<@${session.metadata?.DiscordID ?? 'This purchase was probably not made via buy.sirius.menu.'}>`;

      // Tier
      const tier = session.metadata?.Tier || lineItems.data[0].description;

      // Currency
      const currency = session.currency?.toUpperCase() === 'EUR' ? '€' : session.currency?.toUpperCase() === 'USD' ? '$' : session.currency?.toUpperCase() === 'GBP' ? '£' : session.currency?.toUpperCase();

      // Amount Paid
      const amountPaid = `${session.amount_total == null ? 'N/A' : (session.amount_total ?? -1) === -1 ? 'Error: Invalid amount' : `${currency}${((session.amount_total ?? -1) / 100).toFixed(2)}`}`;

      // Date and Time of Purchase
      const created = `<t:${session.created ?? 0}:f>`;

      // Receipt URL
      const receiptLink = `[View Receipt](${receiptUrl ?? 'https://dashboard.stripe.com/'})`;

      // Footer
      const footer = `Discord ID: ${session.metadata?.DiscordID}${session.livemode === false ? ' | Test Mode: True' : ''}`;

      // Send the webhook
      const webhook = fetch(`${WEBHOOK_URL}?wait=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'Stripe',
          avatar_url: 'https://i.vgy.me/DFBwES.png',
          content: null,
          embeds: [
            {
              title: `Successful Purchase`,
              color: 2829617,
              fields: [
                {
                  name: 'Email:',
                  value: customerEmail,
                  inline: true
                },
                {
                  name: 'Discord User:',
                  value: discordUser,
                  inline: true
                },
                {
                  name: 'License Tier:',
                  value: tier,
                  inline: true
                },
                {
                  name: 'Amount Paid:',
                  value: amountPaid,
                  inline: true
                },
                {
                  name: 'Date Purchased:',
                  value: created,
                  inline: true
                },
                {
                  name: 'Receipt:',
                  value: receiptLink,
                  inline: true
                }
              ],
              footer: {
                text: footer
              }
            }
          ]
        })
      });

      if ((await webhook).status !== 200) {
        return new Response('Error sending webhook', { status: 500 });
      }
      return new Response('OK', { status: 200 });
    } else {
      // Return a 200 response to acknowledge receipt of the event
      return new Response('OK', { status: 200 });
    }
  } else if (request.headers.get('user-agent')?.includes('Roblox')) {
    // Match the secret to verify the request
    if (request.headers.get('secret') !== ROBLOX_WEBHOOK_SECRET) {
      return new Response('Unauthorized, invalid secret', { status: 401 });
    }

    // Get the data from the request
    const data = await request.json();

    // Store the data in variables for later use when sending the webhook
    // Username
    const robloxUsername = data.user;

    // Discord ID
    const discordUser = `<@${data.discordID}>`;

    // Tier
    const tier = data.pass.charAt(0).toUpperCase() + data.pass.slice(1);

    // Price
    const price = data.passPrice;

    // Footer
    const footer = `Discord ID: ${data.discordID} | Roblox ID: ${data.userID}`;

    // Send the webhook
    const webhook = fetch(`${WEBHOOK_URL}?wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'Roblox',
        avatar_url: 'https://i.vgy.me/ECSYzR.jpg',
        content: null,
        embeds: [
          {
            title: `Successful Purchase`,
            color: 2829617,
            fields: [
              {
                name: 'Roblox Username:',
                value: robloxUsername,
                inline: true
              },
              {
                name: 'Discord User:',
                value: discordUser,
                inline: true
              },
              {
                name: 'License Tier:',
                value: tier,
                inline: true
              },
              {
                name: 'Amount Paid:',
                value: `${price} R$`,
                inline: true
              },
              {
                name: 'Date Purchased:',
                value: `<t:${Math.floor(Date.now() / 1000)}:f>`,
                inline: true
              },
              {
                name: 'Profile:',
                value: `[View Profile](https://www.roblox.com/users/${data.userID}/inventory/#!/game-passes)`,
                inline: true
              }
            ],
            footer: {
              text: footer
            }
          }
        ]
      })
    });

    if ((await webhook).status !== 200) {
      return new Response('Error sending webhook', { status: 500 });
    }
    return new Response('OK', { status: 200 });
  } else {
    // Return a 404 if the request is not from Stripe or Roblox
    return new Response('Not Found', { status: 404 });
  }
};
