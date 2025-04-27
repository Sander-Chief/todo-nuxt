const apiUrlPaths = ['getTodos', 'addTodo', 'deleteTodo', 'toggleTodoDone'];
const dbName = 'ToDoDB';
const todoStoreName = 'ToDoStore';

let db;

const initDB = async () => {
  const request = await indexedDB.open(dbName, 3);

  request.onerror = (event) => {
    console.error('[Service Worker] Error encountered during IndexedDB init. Offline mode will be disabled.');
  };

  request.onupgradeneeded = function (event) {
    db = event.target.result;

    db.createObjectStore(todoStoreName, { autoIncrement: true });
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    console.log('[Service Worker] IndexedDB instance ready');

    db.onerror = (event) => {
      console.error(`[Service Worker] IndexedDB error: ${event.target.errorCode}`);
    };
  };
};

const populateIndexedDB = (data) => {
  const transaction = db.transaction(todoStoreName, 'readwrite');
  const objectStore = transaction.objectStore(todoStoreName);
  const getAllRequest = objectStore.openCursor();

  getAllRequest.onsuccess = function(event) {
    const cursor = event.target.result;

    if (!cursor) {
      console.log('[Service Worker] No data, populating...');

      data.rows?.forEach((dataEntry) => {
        const addObjectRequest = objectStore.add({
          ...dataEntry,
          synced: true
        });
    
        addObjectRequest.onerror = function(event) {
          console.error('[Service Worker] Error adding data:', event.target.error);
        };
      });
    } else {
      // TODO also sync todos on page load
    }
  };
};

const syncTodosWithBackend = async (unsyncedTodos) => {
  const response = await fetch('http://localhost:3000/api/syncTodos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(unsyncedTodos)
  });

  const json = await response.json();

  return json;
};

const syncTodos = (client) => {
  if (!db) {
    return;
  }

  let rows = [];

  let transaction = db.transaction(todoStoreName, 'readonly');
  let objectStore = transaction.objectStore(todoStoreName);
  const unsyncedTodos = [];

  const cursorRequest = objectStore.openCursor();

  cursorRequest.onsuccess = async function (event) {
    const cursor = event.target.result;
    if (cursor) {
      if (!cursor.value.synced) {
        unsyncedTodos.push({
          ...cursor.value,
          idbId: cursor.key
        });
      }
      cursor.continue();
    } else {
      if (!unsyncedTodos.length) return;

      try {
        const response = await syncTodosWithBackend(unsyncedTodos);
        rows = response.data?.rows?.filter((row) => !row.deleted);
        const rowsMap = new Map();

        rows.forEach((row) => {
          rowsMap.set(row.id, row);
        });

        transaction = db.transaction(todoStoreName, 'readwrite');
        objectStore = transaction.objectStore(todoStoreName);

        const updateCursorRequest = objectStore.openCursor();

        updateCursorRequest.onsuccess = async function (event) {
          const updateCursor = event.target.result;

          if (updateCursor) {
            const { id } = updateCursor.value;
            const row = rowsMap.get(id);

            if (row && !row.deleted) {
              const { content, done } = row;
              const updatedRowData = {
                id,
                content,
                done,
                synced: true,
              };

              updateCursor.update(updatedRowData);
            } else {
              updateCursor.delete();
            }

            rowsMap.delete(id);

            updateCursor.continue();
          } else {
            rowsMap.forEach((rowData) => {
              objectStore.add(rowData);
            });

            console.log('[Service Worker] IndexedDB data sync successful');

            if (!client) return;

            client.postMessage({
              type: 'sync-todos',
              rows,
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  cursorRequest.onerror = function (event) {
    console.error('[Service Worker] Error iterating over records in IndexedDB:', event.target.error);
  };

  return rows;
};

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());

  console.log('[Service Worker] Install');

  if (!db) {
    initDB();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.skipWaiting());
  clients.claim();

  console.log('[Service Worker] Active');
});

self.addEventListener('fetch', async (event) => {
  const { request } = event;
  const { url } = request;
  const splitUrl = url.split('/');
  const urlPath = splitUrl[splitUrl.length -1];

  switch (urlPath) {
    case 'getTodos': {
      event.respondWith(
        fetch(event.request).then((response) => {
          const clonedResponse = response.clone();

          clonedResponse.json().then((responseData) => {
            if (!db) {
              initDB();
            }

            populateIndexedDB(responseData);   
          });

          return response;
        })
      );
    }
  }
});

self.onmessage = function(event) {
  const { data, type } = event.data;

  if (!db) {
    initDB();
  }

  const transaction = db.transaction(todoStoreName, 'readwrite');
  const objectStore = transaction.objectStore(todoStoreName);

  switch (type) {
    case 'getTodos': {
      const getAllRequest = objectStore.openCursor();

      getAllRequest.onsuccess = function(event) {
        const cursor = event.target.result;
  
        if (!cursor) {
          console.log('[Service Worker] No data');
        }
      };

      break;
    }

    case 'addTodo': {
      const addObjectRequest = objectStore.add(data);

      addObjectRequest.onsuccess = function(dbEvent) {
        console.log('[Service Worker] Data added successfully');
      };
  
      addObjectRequest.onerror = function(dbEvent) {
        console.error('[Service Worker] Error adding data:', event.target.error);
      };

      break;
    }

    case 'deleteTodo': {
      const { id, fullDelete } = data;

      const deleteRequest = objectStore.openCursor();
  
      deleteRequest.onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
          const storedData = cursor.value;
  
          if (storedData.id === id) {
            const newData = {
              ...storedData,
              deleted: true,
              synced: false,
            };
  
            const updateRequest = fullDelete ? cursor.delete() : cursor.update(newData);
  
            updateRequest.onsuccess = () => {
              console.log('[Service Worker] Value marked as deleted successfully');
            };
  
            updateRequest.onerror = (updateEvent) => {
              console.error('[Service Worker] Marking as deleted error:', updateEvent.target.error);
            };
          } else {
            cursor.continue();
          }
        }
      };
  
      deleteRequest.onerror = function(dbEvent) {
        console.error('[Service Worker] Error deleting data:', event.target.error);
      };

      break;
    }

    case 'toggleTodoDone': {
      const { id, done, synced } = data;

      const getRequest = objectStore.openCursor();
  
      getRequest.onsuccess = function (event) {
        const cursor = event.target.result;
  
        if (cursor) {
          const storedData = cursor.value;
  
          if (storedData.id === id) {
            const newData = {
              ...storedData,
              done: !done ? 1 : 0,
              synced,
            };
  
            const updateRequest = cursor.update(newData);
  
            updateRequest.onsuccess = () => {
              console.log('[Service Worker] Value updated successfully');
            };
  
            updateRequest.onerror = (updateEvent) => {
              console.error('[Service Worker] Update error:', updateEvent.target.error);
            };
          } else {
            cursor.continue();
          }
        }
      };
  
      getRequest.onerror = function (event) {
        console.error(event.target.error);
      };

      break;
    }

    case 'populateTodos': {
      if (!db) {
        initDB();
      }

      populateIndexedDB(data);

      break;
    }
  }
};

self.addEventListener('message', (event) => {
  if (event.data?.type === 'sync-todos') {
    event.waitUntil((async () => {
      const client = await self.clients?.get(event.source.id);

      syncTodos(client);
    })());
  }
});
