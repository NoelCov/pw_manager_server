import pwGenerator from "./passwordGenerator.js";
import encryptPw from "./encryptPassword.js";
import decryptPw from "./decryptPassword.js";

// Generate random password
const randomPw = pwGenerator(30);

// Encrypt random password with a message
// Add to DB
const encryptedPassword = encryptPw(randomPw, "facebook");

// Decrypt encrypted password with message 
// Copy to clipboard 
const decryptedPassword = decryptPw(encryptedPassword, "facebook");