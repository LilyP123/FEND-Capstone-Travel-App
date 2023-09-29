const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/proxy',
    createProxyMiddleware({
      target: 'https://api.meaningcloud.com',
      changeOrigin: true,
      pathRewrite: {
        '^/proxy': '/sentiment-2.1',
      },
    })
  );
};