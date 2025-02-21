import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './db';

type User = {
  id: number,
  username: string,
  password: string,
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [body.username], async (error, user: User) => {
      if (error || !user) {
        return reject({
          status: 'ERROR',
          message: 'Invalid credentials.',
        });
      }

      const { id, username, password } = user;

      const isValid = await bcrypt.compare(body.password, password);
      if (!isValid) {
        return reject({
          status: 'ERROR',
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
        status: 'SUCCESS',
        message: 'Login successful.',
      });
    });
  });
});
