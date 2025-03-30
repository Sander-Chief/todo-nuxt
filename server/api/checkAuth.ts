import jwt from 'jsonwebtoken';

export default defineEventHandler((event) => {
  const token = getCookie(event, 'auth_token');
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized.',
    });
  }

  try {
    const user = jwt.verify(token, 'secret-key');

    return {
      status: 'SUCCESS',
      user,
    };
  } catch (error) {
    console.log(error);

    throw createError({
      statusCode: 401,
      message: 'Bad credentials.',
    });
  }
});
