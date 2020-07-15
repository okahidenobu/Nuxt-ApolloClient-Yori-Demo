<template>
  <div>
    <global-snackbar :snackbar="snackbar" :message="message" />
    <pre>{{ Users }}</pre>
    <v-btn @click="craeteUser(1)">create</v-btn>
    <v-btn @click="updateUser(0, 100)">update</v-btn>
    <v-btn @click="deleteUser(1)">delete</v-btn>
    <pre>{{ snackbar }}</pre>
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
          this.message = 'データを更新しました'
          this.snackbar = true
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
          this.message = 'データを追加しました'
          this.snackbar = true
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
          this.message = 'データを削除しました'
          this.snackbar = true
        })
    },
  },
}
</script>
