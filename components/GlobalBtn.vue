<template>
  <v-btn color="pink" text @click="$emit('closeSnackbar')">{{ text }}</v-btn>
</template>

<script>
export default {
  name: 'GlobalBtn',
  props: {
    text: { type: String, default: 'これはボタンです' },
  },
}
</script>
