import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(path.dirname('./'), 'todo.db');
const db = new sqlite3.Database(dbPath);

// @ts-ignore
db.query = function (sql: string, params: any[]) {
  var that = this;
  return new Promise(function (resolve, reject) {
    // @ts-ignore
    that.all(sql, params, function (error, rows) {
      if (error)
        reject(error);
      else
        resolve({ rows: rows });
    });
  });
};

export default db;
