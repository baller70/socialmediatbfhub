
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Enable CORS for all origins
app.use(cors());

// Proxy endpoint
app.use('/proxy', createProxyMiddleware({
  target: 'http://example.com', // This will be overridden
  changeOrigin: true,
  router: (req) => {
    // Get the target URL from query parameter
    const targetUrl = req.query.url;
    if (!targetUrl) {
      throw new Error('URL parameter is required');
    }
    
    try {
      const url = new URL(targetUrl);
      return `${url.protocol}//${url.host}`;
    } catch (error) {
      throw new Error('Invalid URL provided');
    }
  },
  pathRewrite: (path, req) => {
    // Get the target URL and extract the path
    const targetUrl = req.query.url;
    try {
      const url = new URL(targetUrl);
      return url.pathname + url.search;
    } catch (error) {
      return '/';
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    // Remove headers that prevent iframe embedding
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
    delete proxyRes.headers['x-content-type-options'];
    
    // Add headers to allow iframe embedding
    proxyRes.headers['x-frame-options'] = 'ALLOWALL';
    
    console.log(`Proxied: ${req.query.url} - Status: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', port: PORT, service: 'iframe-proxy' });
});

app.listen(PORT, () => {
  console.log(`🚀 Iframe Proxy Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Proxy usage: http://localhost:${PORT}/proxy?url=<target_url>`);
});
