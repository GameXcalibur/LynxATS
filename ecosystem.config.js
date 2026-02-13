/**
 * PM2 Ecosystem Config for LynxATS
 *
 * Install PM2 globally:   npm install -g pm2
 * Start:                  pm2 start ecosystem.config.js
 * Monitor:                pm2 monit
 * Logs:                   pm2 logs lynxats
 * Restart:                pm2 restart lynxats
 * Stop:                   pm2 stop lynxats
 */
module.exports = {
  apps: [
    {
      name: "lynxats",
      script: "node_modules/.bin/next",
      args: "start",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // Restart if the process uses too much memory
      // or if it crashes — wait 5s before restarting
      restart_delay: 5000,
      max_restarts: 50,
      min_uptime: "10s",
      // Exponential backoff on repeated crashes
      exp_backoff_restart_delay: 1000,
      // Log configuration
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
