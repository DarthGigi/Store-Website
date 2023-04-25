<script lang="ts">
	import type { IChoice } from '$lib/types';

	export let choice: IChoice;
	export let showSub: boolean;
	export let enabled: boolean;
	export let price: number;
</script>

<header>
	<div
		id="infoMenu"
		class="pointer-events-auto hidden fixed left-0 top-0 z-50 w-full items-start px-4 md:visible md:flex md:backdrop-blur lg:z-0 lg:backdrop-blur-none"
	>
		<div class="items-left flex flex-col items-start pl-10 pb-4 pt-10">
			<span id="infoMenuTier" class="text-4xl font-bold text-white transition-all"
				>Sirius {enabled && choice && choice.PlanID != undefined
					? choice.PlanID[0].toUpperCase() + choice.PlanID.substring(1).toLowerCase()
					: ''}</span
			>
			<div class="my-2 flex flex-row items-start text-white">
				<svg
					class="mr-2 h-6"
					role="img"
					viewBox="0 0 640 640"
					width={24}
					height={24}
					fill="#fff"
					xmlns="http://www.w3.org/2000/svg"
					><title>Windows</title><path
						d="M.2 298.669L0 90.615l256.007-34.76v242.814H.201zM298.658 49.654L639.905-.012v298.681H298.657V49.654zM640 341.331l-.071 298.681L298.669 592V341.332h341.33zM255.983 586.543L.189 551.463v-210.18h255.794v245.26z"
					/></svg
				>
				<svg class="mr-2 h-6" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
					><title>Apple</title><path
						fill="currentColor"
						d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
					/></svg
				>
			</div>
			<div
				class="mt-4 scale-100 transform flex-col items-start text-neutral-300 opacity-100 duration-500 {showSub
					? ''
					: 'hidden'}"
			>
				<span class="text-lg font-bold">{choice.PaymentID}</span>
				<span class="text-base font-medium"
					>{price.toLocaleString('en-US', {
						style: choice.PaymentID != 'Robux' ? 'currency' : 'decimal',
						currency: 'USD'
					})}</span
				>
			</div>
		</div>
	</div>
</header>
