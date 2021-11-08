import express from "express";
import cors from "cors";

import {
  verification,
  openDB,
  getPassWord,
  addPassword,
  checkForMasterPw,
  setMasterPw,
} from "./db/dbFunctions.js";

import decryptPw from "./pw_utils/decryptPassword.js";

const db = await openDB();

const app = express();
app.use(
  cors({
    origin: [
      "http://pw-manager-noelcov.vercel.app",
      "http://localhost:3000",
      "http://pw-manager-flame.vercel.app",
      "https://pw-manager-flame.vercel.app",
      "http://pw-manager-noelcov.vercel.app",
    ],
    methods: ["POST"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hi there");
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const pw = req.body.encryptedPw;
  const encryptionMessage = req.body.encryptionMessage;

  // Get username and encrypted master password from db
  const data = await verification(db);
  const encryptedMasterPw = data["key"]["Key"];
  const masterUsername = data["user"]["User"];

  if (username !== masterUsername) {
    res.send("Wrong username");
  } else {
    if (encryptedMasterPw === "") {
      res.send("Password not set");
    } else {
      try {
        // Decrypt password and master password
        const decryptedPw = decryptPw(pw, encryptionMessage);
        const decryptedMasterPw = decryptPw(
          encryptedMasterPw,
          encryptionMessage
        );

        if (decryptedPw !== decryptedMasterPw) {
          res.send("Wrong PassWord");
        } else {
          res.send("Correct PassWord");
        }
      } catch (e) {
        res.send("Encryption Message Incorrect");
      }
    }
  }
});

app.post("/change", async (req, res) => {
  const oldMasterPw = req.body.oldMasterPwEncrypted;
  const newMasterPwEncrypted = req.body.newMasterPwEncrypted;
  const oldEncryptMessage = req.body.oldEncryptMessage;

  // If no oldMasterPw check if there is a master password in db
  // if there is not, set up new password. Else send error.
  if (!oldMasterPw) {
    const result = await checkForMasterPw(db);
    if (result["Key"] === "") {
      const result = await setMasterPw(newMasterPwEncrypted, db);
      if (result) {
        res.send("Master Password Successfully Changed");
      }
    } else {
      res.send("Old Password is Needed");
    }
  } else {
    // If there is an oldMasterPw then we know there is a previous master password
    // we check if it is the correct one and then we store new master password
    const decryptedOldMasterPw = decryptPw(oldMasterPw, oldEncryptMessage);
    let encryptedMasterPw = await checkForMasterPw(db);
    encryptedMasterPw = encryptedMasterPw["Key"];
    const decryptedMasterPw = decryptPw(encryptedMasterPw, oldEncryptMessage);

    if (decryptedOldMasterPw === decryptedMasterPw) {
      const result = await setMasterPw(newMasterPwEncrypted, db);
      if (result) {
        res.send("Master Password Successfully Changed");
      } else {
        res.send("Problem setting up New Password");
      }
    }
  }
});

app.post("/pw", async (req, res) => {
  const website = req.body.website;

  try {
    const result = await getPassWord(website, db);
    if (result) {
      res.send(result);
    }
  } catch (e) {
    console.error(e);
  }
});

app.post("/add", async (req, res) => {
  const website = req.body.website;
  const encryptedPw = req.body.encryptedPw;

  try {
    const result = await addPassword(website, encryptedPw, db);
    if (result) {
      res.send("Password Saved Successfully");
    } else {
      console.log(result);
      res.send("Password not saved");
    }
  } catch (e) {}
});

app.listen(process.env.PORT || 8000, () => {
  console.log("Server running on port 8000");
});
