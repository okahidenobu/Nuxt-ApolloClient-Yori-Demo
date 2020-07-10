<template>
  <div>
    <p>{{ hello }}</p>
    <button @click="updateHello">
      Update Hello
    </button>
  </div>
</template>
<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    hello: gql`
      query hello {
        hello @client
      }
    `,
  },
  methods: {
    updateHello() {
      this.$apollo.mutate({
        mutation: gql`
          mutation updateHello($value: String!) {
            updateHello(value: $value) @client
          }
        `,
        variables: {
          value: 'Hello from apollo-link-state!',
        },
      })
    },
  },
}
</script>
