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
      <div id="intro" class="flex flex-col gap-10">
        <div>
          <h2 class="m-0 p-0 text-left text-2xl font-semibold tracking-wide">
            <span class="!font-sfdisplay text-2xl font-semibold leading-7 text-white">
              Purchasing as
              <span class="text-neutral-400">
                {data.user.username}
              </span>
            </span>
          </h2>
          <dl class="mt-5 gap-5">
            <div class="group relative w-full overflow-hidden rounded-lg border border-neutral-700 border-opacity-40 bg-[#050505] bg-cover bg-center bg-no-repeat px-4 py-5 shadow sm:p-6">
              <img src="https://cdn.discordapp.com/avatars/{data.user.id}/{data.user.avatar}?size=16" alt="User Avatar Blurred" class="absolute inset-0 h-[75px] max-h-[100px] w-[100px] max-w-[100px] scale-[5] rounded-full bg-gradient-to-r blur-lg transition-all duration-500 will-change-transform group-hover:scale-150 group-active:group-hover:scale-125 group-active:group-hover:duration-200 group-[:checked+&]:scale-150" style="transform:translate(325%, 50%) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))" />
              <div class="relative z-20">
                <dd class="mt-1 flex flex-row justify-between text-3xl font-semibold tracking-tight text-white">
                  <p class="flex flex-col">
                    <span>
                      {data.user.username + '#' + data.user.discriminator}
                      <br />
                      <span class="text-sm font-normal text-neutral-200">
                        {data.user.id}
                      </span>
                    </span>
                    <a href="/api/logout" class="m-0 p-0 text-sm font-normal text-neutral-400 underline opacity-0 transition-opacity duration-300 group-hover:opacity-100">Not you?</a>
                  </p>
                  <div class="flex items-center justify-center">
                    <img src="https://cdn.discordapp.com/avatars/{data.user.id}/{data.user.avatar}?size=256" class="inline-block h-24 w-24 rounded-full drop-shadow-[0_0_10px_rgb(0_0_0_/_0.25)]" alt="User Avatar" />
                  </div>
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
  <main class="relative grid min-h-screen place-items-center overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
    <div id="blob" class="absolute inset-0 h-[75px] max-h-[100px] w-[100px] max-w-[100px] origin-center translate-x-[325%] translate-y-[50%] scale-[5] transform rounded-full bg-gradient-to-r from-pink-500 via-blue-600 to-emerald-500 blur-lg transition-all duration-500 ease-in-out will-change-transform" />
    <div class="relative z-10 flex max-w-lg flex-col">
      <div class="text-left">
        <h1 class="mt-4 text-3xl font-bold tracking-tight text-neutral-200 sm:text-5xl">Welcome</h1>
        <p id="desc" class="mt-2 text-base leading-7 text-neutral-400">Before continuing to the Sirius Store, you'll need to connect Sirius to your Discord account using the login button below.</p>
      </div>
      <div class="mt-11 flex items-center justify-end">
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <a
          on:mouseover={() => {
            document.getElementById('blob')?.classList.add('!scale-[20]');
            document.getElementById('desc')?.classList.add('!opacity-40', '!text-white');
          }}
          on:mouseout={() => {
            document.getElementById('blob')?.classList.remove('!scale-[20]');
            document.getElementById('desc')?.classList.remove('!opacity-40', '!text-white');
          }}
          href="/api/auth"
          class="flex flex-row items-center justify-center rounded-md bg-[#5865F2] px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-[rgb(20_20_20)] hover:bg-opacity-30 hover:text-opacity-70"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.3034 5.33716C17.9344 4.71103 16.4805 4.2547 14.9629 4C14.7719 4.32899 14.5596 4.77471 14.411 5.12492C12.7969 4.89144 11.1944 4.89144 9.60255 5.12492C9.45397 4.77471 9.2311 4.32899 9.05068 4C7.52251 4.2547 6.06861 4.71103 4.70915 5.33716C1.96053 9.39111 1.21766 13.3495 1.5891 17.2549C3.41443 18.5815 5.17612 19.388 6.90701 19.9187C7.33151 19.3456 7.71356 18.73 8.04255 18.0827C7.41641 17.8492 6.82211 17.5627 6.24904 17.2231C6.39762 17.117 6.5462 17.0003 6.68416 16.8835C10.1438 18.4648 13.8911 18.4648 17.3082 16.8835C17.4568 17.0003 17.5948 17.117 17.7434 17.2231C17.1703 17.5627 16.576 17.8492 15.9499 18.0827C16.2789 18.73 16.6609 19.3456 17.0854 19.9187C18.8152 19.388 20.5875 18.5815 22.4033 17.2549C22.8596 12.7341 21.6806 8.80747 19.3034 5.33716ZM8.5201 14.8459C7.48007 14.8459 6.63107 13.9014 6.63107 12.7447C6.63107 11.5879 7.45884 10.6434 8.5201 10.6434C9.57071 10.6434 10.4303 11.5879 10.4091 12.7447C10.4091 13.9014 9.57071 14.8459 8.5201 14.8459ZM15.4936 14.8459C14.4535 14.8459 13.6034 13.9014 13.6034 12.7447C13.6034 11.5879 14.4323 10.6434 15.4936 10.6434C16.5442 10.6434 17.4038 11.5879 17.3825 12.7447C17.3825 13.9014 16.5548 14.8459 15.4936 14.8459Z" /></svg>
          Login with Discord
        </a>
      </div>
    </div>
  </main>
{/if}
