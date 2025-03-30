import db from './db';

const query = 'UPDATE todos SET done = ? WHERE id = ? AND user_id = ?';

export default defineEventHandler(async (event) => {
  const { done, id } = await readBody(event);

  return new Promise((resolve, reject) => {
    const { userId } = event.context.auth;

    db.run(query, [done, id, userId], function (error) {
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
