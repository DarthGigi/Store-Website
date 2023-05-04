import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { IPlanPrices } from '$lib/types';
import { STRIPE_SECRET_KEY, PRICE_ID_PRO, PRICE_ID_ESSENTIAL } from '$env/static/private';
import Stripe from 'stripe';

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });
const baseURLIP = 'http://ip-api.com/json/';
const baseURLOptions = '?fields=8445952';
const botDetect = /(bot)/gm;

export const load = (async ({ getClientAddress }) => {
  // Get the IP address of the user to determine the currency, USD is the default, EUR and GBP are supported
  const ip = getClientAddress();
  const location = await fetch(`${baseURLIP}${ip}${baseURLOptions}`).then((res) => res.json());

  // Get the Stripe prices
  const ProPriceData = await stripe.prices.retrieve(PRICE_ID_PRO);
  const ProPrice = ProPriceData.unit_amount != null ? ProPriceData.unit_amount / 100 : 'Error';
  const EssentialPriceData = await stripe.prices.retrieve(PRICE_ID_ESSENTIAL);
  const EssentialPrice = EssentialPriceData.unit_amount != null ? EssentialPriceData.unit_amount / 100 : 'Error';

  // Get the Roblox game pass prices
  const ProGamePass = await fetch('https://apis.roblox.com/game-passes/v1/game-passes/19208841/product-info').then((res) => res.json());
  const EssentialGamePass = await fetch('https://apis.roblox.com/game-passes/v1/game-passes/166413635/product-info').then((res) => res.json());

  // Get the location of the user to determine the currency, USD is the default, EUR and GBP are supported

  const plans: IPlanPrices = {
    pro: {
      stripe: ProPrice,
      crypto: 13.99,
      robux: ProGamePass.PriceInRobux
    },
    essential: {
      stripe: EssentialPrice,
      crypto: 6.99,
      robux: EssentialGamePass.PriceInRobux
    },
    upgrade: {
      stripe: 3.99,
      crypto: 3.99,
      robux: ''
    },
    none: {
      stripe: '',
      crypto: '',
      robux: ''
    }
  };

  if (location.currency !== 'EUR' || location.currency !== 'GBP' || location.currency !== 'USD') {
    location.currency = 'USD';
  }

  return {
    plans,
    currency: location.currency
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async (event) => {
    console.log(event);
  }
};
