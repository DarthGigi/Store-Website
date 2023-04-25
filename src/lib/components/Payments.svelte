<script lang="ts">
	import type { IChoice } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	import Payment from './Payment.svelte';
	import PaymentCard from './PaymentCard.svelte';
	import Section from './Section.svelte';
	import PaymentGuide from './PaymentGuide.svelte';

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

<Section id="payment" title="Payment." description="Which method suits you?" class="opacity-30">
	<PaymentCard size="long">
		<Payment
			id="Stripe"
			plan={choice.PlanID}
			description="Apple Pay, Google Pay, Card, iDeal"
			x="100"
			y="200"
			on:click={handleClick}
		/>
	</PaymentCard>
	<PaymentCard size="short">
		<Payment id="Crypto" plan={choice.PlanID} on:click={handleClick} x="50" y="200" />
		<Payment id="Robux" plan={choice.PlanID} on:click={handleClick} x="50" y="200" />
	</PaymentCard>
	{#if choice.PaymentID == 'Robux'}
		<PaymentGuide />
	{/if}
</Section>
