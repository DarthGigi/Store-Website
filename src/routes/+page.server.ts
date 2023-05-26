import type { PageServerLoad, Actions } from './$types';
import type { IPlanPrices } from '$lib/types';
import { PRICE_ID_PRO, PRICE_ID_ESSENTIAL, PRICE_ID_UPGRADE, DOMAIN, DISCORD_BOT_TOKEN } from '$env/static/private';
import { PUBLIC_SIRIUS_GUILD_ID } from '$env/static/public';
import { stripe } from '$lib/server/stripe';
import { redirect } from '@sveltejs/kit';
const DISCORD_API_URL = 'https://discord.com/api/v10';

interface User {
  id: string;
  username: string;
  global_name: string;
  discriminator: string;
  avatar: string;
  roles?: string[];
}

let user: User | null;
let currency: string;

export const load = (async ({ getClientAddress, cookies, request }) => {
  if (cookies.get('refresh_token') && !cookies.get('access_token')) {
    const discord_response = await fetch(`${request.url}api/refresh`, {
      method: 'POST',
      body: JSON.stringify({ refresh_token: cookies.get('refresh_token') }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json());

    const access_token_expires_in = new Date(Date.now() + discord_response.expires_in); // 10 minutes
    const refresh_token_expires_in = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    cookies.set('access_token', discord_response.access_token, {
      expires: access_token_expires_in,
      path: '/'
    });

    cookies.set('refresh_token', discord_response.refresh_token, {
      expires: refresh_token_expires_in,
      path: '/'
    });
  }

  if (cookies.get('access_token')) {
    const discord_response = await fetch(`${DISCORD_API_URL}/users/@me`, {
      headers: {
        authorization: `Bearer ${cookies.get('access_token')}`
      }
    }).then((res) => res.json());

    if (discord_response.id) {
      user = {
        id: discord_response.id,
        username: discord_response.username,
        global_name: discord_response.global_name,
        discriminator: discord_response.discriminator,
        avatar: discord_response.avatar
      };
      const guild_response = await fetch(`${DISCORD_API_URL}/guilds/${PUBLIC_SIRIUS_GUILD_ID}/members/${discord_response.id}`, {
        headers: {
          authorization: `Bot ${DISCORD_BOT_TOKEN}`
        }
      }).then((res) => res.json());

      if (guild_response.roles) {
        user.roles = guild_response.roles;
      }
    } else {
      user = null;
    }
  } else {
    user = null;
  }

  // Get the IP address of the user to determine the currency, USD is the default, EUR and GBP are supported
  const ip = getClientAddress();
  const location = await fetch(`http://ip-api.com/json/${ip}?fields=8445952`).then((res) => res.json());

  // Get the Stripe prices
  const ProPriceData = await stripe.prices.retrieve(PRICE_ID_PRO);
  const ProPrice = ProPriceData.unit_amount != null ? ProPriceData.unit_amount / 100 : 'Error';
  const EssentialPriceData = await stripe.prices.retrieve(PRICE_ID_ESSENTIAL);
  const EssentialPrice = EssentialPriceData.unit_amount != null ? EssentialPriceData.unit_amount / 100 : 'Error';
  const UpgradePriceData = await stripe.prices.retrieve(PRICE_ID_UPGRADE);
  const UpgradePrice = UpgradePriceData.unit_amount != null ? UpgradePriceData.unit_amount / 100 : 'Error';

  // Get the Roblox game pass prices
  const ProGamePass = await fetch('https://apis.roblox.com/game-passes/v1/game-passes/19208841/product-info').then((res) => res.json());
  const EssentialGamePass = await fetch('https://apis.roblox.com/game-passes/v1/game-passes/166413635/product-info').then((res) => res.json());

  // Get the location of the user to determine the currency, USD is the default, EUR and GBP are supported

  const plans: IPlanPrices = {
    pro: {
      stripe: ProPrice,
      robux: ProGamePass.PriceInRobux
    },
    essential: {
      stripe: EssentialPrice,
      robux: EssentialGamePass.PriceInRobux
    },
    upgrade: {
      stripe: UpgradePrice,
      robux: ''
    },
    none: {
      stripe: '',
      robux: ''
    }
  };

  if (location.currency !== 'EUR' && location.currency !== 'GBP' && location.currency !== 'USD') {
    location.currency = 'USD';
  }

  currency = location.currency;

  return {
    plans,
    currency,
    locale: 'en-US',
    user
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();

    if (formData.get('payment') == 'Stripe') {
      const tier: string = formData.get('tier') as string;
      let priceId: string;

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

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],
        metadata: {
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

      throw redirect(303, session.url as string);
    } else if (formData.get('payment') == 'Robux') {
      const launchData = encodeURIComponent(
        JSON.stringify({
          dID: user?.id,
          dN: user?.username,
          dD: user?.discriminator
        })
      );
      throw redirect(303, `roblox://placeId=13519364215&launchData=${launchData}`);
    }
  }
};
