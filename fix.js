const fs = require('fs');

const files = [
  'd:/technova/client/api/analyze.js',
  'd:/technova/client/api/notify.js',
  'd:/technova/client/api/auth/google.js',
  'd:/technova/client/api/auth/me.js',
  'd:/technova/client/api/auth/logout.js'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const (.*?) = require\('(.*?)'\);/g, 'import $1 from \'$2\';');
  content = content.replace(/module\.exports = /g, 'export default ');
  fs.writeFileSync(file, content);
  console.log('Fixed ' + file);
});
