import type { IPlanPrices } from '$lib/types';

export const load = (() => {
    const plans: IPlanPrices = {
        pro: {
          stripe: 15.99,
          crypto: 13.99,
          robux: 3149
        },
        essential: {
          stripe: 7.99,
          crypto: 6.99,
          robux: 2149
        },
        upgrade: {
          stripe: 3.99,
          crypto: 3.99,
          robux: 399
        }
      };

    return {
      plans
    }
})