import gql from 'graphql-tag'

export default function (ctx) {
  const accessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZmFjaWxpdHlJZCI6MiwiZmFjaWxpdHlBZG1pbiI6dHJ1ZSwiY29ycG9yYXRpb25BZG1pbiI6dHJ1ZSwic3lzdGVtQWRtaW4iOnRydWUsImlhdCI6MTU5MzY3MDI3MH0.n8iK4W9Wn7YXbdfBs3-SZHiHkpqLxhzs1C6zc6S3z-U'

  // mutationでデータ取得する用
  const UsersQuery = gql`
    {
      Users @client {
        id
        facilityId
        firstName
        lastName
      }
    }
  `

  const snackbarQuery = gql`
    {
      getSnackbar @client {
        isEnable
        message
      }
    }
  `

  return {
    // httpエンドポイント
    httpEndpoint: 'http://localhost:8093/graphql',
    // wsエンドポイント
    wsEndpoint: 'ws://localhost:8093/graphql',

    // mockサーバー
    // httpEndpoint: 'http://localhost:4000/',
    // wsEndpoint: 'http://localhost:4000/',

    // 設定しなくてもよい？？
    // websocketsOnly: true,

    // へッダーで認証
    getAuth: () => `Bearer ${accessToken}`,

    // localのschemaを定義
    typeDefs: gql`
      type User {
        id: ID!
        facilityId: Int
        firstName: String
        lastName: String
      }

      type Snackbar {
        isEnable: Boolean!
        message: String
      }

      type UserAndSnackbar {
        user: [User]
        snackbar: Snackbar
      }

      type Query {
        Users: [User]
        getSnackbar: Snackbar
        getUserAndSnackbar: UserAndSnackbar
      }

      type Mutation {
        updateUser(id: ID!, facilityId: Int): Int
        craeteUser(id: ID!): User
        deleteUser(id: ID!): Int
        snackbarOn(message: String): Boolean
        snackbarOff: Boolean
      }
    `,

    // localのresolverを定義
    resolvers: {
      Mutation: {
        updateUser: (_, { id, facilityId }, { cache }) => {
          // キャッシュからデータを取得
          const data = cache.readQuery({ query: UsersQuery })
          // 変更したいデータを検索
          const currentItem = data.Users.find((item) => item.id === id)
          // データを変更
          currentItem.facilityId = facilityId
          // キャッシュを書き換え
          cache.writeQuery({ query: UsersQuery, data })
          return facilityId
        },
        craeteUser: (_, { id }, { cache }) => {
          // 変更前のデータを取得
          const previous = cache.readQuery({ query: UsersQuery })
          // 追加するデータ
          const newUser = {
            id,
            facilityId: 0,
            firstName: 'addedFirstName',
            lastName: 'addedLastName',
            __typename: 'User',
          }
          // キャッシュを更新
          cache.writeQuery({
            query: UsersQuery,
            data: { Users: [...previous.Users, newUser] },
          })
          return newUser
        },
        deleteUser: (_, { id }, { cache }) => {
          // キャッシュを読み込み
          const data = cache.readQuery({ query: UsersQuery })
          // キャッシュを更新
          cache.writeQuery({
            query: UsersQuery,
            data: { Users: data.Users.filter((e) => e.id !== id) },
          })
          return id
        },
        snackbarOn: async (_, { message }, { cache }) => {
          // キャッシュを読み込み
          const data = cache.readQuery({ query: snackbarQuery })

          data.getSnackbar.isEnable = true

          // messageの指定があれば更新
          if (message) data.getSnackbar.message = message

          // キャッシュを更新
          await cache.writeQuery({ query: snackbarQuery, data })
          return !data.getSnackbar.isEnable
        },
        snackbarOff: async (_, payload, { cache }) => {
          // キャッシュを読み込み
          const data = cache.readQuery({ query: snackbarQuery })

          data.getSnackbar.isEnable = false

          // キャッシュを更新
          await cache.writeQuery({ query: snackbarQuery, data })
          return !data.getSnackbar.isEnable
        },
      },
    },

    // キャシュの初期値を定義
    onCacheInit: (cache) => {
      // 初期値データを作成
      const data = {
        Users: [
          {
            id: 0,
            facilityId: 0,
            firstName: 'defaltFirstName',
            lastName: 'defaltLastName',
            __typename: 'User',
          },
        ],
        getSnackbar: {
          isEnable: false,
          message: 'snackbarです',
          __typename: 'Snackbar',
        },
      }
      // キャッシュを更新
      cache.writeData({ data })
    },
  }
}
