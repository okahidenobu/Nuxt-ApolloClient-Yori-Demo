<template>
  <v-btn color="pink" @click="snackbarOff">{{ text }}</v-btn>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'GlobalBtn',
  props: {
    text: { type: String, default: 'これはボタンです' },
  },
  methods: {
    snackbarOff() {
      this.$apollo.mutate({
        mutation: gql`
          mutation {
            snackbarOff @client
          }
        `,
      })
    },
  },
}
</script>
