module.exports = {
  apps: [{
    name: 'solution-generator',
    script: 'src/api.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    instances: 1,
    autorestart: true,
    max_memory_restart: '256M'
  }]
};
