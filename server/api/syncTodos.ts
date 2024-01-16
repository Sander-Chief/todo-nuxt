import db from './db';

export default defineEventHandler(async (event) => {
const todos = await readBody(event);

  if (!todos?.length) {
    return {
      status: 'ERROR'
    };
  }

  console.log(todos);

  return new Promise(async (resolve, reject) => {
    try {
      const updatedRows = await Promise.all(todos.map(async (todo: any) => {
        if (todo.deleted) {
          // Delete the row from the database
          await db.run('DELETE FROM todos WHERE id = ?;', todo.id);

          return {
            id: todo.id,
            deleted: true,
            synced: true
          }
        } else if (todo.id === null) {
          // Create a new row in the database
          const result = await db.run('INSERT INTO todos (content, done) VALUES (?, ?)', todo.content, todo.done);
          // TODO FIX RETURN ID
          console.log(result);
          // @ts-ignore
          todo.id = result.lastID;
        } else {
          // Update the row in the database
          await db.run('UPDATE todos SET content = ?, done = ? WHERE id = ?;', todo.content, todo.done, todo.id);
        }
  
        return {
          ...todo,
          synced: true
        };
      }));
  
      resolve({
        status: 'SUCCESS',
        updatedRows
      });
    } catch (error) {
      console.error('Error updating database:', error);
      reject(error);
    }
  });

});
