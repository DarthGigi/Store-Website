import { ROBLOX_WEBHOOK_SECRET, STRIPE_WEBHOOK_SECRET, WEBHOOK_URL, WHITELIST_URL, LUARMOR_PROJECT, LUARMOR_KEY, DISCORD_BOT_TOKEN } from '$env/static/private';
import { PUBLIC_DISCORD_API_URL, PUBLIC_GUILD_ID } from '$env/static/public';
import { stripe } from '$lib/server/stripe';
import type Stripe from 'stripe';
import type { RequestHandler } from './$types';
let hasNewRole = false;
let whitelisted = false;

async function whitelistUser(discordID: string, tier: string) {
  try {
    const whitelist = fetch(`${WHITELIST_URL}/projects/${LUARMOR_PROJECT}/users`, {
      method: 'POST',
      headers: {
        authorization: LUARMOR_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Pro, Essential or Upgrade
        note: tier.toString(),
        // Discord ID
        discord_id: discordID.toString()
      })
    }).then((res) => res.json());

    console.log(await whitelist);
    let discord_role_response;
    if ((await whitelist).success) {
      whitelisted = true;
      console.log('Successfully whitelisted user');
      let roleID;
      switch (tier) {
        case 'TierName':
          roleID = 'ROLEID';
          break;
        case 'TierName':
          roleID = 'ROLEID';
          break;
        case 'TierName':
          roleID = 'ROLEID';
          break;
        default:
          roleID = 'ROLEID';
          break;
      }
      // Adds a role to a guild member. Requires the MANAGE_ROLES permission. Returns a 204 empty response on success. Fires a Guild Member Update Gateway event.
      discord_role_response = await fetch(`${PUBLIC_DISCORD_API_URL}/guilds/${PUBLIC_GUILD_ID}/members/${discordID}/roles/${roleID}`, {
        method: 'PUT',
        headers: {
          authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          'X-Audit-Log-Reason': 'Add the correct tier role to the user. From a purchase done through the store.'
        }
      });

      // if the user has the new role
      if (discord_role_response.status === 204) {
        hasNewRole = true;
        console.log(`Successfully added the ${tier} role to ${discordID}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export const POST: RequestHandler = async ({ request, fetch }) => {
  // Check the user agent to see if the request is from Stripe or Roblox
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

      const giftUser = session.metadata?.Gift === '' ? null : session.metadata?.Gift;

      let giftUserEmail: string | null = null;

      if (giftUser != null) {
        const customFields = session.custom_fields;
        if (customFields != null) {
          const giftField = customFields.find((field) => field.key === 'Gift');
          if (giftField != null) {
            giftUserEmail = giftField.text?.value ?? null;
          } else {
            giftUserEmail = null;
          }
        } else {
          giftUserEmail = null;
        }
      }

      // Store the data in variables for later use when sending the webhook
      // Email
      const customerEmail = session.customer_email || session.customer_details?.email || 'contact@gigi.asap';

      // Discord ID
      const discordUser = `<@${session.metadata?.DiscordID ?? 'This purchase was probably not made via store.example.com.'}>`;

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

      // the giftuser or the user who bought the product
      const whitelistingUser = giftUser ?? session.metadata?.DiscordID ?? 'Discord ID not found';

      await whitelistUser(whitelistingUser, tier);

      const requestBody = {
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
              },
              // Conditionally add the gift fields if the purchase was a gift
              ...(giftUser != null
                ? [
                    {
                      name: 'Gifted User Email:',
                      value: giftUserEmail ?? 'N/A',
                      inline: true
                    },
                    {
                      name: 'Gifted User:',
                      value: `<@${giftUser}>`,
                      inline: true
                    },
                    {
                      name: 'Gifted User ID:',
                      value: giftUser,
                      inline: true
                    }
                  ]
                : []),
              {
                name: 'Whitelist Status:',
                value: whitelisted ? 'Whitelisted' : 'Not Whitelisted',
                inline: true
              },
              {
                name: 'Discord Role Status:',
                value: hasNewRole ? 'Role Added' : 'Role Not Added',
                inline: true
              }
            ],
            footer: {
              text: footer
            }
          }
        ]
      };

      // Send the webhook
      const webhook = fetch(`${WEBHOOK_URL}?wait=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      // Log the webhook body before sending to the console

      if ((await webhook).status !== 200) {
        // [object Promise] is returned if the webhook fails to send, so fix that
        console.log(`Error response from Discord after sending webhook: ${(await webhook).text()}`);
        return new Response(`Error response from Discord after sending webhook: ${(await webhook).text()}`, { status: 502 });
      }
      return new Response('Created. Purchase logged successfully to Discord.', { status: 201 });
    } else {
      // Return a 200 response to acknowledge receipt of the event
      return new Response(`OK. Received event: ${webhookEvent.type}`, { status: 200 });
    }
  } else if (request.headers.get('user-agent')?.includes('Roblox')) {
    // Match the secret to verify the request
    if (request.headers.get('secret') !== ROBLOX_WEBHOOK_SECRET) {
      return new Response('Unauthorized, invalid secret', { status: 401 });
    }

    // Get the data from the request
    const data = await request.json();

    console.log(data);

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

    await whitelistUser(data.discordID, tier);

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
              },
              {
                name: 'Whitelist Status:',
                value: whitelisted ? 'Whitelisted' : 'Not Whitelisted',
                inline: true
              },
              {
                name: 'Discord Role Status:',
                value: hasNewRole ? 'Role Added' : 'Role Not Added',
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

    // Return a 500 if the webhook failed to send
    if ((await webhook).status !== 200) {
      return new Response(`Error response from Discord after sending webhook: ${(await webhook).text()}`, { status: 502 });
    }
    // Return a 201 if the webhook was sent successfully
    return new Response('Created. Purchase logged successfully to Discord.', { status: 201 });
  } else {
    // Return a 400 if the request is not from Stripe or Roblox
    return new Response('Bad Request', { status: 400 });
  }
};
