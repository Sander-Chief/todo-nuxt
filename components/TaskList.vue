<script setup>
const { todos, toggleTodoDone, removeTodo } = defineProps(['todos', 'toggleTodoDone', 'removeTodo']);
</script>

<template>
  <ul>
    <li v-for="(todo, index) in todos" :key="index">
      <span
        :class="{ done: todo.done }"
        @click="toggleTodoDone(todo)"
      >
        {{ todo.content }}
      </span>
      <button @click="removeTodo(todo.id, index)">
        Remove
      </button>
    </li>
  </ul>
</template>
