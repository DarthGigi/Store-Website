<script lang="ts">
  import type { IChoice } from '$lib/types';
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  import Header from '$lib/components/Header.svelte';
  import UserCard from '$lib/components/UserCard.svelte';
  import Payments from '$lib/components/Payments.svelte';
  import Tiers from '$lib/components/Tiers.svelte';
  import Section from '$lib/components/Section.svelte';
  import Input from '$lib/components/Input.svelte';
  import Button from '$lib/components/Button.svelte';

  export let data: PageData;
  let selected: IChoice = { PlanID: 'none', PaymentID: '' };
  let showSubText = false;
  let showPlan = false;
  let price = 0.0;
  let gift = false;
  // Set locale from the browser
  onMount(async () => {
    data.locale = navigator.language;
  });

  // Scroll to the center of the element, smooth
  function enableAndScrollToElement(ele: HTMLElement | null) {
    ele?.classList.forEach((cl) => {
      if (/opacity|hidden|scale|!hidden/.test(cl)) {
        ele?.classList.remove(cl);
      }
    });
    setTimeout(() => {
      ele?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  }

  // Scroll to the payment methods
  function ShowPaymentMethods() {
    enableAndScrollToElement(document.getElementById('payment') as HTMLElement);
  }

  // Update the price
  function UpdatePrice({ detail }: { detail: number }) {
    price = detail;
  }
</script>

{#if data.logged_in}
  <Header choice={selected} bind:price bind:showSub={showSubText} bind:enabled={showPlan} />
  <form class="mt-24 w-full px-4 lg:col-span-6 lg:mt-0" action="/" method="post">
    <div class="mx-auto max-w-xl lg:max-w-md">
      <section id="tiers" class="flex h-screen flex-col justify-center gap-10">
        <div>
          <h2 class="m-0 p-0 text-left text-2xl font-semibold tracking-wide">
            {#await data.streamed.user}
              <span class="flex flex-row items-center !font-sfdisplay text-2xl font-semibold leading-7 text-white">
                Purchasing as
                <span class="ml-2 inline-flex h-6 w-20 animate-pulse rounded bg-neutral-700/40" />
              </span>
            {:then user}
              <span class="!font-sfdisplay text-2xl font-semibold leading-7 text-white">
                Purchasing as
                <span class="text-neutral-400">
                  {user.global_name || user.username}
                </span>
              </span>
            {/await}
          </h2>
          {#await data.streamed.user}
            <UserCard loading={true} class="animate-pulse" />
          {:then user}
            <UserCard loading={false} {user} />
          {/await}
        </div>
        <Tiers
          bind:choice={selected}
          on:planChanged={() => {
            enableAndScrollToElement(document.getElementById('gifting'));
          }}
          bind:enablePlan={showPlan}
        />
      </section>
      <Section id="gifting" title="Feeling Generous?" class="flex !hidden h-screen flex-col justify-center">
        <p class="-mt-[1px] mb-2 text-base text-white/40">Buying Sirius for a friend? Enter your friend's Discord ID below to gift a license to them</p>
        <Input
          id="gift"
          type="number"
          name="giftUser"
          placeholder="Discord ID"
          required={data.streamed.user.hasPro ? true : false}
          on:input={() => {
            const giftInput = document.getElementById('gift');
            const giftBtn = document.getElementById('giftBtn');
            const giftAlert = document.getElementById('giftAlert');
            if (!giftInput || !giftBtn || !giftAlert) return;
            // @ts-expect-error - value is a valid property
            if (giftInput.value) {
              // must be at least 17 characters long
              // @ts-expect-error - value is a valid property
              if (giftInput.value.length < 17) {
                giftBtn.innerHTML = 'Invalid ID';
                // @ts-expect-error - disabled is a valid property
                giftBtn.disabled = true;
                giftAlert.classList.add('!opacity-0');
                gift = false;
                return;
              } else {
                giftBtn.innerHTML = 'Continue';
                // @ts-expect-error - disabled is a valid property
                giftBtn.disabled = false;
                giftAlert.classList.remove('!opacity-0');
                gift = true;
              }
            } else {
              giftBtn.innerHTML = data.streamed.user.hasPro ? 'Continue' : 'Skip';
              // disable the button if the user has pro
              // @ts-expect-error - disabled is a valid property
              giftBtn.disabled = data.streamed.user.hasPro ? true : false;
              giftAlert.classList.add('!opacity-0');
              gift = false;
            }
          }}
          on:keypress={(e) => {
            const validCharacters = /[0-9]/;
            if (!validCharacters.test(e.key)) {
              e.preventDefault();
            }
          }}
        >
          ID
        </Input>
        <div class="flex flex-row-reverse justify-between">
          <Button
            id="giftBtn"
            disabled={data.streamed.user.hasPro ? true : false}
            on_click={() => {
              ShowPaymentMethods();
            }}
          >
            {data.streamed.user.hasPro ? 'Continue' : 'Skip'}
          </Button>
          <p id="giftAlert" class="mt-3 text-base text-white !opacity-0 opacity-20 transition-opacity duration-300">Gifting is enabled</p>
        </div>
      </Section>
      <Payments bind:choice={selected} bind:gift bind:enableSubText={showSubText} on:paymentChanged={UpdatePrice} />
    </div>
    <!-- discord ID -->
    {#await data.streamed.user then user}
      <input type="hidden" name="mainUser" value={JSON.stringify(user)} />
    {/await}
  </form>
{:else}
  <main class="relative grid min-h-screen place-items-center overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
    <div id="blob" class="absolute inset-0 h-[75px] max-h-[100px] w-[100px] max-w-[100px] origin-center translate-x-[325%] translate-y-[50%] scale-[5] transform rounded-full bg-gradient-to-r from-pink-500 via-blue-600 to-emerald-500 blur-lg transition-all duration-500 ease-in-out will-change-transform" />
    <div class="relative z-10 flex max-w-lg flex-col">
      <div class="text-left">
        <h1 class="mt-4 text-3xl font-bold tracking-tight text-neutral-200 sm:text-5xl">Welcome</h1>
        <p id="desc" class="mt-2 text-base leading-7 text-white opacity-40">Before continuing to the Sirius Store, you'll need to connect Sirius to your Discord account using the login button below.</p>
      </div>
      <div class="mt-11 flex items-center justify-end">
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <a
          on:mouseover={() => {
            document.getElementById('blob')?.classList.add('!scale-[20]');
          }}
          on:mouseout={() => {
            document.getElementById('blob')?.classList.remove('!scale-[20]');
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
