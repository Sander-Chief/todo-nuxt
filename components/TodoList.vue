<script setup lang='ts'>
const { todos } = defineProps(['todos']);
</script>

<template>
  <h2 class="todo-list-header">Task List</h2>

  <ul
    v-if="todos?.length"
    class="todo-list"
    data-testid="todo-list"
  >
    <TodoItem
      :todo="todo"
      :index="index"
      v-for="(todo, index) in todos"
    />
  </ul>

  <h4 v-if="!todos?.length" class="empty-list">Empty list.</h4>
</template>

<style lang="less" scoped>
  .todo-list-header {
    font-size: 22px;
    border-bottom: @border;
    padding-bottom: @size1;
  }

  .todo-list {
    padding: 10px;
  }

  .empty-list {
    text-align: center;
    opacity: 0.5;
    margin: 0;
  }
</style>