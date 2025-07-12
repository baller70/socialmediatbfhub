"use client";

import { SmartIframe } from '@/components/smart-iframe';

export default function TestSmartIframe() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">SmartIframe Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Test 1: Example.com (Direct)</h2>
          <div style={{ width: '800px', height: '400px', border: '1px solid #ccc' }}>
            <SmartIframe
              src="http://example.com"
              title="Example.com Test"
              embedMethod="direct"
              proxyAvailable={true}
              onLoad={() => console.log('✅ Test 1: Example.com loaded!')}
              onError={() => console.log('❌ Test 1: Example.com failed!')}
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Test 2: Example.com (Proxy)</h2>
          <div style={{ width: '800px', height: '400px', border: '1px solid #ccc' }}>
            <SmartIframe
              src="http://example.com"
              title="Example.com Proxy Test"
              embedMethod="proxy"
              proxyAvailable={true}
              onLoad={() => console.log('✅ Test 2: Example.com proxy loaded!')}
              onError={() => console.log('❌ Test 2: Example.com proxy failed!')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
