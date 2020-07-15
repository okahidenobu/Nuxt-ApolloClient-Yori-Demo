<template>
  <v-app>
    <v-snackbar :value="snackbar">
      {{ message }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>

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
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="facilityId"
                label="facility ID"
                :counter="3"
                :rules="[facilityIdRule.number, facilityIdRule.max]"
                required
              ></v-text-field>
              <v-text-field
                v-model="firstName"
                label="first name"
                :counter="10"
                :rules="[nameRules.required, nameRules.max]"
                required
              ></v-text-field>
              <v-text-field
                v-model="lastName"
                label="last name"
                :counter="10"
                :rules="[nameRules.required, nameRules.max]"
                required
              >
              </v-text-field>
              <v-btn @click="createUser()">submit</v-btn>
            </v-form>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
// コンポーネント
// import Vbtn from './Vbtn'
// import GlobalSnackbar from './GlobalSnackbar'

// クエリ
import { nameRules, facilityIdRule } from '../utils/validationRules'
import getUsers from '~/apollo/queries/getUsers.graphql'
import createUser from '~/apollo/mutations/createUser.graphql'
import deleteUser from '~/apollo/mutations/deleteUser.graphql'
import updateUser from '~/apollo/mutations/updateUser.graphql'
import userCreated from '~/apollo/subscriptions/userAdded.graphql'
import userUpdated from '~/apollo/subscriptions/userUpdated.graphql'
import userDeleted from '~/apollo/subscriptions/userDeleted.graphql'
// import getUserInfo from '~/apollo/queries/getUserInfo.graphql'

export default {
  // components: { Vbtn, GlobalSnackbar },
  // components: { GlobalSnackbar },
  data() {
    return {
      valid: true,
      text: '',
      getUsers: [],
      firstName: '',
      lastName: '',
      UserInfo: [],
      facilityId: '',
      snackbar: '',
      message: '',
      // nameRules: {
      //   required: (v) => !!v || 'Name is required',
      //   max: (v) =>
      //     (v && v.length <= 10) || 'Name must be less than 10 characters',
      // },
      nameRules: {
        required: nameRules.required,
        max: nameRules.max,
      },
      facilityIdRule: {
        number: facilityIdRule.number,
        max: facilityIdRule.max,
      },
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
      if (this.$refs.form.validate()) {
        // We save the user input in case of an error これはなくてもいいのか？
        const firstName = this.firstName
        const lastName = this.lastName
        const facilityId = Number(this.facilityId)
        // We clear it early to give the UI a snappy feel これもなくてもいいのか？
        this.firstName = ''
        this.lastName = ''
        this.facilityId = ''

        // mutation実行処理
        await this.$apollo
          .mutate({
            // クエリ
            mutation: createUser,
            // 変数
            variables: {
              facilityId,
              firstName,
              lastName,
            },
          })
          .then((res) => {
            // 送信成功はこの中
            this.message = 'データを追加しました'
            this.snackbar = true
            this.$refs.form.resetValidation()
          })
        // .catch((err) => {
        //   // 送信失敗はこの中の処理
        //   this.message = '失敗しました'
        //   this.isSnackBar = true
        // })
      }
    },

    async updateUser(id) {
      const firstName = this.firstName
      const lastName = this.lastName
      // We clear it early to give the UI a snappy feel これもなくてもいいのか？
      this.firstName = ''
      this.lastName = ''
      // mutation実行処理
      await this.$apollo
        .mutate({
          // クエリ
          mutation: updateUser,
          // 変数
          variables: {
            id,
            firstName,
            lastName,
          },
        })
        .then((res) => {
          // 送信成功はこの中
          this.message = 'データを更新しました'
          this.snackbar = true
        })
    },

    async deleteUser(id) {
      // mutation実行処理
      await this.$apollo
        .mutate({
          // クエリ
          mutation: deleteUser,
          // 変数
          variables: {
            id,
          },
        })
        .then((res) => {
          // 送信成功はこの中
          this.message = 'データを削除しました'
          this.snackbar = true
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
