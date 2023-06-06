<script lang="ts">
  import { page } from '$app/stores';
  import { createEventDispatcher } from 'svelte';
  export let id: string;
  export let plan: string;
  export let description = '';
  export let x: string;
  export let y: string;
  let colors = '';
  let stripeTextPositioning = '';

  switch (id) {
    case 'Stripe':
      colors = 'from-purple-500 to-blue-600';
      stripeTextPositioning = '!flex-col !items-stretch';
      break;

    case 'Robux':
      colors = 'from-yellow-500 to-white';
      break;

    default:
      break;
  }

  const dispatch = createEventDispatcher();

  const click = () => {
    dispatch('click', { id, price: $page.data.streamed.plans[plan.toLowerCase()][id.toLowerCase()] });
  };
</script>

<div
  on:click={click}
  on:keypress={() => {
    return;
  }}
>
  <input required type="radio" {id} value={id} name="payment" class="hidden" />
  <label for={id} class="group relative flex h-24 w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg bg-neutral-800 bg-opacity-70 p-4 shadow-sm backdrop-blur-md transition-all duration-500 hover:scale-105 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 active:scale-50 active:hover:scale-100 peer-checked:scale-95 peer-disabled:pointer-events-none peer-disabled:cursor-default peer-disabled:hover:scale-100">
    <div class="{colors} absolute inset-0 max-h-[100px] max-w-[100px] transform rounded-full bg-gradient-to-r blur-lg transition-all duration-500 will-change-transform group-active:group-hover:duration-200 group-[:checked+&]:scale-[600%]" style:transform={`translate(${x}%, ${y}%) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`} />

    <span class="{stripeTextPositioning} z-20 flex w-full cursor-pointer flex-col items-center justify-center text-center leading-5 tracking-tight md:flex-row md:items-baseline md:justify-between">
      <span class="relative m-0 min-w-0 basis-1/2 cursor-pointer p-0 text-left leading-5 tracking-tight">
        <span class="cursor-pointer text-left text-lg font-semibold leading-5 tracking-tight text-white">
          {#if id !== 'Stripe'}
            {id}
          {:else if id === 'Stripe'}
            {id}
            <span class="relative mt-1 block cursor-pointer text-left text-xs font-normal tracking-normal opacity-70">{description}</span>
          {/if}
        </span>
      </span>
      <span class="relative m-0 min-w-0 basis-1/2 cursor-pointer p-0 text-right leading-5 tracking-tight">
        <span id={id + 'Price'} class="inline-block cursor-pointer whitespace-nowrap text-right text-xs leading-4 tracking-normal text-white">
          {#if $page.data.streamed.plans[plan.toLowerCase()][id.toLowerCase()] != ''}
            {new Intl.NumberFormat($page.data.locale, {
              style: id !== 'Robux' ? 'currency' : 'decimal',
              currency: $page.data.streamed.currency
            }).format($page.data.streamed.plans[plan.toLowerCase()][id.toLowerCase()])}
          {/if}
        </span>
      </span>
    </span>
  </label>
</div>
