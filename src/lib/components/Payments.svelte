<script lang="ts">
	import Payment from './Payment.svelte';
	import PaymentCard from './PaymentCard.svelte';
	import Section from './Section.svelte';
</script>

<Section id="payment" title="Payment." description="Which method suits you?">
	<PaymentCard size="long">
		<Payment id="Stripe" description="Apple Pay, Google Pay, Card, iDeal" x="100" y="200" />
	</PaymentCard>
</Section>
