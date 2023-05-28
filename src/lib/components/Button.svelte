<script lang="ts">
  export let id: string;
  export let disabled = false;
  export let on_click = () => {
    return;
  };

  // trigger animation on click
  export function toggleLoadingSpinner() {
    const button: HTMLButtonElement = document.getElementById(id) as HTMLButtonElement;
    const textSave: string = button.innerText;

    button.classList.add('opacity-70', 'cursor-wait', 'p-1', 'bg-transparent', 'disabled:hover:bg-transparent');
    button.classList.remove('px-[15px]', 'py-1', 'bg-[#0071e3]', 'hover:bg-[#147ce5]');
    button.disabled = true;
    button.innerHTML = `<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>`;

    // Execute the original on_click function
    on_click();

    // Simulate asynchronous action
    setTimeout(() => {
      button.classList.add('px-[15px]', 'py-1', 'bg-[#0071e3]', 'hover:bg-[#147ce5]');
      button.classList.remove('opacity-70', 'cursor-wait', 'p-1', 'bg-transparent');
      button.disabled = false;
      button.innerHTML = textSave;
    }, 3000);
  }
</script>

<div class="mt-3 flex justify-end text-right leading-6 tracking-tight">
  <button {id} type="button" class="inline-flex cursor-pointer items-center rounded-full border-0 bg-[#0071e3] px-[15px] py-1 text-center font-normal text-white outline-0 transition-all duration-500 [letter-spacing:-0.01em] hover:bg-[#147ce5] disabled:cursor-not-allowed disabled:opacity-40" on:click={toggleLoadingSpinner} {disabled}><slot /></button>
</div>
