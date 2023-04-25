<script lang="ts">
	import type { IChoice } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	import Payment from './Payment.svelte';
	import PaymentCard from './PaymentCard.svelte';
	import Section from './Section.svelte';

	export let Choice: IChoice;
	export let enableHeader = false;

	const dispatch = createEventDispatcher();

	const select = ({ id, price }: { id: string; price: number }) => {
		Choice.PaymentID = id;
		dispatch('paymentChanged', price);
		enableHeader = true;
	};
	const handleClick = ({ detail }: { detail: { id: string; price: number } }) => {
		select(detail);
	};
</script>

<Section id="payment" title="Payment." description="Which method suits you?">
	<PaymentCard size="long">
		<Payment
			id="Stripe"
			plan={Choice.PlanID}
			description="Apple Pay, Google Pay, Card, iDeal"
			x="100"
			y="200"
			on:click={handleClick}
		/>
	</PaymentCard>
	<PaymentCard size="short">
		<Payment id="Crypto" plan={Choice.PlanID} x="50" y="200" />
		<Payment id="Robux" plan={Choice.PlanID} x="50" y="200" />
	</PaymentCard>
</Section>
