import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(path.dirname('./'), 'todo.db');
const db = new sqlite3.Database(dbPath);

export default db;
