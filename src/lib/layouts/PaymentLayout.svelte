<script lang="ts">
  export let size: string;

  switch (size) {
    case 'long':
      size = 'grid-cols-1';
      break;

    case 'short':
      size = 'grid-cols-2';
      break;
    default:
      size = 'grid-cols-1';
      break;
  }

  const classes = [size, 'relative mt-3 grid gap-3 text-left leading-6 tracking-tight'];
</script>

<div class={classes.join(' ')}>
  <slot />
</div>
