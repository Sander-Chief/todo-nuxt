import db from './db';  

export default defineEventHandler(() => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM todos', (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
});
