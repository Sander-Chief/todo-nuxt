import bcrypt from 'bcrypt';
import db from './db';
import { ResponseStatus, ServerResponse } from '~/types';

export default defineEventHandler<Promise<ServerResponse>>(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  const hashedPassword = await bcrypt.hash(password, 10);

  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (error) {
        if (error) {
          return reject({
            statusMessage: ResponseStatus.ERROR,
            message: 'User already exists.'
          });
        }

        resolve({
          statusMessage: ResponseStatus.SUCCESS,
          message: 'User registered.',
        });
      }
    );
  });
});
