<script>
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>
    {$page.status}
    {$page.error?.message}
  </title>
</svelte:head>
<div class="flex h-screen w-screen items-center justify-center py-6 sm:py-8 lg:py-12">
  <div class="mx-auto max-w-screen-md px-4 text-[#979797] md:px-8">
    <h1 class="mb-2 text-2xl font-medium text-white sm:text-3xl md:text-5xl">
      {$page.status}
      {#if $page.error?.message}
        — {$page.error?.message}
      {/if}
    </h1>
    <p class="mb-6 sm:text-lg md:mb-8">
      The page you are looking for does not exist or something went wrong. <br /> Are you sure you are in the right place?
    </p>
    <div class="w-full text-center">
      <a href="/" class="text-[#979797] underline transition-colors duration-200 ease-in-out hover:text-[#ffffff]">Go back home →</a>
    </div>
  </div>
</div>
