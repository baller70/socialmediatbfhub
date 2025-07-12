// Simple test script to check if our iframe fix works
console.log('Testing iframe functionality...');

// Create a test iframe element
const testIframe = document.createElement('iframe');
testIframe.src = 'http://example.com';
testIframe.style.width = '400px';
testIframe.style.height = '300px';
testIframe.style.border = '1px solid #ccc';

testIframe.onload = function() {
    console.log('✅ Test iframe loaded successfully!');
};

testIframe.onerror = function() {
    console.log('❌ Test iframe failed to load');
};

// Add to body for testing
document.body.appendChild(testIframe);

console.log('Test iframe created and added to page');
