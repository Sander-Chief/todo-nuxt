<script setup lang='ts'>
import { inject } from 'vue';

const newTodo = inject('newTodo');

const emit = defineEmits(['addTodo']);

const onSubmit = () => emit('addTodo');
</script>

<template>
  <form @submit.prevent="onSubmit" class="todo-form">
    <label class="todo-label">New task:</label>
    <input
      v-model="newTodo"
      name="newTodo"
      autocomplete="off"
      class="todo-input"
      placeholder="wash the dishes, buy bread, etc"
    />
    <button class="todo-add-button">Add a task</button>
  </form>
</template>

<style lang="less" scoped>
  .todo-form {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .todo-label {
    font-size: 14px;
    font-weight: bold;
  }

  .todo-input,
  .todo-add-button {
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

  .todo-input {
    background-color: transparent;
    border: @border;
    color: inherit;
  }
</style>
