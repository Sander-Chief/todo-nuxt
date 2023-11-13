<script setup>
const { todos, doneTodo, removeTodo } = defineProps(['todos', 'doneTodo', 'removeTodo']);
</script>

<template>
  <ul>
    <li v-for="(todo, index) in todos" :key="index">
      <span
        :class="{ done: todo.done }"
        @click="doneTodo(todo)"
      >
        {{ todo.content }}
      </span>
      <button @click="removeTodo(todo.id, index)">
        Remove
      </button>
    </li>
  </ul>
</template>
