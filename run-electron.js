
#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Multi-App Social Dashboard in Desktop Mode...\n');

// Start Next.js dev server
console.log('📦 Starting Next.js development server...');
const nextProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname),
  stdio: 'pipe'
});

let nextReady = false;

nextProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`[Next.js] ${output.trim()}`);
  
  // Check if Next.js is ready
  if (output.includes('Ready in') || output.includes('Local:')) {
    if (!nextReady) {
      nextReady = true;
      startElectron();
    }
  }
});

nextProcess.stderr.on('data', (data) => {
  console.error(`[Next.js Error] ${data.toString().trim()}`);
});

function startElectron() {
  console.log('\n⚡ Starting Electron application...');
  
  const electronProcess = spawn('npx', ['electron', '.'], {
    cwd: path.join(__dirname),
    stdio: 'inherit'
  });

  electronProcess.on('close', (code) => {
    console.log(`\n🔌 Electron process exited with code ${code}`);
    console.log('🛑 Shutting down Next.js server...');
    nextProcess.kill();
    process.exit(code);
  });

  electronProcess.on('error', (error) => {
    console.error('❌ Failed to start Electron:', error);
    nextProcess.kill();
    process.exit(1);
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down...');
  nextProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  nextProcess.kill();
  process.exit(0);
});
