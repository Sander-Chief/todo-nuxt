import { dbInit } from './dbInit';

export default function globalSetup() {
  const dbPath = 'todo-e2e.db';

  dbInit(dbPath);
}
