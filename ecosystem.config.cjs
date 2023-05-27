module.exports = {
  apps: [
    {
      name: 'Sirius-Store',
      script: './build/index.js',
      env: {
        NODE_PORT: '3002',
        NODE_ENV: 'production'
      }
    }
  ]
};
