// Import the XKPasswd modules from the npm package
import {XKPasswd} from '../node_modules/xkpasswdjs/src/xkpasswd.mjs';

// Make XKPasswd available globally for the extension
window.XKPasswd = XKPasswd;

console.log('XKPasswd loaded successfully from npm package');