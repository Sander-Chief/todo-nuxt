import jwt, { JwtPayload } from 'jsonwebtoken';
import { ResponseStatus, ServerResponse } from '~/types';

export default defineEventHandler<Promise<ServerResponse<{ user: string | JwtPayload }>>>((event) => {
  return new Promise((resolve, reject) => {
    try {
      const token = getCookie(event, 'auth_token');
      if (!token) {
        return resolve({
          statusMessage: ResponseStatus.ERROR,
          statusCode: 401,
          message: 'Unauthorized.',
        });
      }

      const user = jwt.verify(token, 'secret-key');
  
      resolve({
        statusMessage: ResponseStatus.SUCCESS,
        data: {
          user,
        },
      });
    } catch (error) {
      console.log(error);
  
      resolve({
        statusMessage: ResponseStatus.ERROR,
        statusCode: 401,
        message: error as string,
      });
    }
  });
});
