<script lang="ts">
  export let x: string;
  export let y: string;
  export let tier: string;
  let colors: string;

  switch (tier) {
    case 'Pro':
      colors = 'from-pink-500 to-blue-600';
      break;
    case 'Essential':
      colors = 'from-emerald-500 to-blue-600';
      break;

    case 'Upgrade':
      colors = 'from-orange-500 to-blue-600';
      break;

    default:
      colors = 'from-gray-500 to-blue-600';
      break;
  }

  const classes = ['absolute inset-0 max-h-[100px] max-w-[100px] rounded-full bg-gradient-to-r blur-lg transition-all duration-500 group-hover:scale-150 will-change-transform group-active:group-hover:scale-125 group-active:group-hover:duration-200 group-[:checked+&]:scale-150', colors];
</script>

<div class={classes.join(' ')} style:transform={`translate(${x}%, ${y}%) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`} />
