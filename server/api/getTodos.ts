import { TTodo } from '~/store/todos';
import { ResponseStatus, ServerResponse } from '~/types';
import db from './db';

const query = 'SELECT * FROM todos WHERE user_id = ?';

export default defineEventHandler<Promise<ServerResponse<{ rows: TTodo[] }>>>((event) => {
  return new Promise((resolve, reject) => {
    const { userId } = event.context.auth;

    db.all(query, [userId], (error, rows: TTodo[]) => {
      if (error) {
        reject({
          statusMessage: ResponseStatus.ERROR,
          message: error,
        });
      } else {
        resolve({
          statusMessage: ResponseStatus.SUCCESS,
          data: {
            rows,
          },
        });
      }
    });
  });
});
