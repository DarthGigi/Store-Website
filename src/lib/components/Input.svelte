<script lang="ts">
  export let id: string;
  export let disabled = false;
  export let required = false;
  export let type = 'text';
  export let name = '';
  export let placeholder = '';
</script>

<div class="relative mt-3 flex text-left leading-6 tracking-tight">
  <input on:keypress {disabled} {required} {type} {id} {name} {placeholder} on:input class="{$$props.class} peer col-span-2 flex w-full items-center justify-between overflow-hidden rounded-lg border border-neutral-700 bg-black px-4 py-3 text-white placeholder-neutral-500 placeholder-transparent shadow-sm backdrop-blur-md transition-all duration-500 focus:border-neutral-500 focus:outline-none focus:ring-neutral-500" />
  <label for={id} class="pointer-events-auto absolute left-1 top-2 z-10 origin-[0] -translate-y-5 translate-x-2 scale-75 transform cursor-text bg-black px-2 text-neutral-400 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:translate-x-2 peer-focus:scale-75 peer-focus:cursor-default peer-focus:bg-black peer-focus:px-2 peer-focus:text-white"><slot /></label>
</div>
