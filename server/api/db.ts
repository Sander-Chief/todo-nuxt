import sqlite3, { Database } from 'sqlite3';
import path from 'path';

type RowEntry = {
  id: number,
}

export type DatabaseExtended = Database & {
  query?: (sql: string, params: any[]) => Promise<{
    rows: RowEntry[]
  }>,
}

const dbName = process.env.DATABASE_PATH ?? 'todo.db';
const dbPath = path.resolve(path.dirname('./'), dbName);
const db: DatabaseExtended = new sqlite3.Database(dbPath);

db.query = function (sql, params) {
  const self = this;

  return new Promise(function (resolve, reject) {
    self.all(sql, params, function (error: Error, rows: RowEntry[]) {
      if (error)
        reject(error);
      else
        resolve({ rows: rows });
    });
  });
};

export default db;
