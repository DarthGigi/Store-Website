module.exports = {
  apps: [
    {
      name: 'Sirius-Store',
      script: './build/index.js',
      env: {
        PORT: '3002',
        NODE_ENV: 'production',
        ORIGIN: 'https://store.sirius.menu',
        ADDRESS_HEADER: 'CF-Connecting-IP'
      }
    }
  ]
};
