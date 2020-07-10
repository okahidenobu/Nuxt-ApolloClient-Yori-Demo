<template>
  <v-app>
    <v-container class="display-1" fluid>
      <v-row align="start" justify="center">
        <v-col cols="5">
          <v-card width="500" class="mx-auto">
            <v-toolbar color="light-blue" dark>
              <v-app-bar-nav-icon></v-app-bar-nav-icon>

              <v-toolbar-title>TODO list</v-toolbar-title>

              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </v-toolbar>

            <v-divider></v-divider>
            <v-list subheader>
              <v-subheader>顧客一覧</v-subheader>
              <v-list-item v-for="todo in getUsers" :key="todo.id">
                <v-list-item-content>
                  <v-list-item-title
                    >名: {{ todo.firstName }}
                  </v-list-item-title>
                  <v-list-item-title
                    >姓: {{ todo.lastName }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-btn @click="deleteUser(todo.id)">delete</v-btn>
                <v-btn @click="updateUser(todo.id)">update</v-btn>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="3">
          <v-card-text>
            <form @submit.prevent>
              <v-text-field
                v-model="facilityId"
                label="facility ID"
              ></v-text-field>
              <v-text-field
                v-model="firstName"
                label="first name"
              ></v-text-field>
              <v-text-field v-model="lastName" label="last name"></v-text-field>
              <!--              <Vbtn description="submit" @click="addTodo(text)" />-->
              <v-btn @click="createUser()">submit</v-btn>
            </form>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import Vbtn from './Vbtn'

import getUsers from '~/apollo/queries/getUsers.graphql'
import createUser from '~/apollo/mutations/createUser.graphql'
import deleteUser from '~/apollo/mutations/deleteUser.graphql'
import updateUser from '~/apollo/mutations/updateUser.graphql'
import userCreated from '~/apollo/subscriptions/userAdded.graphql'
import userUpdated from '~/apollo/subscriptions/userUpdated.graphql'
import userDeleted from '~/apollo/subscriptions/userDeleted.graphql'
// import getUserInfo from '~/apollo/queries/getUserInfo.graphql'

export default {
  components: Vbtn,
  data() {
    return {
      text: '',
      getUsers: [],
      firstName: '',
      lastName: '',
      UserInfo: [],
      facilityId: '',
    }
  },
  computed: {
    todos() {
      return this.$store.state.todos.list
    },
  },
  methods: {
    // mutationで新しいデータを作成する処理
    async createUser() {
      // We save the user input in case of an error これはなくてもいいのか？
      const firstName = this.firstName
      const lastName = this.lastName
      const facilityId = Number(this.facilityId)
      // We clear it early to give the UI a snappy feel これもなくてもいいのか？
      this.firstName = ''
      this.lastName = ''
      this.facilityId = ''

      // mutation実行処理
      await this.$apollo.mutate({
        // クエリ
        mutation: createUser,
        // 変数
        variables: {
          facilityId,
          firstName,
          lastName,
        },
      })
    },

    async updateUser(id) {
      const firstName = this.firstName
      const lastName = this.lastName
      // We clear it early to give the UI a snappy feel これもなくてもいいのか？
      this.firstName = ''
      this.lastName = ''
      // mutation実行処理
      await this.$apollo.mutate({
        // クエリ
        mutation: updateUser,
        // 変数
        variables: {
          id,
          firstName,
          lastName,
        },
      })
    },
    async deleteUser(id) {
      // mutation実行処理
      await this.$apollo.mutate({
        // クエリ
        mutation: deleteUser,
        // 変数
        variables: {
          id,
        },
      })
    },
  },
  apollo: {
    getUsers: {
      // queryでデータを取得している部分
      query: getUsers,

      // subscriptionsの実装部分
      subscribeToMore: [
        {
          // subscriptionのクエリ
          document: userCreated,
          // 元のデータを更新する処理
          updateQuery: (previousResult, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return previousResult
            }
            return {
              getUsers: [
                ...previousResult.getUsers,
                subscriptionData.data.userCreated,
              ],
            }
          },
        },
        {
          // subscriptionのクエリ
          document: userUpdated,
          // 元のデータを更新する処理
          updateQuery: (previousResult, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return previousResult
            }
            const userUpdated = subscriptionData.data.userUpdated
            const targetUser = previousResult.getUsers.find(
              (link) => link.id + '' === userUpdated.id + ''
            )
            targetUser.firstName = userUpdated.firstName
            targetUser.lastName = userUpdated.lastName
            return previousResult.getUsers
          },
        },
        {
          document: userDeleted,
          updateQuery: async (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev
            }

            const userDeleted = subscriptionData.data.userDeleted
            const linkIndex = prev.getUsers.findIndex(
              (link) => link.id + '' === userDeleted.id + ''
            )

            await prev.getUsers.splice(linkIndex, 1)
            return prev.getUsers
          },
        },
      ],
    },
  },
}
</script>
