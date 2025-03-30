import db from './db';

const query = 'SELECT * FROM todos WHERE user_id = ?';

export default defineEventHandler((event) => {
  return new Promise((resolve, reject) => {
    const { userId } = event.context.auth;

    db.all(query, [userId], (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
});
