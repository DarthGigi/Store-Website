<script>
  import '../app.css';
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <!-- Primary Meta Tags -->
  <title>Company Store</title>
  <meta name="title" content="Company Store" />
  <meta name="description" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget." />
  <meta content="#2B2D31" name="theme-color" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://store.example.com/" />
  <meta property="og:site_name" content="Company Name" />
  <meta property="og:title" content="Company Store" />
  <meta property="og:description" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget." />
  <meta property="og:image" content="https://placehold.co/1920x1080" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://store.example.com/" />
  <meta property="twitter:title" content="Company Store" />
  <meta property="twitter:description" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget." />
  <meta property="twitter:image" content="https://placehold.co/1920x1080" />

  <!-- Favicons -->
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/logo.svg" />
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/logo.svg" />
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/logo.svg" />
  <link rel="manifest" href="/path/to/site.webmanifest" />
  <link rel="mask-icon" href="/assets/images/logo.svg" color="#000000" />
  <link rel="icon" href="/assets/images/logo.svg" />
  <link rel="shortcut icon" href="/assets/images/logo.svg" />
  <meta name="msapplication-TileColor" content="#000000" />
  <meta name="msapplication-TileImage" content="/path/to/mstile-144x144.png" />
  <meta name="msapplication-config" content="/path/to/browserconfig.xml" />
</svelte:head>

<slot />
