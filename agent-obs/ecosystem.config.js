module.exports = {
  apps: [
    {
      name: "agent-obs",
      script: "index.js",
      cwd: __dirname,
      autorestart: true,
      restart_delay: 3000,
      max_restarts: 50,
      watch: false,
    },
  ],
};
