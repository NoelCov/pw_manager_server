import CryptoJS from "crypto-js";

// Decrypt
const decryptPw = (encryptedPw, message) => {
  return CryptoJS.AES.decrypt(encryptedPw, message).toString(CryptoJS.enc.Utf8);
};

export default decryptPw;