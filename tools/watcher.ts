import chokidar from 'chokidar';

// const watchPath = './src/**/*.ejs'; // Replace with your EJS directory path
const watchPath = '../dist/views/**/*.ejs'
chokidar.watch(watchPath, {
  ignored: /node_modules/ // Ignore the node_modules directory
}).on('change', (filePath) => {
  console.log(`EJS file changed: ${filePath}`);
  // Optionally, perform actions like recompiling templates or restarting the server
});
