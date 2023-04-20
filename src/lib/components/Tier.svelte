<script lang="ts">
  import { page } from '$app/stores';
  import TierBlobs from './TierBlobs.svelte';

  export let id: string;
  export let txt: string;
  export let x: string;
  export let y: string;

  // bind this to the price
  export let price: string;
</script>

<div class="relative mt-3 flex text-left leading-6 tracking-tight">
  <input required type="radio" {id} bind:group={$page.data.checkedStates} value={id} name="tier" class="peer invisible absolute m-0 cursor-default list-outside list-none p-0 text-left text-sm text-white opacity-0" />
  <label for={id} class="group relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg bg-neutral-700 bg-opacity-[45%] p-[1px] shadow-sm backdrop-blur-md transition-all duration-500 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 peer-checked:!bg-opacity-[100%]">
    <div class="relative w-full rounded-[calc(0.5rem-1px)] bg-[#050505] bg-opacity-100 p-4">
      <TierBlobs tier={id} {x} {y} />
      <span class="z-20 flex w-full cursor-pointer justify-between text-center leading-5 tracking-tight">
        <span class="relative m-0 min-w-0 basis-1/2 cursor-pointer self-center p-0 text-left leading-5 tracking-tight">
          <span class="cursor-pointer text-left text-2xl font-semibold leading-5 tracking-tight text-white">
            {id}
            <span class="relative mt-1 block cursor-pointer text-left text-xs font-normal tracking-normal opacity-70">{txt}</span>
          </span>
        </span>
        <span class="relative m-0 min-w-0 basis-1/2 cursor-pointer self-center p-0 text-right leading-5 tracking-tight">
          <span class="relative mt-1 block cursor-pointer text-right text-xs font-normal tracking-normal text-white">
            <span class="cursor-pointer text-right text-xs leading-4 tracking-normal">
              From
              <span class="inline-block cursor-pointer whitespace-nowrap text-right text-xs leading-4 tracking-normal">{price}</span>
            </span>
          </span>
        </span>
      </span>
    </div>
  </label>
</div>
