<script setup>
const { todos, toggleTodoDone, removeTodo } = defineProps(['todos', 'toggleTodoDone', 'removeTodo']);
</script>

<template>
  <h2 class="todo-list-header">Task List</h2>

  <ul class="todo-list">
    <li v-for="(todo, index) in todos" :key="index" class="todo-wrapper">
      <span
        class="todo"
        :class="{ done: todo.done }"
        @click="toggleTodoDone(todo)"
      >
        {{ todo.content }}
      </span>
      <button @click="removeTodo(todo.id, index)" class="todo-add-button">
        Remove
      </button>
    </li>
  </ul>

  <h4 v-if="!todos?.length" class="empty-list">Empty list.</h4>
</template>

<style lang="less" scoped>
@import '../assets/less/constants.less';

  .todo-list-header {
    font-size: 22px;
    border-bottom: @border;
    padding-bottom: @size1;
  }

  .todo-list {
    padding: 10px;
  }

  .todo-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: @border;
    padding: @size2 @size4;
    border-radius: @size1;
    margin-bottom: @size2;
  }

  .todo {
    cursor: pointer;
  }

  .done {
    text-decoration: line-through;
  }

  .todo-add-button {
    font-size: @size2;
    padding: @size1;
  }

  .empty-list {
    text-align: center;
    opacity: 0.5;
    margin: 0;
  }
</style>