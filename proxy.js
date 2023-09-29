const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/',
    createProxyMiddleware({
      target: 'http://api.geonames.org',
      changeOrigin: true,
      onProxyReq: function(proxyReq, req, res) {
        console.log('Proxying request to:', proxyReq.path);
    })
  );
};