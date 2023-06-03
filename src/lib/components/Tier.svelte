<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { page } from '$app/stores';

  export let id = '';
  export let description = '';
  export let price = 0;
  export let disabled = false;
  export let loading = false;
  let blobColor: string;
  let x: string;
  let y: string;

  switch (id.toLowerCase()) {
    case 'pro': {
      blobColor = 'from-pink-500 to-blue-600';
      x = '10';
      y = '-10';
      break;
    }

    case 'essential': {
      blobColor = 'from-emerald-500 to-blue-600';
      x = '300';
      y = '60';
      break;
    }

    case 'upgrade': {
      blobColor = 'from-orange-500 to-blue-600';
      x = '180';
      y = '-40';
      break;
    }

    default:
      blobColor = 'from-gray-500 to-blue-600';
      x = '0';
      y = '0';
      break;
  }

  const dispatch = createEventDispatcher();

  const click = () => dispatch('click', { PlanID: id });
</script>

{#if loading === false}
  <!-- This needs to be made accessible (basically just look check if the event is triggered by like the tab or space key or smt)-->
  <div
    class="relative mt-3 flex text-left leading-6 tracking-tight"
    on:click={() => {
      click();
    }}
    on:keypress={() => {
      return;
    }}
  >
    <input {disabled} required type="radio" {id} value={id} name="tier" class="hidden" />
    <label for={id} class="group relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg bg-neutral-700 bg-opacity-[45%] p-[1px] shadow-sm backdrop-blur-md transition-all duration-500 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 peer-checked:!bg-opacity-[100%]">
      <div class="relative w-full rounded-[calc(0.5rem-1px)] bg-[#050505] bg-opacity-100 p-4">
        <!-- Blob div Start -->
        <div class={`absolute inset-0 max-h-[100px] max-w-[100px] rounded-full bg-gradient-to-r blur-lg transition-all duration-500 will-change-transform group-hover:scale-150 group-active:group-hover:scale-125 group-active:group-hover:duration-200 group-[:checked+&]:scale-150 ${blobColor}`} style="transform:translate({x}%, {y}%) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))" />
        <!-- Blob div End-->
        <span class="z-20 flex w-full cursor-pointer justify-between text-center leading-5 tracking-tight">
          <span class="relative m-0 min-w-0 basis-1/2 cursor-pointer self-center p-0 text-left leading-5 tracking-tight">
            <span class="cursor-pointer text-left text-2xl font-semibold leading-5 tracking-tight text-white">
              {id}
              <span class="relative mt-1 block cursor-pointer text-left text-xs font-normal tracking-normal opacity-70">{description}</span>
            </span>
          </span>
          <span class="relative m-0 min-w-0 basis-1/2 cursor-pointer self-center p-0 text-right leading-5 tracking-tight">
            <span class="relative mt-1 block cursor-pointer text-right text-xs font-normal tracking-normal text-white">
              <span class="cursor-pointer text-right text-xs leading-4 tracking-normal">
                From
                {#await $page.data.streamed.currency then currency}
                  <span class="inline-block cursor-pointer whitespace-nowrap text-right text-xs leading-4 tracking-normal">{price.toLocaleString('en-US', { style: 'currency', currency: currency })}</span>
                {/await}
              </span>
            </span>
          </span>
        </span>
      </div>
    </label>
  </div>
{:else}
  <div class="relative mt-3 flex text-left leading-6 tracking-tight">
    <div class="group relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg bg-neutral-700 bg-opacity-[45%] p-[1px] shadow-sm backdrop-blur-md transition-all duration-500 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 peer-checked:!bg-opacity-[100%]">
      <div class="relative w-full rounded-[calc(0.5rem-1px)] bg-[#050505] bg-opacity-100 p-4">
        <span class="z-20 flex w-full cursor-pointer justify-between text-center leading-5 tracking-tight">
          <span class="relative m-0 min-w-0 basis-1/2 cursor-pointer self-center p-0 text-left leading-5 tracking-tight">
            <span class="block h-6 w-24 animate-pulse cursor-pointer rounded bg-neutral-700/40 text-left text-2xl font-semibold leading-5 tracking-tight text-white" />
            <span class="relative mt-1 block h-6 w-60 animate-pulse cursor-pointer rounded bg-neutral-700/40 text-left text-xs font-normal tracking-normal opacity-70" />
          </span>
          <span class="relative m-0 min-w-0 basis-1/2 cursor-pointer self-center p-0 text-right leading-5 tracking-tight">
            <span class="relative mt-1 block cursor-pointer text-right text-xs font-normal tracking-normal text-white">
              <span class="inline-block h-6 w-8 animate-pulse cursor-pointer rounded bg-neutral-700/40 text-right text-xs leading-4 tracking-normal" />
            </span>
          </span>
        </span>
      </div>
    </div>
  </div>
{/if}
