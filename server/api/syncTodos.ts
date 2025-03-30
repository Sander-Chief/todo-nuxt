import db from './db';

type Todo = {
  id: number | null,
  idbId: number,
  content: string,
  done: number,
  deleted: boolean,
  synced: boolean
}

export default defineEventHandler(async (event) => {
  const todos = await readBody(event);

  if (!todos?.length) {
    return {
      status: 'ERROR'
    };
  }

  return new Promise(async (resolve, reject) => {
    try {
      const { userId } = event.context.auth;
      const syncedIds: Number[] = [];

      const updatedRows = await Promise.all(todos.map(async (todo: Todo) => {
        const {
          id,
          content,
          done,
          deleted
        } = todo;

        if (deleted && id) {
          // Delete the row from the database
          await db.run('DELETE FROM todos WHERE id = ? AND user_id = ?;', id, userId);

          syncedIds.push(id);

          return {
            ...todo,
            deleted: true,
            synced: true
          }
        } else if (id === null) {
          // Create a new row in the database
          const result = await db.query!('INSERT INTO todos (content, done, user_id) VALUES (?, ?, ?) RETURNING id', [content, done, userId]);

          syncedIds.push(result.rows[0].id);

          return {
            ...todo,
            id: result.rows[0].id,
            synced: true
          }
        } else {
          // Update the row in the database
          await db.run('UPDATE todos SET content = ?, done = ? WHERE id = ? AND user_id = ?;', content, done, id, userId);

          syncedIds.push(id);
        }

        return {
          ...todo,
          synced: true
        };
      }));

      const syncedIdsStringified = syncedIds.join(',');

      let otherRows: Todo[] = await new Promise((resolve, reject) => {
        db.all(`SELECT * FROM todos WHERE ID NOT IN (${syncedIdsStringified}) AND user_id = ?`, [userId], (error, rows: Todo[]) => {
          if (error) {
            reject(error);
          } else {
            resolve(rows);
          }
        });
      });

      resolve({
        status: 'SUCCESS',
        rows: [...updatedRows, ...otherRows],
      });
    } catch (error) {
      console.error('Error updating database:', error);
      reject(error);
    }
  });

});
