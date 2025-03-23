<script setup>
import { provide } from 'vue';
import { storeToRefs } from 'pinia';
import { useTodoStore } from '~/store/todos';

const todoStore = useTodoStore();
const { todos, newTodo } = storeToRefs(todoStore);
const {
  getTodos,
  setTodos,
  addTodo,
  toggleTodoDone,
  deleteTodo
} = todoStore;
const router = useRouter();

async function registerSync() {
  const registration = await navigator.serviceWorker.ready;

  try {
    window.addEventListener('online', async () => {
      registration.active.postMessage({
        type: 'sync-todos',
      });
    });

    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type } = event.data;

      if (type === 'sync-todos') {
        setTodos(event.data.rows);
      }
    });
  } catch(e) {
    console.error('Sync registration failed');
  }
};

getTodos();

provide('newTodo', newTodo);
provide('toggleTodoDone', toggleTodoDone);
provide('deleteTodo', deleteTodo);

registerSync();
</script>

<template>
  <OnlineIndicator />

  <h1>Todo App</h1>

  <TodoForm
    @add-todo="addTodo"
  />

  <TodoList
    :todos="todos"
  />
</template>
