<script lang="ts">
  export let id: string;
</script>

<div id={id + 'ModalContainer'} class="relative z-50 scale-0" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div id={id + 'ModalBackdrop'} class="fixed inset-0 bg-gray-500 bg-opacity-75 opacity-0 transition-opacity duration-500 ease-in-out" />

  <div class="pointer-events-none fixed inset-0 z-10 overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div id={id + 'Modal'} class="relative translate-y-4 transform overflow-hidden rounded-lg bg-black text-left opacity-0 shadow-xl transition-all duration-500 ease-in-out sm:my-8 sm:w-full sm:max-w-lg sm:translate-y-0 sm:scale-95">
        <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-white sm:mx-0 sm:h-10 sm:w-10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-12 w-12 sm:h-10 sm:w-10">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
