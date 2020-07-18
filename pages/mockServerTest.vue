<template>
  <div>
    <p>mockサーバーからデータを取得(要エンドポイント切り替え)</p>
    {{ user }}
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'MockServerTest',
  apollo: {
    user: {
      // queryでデータを取得している部分
      query: gql`
        {
          user(id: 1) {
            id
            fullName
          }
        }
      `,
    },
  },
}
</script>
