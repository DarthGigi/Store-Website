<script lang="ts">
	export let id: string;
	export let title: string;
	export let description: string;

	let classes: string;

	switch (id) {
		case 'payment': {
			classes = 'opacity-30';
			break;
		}
		case 'details': {
			classes = 'scale-0 opacity-0 hidden';
			break;
		}
		default: {
			classes = '';
			break;
		}
	}
</script>

<section
	{id}
	class:name={[
		$$props.class,
		classes,
		'w-auto text-left leading-6 tracking-tight transition-all duration-500'
	]}
>
	<h2 class="m-0 p-0 text-left text-2xl font-semibold tracking-wide">
		<span class="!font-sfdisplay text-2xl font-semibold leading-7 text-white">
			{title}
			<span class="text-neutral-400">
				{description}
			</span>
		</span>
	</h2>
	<slot />
</section>
