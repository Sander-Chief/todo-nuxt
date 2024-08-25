import db from './db';

export default defineEventHandler(async (event) => {
  const { content } = await readBody(event);

  if (!content) {
    return {
      status: 'ERROR'
    };
  }

  const query = `INSERT INTO todos (done, content) VALUES (?, ?)
                RETURNING id`;

  return new Promise((resolve, reject) => {
    db.run(query, [false, content], function (error) {
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
