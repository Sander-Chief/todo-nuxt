import path from 'path';
import fs from 'fs';

export default async function globalTeardown() {
  try {
    const dbFile = path.resolve(path.dirname('./'), 'todo-e2e.db');

    if (fs.existsSync(dbFile)) {
      fs.unlinkSync(dbFile);
    }
  } catch (error) {
    console.log(error);
  }
}
