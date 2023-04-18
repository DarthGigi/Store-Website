<script lang="ts">
  export let id: string;
  export let description: string = '';
  export let x: string;
  export let y: string;
  let colors: string = '';
  let height: string = '';
  let span1: string = '';

  switch (id) {
    case 'Stripe':
      colors = 'from-purple-500 to-blue-600';
      height = '!h-24';
      span1 = '!flex-col !items-stretch';
      break;

    case 'Crypto':
      colors = 'from-yellow-500 to-orange-600';
      break;

    case 'Robux':
      colors = 'from-yellow-500 to-white';
      break;

    default:
      break;
  }

  const labelClasses = [height, 'h-20 peer-checked:scale-95 group relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg bg-neutral-800 bg-opacity-70 p-4 shadow-sm backdrop-blur-md transition-all duration-500 hover:scale-105 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 active:scale-50 active:hover:scale-100 peer-disabled:pointer-events-none peer-disabled:hover:scale-100 peer-disabled:cursor-default'];

  const colorClasses = [colors, 'absolute inset-0 max-h-[100px] max-w-[100px] transform rounded-full bg-gradient-to-r blur-lg transition-all duration-500 group-active:group-hover:duration-200 group-[:checked+&]:scale-[600%]'];

  const spanClasses = [span1, 'flex-col md:flex-row justify-center md:items-baseline items-center z-20 flex w-full cursor-pointer md:justify-between text-center leading-5 tracking-tight'];
</script>

<div>
  <input required type="radio" {id} value={id} name="payment" class="peer invisible absolute m-0 cursor-default list-outside list-none p-0 text-left text-sm text-white opacity-0" />
  <label for={id} class={labelClasses.join(' ')}>
    <div class={colorClasses.join(' ')} style:transform={`translate(${x}%, ${y}%) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`} />

    <span class={spanClasses.join(' ')}>
      <span class="relative m-0 min-w-0 basis-1/2 cursor-pointer p-0 text-left leading-5 tracking-tight">
        <span class="cursor-pointer text-left text-lg font-semibold leading-5 tracking-tight text-white">
          {#if id !== 'Stripe'}
            {id}Test1
          {:else if id === 'Stripe'}
            {id}
            <span class="relative mt-1 block cursor-pointer text-left text-xs font-normal tracking-normal opacity-70">{description}</span>
          {/if}
        </span>
      </span>
      <span class="relative m-0 min-w-0 basis-1/2 cursor-pointer p-0 text-right leading-5 tracking-tight">
        <span id={id + 'Price'} class="inline-block cursor-pointer whitespace-nowrap text-right text-xs leading-4 tracking-normal text-white"> $13.37 </span>
      </span>
    </span>
  </label>
</div>
