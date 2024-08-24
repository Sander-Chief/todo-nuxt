<script setup>
import { provide } from 'vue';
import { storeToRefs } from 'pinia';
import { useTodoStore } from '~/store/todos';

const todoStore = useTodoStore();
const { todos, newTodo } = storeToRefs(todoStore);
const {
  addTodo,
  toggleTodoDone,
  deleteTodo
} = todoStore;

provide('newTodo', newTodo);
provide('toggleTodoDone', toggleTodoDone);
provide('deleteTodo', deleteTodo);
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
