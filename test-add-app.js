
// Test script to add a simple app
const response = await fetch('/api/apps', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Example Test',
    url: 'http://example.com',
    category: 'General',
    icon: '🌐'
  })
});
console.log('Add app response:', await response.json());

