import { getCookie } from 'h3';
import jwt from 'jsonwebtoken';

export default defineEventHandler((event) => {
  const token = getCookie(event, 'auth_token');
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized.',
    });
  }

  const user = jwt.verify(token, 'secret-key');

  return {
    status: 'SUCCESS',
    user,
  };
});
