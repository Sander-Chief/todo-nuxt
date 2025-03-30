import db from './db';

const query = `INSERT INTO todos (done, content, user_id) VALUES (?, ?, ?)
RETURNING id`;

export default defineEventHandler(async (event) => {
  const { content } = await readBody(event);

  if (!content) {
    return {
      status: 'ERROR'
    };
  }

  return new Promise((resolve, reject) => {
    const { userId } = event.context.auth;

    db.run(query, [false, content, userId], function (error) {
      if (error) {
        reject(error);
      } else {
        resolve({
          id: this.lastID,
          status: 'SUCCESS'
        });
      }
    });
  });
});
