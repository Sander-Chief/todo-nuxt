<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTodoStore } from './store/todos';

const todoStore = useTodoStore();
const { todos, newTodo } = storeToRefs(todoStore);
const {
  addTodo,
  toggleTodoDone,
  deleteTodo
} = todoStore;

async function registerSync() {
  const registration = await navigator.serviceWorker.ready;

  try {
    window.addEventListener('online', () => {
      registration.sync.register('sync-todos');
    });
  } catch(e) {
    console.error('Sync registration failed');
  }
};

const isOnline = ref(true);

useHead({
  title: 'Todo App',
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width,initial-scale=1'
    },
    {
      name: 'description',
      content: 'Nuxt 3 Todo App'
    },
    {
      name: 'theme-color',
      content: '#fff'
    }
  ],
  link: [
    {
      name: 'icon',
      content: '/favicon.ico'
    }
  ]
});

registerSync();

window.addEventListener('online', () => {
  isOnline.value = true;
});

window.addEventListener('offline', () => {
  isOnline.value = false;
});
</script>

<template>
  <!-- <VitePwaManifest /> -->

    <div
      class="online-indicator"
      :class="{ 'offline': !isOnline }"
    ></div>

    <h1>Todo App</h1>

    <form @submit.prevent="onSubmit">
      <label>New task:</label>
      <input
        v-model="newTodo"
        name="newTodo"
        autocomplete="off"
      />
      <button
        @click="addTodo()"
      >
        Add a task
      </button>
    </form>

    <h2>Task List</h2>

    <TaskList
      :todos="todos"
      :toggleTodoDone="toggleTodoDone"
      :removeTodo="deleteTodo"
    />

    <h4 v-if="!todos?.length">Empty list.</h4>
</template>

<style lang="less">
  @border: 2px solid rgba(white, 0.35);
  @size1: 6px;
  @size2: 12px;
  @size3: 18px;
  @size4: 24px;
  @size5: 48px;
  @backgroundColor: #27292d;
  @textColor: white;
  @primaryColor: #a0a4d9;
  @secondTextColor: #1f2023;

  body {
    margin: 0;
    padding: 0;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: @backgroundColor;
    color: @textColor;

    #__nuxt {
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      padding: 20px;

      h1 {
        font-weight: bold;
        font-size: 28px;
        text-align: center;
      }

      form {
        display: flex;
        flex-direction: column;
        width: 100%;

        label {
          font-size: 14px;
          font-weight: bold;
        }

        input,
        button {
          height: @size5;
          box-shadow: none;
          outline: none;
          padding-left: @size2;
          padding-right: @size2;
          border-radius: @size1;
          font-size: 18px;
          margin-top: @size1;
          margin-bottom: @size2;
        }

        input {
          background-color: transparent;
          border: @border;
          color: inherit;
        }

      }

      button {
        cursor: pointer;
        background-color: @primaryColor;
        border: 1px solid @primaryColor;
        color: @secondTextColor;
        font-weight: bold;
        outline: none;
        border-radius: @size1;
      }

      h2 {
        font-size: 22px;
        border-bottom: @border;
        padding-bottom: @size1;
      }

      ul {
        padding: 10px;

        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: @border;
          padding: @size2 @size4;
          border-radius: @size1;
          margin-bottom: @size2;

          span {
            cursor: pointer;
          }

          .done {
            text-decoration: line-through;
          }

          button {
            font-size: @size2;
            padding: @size1;
          }
        }
      }

      h4 {
        text-align: center;
        opacity: 0.5;
        margin: 0;
      }

      .online-indicator {
        position: absolute;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background-color: green;

        &.offline {
          background-color: red;
        }
      }
    }
  }
</style>
