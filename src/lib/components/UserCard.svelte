<script lang="ts">
  //
  export let user: { id: string; avatar: string; username: string; discriminator: string } = {
    id: '0',
    avatar: '0',
    username: '0',
    discriminator: '0'
  };

  export let loading = false;
</script>

{#if loading === false}
  <dl class="mt-5 gap-5">
    <div class={`group relative w-full overflow-hidden rounded-lg border border-neutral-700 border-opacity-40 bg-[#050505] bg-cover bg-center bg-no-repeat px-4 py-5 shadow sm:p-6 ${$$props.class}`}>
      <img src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}?size=16" alt="User Avatar Blurred" class="absolute inset-0 h-[75px] max-h-[100px] w-[100px] max-w-[100px] translate-x-[325%] translate-y-[50%] scale-[5] rounded-full bg-gradient-to-r blur-lg transition-all duration-500 will-change-transform group-hover:scale-150 group-active:group-hover:scale-125 group-active:group-hover:duration-200 group-[:checked+&]:scale-150" />
      <div class="relative z-20">
        <dd class="mt-1 flex flex-row justify-between text-3xl font-semibold tracking-tight text-white">
          <p class="flex flex-col">
            <span>
              {user.username + '#' + user.discriminator}
              <br />
              <span class="text-sm font-normal text-neutral-200">
                {user.id}
              </span>
            </span>
            <a href="/api/logout" class="m-0 p-0 text-sm font-normal text-neutral-400 underline opacity-0 transition-opacity duration-300 group-hover:opacity-100">Not you?</a>
          </p>
          <div class="flex items-center justify-center">
            <img src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}?size=256" class="inline-block h-24 w-24 rounded-full drop-shadow-[0_0_10px_rgb(0_0_0_/_0.25)]" alt="User Avatar" />
          </div>
        </dd>
      </div>
    </div>
  </dl>
{:else if loading === true}
  <dl class="mt-5 gap-5">
    <div class={`group relative w-full overflow-hidden rounded-lg border border-neutral-700 border-opacity-40 bg-[#050505] bg-cover bg-center bg-no-repeat px-4 py-5 shadow sm:p-6`}>
      <div class="absolute inset-0 h-[75px] max-h-[100px] w-[100px] max-w-[100px] translate-x-[325%] translate-y-[50%] scale-[5] animate-pulse rounded-full bg-gradient-to-r from-white to-black blur-lg transition-all duration-500 will-change-transform group-hover:scale-150 group-active:group-hover:scale-125 group-active:group-hover:duration-200 group-[:checked+&]:scale-150" />
      <div class="relative z-20">
        <dd class="mt-1 flex flex-row justify-between text-3xl font-semibold tracking-tight text-white">
          <p class="flex h-full w-full flex-col">
            <span class="inline-block h-8 w-56 animate-pulse rounded bg-neutral-700/40">
              <br />
              <span class="mt-5 inline-block h-6 w-44 animate-pulse rounded bg-neutral-700/40" />
            </span>
          </p>
          <div class="flex items-center justify-center">
            <div class="inline-block h-24 w-24 animate-pulse rounded-full bg-neutral-700/40 drop-shadow-[0_0_10px_rgb(0_0_0_/_0.25)]" />
          </div>
        </dd>
      </div>
    </div>
  </dl>
{/if}
