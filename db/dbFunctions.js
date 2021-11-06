import sqlite3 from "sqlite3";
import { open } from "sqlite";

sqlite3.verbose();

// class Database {
//   constructor() {
//     this.db = openDB;
//   }

//   openDB = async () => {
//     return await open({
//       filename: "./db/database.db",
//       driver: sqlite3.cached.Database,
//     });
//   };

//   // Verify Username and MasterKey
//   verification = async () => {
//     const key = await db.get("SELECT Key FROM Master");
//     const user = await db.get("SELECT User FROM Master");

//     return {
//       key,
//       user,
//     };
//   };

//   // Get passwords with MasterKey
//   getPassWord = async (website, db) => {
//     return await db.get(
//       "SELECT PassWord FROM PassWords where Website = ?",
//       website
//     );
//   };

//   // Adds password to database along its website
//   addPassword = async (website, pw, db) => {
//     return await db.run(
//       "INSERT INTO PassWords (Website, PassWord) VALUES (?, ?)",
//       website,
//       pw
//     );
//   };

//   checkForMasterPw = async (db) => {
//     return await db.get("SELECT Key from Master");
//   };

//   setMasterPw = async (newMasterPw, db) => {
//     return await db.run("UPDATE Master SET Key = ?", newMasterPw);
//   };
// }

// export default Database;

export const openDB = async () => {
  return await open({
    filename: "./db/database.db",
    driver: sqlite3.cached.Database,
  });
};

// Verify Username and MasterKey
export const verification = async (db) => {
  const key = await db.get("SELECT Key FROM Master");
  const user = await db.get("SELECT User FROM Master");

  return {
    key,
    user,
  };
};

// Get passwords with MasterKey
export const getPassWord = async (website, db) => {
  return await db.get(
    "SELECT PassWord FROM PassWords where Website = ?",
    website
  );
};

// Adds password to database along its website
export const addPassword = async (website, pw, db) => {
  return await db.run(
    "INSERT INTO PassWords (Website, PassWord) VALUES (?, ?)",
    website,
    pw
  );
};

export const checkForMasterPw = async (db) => {
  return await db.get("SELECT Key from Master");
};

export const setMasterPw = async (newMasterPw, db) => {
  return await db.run("UPDATE Master SET Key = ?", newMasterPw);
};

// // TODO Change how this method works (make it so it can change name of website as well)
// export const changePassword = async (oldPw, newPw) => {
//   return await db.run(
//     "UPDATE PassWords set PassWord = ? where PassWord = ? ",
//     newPw,
//     oldPw
//   );
// };
