import bcrypt from 'bcrypt';
import db from './db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  const hashedPassword = await bcrypt.hash(password, 10);

  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (error) {
        if (error) {
          return reject({
            status: 'ERROR',
            message: 'User already exists.'
          });
        }

        resolve({
          status: 'SUCCESS',
          message: 'User registered.',
        });
      }
    );
  });
});
