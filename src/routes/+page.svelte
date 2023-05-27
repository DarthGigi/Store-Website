<script lang="ts">
  import type { IChoice } from '$lib/types';
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  import Header from '$lib/components/Header.svelte';
  import Payments from '$lib/components/Payments.svelte';
  import Tiers from '$lib/components/Tiers.svelte';

  export let data: PageData;
  let selected: IChoice = { PlanID: 'none', PaymentID: '' };
  let showSubText = false;
  let showPlan = false;
  let price = 0.0;

  // Set locale from the browser
  onMount(async () => {
    data.locale = navigator.language;
  });

  // Scroll to the center of the element, smooth
  function enableAndScrollToElement(ele: HTMLElement) {
    ele.classList.forEach((cl) => {
      if (/opacity|hidden|scale/.test(cl)) {
        ele.classList.remove(cl);
      }
    });
    setTimeout(() => {
      ele.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 250);
  }

  // Scroll to the payment methods
  function ShowPaymentMethods() {
    enableAndScrollToElement(document.getElementById('payment') as HTMLElement);
  }

  // Update the price
  function UpdatePrice({ detail }: { detail: number }) {
    price = detail;
    // enableAndScrollToElement(document.getElementById('details') as HTMLElement);
  }

  // Position the user at the center of the first section if they're logged in
  if (data.user) {
    onMount(() => {
      const intro = document.getElementById('intro') as HTMLDivElement;
      intro.scrollIntoView({ behavior: 'auto', block: 'center' });
    });
  }
</script>

{#if data.user}
  <Header choice={selected} bind:price bind:showSub={showSubText} bind:enabled={showPlan} />

  <form class="mt-24 w-full px-4 py-8 lg:col-span-6 lg:mt-0" action="/" method="post">
    <div class="mx-auto my-48 max-w-xl space-y-48 md:my-72 md:space-y-96 lg:my-96 lg:max-w-md">
      <div id="intro" class="gap-10 flex flex-col">
        <div>
          <h3 class="text-lg font-medium leading-6 text-neutral-200">Purchasing as</h3>
          <dl class="mt-5 gap-5">
            <div class="group w-full relative overflow-hidden rounded-lg border border-neutral-700 border-opacity-40 bg-[#050505] bg-cover bg-center bg-no-repeat px-4 py-5 shadow sm:p-6">
              <img src="https://cdn.discordapp.com/avatars/{data.user.id}/{data.user.avatar}?size=128" alt="User Avatar Blurred" class={`absolute inset-0 max-h-[100px] h-[75px] w-[100px] max-w-[100px] rounded-full bg-gradient-to-r blur-lg transition-all duration-500 will-change-transform group-hover:scale-150 group-active:group-hover:scale-125 group-active:group-hover:duration-200 group-[:checked+&]:scale-150 from-pink-500 to-blue-600`} style="transform:translate(340%, 60%) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))" />
              <div class="relative z-20">
                <dt class="hidden truncate text-sm font-medium text-neutral-400">Profile</dt>
                <dd class="mt-1 text-3xl font-semibold tracking-tight text-neutral-300">
                  <img src="https://cdn.discordapp.com/avatars/{data.user.id}/{data.user.avatar}?size=1024" class="inline-block h-10 w-10 rounded-full" alt="User Avatar" />
                  <br />
                  {data.user.username + '#' + data.user.discriminator}
                  <br />
                  <span class="text-sm font-normal text-neutral-200">
                    {data.user.id}
                    <span class="text-sm font-normal text-neutral-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">Not you? <a href="/api/logout" class="underline">Logout</a></span>
                  </span>
                </dd>
              </div>
            </div>
          </dl>
        </div>
        <Tiers
          bind:choice={selected}
          on:planChanged={() => {
            ShowPaymentMethods();
          }}
          bind:enablePlan={showPlan}
        />
      </div>
      {#if !data.user.hasPro}
        <Payments bind:choice={selected} bind:enableSubText={showSubText} on:paymentChanged={UpdatePrice} />
      {/if}
    </div>
  </form>
{:else}
  <main class="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
    <div class="text-center">
      <h1 class="mt-4 text-3xl font-bold tracking-tight text-neutral-200 sm:text-5xl">Not authenticated</h1>
      <p class="mt-6 text-base leading-7 text-neutral-400">You must authenticate with discord in order to purchase Sirius</p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <a href="/api/auth" class="text-sm font-semibold hover:underline text-neutral-500">Login <span aria-hidden="true">&rarr;</span></a>
      </div>
    </div>
  </main>
{/if}
