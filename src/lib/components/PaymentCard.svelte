<script lang="ts">
  export let size: 'long' | 'short';
  let sizeClass: string;

  switch (size) {
    case 'long':
      sizeClass = 'grid-cols-1';
      break;

    case 'short':
      sizeClass = 'grid-cols-2';
      break;
    default:
      sizeClass = 'grid-cols-1';
      break;
  }
</script>

<div class="{sizeClass} relative mt-3 grid gap-3 text-left leading-6 tracking-tight">
  <slot />
</div>
