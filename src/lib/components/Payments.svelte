<script lang="ts">
  import { page } from '$app/stores';
  import type { IChoice } from '$lib/types';
  import { createEventDispatcher } from 'svelte';
  import Payment from './Payment.svelte';
  import PaymentCard from './PaymentCard.svelte';
  import Section from './Section.svelte';
  import Button from './Button.svelte';

  export let choice: IChoice;
  export let enableSubText = false;

  const dispatch = createEventDispatcher();

  const select = ({ id, price }: { id: string; price: number }) => {
    choice.PaymentID = id;
    dispatch('paymentChanged', price);
    enableSubText = true;
  };
  const handleClick = ({ detail }: { detail: { id: string; price: number } }) => {
    select(detail);
  };
</script>

<!-- If a tier is not selected, don't show -->
<Section id="payment" title="Payment." description="Which method suits you?" class="flex !hidden h-screen flex-col justify-center opacity-30">
  <PaymentCard size="long">
    <Payment id="Stripe" plan={choice.PlanID} description="Apple Pay, Google Pay, Card, iDeal" x="100" y="200" on:click={handleClick} />
    {#if !$page.data.streamed.user.hasEssential}
      <Payment id="Robux" plan={choice.PlanID} on:click={handleClick} x="50" y="200" />
    {/if}
  </PaymentCard>
  <Button on_click={() => document.getElementsByTagName('form')[0].submit()} disabled={!choice.PaymentID} id="purchaseBtn">Buy</Button>
</Section>
