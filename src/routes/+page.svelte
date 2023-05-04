<script lang="ts">
  import type { IChoice } from '$lib/types';
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  import Details from '$lib/components/Details.svelte';
  import Header from '$lib/components/Header.svelte';
  import Payments from '$lib/components/Payments.svelte';
  import Tiers from '$lib/components/Tiers.svelte';

  export let data: PageData;
  let selected: IChoice = { PlanID: 'none', PaymentID: '' };
  let showSubText = false;
  let showPlan = false;
  let price = 0.0;

  export let locale;
  onMount(async () => {
    locale = navigator.language;
  });

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

  function ShowPaymentMethods() {
    enableAndScrollToElement(document.getElementById('payment') as HTMLElement);
  }
  function UpdatePrice({ detail }: { detail: number }) {
    price = detail;
    // enableAndScrollToElement(document.getElementById('details') as HTMLElement);
  }

  function handleSubmit(e: SubmitEvent) {
    console.log(e.target);
    let send: { plan: string; service: string; email: string } = {
      email: (document.getElementById('email') as HTMLInputElement).value,
      plan: selected.PlanID,
      service: selected.PaymentID
    };
    fetch('/', { method: 'POST', body: JSON.stringify(send), credentials: 'include' });
  }
</script>

<Header choice={selected} bind:price bind:showSub={showSubText} bind:enabled={showPlan} />

<form class="mt-24 w-full px-4 py-8 lg:col-span-6 lg:mt-0" action="/" method="post" on:submit|preventDefault={handleSubmit}>
  <div class="mx-auto my-48 max-w-xl space-y-48 md:my-72 md:space-y-96 lg:my-96 lg:max-w-md">
    <Tiers
      bind:choice={selected}
      on:planChanged={() => {
        ShowPaymentMethods();
      }}
      bind:enablePlan={showPlan}
    />
    <Payments bind:choice={selected} bind:enableSubText={showSubText} on:paymentChanged={UpdatePrice} />
  </div>
</form>
