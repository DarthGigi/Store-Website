import type { PageLoad } from './$types';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export const load = (({ params }) => {
  interface PurchaseServices {
    pro: object;
    essential: object;
    upgrade: object;
  }

  interface PurchaseServicesChecks {
    pro: Writable<unknown>;
    essential: Writable<unknown>;
    upgrade: Writable<unknown>;
  }

  let prices: PurchaseServices = {
    pro: {
      stripe: '15.99',
      crypto: '13.99',
      robux: '3,149'
    },
    essential: {
      stripe: '7.99',
      crypto: '6.99',
      robux: '2,149'
    },
    upgrade: {
      stripe: '3.99',
      crypto: '3.99',
      robux: '3.99'
    }
  };

  let checkedStates: PurchaseServicesChecks = {
    pro: writable(),
    essential: writable(),
    upgrade: writable()
  };

  return {
    prices,
    checkedStates,
    title: '',
    description: ''
  };
}) satisfies PageLoad;
