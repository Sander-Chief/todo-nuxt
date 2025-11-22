import jwt from 'jsonwebtoken';
import db from './db';
import { ResponseStatus, ServerResponse } from '~/types';

interface DecodedGoogleCredential {
  aud: string;
  email: string;
  exp: number;
  iss: string;
  sub: string;
}

const googleGetUserQuery = 'SELECT * FROM users WHERE google_id = ?';
const googleAddUserQuery = 'INSERT INTO users (username, google_id) VALUES (?, ?) RETURNING id';

const verifyGoogleToken = (token: string | jwt.JwtPayload | null): boolean => {
  if (!token || typeof token === 'string') {
    return false;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  if (!token.exp || token.exp < currentTime) {
    return false;
  }

  if (token.iss !== 'accounts.google.com' && token.iss !== 'https://accounts.google.com') {
    return false;
  }

  return true;
}

const createUserWithGoogleId = async (email: string, googleId: string): Promise<{ id: number }> => {
  return new Promise((resolve, reject) => {
    db.run(
      googleAddUserQuery, [email, googleId], function (error) {
        if (error) {
          reject();
        }

        resolve({
          id: this.lastID,
        });
      }
    );
  });
}

export default defineEventHandler<Promise<ServerResponse<unknown>>>(async (event) => {
  const { credential } = await readBody(event);

  return new Promise((resolve, reject) => {
    const decoded = jwt.decode(credential);

    if (!verifyGoogleToken(decoded)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid Google ID Token.',
      });
    }

    const { email, sub } = decoded as DecodedGoogleCredential;

    db.get(googleGetUserQuery, [sub], async (error, user) => {
      if (error) {
        return reject({
          statusMessage: ResponseStatus.ERROR,
          message: 'Database error.',
        });
      }

      if (!user) {
        const newUser = await createUserWithGoogleId(email, sub);

        if (!newUser) {
          return reject({
            statusMessage: ResponseStatus.ERROR,
            message: 'Failed to create user.',
          });
        }
      }

      const token = jwt.sign({
        id: sub,
        username: email,
      }, 'secret-key', {
        expiresIn: '12h',
      });

      setCookie(event, 'auth_token', token, {
        httpOnly: true,
        secure: true,
      });

      resolve({
        statusMessage: ResponseStatus.SUCCESS,
        message: 'Google Sign-In successful.',
      });
    });
  });
});
