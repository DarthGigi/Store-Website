<script lang="ts">
  import Tier from './Tier.svelte';
  import Section from './Section.svelte';
  import { page } from '$app/stores';
  import { createEventDispatcher } from 'svelte';
  import type { IChoice } from '$lib/types';

  export let choice: IChoice;
  export let enablePlan = false;

  const dispatch = createEventDispatcher();

  const select = (id: string) => {
    choice.PlanID = id;
    dispatch('planChanged');
    enablePlan = true;
  };
  const handleClick = ({ detail }: { detail: IChoice }) => {
    select(detail.PlanID);
  };
</script>

<!-- Say Which is best for you? if the user doesn't have pro, else say Which is best for your friend? -->
<Section id="tiersSelection" title="Tier." description={$page.data.streamed.user.hasPro ? 'Which is best for your friend?' : 'Which is best for you?'}>
  {#await $page.data.streamed.user}
    <Tier loading={true} />
    <Tier loading={true} />
  {:then user}
    {#await $page.data.streamed.plans then}
      {#if user.hasEssential}
        <Tier id="Upgrade" description="Upgrade to Pro." bind:price={$page.data.streamed.plans.upgrade.stripe} on:click={handleClick} />
      {:else}
        <Tier id="Pro" description="WatchTower, Themes & more!" bind:price={$page.data.streamed.plans.pro.stripe} on:click={handleClick} />
        <Tier id="Essential" description="No Key System, Custom Script Prompts, and more." bind:price={$page.data.streamed.plans.essential.stripe} on:click={handleClick} />
      {/if}
    {/await}
  {/await}
</Section>
