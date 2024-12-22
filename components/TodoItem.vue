<script setup lang='ts'>
import { inject } from 'vue';
import { type TTodo } from '@/store/todos';

const { todo, index } = defineProps(['todo', 'index']);

const toggleTodoDone = inject<(todo: TTodo) => Promise<void>>('toggleTodoDone');
const deleteTodo = inject<(id: number, index: number) => Promise<void>>('deleteTodo');
</script>

<template>
  <div class="todo-wrapper">
    <span
        class="todo"
        :class="{ done: todo.done }"
        @click="toggleTodoDone?.(todo)"
      >
        {{ todo.content }}
      </span>
      <button class="todo-add-button" @click="deleteTodo?.(todo.id, index)">Remove</button>
  </div>
</template>

<style lang="less" scoped>
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
</style>
