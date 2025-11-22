import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './db';
import { ResponseStatus, ServerResponse } from '~/types';

type User = {
  id: number,
  username: string,
  password: string,
};

export default defineEventHandler<Promise<ServerResponse>>(async (event) => {
  const body = await readBody(event);

  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ? AND google_id IS NULL', [body.username], async (error, user: User) => {
      if (error || !user) {
        return reject({
          statusMessage: ResponseStatus.ERROR,
          message: 'Invalid credentials.',
        });
      }

      const { id, username, password } = user;

      const isValid = await bcrypt.compare(body.password, password);
      if (!isValid) {
        return reject({
          statusMessage: ResponseStatus.ERROR,
          message: 'Invalid credentials.',
        });
      }

      const token = jwt.sign({
        id,
        username,
      }, 'secret-key', {
        expiresIn: '12h',
      });

      setCookie(event, 'auth_token', token, {
        httpOnly: true,
        secure: true,
      });

      resolve({
        statusMessage: ResponseStatus.SUCCESS,
        message: 'Login successful.',
      });
    });
  });
});
