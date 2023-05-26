<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<svelte:head>
  <title>{data.props.pageTitle}</title>
</svelte:head>

<div class="flex h-screen w-screen items-center justify-center py-6 sm:py-8 lg:py-12">
  <div class="mx-auto max-w-screen-md px-4 text-[#979797] md:px-8">
    <h1 class="mb-2 !font-sfdisplay text-2xl font-medium text-white sm:text-3xl md:text-5xl">{data.props.title}</h1>
    <p class="mb-6 !font-sfdisplay sm:text-lg md:mb-8">{data.props.message}</p>
  </div>
</div>
