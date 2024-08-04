module.exports = {
  apps: [
    {
      name: 'myapp',       // This is the appName
      script: './server/index.js', // Path to your entry script
      instances: 1,        // Number of instances to run
      autorestart: true,   // Restart app on crashes
      watch: false,        // Watch for file changes (set to true if needed)
      max_memory_restart: '1G', // Restart if memory usage exceeds 1GB
    },
  ],
};
