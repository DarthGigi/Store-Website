<script lang="ts">
	export let id: string;
	export let title: string;
	export let description: string;
</script>

<section
	{id}
	class="{$$props.class} w-auto text-left leading-6 tracking-tight transition-all duration-700"
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
