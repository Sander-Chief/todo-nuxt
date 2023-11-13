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
    db.run(query, [false, content], function (error: unknown) {
      if (error) {
        reject(error);
      } else {
        resolve({
          // @ts-ignore
          id: this.lastID,
          status: 'SUCCESS'
        });
      }
    });
  });
});
