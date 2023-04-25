<script lang="ts">
	import Tier from './Tier.svelte';
	import Section from './Section.svelte';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import type { IChoice } from '$lib/types';

	export let choice: IChoice;

	const dispatch = createEventDispatcher();

	const select = (id: string) => {
		choice.PlanID = id;
		dispatch('planChanged');
	};
	const handleClick = ({ detail }: { detail: IChoice }) => {
		select(detail.PlanID);
	};
</script>

<Section id="tiers" title="Tier." description="Which is best for you?">
	<Tier
		id="Pro"
		description="WatchTower, Themes & more!"
		bind:price={$page.data.plans.pro.crypto}
		on:click={handleClick}
	/>
	<Tier
		id="Essential"
		description="No Key System, Custom Script Prompts, and more."
		bind:price={$page.data.plans.essential.crypto}
		on:click={handleClick}
	/>
	<Tier
		id="Upgrade"
		description="Upgrade to Pro."
		bind:price={$page.data.plans.upgrade.crypto}
		on:click={handleClick}
	/>
</Section>
