<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Payments from '$lib/components/Payments.svelte';
	import Tiers from '$lib/components/Tiers.svelte';
	import type { IChoice } from '$lib/types';
	import type { PageData } from './$types';

	export let data: PageData;
	let selected: IChoice = { id: '', price: 0 };
	let showSub = false;

	console.log(data);

	function ShowPaymentMethods() {
		const payments = document.getElementById('payment') as HTMLElement;
		payments.classList.remove('opacity-30');
		setTimeout(() => {
			payments.scrollIntoView({ behavior: 'smooth' });
		}, 250);
	}
</script>

<Header choice={selected} {showSub} />

<form class="px-4 py-8 mt-24 w-full lg:col-span-6 lg:mt-0">
	<div class="my-48 max-w-xl space-y-48 mx-auto md:my-72 md:space-y-96 lg:my-96 lg:max-w-md">
		<Tiers
			bind:choice={selected}
			on:choiceChanged={() => {
				ShowPaymentMethods;
			}}
		/>
		<Payments />
	</div>
</form>
