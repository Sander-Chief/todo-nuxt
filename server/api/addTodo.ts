import { ResponseStatus, ServerResponse } from '~/types';
import db from './db';

const query = `INSERT INTO todos (done, content, user_id) VALUES (?, ?, ?)
RETURNING id`;

export default defineEventHandler<Promise<ServerResponse<{ id: number }>>>(async (event) => {
  const { content } = await readBody(event);

  return new Promise((resolve, reject) => {
    if (!content) {
      return reject({
        statusMessage: ResponseStatus.ERROR,
        message: 'No content',
      });
    }

    const { userId } = event.context.auth;

    db.run(query, [false, content, userId], function (error) {
      if (error) {
        reject({
          statusMessage: ResponseStatus.ERROR,
          message: error,
        });
      } else {
        resolve({
          data: {
            id: this.lastID,
          },
          statusMessage: ResponseStatus.SUCCESS,
        });
      }
    });
  });
});
