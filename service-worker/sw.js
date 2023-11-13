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

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');

  const request = indexedDB.open(dbName, 3);

  request.onerror = (event) => {
    console.error('Error encountered during IndexedDB init. Offline mode will be disabled.');
  };

  request.onupgradeneeded = function (event) {
    db = event.target.result;

    db.createObjectStore(todoStoreName, { keyPath: 'id', autoIncrement: true });
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    console.log('IndexedDB instance ready');

    db.onerror = (event) => {
      console.error(`IndexedDB error: ${event.target.errorCode}`);
    };
  };
});

// const handleRequest = async (path, json) => {
//   const response = await fetch(request);
//   // ignore non-api requests
//   if (apiUrlPaths.includes(path)) {
//     switch(urlPath) {
//       case 'getTodos': {
//         console.log('getTodos');
//         break;
//       }

//       case 'addTodo': {
//         console.log('addTodo');
//         console.log(json);
//         const { content } = json;

//         const transaction = await db.transaction(todoStoreName, 'readwrite');
//         const objectStore = await transaction.objectStore(todoStoreName);

//         const addObjectRequest = await objectStore.add({
//           content,
//           done: 0
//         });
    
//         addObjectRequest.onsuccess = function(dbEvent) {
//           console.log('Success adding data');

//           return {
//             status: 'SUCCESS'
//           };
//         };
    
//         addObjectRequest.onerror = function(dbEvent) {
//           console.error('Error adding data:', event.target.error);
//         };

//         break;
//       }
  
//       case 'deleteTodo': {
//         console.log('deleteTodo');
//         console.log(json);
//         const { id } = json;
//         break;
//       }
  
//       case 'toggleTodoDone': {
//         console.log('toggleTodoDone');
//         console.log(json);
//         const { id, done } = json;
//         break;
//       }

//       default:
//         return response;
//     }
//   }
// };

// self.addEventListener('fetch', async (event) => {
//   const { request } = event;
//   const { url } = request;
//   const splitUrl = url.split('/');
//   const urlPath = splitUrl[splitUrl.length -1];
//   const requestText = await request.text();
//   const json = requestText ? JSON.parse(requestText) : null;

//   if (db && !navigator.onLine) {
//     console.log(db);
//     console.log(navigator.onLine);
//     event.respondWith(handleRequest(urlPath, json));
//   }
// });

self.onmessage = function(event) {
  const { data, type } = event.data;

  if (!db) {
    return;
  }

  const transaction = db.transaction(todoStoreName, 'readwrite');
  const objectStore = transaction.objectStore(todoStoreName);

  if (type === 'populate') {
    const getAllRequest = objectStore.openCursor();

    getAllRequest.onsuccess = function(event) {
      const cursor = event.target.result;

      if (!cursor) {
        console.log('No data');

        data.forEach((dataEntry) => {
          const addObjectRequest = objectStore.add(dataEntry);
      
          addObjectRequest.onerror = function(event) {
            console.error('Error adding data:', event.target.error);
          };
        });
      }
    };
  }

  if (type === 'getTodos') {
    const getAllRequest = objectStore.openCursor();

    getAllRequest.onsuccess = function(event) {
      const cursor = event.target.result;

      if (!cursor) {
        console.log('No data');

        console.log(cursor);
      }
    };
  }

  if (type === 'addTodo') {
    const addObjectRequest = objectStore.add(data);

    addObjectRequest.onsuccess = function(dbEvent) {
      console.log('Success adding data');
    };

    addObjectRequest.onerror = function(dbEvent) {
      console.error('Error adding data:', event.target.error);
    };
  }

  if (type === 'deleteTodo') {
    const deleteRequest = objectStore.delete(data);

    deleteRequest.onsuccess = function(dbEvent) {
      console.log('Success deleting data');
    };

    deleteRequest.onerror = function(dbEvent) {
      console.error('Error deleting data:', event.target.error);
    };
  }

  if (type === 'toggleTodoDone') {
    const { id, done } = data;

    const getRequest = objectStore.get(id);

    getRequest.onsuccess = function (event) {
      debugger;
      const result = event.target.result;
      const putRequest = objectStore.put({
        ...result,
        done: !done ? 1 : 0,
      }, data);
    };

    getRequest.onerror = function (event) {
      reject(event.target.error);
    };

  }
};
