import db from './db';

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event);

  return new Promise((resolve, reject) => {
    db.run('DELETE FROM todos WHERE id = ?', [id], function (error) {
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
