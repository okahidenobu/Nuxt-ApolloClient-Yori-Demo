<template>
  <div>
    <global-snackbar />
    <pre>getSnackbar: {{ getSnackbar }}</pre>
    <pre>Users:{{ Users }}</pre>
    <v-btn @click="craeteUser(1)">create</v-btn>
    <v-btn @click="updateUser(0, 100)">update</v-btn>
    <v-btn @click="deleteUser(1)">delete</v-btn>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import GlobalSnackbar from '../../components/GlobalSnackbar'

export default {
  components: { 'global-snackbar': GlobalSnackbar },
  data() {
    return {
      snackbar: false,
      message: '',
    }
  },
  apollo: {
    getSnackbar: {
      query: gql`
        {
          getSnackbar @client {
            isEnable
            message
          }
        }
      `,
    },
    Users: gql`
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
  methods: {
    updateUser(id, facilityId) {
      this.$apollo
        .mutate({
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
        .then((res) => {
          // データ追加時処理
          const message = 'データを更新しました'
          this.snackbarOn(message)
        })
    },
    craeteUser(id) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($id: ID!) {
              craeteUser(id: $id) @client
            }
          `,
          variables: {
            id,
          },
        })
        .then((res) => {
          // データ追加時処理
          const message = 'データを追加しました'
          this.snackbarOn(message)
        })
    },
    deleteUser(id) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($id: ID!) {
              deleteUser(id: $id) @client
            }
          `,
          variables: {
            id,
          },
        })
        .then((res) => {
          // データ追加時処理
          const message = 'データを削除しました'
          this.snackbarOn(message)
        })
    },
    snackbarOn(message) {
      this.$apollo.mutate({
        mutation: gql`
          mutation($message: String) {
            snackbarOn(message: $message) @client
          }
        `,
        variables: {
          message,
        },
      })
    },
  },
}
</script>
