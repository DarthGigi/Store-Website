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

  let sectionTitle: string;
  let sectionDescription: string;

  if ($page.data.user.hasPro) {
    sectionTitle = 'Your License';
    sectionDescription = '';
  } else {
    sectionTitle = 'Tier.';
    sectionDescription = 'Which is best for you?';
  }
</script>

<Section id="tiers" title={sectionTitle} description={sectionDescription}>
  {#if $page.data.user.hasPro}
    <Tier id="Pro" disabled description="WatchTower, Themes & more!" bind:price={$page.data.plans.pro.stripe} on:click={handleClick} />
  {:else if $page.data.user.hasEssential}
    <Tier id="Upgrade" description="Upgrade to Pro." bind:price={$page.data.plans.upgrade.stripe} on:click={handleClick} />
  {:else}
    <Tier id="Pro" description="WatchTower, Themes & more!" bind:price={$page.data.plans.pro.stripe} on:click={handleClick} />
    <Tier id="Essential" description="No Key System, Custom Script Prompts, and more." bind:price={$page.data.plans.essential.stripe} on:click={handleClick} />
  {/if}
</Section>
