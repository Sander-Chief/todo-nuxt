import db from './db';

export default defineEventHandler(async (event) => {
  const { done, id } = await readBody(event);

  return new Promise((resolve, reject) => {
    db.run('UPDATE todos SET done = ? WHERE id = ?', [done, id], function (error) {
      if (error) {
        reject(error);
      } else {
        resolve({
          status: 'SUCCESS'
        });
      }
    });
  });
});
