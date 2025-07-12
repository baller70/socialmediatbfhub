
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Enhanced proxy endpoint with better error handling
app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // Validate URL
    const url = new URL(targetUrl);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return res.status(400).json({ error: 'Invalid URL protocol' });
    }

    console.log(`Proxying request to: ${targetUrl}`);

    // Fetch the content with enhanced headers
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      },
      timeout: 15000,
      maxRedirects: 10,
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Accept redirects
      }
    });

    const contentType = response.headers['content-type'] || '';
    let content = response.data;

    // Only process HTML content
    if (contentType.includes('text/html')) {
      try {
        // Parse and modify HTML
        const $ = cheerio.load(content);
        const baseUrl = `${url.protocol}//${url.host}`;

        // Fix relative URLs
        $('a[href^="/"], link[href^="/"], script[src^="/"], img[src^="/"], form[action^="/"]').each((i, elem) => {
          const $elem = $(elem);
          const attrName = $elem.attr('href') ? 'href' : 
                          $elem.attr('src') ? 'src' : 
                          $elem.attr('action') ? 'action' : null;
          
          if (attrName) {
            const currentValue = $elem.attr(attrName);
            if (currentValue && currentValue.startsWith('/')) {
              $elem.attr(attrName, baseUrl + currentValue);
            }
          }
        });

        // Add base tag
        if (!$('base').length) {
          $('head').prepend(`<base href="${baseUrl}/">`);
        }

        // Advanced frame busting prevention and iframe compatibility
        const frameFixScript = `
          <script>
            (function() {
              try {
                // Advanced frame busting prevention
                if (window.top !== window.self) {
                  // Override top and parent references
                  Object.defineProperty(window, 'top', {
                    get: function() { return window.self; },
                    set: function() { return window.self; },
                    configurable: false
                  });
                  
                  Object.defineProperty(window, 'parent', {
                    get: function() { return window.self; },
                    set: function() { return window.self; },
                    configurable: false
                  });
                  
                  // Override frameElement
                  Object.defineProperty(window, 'frameElement', {
                    get: function() { return null; },
                    set: function() { return null; },
                    configurable: false
                  });
                  
                  // Override location checks
                  const originalLocation = window.location;
                  Object.defineProperty(window, 'location', {
                    get: function() { return originalLocation; },
                    set: function() { return false; },
                    configurable: false
                  });
                }
                
                // Disable common frame busting techniques
                window.onbeforeunload = null;
                document.onbeforeunload = null;
                
                // Override setTimeout/setInterval for frame busting
                const originalSetTimeout = window.setTimeout;
                const originalSetInterval = window.setInterval;
                
                window.setTimeout = function(fn, delay) {
                  if (typeof fn === 'string') {
                    const fnStr = fn.toLowerCase();
                    if (fnStr.includes('top.location') || fnStr.includes('parent.location') || 
                        fnStr.includes('window.top') || fnStr.includes('self.parent') ||
                        fnStr.includes('top.href') || fnStr.includes('parent.href')) {
                      console.log('Blocked frame busting setTimeout:', fn);
                      return;
                    }
                  }
                  return originalSetTimeout.apply(this, arguments);
                };
                
                window.setInterval = function(fn, delay) {
                  if (typeof fn === 'string') {
                    const fnStr = fn.toLowerCase();
                    if (fnStr.includes('top.location') || fnStr.includes('parent.location') || 
                        fnStr.includes('window.top') || fnStr.includes('self.parent') ||
                        fnStr.includes('top.href') || fnStr.includes('parent.href')) {
                      console.log('Blocked frame busting setInterval:', fn);
                      return;
                    }
                  }
                  return originalSetInterval.apply(this, arguments);
                };
                
                // Override document.write for frame busting
                const originalDocumentWrite = document.write;
                document.write = function(content) {
                  if (typeof content === 'string') {
                    const contentStr = content.toLowerCase();
                    if (contentStr.includes('top.location') || contentStr.includes('parent.location') ||
                        contentStr.includes('framebuster') || contentStr.includes('framebreaker')) {
                      console.log('Blocked frame busting document.write:', content);
                      return;
                    }
                  }
                  return originalDocumentWrite.apply(this, arguments);
                };
                
                // Block common frame detection scripts
                const originalEval = window.eval;
                window.eval = function(code) {
                  if (typeof code === 'string') {
                    const codeStr = code.toLowerCase();
                    if (codeStr.includes('top') && codeStr.includes('location') ||
                        codeStr.includes('parent') && codeStr.includes('location') ||
                        codeStr.includes('framebuster') || codeStr.includes('framebreaker')) {
                      console.log('Blocked frame busting eval:', code);
                      return;
                    }
                  }
                  return originalEval.apply(this, arguments);
                };
                
              } catch (e) {
                console.log('Frame protection error:', e);
              }
            })();
          </script>
        `;
        
        $('head').prepend(frameFixScript);

        // Remove problematic meta tags and scripts
        $('meta[http-equiv="refresh"]').remove();
        $('meta[http-equiv="X-Frame-Options"]').remove();
        $('meta[http-equiv="Content-Security-Policy"]').remove();
        
        // Remove frame-busting scripts
        $('script').each((i, elem) => {
          const $elem = $(elem);
          const scriptContent = $elem.html();
          if (scriptContent && (
            scriptContent.includes('top.location') ||
            scriptContent.includes('parent.location') ||
            scriptContent.includes('window.top') ||
            scriptContent.includes('frameElement') ||
            scriptContent.includes('framebuster') ||
            scriptContent.includes('framebreaker') ||
            scriptContent.includes('top!=self') ||
            scriptContent.includes('top !== self') ||
            scriptContent.includes('top!=window') ||
            scriptContent.includes('top !== window')
          )) {
            console.log('Removed frame-busting script');
            $elem.remove();
          }
        });

        content = $.html();
      } catch (parseError) {
        console.log('HTML parsing error:', parseError.message);
        // If parsing fails, return original content
      }
    }

    // Set enhanced response headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Remove ALL iframe-blocking headers from original response
    const headersToRemove = [
      'X-Frame-Options',
      'Content-Security-Policy',
      'X-Content-Security-Policy', 
      'X-WebKit-CSP',
      'X-Content-Type-Options',
      'X-XSS-Protection',
      'Referrer-Policy',
      'Feature-Policy',
      'Permissions-Policy',
      'Cross-Origin-Embedder-Policy',
      'Cross-Origin-Opener-Policy',
      'Cross-Origin-Resource-Policy'
    ];
    
    headersToRemove.forEach(header => {
      res.removeHeader(header);
    });
    
    // Add permissive headers for iframe embedding
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Content-Security-Policy', "frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline';");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    
    res.send(content);

  } catch (error) {
    console.error('Proxy error for', targetUrl, ':', error.message);
    
    if (error.code === 'ENOTFOUND') {
      res.status(404).json({ error: 'Website not found', details: error.message });
    } else if (error.code === 'ECONNREFUSED') {
      res.status(503).json({ error: 'Connection refused', details: error.message });
    } else if (error.code === 'ETIMEDOUT') {
      res.status(408).json({ error: 'Request timeout', details: error.message });
    } else if (error.response) {
      res.status(error.response.status).json({ 
        error: `HTTP ${error.response.status}: ${error.response.statusText}`,
        details: error.message
      });
    } else {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }
});

// Advanced CORS proxy with URL rewriting
app.get('/cors-proxy', async (req, res) => {
  const targetUrl = req.query.url;
  
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const url = new URL(targetUrl);
    console.log(`CORS Proxy request to: ${targetUrl}`);

    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': url.origin,
        'Origin': url.origin,
        'DNT': '1',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'iframe',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 20000,
      maxRedirects: 5
    });

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Expose-Headers', '*');
    
    // Copy response headers (except problematic ones)
    Object.keys(response.headers).forEach(key => {
      if (!['content-encoding', 'transfer-encoding', 'connection', 'x-frame-options', 'content-security-policy'].includes(key.toLowerCase())) {
        res.setHeader(key, response.headers[key]);
      }
    });

    res.send(response.data);

  } catch (error) {
    console.error('CORS Proxy error:', error.message);
    res.status(500).json({ error: 'CORS proxy failed', details: error.message });
  }
});

// Screenshot endpoint using puppeteer
app.get('/screenshot', async (req, res) => {
  const targetUrl = req.query.url;
  const format = req.query.format || 'png'; // png or html
  
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const puppeteer = require('puppeteer');
    
    console.log(`Taking screenshot of: ${targetUrl}`);
    
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Navigate to page
    await page.goto(targetUrl, { 
      waitUntil: 'networkidle2', 
      timeout: 30000 
    });
    
    if (format === 'html') {
      // Return HTML content
      const content = await page.content();
      await browser.close();
      
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('X-Frame-Options', 'ALLOWALL');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(content);
    } else {
      // Return screenshot
      const screenshot = await page.screenshot({ 
        type: 'png',
        fullPage: false
      });
      
      await browser.close();
      
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minute cache
      res.send(screenshot);
    }
    
  } catch (error) {
    console.error('Screenshot error for', targetUrl, ':', error.message);
    res.status(500).json({ 
      error: 'Screenshot failed', 
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// CORS preflight
app.options('*', cors());

app.listen(PORT, () => {
  console.log(`Enhanced Proxy server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Proxy usage: http://localhost:${PORT}/proxy?url=https://example.com`);
});

module.exports = app;
