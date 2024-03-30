// import { clientsClaim } from 'workbox-core'
// import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
// import { registerRoute, NavigationRoute } from 'workbox-routing';

self.skipWaiting();
// clientsClaim();
// precacheAndRoute(self.__WB_MANIFEST);
// cleanupOutdatedCaches();

// // try {
// // 	const handler = createHandlerBoundToURL('/');
// // 	const route = new NavigationRoute(handler);
// // 	registerRoute(route);
// // } catch (error) {
// // 	console.warn('Error while registering cache route', { error });
// // }
const apiUrlPaths = ['getTodos', 'addTodo', 'deleteTodo', 'toggleTodoDone'];
const dbName = 'ToDoDB';
const todoStoreName = 'ToDoStore';

let db;

const initDB = () => {
  const request = indexedDB.open(dbName, 3);

  request.onerror = (event) => {
    console.error('Error encountered during IndexedDB init. Offline mode will be disabled.');
  };

  request.onupgradeneeded = function (event) {
    db = event.target.result;

    db.createObjectStore(todoStoreName, { autoIncrement: true });
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    console.log('IndexedDB instance ready');

    db.onerror = (event) => {
      console.error(`IndexedDB error: ${event.target.errorCode}`);
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
      console.log('No data, populating...');

      data.forEach((dataEntry) => {
        const addObjectRequest = objectStore.add({
          ...dataEntry,
          synced: true
        });
    
        addObjectRequest.onerror = function(event) {
          console.error('Error adding data:', event.target.error);
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

const syncTodos = () => {
  if (!db) {
    return;
  }

  let transaction = db.transaction(todoStoreName, 'readwrite');
  let objectStore = transaction.objectStore(todoStoreName);
  const unsyncedTodos = [];

  const cursorRequest = objectStore.openCursor();

  cursorRequest.onsuccess = async function (event) {
    const cursor = event.target.result;
    if (cursor) {
      if (!cursor.value.synced) {
        console.log(cursor);
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
        console.log(response);
        const { updatedRows } = response;

        transaction = db.transaction(todoStoreName, 'readwrite');
        objectStore = transaction.objectStore(todoStoreName);

        updatedRows.forEach((row) => {
          const { idbId } = row;
          const dataRequest = objectStore.get(idbId);

          dataRequest.onsuccess = (event) => {
            const rowData = event.target.result;

            if (rowData) {
              if (row.deleted) {
                objectStore.delete(idbId);
              } else {
                const { content, done } = row;

                rowData.content = content;
                rowData.done = done;
                rowData.synced = true;

                objectStore.put(rowData, idbId);
              }
            }
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  cursorRequest.onerror = function (event) {
    console.error('Error iterating over records in IndexedDB:', event.target.error);
  };
};

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');

  if (!db) {
    initDB();
  }
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
            console.log(responseData);
            console.log(db);
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

  if (type === 'getTodos') {
    const getAllRequest = objectStore.openCursor();

    getAllRequest.onsuccess = function(event) {
      const cursor = event.target.result;

      if (!cursor) {
        console.log('No data');
      }
    };
  }

  if (type === 'addTodo') {
    const addObjectRequest = objectStore.add(data);

    addObjectRequest.onsuccess = function(dbEvent) {
      console.log('Data added successfully');
    };

    addObjectRequest.onerror = function(dbEvent) {
      console.error('Error adding data:', event.target.error);
    };
  }

  if (type === 'deleteTodo') {
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
            console.log('Value marked as deleted successfully');
          };

          updateRequest.onerror = (updateEvent) => {
            console.error('Marking as deleted error:', updateEvent.target.error);
          };
        } else {
          cursor.continue();
        }
      }
    };

    deleteRequest.onerror = function(dbEvent) {
      console.error('Error deleting data:', event.target.error);
    };
  }

  if (type === 'toggleTodoDone') {
    const { id, done } = data;

    const getRequest = objectStore.openCursor();

    getRequest.onsuccess = function (event) {
      const cursor = event.target.result;

      if (cursor) {
        const storedData = cursor.value;

        if (storedData.id === id) {
          const newData = {
            ...storedData,
            done: !done ? 1 : 0,
            synced: false,
          };

          const updateRequest = cursor.update(newData);

          updateRequest.onsuccess = () => {
            console.log('Value updated successfully');
          };

          updateRequest.onerror = (updateEvent) => {
            console.error('Update error:', updateEvent.target.error);
          };
        } else {
          cursor.continue();
        }
      }
    };

    getRequest.onerror = function (event) {
      console.error(event.target.error);
    };

  }
};

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-todos') {
    event.waitUntil(syncTodos());
  }
});
