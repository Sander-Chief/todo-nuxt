import { defineStore } from 'pinia';

type TTask = {
  id: number,
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

const addTodoSW = (content: string, id?: number) => {
  if (navigator.serviceWorker.controller) {
    const swPayload: TSWPayload = {
      type: 'addTodo',
      data: {
        done: 0,
        content,
      }
    };

    if (id) {
      swPayload.data.id = id;
    }

    navigator.serviceWorker.controller.postMessage(swPayload);
  }
};

const deleteTodoSW = (id: number) => {
  if (navigator.serviceWorker.controller) {
    const swPayload: TSWPayload = {
      type: 'deleteTodo',
      data: id
    };

    navigator.serviceWorker.controller.postMessage(swPayload);
  }
};

const toggleTodoDoneSW = (id: number, done: boolean) => {
  if (navigator.serviceWorker.controller) {
    const swPayload: TSWPayload = {
      type: 'toggleTodoDone',
      data: {
        id,
        done
      }
    };
    
    navigator.serviceWorker.controller.postMessage(swPayload);
  }
};

export const useTodoStore = defineStore('todos', () => {
  const todos = ref<TTask[]>([]);
  const newTodo = ref('');

  useFetch('/api/getTodos').then((response) => {
    if (navigator.onLine) {
      const { data } = response;
      const rawData = toRaw(data.value) as TTask[];
  
      const swPayload = {
        type: 'populate',
        data: rawData
      };
  
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(swPayload);
      } else {
        console.log('[Service Worker] inactive or not ready yet');
        navigator.serviceWorker.ready.then((registration) => {
          registration.active?.postMessage(swPayload);
        });
      }
  
      todos.value = rawData;
    } else {
      getTodosSW();
      // TODO add logic for listening to messages from SW
    }
  });

  const addTodo = async () => {
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
  
          addTodoSW(newItem.content, response.id);

          newTodo.value = '';
        }
  
      } catch (error) {
        console.warn(error);
      }
    } else {
      addTodoSW(newTodo.value);
    }
  };

  const doneTodo = async (todo: TTask) => {
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
          toggleTodoDoneSW(id, done);

          todo.done = !todo.done;
        }
      } catch (error) {
        console.warn(error);
      }
    } else if (navigator.serviceWorker.controller) {
      toggleTodoDoneSW(id, done);

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
          deleteTodoSW(id);

          todos.value.splice(index, 1);
        }
      } catch (error) {
        console.warn(error);
      }
    } else if (navigator.serviceWorker.controller) {
      deleteTodoSW(id);

      todos.value.splice(index, 1);
    }
  }

  return {
    todos,
    newTodo,
    addTodo,
    doneTodo,
    deleteTodo
  };
});
