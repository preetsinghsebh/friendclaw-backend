module.exports = {
  apps: [
    {
      name: 'ziva-service',
      script: './ziva-service/src/index.js',
      env: {
        PORT: 3006,
        NODE_ENV: 'production',
        MONGODB_URI: process.env.MONGODB_URI,
        SARVAM_PROXY_URL: "http://localhost:3000"
      }
    },
    {
      name: 'liam-service',
      script: './liam-service/src/index.js',
      env: {
        PORT: 3007,
        NODE_ENV: 'production',
        MONGODB_URI: process.env.MONGODB_URI,
        SARVAM_PROXY_URL: "http://localhost:3000"
      }
    },
    {
      name: 'anime-service',
      script: './anime-service/src/index.js',
      env: {
        PORT: 3008,
        NODE_ENV: 'production',
        MONGODB_URI: process.env.MONGODB_URI,
        SARVAM_PROXY_URL: "http://localhost:3000"
      }
    },
    {
      name: 'celeb-service',
      script: './celeb-service/src/index.js',
      env: {
        PORT: 3009,
        NODE_ENV: 'production',
        MONGODB_URI: process.env.MONGODB_URI,
        SARVAM_PROXY_URL: "http://localhost:3000"
      }
    },
    {
      name: 'safespace-service',
      script: './safespace-service/src/index.js',
      env: {
        PORT: 3010,
        NODE_ENV: 'production',
        MONGODB_URI: process.env.MONGODB_URI,
        SARVAM_PROXY_URL: "http://localhost:3000"
      }
    },
    {
      name: 'mindreset-service',
      script: './mindreset-service/src/index.js',
      env: {
        PORT: 3011,
        NODE_ENV: 'production',
        MONGODB_URI: process.env.MONGODB_URI,
        SARVAM_PROXY_URL: "http://localhost:3000"
      }
    },
    {
      name: 'openclaw-service',
      script: './openclaw-service/src/index.js',
      env: {
        PORT: 3001,
        NODE_ENV: 'production',
        MONGODB_URI: process.env.MONGODB_URI,
        SARVAM_PROXY_URL: "http://localhost:3000"
      }
    },
    {
      name: 'sarvam-proxy',
      script: './sarvam-proxy/index.js',
      env: {
        PORT: 3000,
        NODE_ENV: 'production'
      }
    }
  ]
};
