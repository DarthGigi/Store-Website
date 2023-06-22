<script lang="ts">
  // This contains the bulk of Skeletons required styles:
  import type { PageData } from './$types';
  export let data: PageData;
  import 'prism-themes/themes/prism-vsc-dark-plus.css';

  // Lua
</script>

<svelte:head>
  <title>{data.props.pageTitle}</title>
</svelte:head>

<div class="flex h-screen w-screen items-center justify-center py-6 sm:py-8 lg:py-12">
  <div class="mx-auto max-w-screen-md px-4 text-[#979797] md:px-8">
    <h1 class="mb-2 !font-sfdisplay text-2xl font-medium text-white sm:text-3xl md:text-5xl">{data.props.title}</h1>
    <p class="mb-6 !font-sfdisplay sm:text-lg md:mb-8">{data.props.message}</p>
    {#if data.props.pageTitle === 'Success'}
      <!-- content here -->
      <div class="relative">
        <!-- button to click and copy the contents of the codeblock -->
        {#await data.props.key then value}
          <button
            id="copyButton"
            class="absolute right-0 top-1/2 z-10 ml-3 mr-2 -translate-y-1/2 cursor-pointer rounded-md border border-neutral-800 bg-black px-3 py-2 text-sm font-medium text-white shadow-sm transition-all duration-500 hover:border-neutral-500 hover:bg-white hover:text-black focus:ring-transparent focus:ring-offset-0 active:scale-90"
            on:click={() => {
              let button = document.getElementById('copyButton');
              navigator.clipboard.writeText(`script_key="${value.users[0].user_key}";\r\nloadstring(game:HttpGet('https://sirius.menu/sirius',true))()`);
              // ignore next line
              // @ts-expect-error - ignore
              button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" /></svg>';
              // @ts-expect-error - ignore
              button.classList.add('!bg-green-800', '!border-green-500', '!text-white');
              setTimeout(() => {
                // @ts-expect-error - ignore
                button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" /></svg>';
                // @ts-expect-error - ignore
                button.classList.remove('!bg-green-800', '!border-green-500', '!text-white');
              }, 2000);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" /></svg>
          </button>
        {/await}

        {#await data.props.key}
          <!-- prettier-ignore -->
          <pre class="language-lua rounded-md relative z-0" data-output="2-17"><code class="language-lua">script_key<span class="token operator">=</span><span class="token string">"Getting your key..."</span><span class="token punctuation">;</span><br/><span class="token function">loadstring</span><span class="token punctuation">(</span>game<span class="token punctuation">:</span><span class="token function">HttpGet</span><span class="token punctuation">(</span><span class="token string">'https://sirius.menu/sirius'</span><span class="token punctuation">,</span><span class="token keyword">true</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>
        {:then value}
          <!-- prettier-ignore -->
          <pre class="language-lua rounded-md relative z-0" data-output="2-17"><code class="language-lua">script_key<span class="token operator">=</span><span class="token string blur-sm transition-all duration-500 hover:blur-none">"{value.users[0].user_key}"</span><span class="token punctuation">;</span><br/><span class="token function">loadstring</span><span class="token punctuation">(</span>game<span class="token punctuation">:</span><span class="token function">HttpGet</span><span class="token punctuation">(</span><span class="token string">'https://sirius.menu/sirius'</span><span class="token punctuation">,</span><span class="token keyword">true</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>
        {/await}
      </div>

      <h2 class="mb-2 mt-8 !font-sfdisplay text-xl font-medium text-white sm:text-2xl md:text-4xl">Support.</h2>
      <p class="mb-6 !font-sfdisplay text-[#979797] sm:text-lg md:mb-8">
        If you have any questions or issues, please contact us in our <a href="https://discord.sirius.menu/" class="underline transition-all duration-300 hover:text-white/80" target="_blank">Discord server</a>.
      </p>
    {/if}
  </div>
</div>
