import { ResponseStatus, ServerResponse } from '~/types';
import db from './db';

const query = 'DELETE FROM todos WHERE id = ? AND user_id = ?';

export default defineEventHandler<Promise<ServerResponse>>(async (event) => {
  const { id } = await readBody(event);

  return new Promise((resolve, reject) => {
    const { userId } = event.context.auth;

    db.run(query, [id, userId], function (error) {
      if (error) {
        reject({
          statusMessage: ResponseStatus.ERROR,
          message: error,
        });
      } else {
        resolve({
          statusMessage: ResponseStatus.SUCCESS,
        });
      }
    });
  });
});
