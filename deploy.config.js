// module.exports = {
//   app: [
//     {
//       name: 'vitepress-docs',
//       // script: '',
//       env: {
//         COMMON_VARIABLE: 'true'
//       },
//       env_production: {
//         NODE_ENV: 'production'
//       }
//     }
//   ],
//   deploy: {
//     production: {
//       user: 'root',
//       host: '120.77.63.71',
//       ref: 'origin/main',
//       repo: 'https://gitee.com/kevinleeeee/vitepress-docs-site.git',
//       path: '/www/vitepress-docs/production',
//       'pre-deploy': 'git fetch --all',
//       'post-deploy':
//         'npm install && npm run deploy && pm2 startOrRestart deploy.config.js --env production'
//     }
//   }
// };
