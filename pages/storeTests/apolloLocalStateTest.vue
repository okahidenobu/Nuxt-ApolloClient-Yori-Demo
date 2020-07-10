<template>
  <div>
    <pre>{{ Users }}</pre>
    <v-btn @click="craeteUser(1)">create</v-btn>
    <v-btn @click="updateUser(0, 100)">update</v-btn>
    <v-btn @click="deleteUser(1)">delete</v-btn>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    Users: {
      query: gql`
        {
          Users @client {
            id
            facilityId
            firstName
            lastName
          }
        }
      `,
    },
  },
  methods: {
    updateUser(id, facilityId) {
      this.$apollo.mutate({
        mutation: gql`
          mutation($id: ID!, $facilityId: Int) {
            updateUser(id: $id, facilityId: $facilityId) @client
          }
        `,
        variables: {
          id,
          facilityId,
        },
      })
    },
    craeteUser(id) {
      this.$apollo.mutate({
        mutation: gql`
          mutation($id: ID!) {
            craeteUser(id: $id) @client
          }
        `,
        variables: {
          id,
        },
      })
    },
    deleteUser(id) {
      this.$apollo.mutate({
        mutation: gql`
          mutation($id: ID!) {
            deleteUser(id: $id) @client
          }
        `,
        variables: {
          id,
        },
      })
    },
  },
}
</script>
