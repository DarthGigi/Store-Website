module.exports = {
  apps: [
    {
      name: 'Store',
      script: './build/index.js',
      env: {
        PORT: '3002',
        NODE_ENV: 'production',
        ORIGIN: 'https://store.example.com',
        ADDRESS_HEADER: 'CF-Connecting-IP'
      }
    }
  ]
};
