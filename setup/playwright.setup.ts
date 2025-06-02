import sqlite3 from 'sqlite3';

export default async function globalSetup() {
  try {
    const db = new sqlite3.Database('./todo.db');

    db.serialize(() => {
      db.run(`DELETE FROM users WHERE username LIKE 'test_user%'`);
    });

    db.close();
  } catch (error) {
    console.log(error);
  }
}
