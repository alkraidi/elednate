module.exports = {
  apps: [
    {
      name: 'eledante-backend',
      cwd: './apps/backend',
      script: 'yarn',
      args: 'start',
      env: { NODE_ENV: 'production', PORT: '9000' },
      max_memory_restart: '1G',
      autorestart: true,
      out_file: '/var/log/eledante/backend.out.log',
      error_file: '/var/log/eledante/backend.err.log',
    },
    {
      name: 'eledante-storefront',
      cwd: './apps/storefront',
      script: 'yarn',
      args: 'start',
      env: { NODE_ENV: 'production', PORT: '3100' },
      max_memory_restart: '512M',
      autorestart: true,
      out_file: '/var/log/eledante/storefront.out.log',
      error_file: '/var/log/eledante/storefront.err.log',
    },
  ],
};
