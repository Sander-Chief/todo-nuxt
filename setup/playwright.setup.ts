import sqlite3 from 'sqlite3';
import path from 'path';

export default async function globalSetup() {
  try {
    const dbFile = path.resolve(path.dirname('./'), 'todo-e2e.db');
    const db = new sqlite3.Database(dbFile);

    db.serialize(() => {
      db.run('PRAGMA foreign_keys = ON');
  
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        )
      `);
  
      db.run(`
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          done BOOLEAN,
          content TEXT,
          user_id INTEGER,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
    });

    db.close();
  } catch (error) {
    console.log(error);
  }
}
