const fs = require('fs');

const files = [
  'd:/technova/client/src/hooks/useLanguage.js',
  'd:/technova/client/src/screens/LoginScreen.jsx',
  'd:/technova/client/vite.config.js',
  'd:/technova/client/index.html',
  'd:/technova/server/services/notifyService.js',
  'd:/technova/server/config/env.js',
  'd:/technova/server/index.js'
];

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/ScreenSaathi/g, 'Trustwise');
    content = content.replace(/screensaathi/g, 'trustwise');
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  } catch (err) {
    console.error(`Error processing ${file}: ${err.message}`);
  }
});
