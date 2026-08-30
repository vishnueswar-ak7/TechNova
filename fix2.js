const fs = require('fs');

const files = [
  'd:/technova/client/src/hooks/useLanguage.js',
  'd:/technova/client/src/screens/LoginScreen.jsx',
  'd:/technova/client/index.html',
  'd:/technova/client/vite.config.js',
  'd:/technova/server/services/notifyService.js',
  'd:/technova/client/api/notify.js'
];

files.forEach(file => {
  try {
    let c = fs.readFileSync(file, 'utf8');
    c = c.replace(/Trustwise/g, 'Trust Wise');
    fs.writeFileSync(file, c);
  } catch(e) {}
});
