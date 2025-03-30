import jwt, { JwtPayload } from 'jsonwebtoken';

const protectedPaths = [
  '/api/getTodos',
  '/api/addTodo',
  '/api/deleteTodo',
  '/api/toggleTodoDone',
  '/api/syncTodos',
];

export default defineEventHandler(async (event) => {
  const { path } = event;

  if (protectedPaths.includes(path)) {
    try {
      const token = getCookie(event, 'auth_token');
      if (!token) {
        throw createError({
          statusCode: 401,
          message: 'Unauthorized.',
        });
      }

      const user = jwt.verify(token, 'secret-key');
      const { id } = user as JwtPayload;
  
      event.context.auth = {
        userId: id,
      };
    } catch (error) {
      throw createError({
        statusCode: 401,
        message: 'Bad credentials.',
      });
    }
  }
});
