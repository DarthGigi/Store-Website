<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Button from '$lib/components/Button.svelte';
  import Error from '$lib/components/Error.svelte';
  import Guide from '$lib/components/Guide.svelte';
  import Input from '$lib/components/Input.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import Payment from '$lib/components/Payment.svelte';
  import Section from '$lib/components/Section.svelte';
  import Tier from '$lib/components/Tier.svelte';
  import PaymentLayout from '$lib/layouts/PaymentLayout.svelte';
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>
<Header />

<form class="px-4 py-8 sm:mt-24 sm:w-full sm:px-10 lg:col-span-6 lg:mt-0">
  <div class="my-48 max-w-xl space-y-48 sm:mx-auto md:my-72 md:space-y-96 lg:my-96 lg:max-w-md">
    <Section id="tier" title="Tier." description="Which is best for you?">
      <Tier id="Pro" txt="WatchTower, Themes, and more." price="$13.99" x="10" y="-10" />
      <Tier id="Essential" txt="No Key System, Custom Script Prompts, and more." price="$6.99" x="300" y="60" />
      <Tier id="Upgrade" txt="Upgrade to Pro." price="$3.99" x="180" y="-40" />
    </Section>
    <Section id="payment" title="Payment." description="Which method suits you?">
      <PaymentLayout size="long">
        <Payment id="Stripe" description="Apple Pay, Google Pay, Card, iDeal" x="100" y="200" />
      </PaymentLayout>
      <PaymentLayout size="short">
        <Payment id="Crypto" x="50" y="200" />
        <Payment id="Robux" x="50" y="200" />
      </PaymentLayout>
      <Guide />
    </Section>
    <Section id="details" title="Details." description="Your information.">
      <Modal id="details" />
      <Input type="email" id="email" placeholder="Email" />
      <Input type="text" id="discordid" placeholder="Discord ID" />
      <Button />
      <Error />
    </Section>
  </div>
</form>
