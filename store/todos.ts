import { defineStore } from 'pinia';

type TTodo = {
  id: number | null,
  done: boolean,
  content: string
}

type TSWPayload = {
  type: string,
  data: any
}

const getTodosSW = () => {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'getTodos' });
  }
}

const addTodoSW = (content: string, id: number | null, synced: boolean) => {
  if (navigator.serviceWorker.controller) {
    const swPayload: TSWPayload = {
      type: 'addTodo',
      data: {
        id,
        content,
        done: 0,
        synced
      }
    };

    navigator.serviceWorker.controller.postMessage(swPayload);
  }
};

const deleteTodoSW = (id: number, fullDelete: boolean) => {
  if (navigator.serviceWorker.controller) {
    const swPayload: TSWPayload = {
      type: 'deleteTodo',
      data: {
        id,
        fullDelete
      }
    };

    navigator.serviceWorker.controller.postMessage(swPayload);
  }
};

const toggleTodoDoneSW = (id: number, done: boolean, synced: boolean) => {
  if (navigator.serviceWorker.controller) {
    const swPayload: TSWPayload = {
      type: 'toggleTodoDone',
      data: {
        id,
        done,
        synced
      }
    };

    navigator.serviceWorker.controller.postMessage(swPayload);
  }
};

export const useTodoStore = defineStore('todos', () => {
  const todos = ref<TTodo[]>([]);
  const newTodo = ref('');

  useFetch('/api/getTodos').then(async (response) => {
    if (navigator.onLine) {
      const { data } = response;
      const rawData = toRaw(data.value) as TTodo[];

      const swPayload = {
        type: 'populateTodos',
        data: rawData
      };

      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(swPayload);
      } else {
        console.log('Service Worker is inactive or not ready yet');
        navigator.serviceWorker.ready.then((registration) => {
          registration.pushManager.getSubscription().then((subscription) => {
            navigator.serviceWorker.controller?.postMessage(swPayload);
          });
        });
      }

      todos.value = rawData;
    } else {
      getTodosSW();
      // TODO add logic for listening to messages from SW
    }
  });

  const addTodo = async () => {
    if (!newTodo.value) {
      return;
    }

    if (navigator.onLine) {
      try {
        const response: any = await $fetch('/api/addTodo', {
          method: 'POST',
          body: {
            content: newTodo.value
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (response.status === 'SUCCESS' && response.id) {
          const newItem = {
            id: response.id,
            done: false,
            content: newTodo.value
          };
  
          todos.value.push(newItem);
  
          addTodoSW(newItem.content, response.id, true);

          newTodo.value = '';
        }
  
      } catch (error) {
        console.warn(error);
      }
    } else {
      addTodoSW(newTodo.value, null, false);
  
      todos.value.push({
        id: null,
        done: false,
        content: newTodo.value
      });

      newTodo.value = '';
    }
  };

  const toggleTodoDone = async (todo: TTodo) => {
    const { id, done } = todo;

    if (navigator.onLine) {
      try {
        const response: any = await $fetch('/api/toggleTodoDone', {
          method: 'POST',
          body: {
            id,
            done: !done ? 1 : 0
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 'SUCCESS') {
          toggleTodoDoneSW(id as number, done, true);

          todo.done = !todo.done;
        }
      } catch (error) {
        console.warn(error);
      }
    } else if (navigator.serviceWorker.controller) {
      toggleTodoDoneSW(id as number, done, false);

      todo.done = !todo.done;
    }
  }

  const deleteTodo = async (id: number, index: number) => {
    if (navigator.onLine) {
      try {
        const response: any = await $fetch('/api/deleteTodo', {
          method: 'POST',
          body: {
            id
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (response.status === 'SUCCESS') {
          deleteTodoSW(id, true);

          todos.value.splice(index, 1);
        }
      } catch (error) {
        console.warn(error);
      }
    } else if (navigator.serviceWorker.controller) {
      deleteTodoSW(id, false);

      todos.value.splice(index, 1);
    }
  }

  return {
    todos,
    newTodo,
    addTodo,
    toggleTodoDone,
    deleteTodo
  };
});
