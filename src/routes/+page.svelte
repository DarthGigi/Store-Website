<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Payments from '$lib/components/Payments.svelte';
	import Tiers from '$lib/components/Tiers.svelte';
	import type { IChoice } from '$lib/types';
	import type { PageData } from './$types';

	export let data: PageData;
	let selected: IChoice = { PlanID: 'essential', PaymentID: '' };
	let showSub = false;
	let enabled = false;
	let price = 0.0;

	console.log(data);

	function ShowPaymentMethods() {
		const payments = document.getElementById('payment') as HTMLElement;
		payments.classList.remove('opacity-30');
		setTimeout(() => {
			payments.scrollIntoView({ behavior: 'smooth' });
		}, 250);
	}
	function UpdatePrice({ detail }: { detail: number }) {
		price = detail;
	}
</script>

<Header choice={selected} bind:price bind:showSub={enabled} {enabled} />

<form class="px-4 py-8 mt-24 w-full lg:col-span-6 lg:mt-0">
	<div class="my-48 max-w-xl space-y-48 mx-auto md:my-72 md:space-y-96 lg:my-96 lg:max-w-md">
		<Tiers
			bind:choice={selected}
			on:planChanged={() => {
				ShowPaymentMethods();
			}}
		/>
		<Payments Choice={selected} bind:enableHeader={enabled} on:paymentChanged={UpdatePrice} />
	</div>
</form>
