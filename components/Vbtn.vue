<template>
  <v-btn>{{ description }}</v-btn>
</template>

<script>
export default {
  name: 'Vbtn',
  props: {
    description: {
      type: String,
      required: true,
    },
  },
}
</script>
