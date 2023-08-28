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
    console.log(detail);
    select(detail.PlanID);
  };
</script>

<!-- Say Which is best for you? if the user doesn't have TierHigh, else say Which is best for your friend? -->
<Section id="tiersSelection" title="Tier." description={$page.data.streamed.user.hasTierHigh ? 'Which is best for your friend?' : 'Which is best for you?'}>
  {#await $page.data.streamed.user}
    <Tier loading={true} />
    <Tier loading={true} />
  {:then user}
    {#await $page.data.streamed.plans then}
      {#if user.hasTierHigh}
        <Tier id="tier1" title="Tier 1" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit." bind:price={$page.data.streamed.plans.tier1.stripe} on:click={handleClick} />
        <Tier id="tier2" title="Tier 2" description="Feature 1, feature 2, feature 3." bind:price={$page.data.streamed.plans.tier2.stripe} on:click={handleClick} />
      {:else if user.hasTierMed}
        <Tier id="tier3" title="Tier 3" description="Upgrade to TierHigh." bind:price={$page.data.streamed.plans.tier3.stripe} on:click={handleClick} />
      {:else}
        <Tier id="tier1" title="Tier 1" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit." bind:price={$page.data.streamed.plans.tier1.stripe} on:click={handleClick} />
        <Tier id="tier2" title="Tier 2" description="Feature 1, feature 2, feature 3." bind:price={$page.data.streamed.plans.tier2.stripe} on:click={handleClick} />
      {/if}
    {/await}
  {/await}
</Section>
