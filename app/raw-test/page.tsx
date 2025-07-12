"use client";

import { RawIframeTest } from '@/components/raw-iframe-test';

export default function RawTest() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Raw Iframe Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Raw HTML Iframe Test</h2>
          <RawIframeTest
            src="http://example.com"
            title="Example.com Raw"
          />
        </div>
      </div>
    </div>
  );
}
