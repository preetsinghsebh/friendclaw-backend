const http = require('http');

http.get('http://localhost:3000', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    if (data.includes('Uncaught Error') || data.includes('ReferenceError') || data.includes('TypeError')) {
      console.log('Found JS error in HTML payload:');
      const lines = data.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Error')) {
           console.log(lines[i].substring(0, 500));
        }
      }
    } else {
      console.log('No obvious unhandled JS string errors found in the initial HTML payload.');
    }
  });
});
