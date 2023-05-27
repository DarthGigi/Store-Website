<script lang="ts">
  import Tier from './Tier.svelte';
  import Section from './Section.svelte';
  import { page } from '$app/stores';
  import { createEventDispatcher } from 'svelte';
  import type { IChoice } from '$lib/types';

  export let choice: IChoice;
  export let enablePlan = false;

  const dispatch = createEventDispatcher();

  const select = (id: string) => {
    choice.PlanID = id;
    dispatch('planChanged');
    enablePlan = true;
  };
  const handleClick = ({ detail }: { detail: IChoice }) => {
    select(detail.PlanID);
  };
</script>

<Section id="tiers" title="Tier." description="Which is best for you?">
  {#if $page.data.user.hasPro}
    <div class="relative mt-3 flex text-left leading-6 tracking-tight">
      <input disabled type="radio" id="highest" name="tier" class="hidden" />
      <label for="highest" class="group relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg bg-neutral-700 bg-opacity-[45%] p-[1px] shadow-sm backdrop-blur-md transition-all duration-500 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 peer-checked:!bg-opacity-[100%]">
        <div class="relative w-full rounded-[calc(0.5rem-1px)] bg-[#050505] bg-opacity-100 p-4">
          <!-- Blob div Start -->
          <div class={`absolute inset-0 max-h-[100px] max-w-[100px] rounded-full bg-gradient-to-r blur-lg transition-all duration-500 will-change-transform group-hover:scale-150 group-active:group-hover:scale-125 group-active:group-hover:duration-200 group-[:checked+&]:scale-150 from-pink-500 to-blue-600`} style="transform:translate(10%, -10%) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))" />
          <!-- Blob div End-->
          <span class="z-20 flex w-full cursor-pointer justify-between text-center leading-5 tracking-tight">
            <span class="relative m-0 min-w-0 basis-1/2 cursor-pointer self-center p-0 text-left leading-5 tracking-tight">
              <span class="cursor-pointer text-left text-2xl font-semibold leading-5 tracking-tight text-white">
                Highest Tier
                <span class="relative mt-1 block cursor-pointer text-left text-xs font-normal tracking-normal opacity-70">You already have the highest tier purchased.</span>
              </span>
            </span>
          </span>
        </div>
      </label>
    </div>
  {:else if $page.data.user.hasEssential}
    <Tier id="Upgrade" description="Upgrade to Pro." bind:price={$page.data.plans.upgrade.stripe} on:click={handleClick} />
  {:else}
    <Tier id="Pro" description="WatchTower, Themes & more!" bind:price={$page.data.plans.pro.stripe} on:click={handleClick} />
    <Tier id="Essential" description="No Key System, Custom Script Prompts, and more." bind:price={$page.data.plans.essential.stripe} on:click={handleClick} />
  {/if}
</Section>
