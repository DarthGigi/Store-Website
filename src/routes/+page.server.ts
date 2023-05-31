import type { PageServerLoad, Actions } from './$types';
import type { IPlanPrices } from '$lib/types';
import { PRICE_ID_PRO, PRICE_ID_ESSENTIAL, PRICE_ID_UPGRADE, DOMAIN, DISCORD_BOT_TOKEN } from '$env/static/private';
import { PUBLIC_SIRIUS_GUILD_ID } from '$env/static/public';
import { stripe } from '$lib/server/stripe';
import { redirect } from '@sveltejs/kit';
const DISCORD_API_URL = 'https://discord.com/api/v10';

// User interface
interface User {
  id: string;
  username: string;
  global_name: string;
  discriminator: string;
  avatar: string;
  roles?: string[];
  hasPro?: boolean;
  hasEssential?: boolean;
}

// Global variables to store the user data and the currency so it can be used in the actions when user submits the form
let user: User | null;
let currency: string;

export const load = (async ({ getClientAddress, cookies, request }) => {
  // If the user has a refresh token but not an access token, refresh the access token
  if (cookies.get('refresh_token') && !cookies.get('access_token')) {
    // Refresh the access token
    const discord_response = await fetch(`${request.url}api/refresh`, {
      method: 'POST',
      body: JSON.stringify({ refresh_token: cookies.get('refresh_token') }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json());

    // Set the new access token and refresh token expiry dates
    const access_token_expires_in = new Date(Date.now() + discord_response.expires_in); // 10 minutes
    const refresh_token_expires_in = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Set the new access token and refresh token
    cookies.set('access_token', discord_response.access_token, {
      expires: access_token_expires_in,
      path: '/'
    });

    cookies.set('refresh_token', discord_response.refresh_token, {
      expires: refresh_token_expires_in,
      path: '/'
    });
  }

  // If the user has an access token, get their user data
  if (cookies.get('access_token')) {
    // Get the user data from Discord
    const discord_response = await fetch(`${DISCORD_API_URL}/users/@me`, {
      headers: {
        authorization: `Bearer ${cookies.get('access_token')}`
      }
    }).then((res) => res.json());

    // If the user exists, set the user data
    if (discord_response.id) {
      user = {
        id: discord_response.id,
        username: discord_response.username,
        global_name: discord_response.global_name,
        discriminator: discord_response.discriminator,
        avatar: discord_response.avatar
      };
      // Get the user's roles from the server/guild
      const guild_response = await fetch(`${DISCORD_API_URL}/guilds/${PUBLIC_SIRIUS_GUILD_ID}/members/${discord_response.id}`, {
        headers: {
          authorization: `Bot ${DISCORD_BOT_TOKEN}`
        }
      }).then((res) => res.json());

      // If the user has roles, set the user's roles
      if (guild_response.roles) {
        user.roles = guild_response.roles;
        user.hasPro = user.roles?.includes('939872682567151626');
        user.hasEssential = user.roles?.includes('994723402214543452');
      }
    }
    // If the user doesn't exist, set the user to null
    else {
      user = null;
    }
  }
  // If the user doesn't have an access token, that means they're not logged in, set the user to null
  else {
    user = null;
  }

  // Get the prices of the plans
  const plans: IPlanPrices = {
    pro: {
      // Get the price data from Stripe
      stripe: ((priceData) => {
        const unitAmount = priceData.unit_amount != null ? priceData.unit_amount / 100 : 'Error';
        return unitAmount;
      })(await stripe.prices.retrieve(PRICE_ID_PRO)),
      // Get the price data from Roblox
      robux: (await fetch('https://apis.roblox.com/game-passes/v1/game-passes/181940005/product-info').then((res) => res.json())).PriceInRobux
    },
    essential: {
      // Get the price data from Stripe
      stripe: ((priceData) => {
        const unitAmount = priceData.unit_amount != null ? priceData.unit_amount / 100 : 'Error';
        return unitAmount;
      })(await stripe.prices.retrieve(PRICE_ID_ESSENTIAL)),
      // Get the price data from Roblox
      robux: (await fetch('https://apis.roblox.com/game-passes/v1/game-passes/181940072/product-info').then((res) => res.json())).PriceInRobux
    },
    upgrade: {
      // Get the price data from Stripe
      stripe: ((priceData) => {
        const unitAmount = priceData.unit_amount != null ? priceData.unit_amount / 100 : 'Error';
        return unitAmount;
      })(await stripe.prices.retrieve(PRICE_ID_UPGRADE)),
      robux: ''
    },
    none: {
      stripe: '',
      robux: ''
    }
  };

  // Get the user's location to determine their currency
  let location;
  try {
    location = await fetch(`http://ip-api.com/json/${getClientAddress()}?fields=8445952`).then((res) => res.json());
  } catch (e) {
    console.log("Couldn't get user's location. => " + e);
    location = {
      currency: 'USD',
      status: 'fail'
    };
  }

  // If the user's currency is not supported, set the currency to USD
  if (!['EUR', 'GBP', 'USD'].includes(await location.currency) || (await location.status) === 'fail') {
    location.currency = 'USD';
  }
  currency = await location.currency;

  return {
    plans,
    currency,
    // Set default locale to en-US, can be overridden by the user's browser
    locale: 'en-US',
    user
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request }) => {
    // Get the form data
    const formData = await request.formData();

    // If the payment method is Stripe, create a Stripe checkout session
    if (formData.get('payment') == 'Stripe') {
      // Get the tier from the form data
      const tier: string = formData.get('tier') as string;
      let priceId: string;

      // Get the price ID based on the tier
      switch (tier.toLowerCase()) {
        case 'pro':
          priceId = PRICE_ID_PRO;
          break;
        case 'essential':
          priceId = PRICE_ID_ESSENTIAL;
          break;
        case 'upgrade':
          priceId = PRICE_ID_UPGRADE;
          break;
        default:
          // Handle the case when tier is not one of the expected options
          throw new Error('Invalid tier option');
      }

      // Create a Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],
        metadata: {
          // User's Discord ID to identify the user
          DiscordID: user?.id as string,
          Tier: tier
        },
        mode: 'payment',
        customer_creation: 'always',
        success_url: `${DOMAIN}status/{CHECKOUT_SESSION_ID}`,
        cancel_url: `${DOMAIN}status/{CHECKOUT_SESSION_ID}`,
        submit_type: 'pay',
        currency: currency,
        allow_promotion_codes: false
      });

      // Redirect the user to the Stripe checkout session
      throw redirect(303, session.url as string);
    }
    // If the payment method is Robux, redirect the user to the Roblox game
    else if (formData.get('payment') == 'Robux') {
      // Set the launch data for the Roblox game
      const launchData = encodeURIComponent(
        JSON.stringify({
          dID: user?.id,
          dN: user?.username,
          dD: user?.discriminator
        })
      );
      // Open the Roblox game for the user
      throw redirect(303, `roblox://placeId=13567101560&launchData=${launchData}`);
    }
  }
};
