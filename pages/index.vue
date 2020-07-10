<template>
  <Todo />
</template>

<script>
import Todo from '../components/Todo'

export default {
  components: Todo,
}
</script>

<style scoped>
.done {
  text-decoration: line-through;
}
</style>
