<template>
  <div>
    <h1>
      apolloClientがキャッシュからデータを取得していることを確認する方法
    </h1>
    <p>1.DBにデータを追加</p>
    <p>2.左上のハンバーガーメニューでcareLog以外のページに遷移</p>
    <p>3.検証で回線速度を遅くする</p>
    <p>4.再度apolloCacheTestに遷移</p>
    <p>
      5.最初に以前と同じデータのみが表示され、遅れてデータが更新されることを確認する
    </p>
    <p>
      ※
      scriptタグ内のapollo.getUsers.fetchpolicyの設定を変えることで挙動を変更できる
    </p>

    <pre>{{ getUsers }}</pre>
  </div>
</template>

<script>
import gql from 'graphql-tag'

const getUsersQuery = gql`
  {
    getUsers {
      id
      facilityId
      firstName
      lastName
    }
  }
`

export default {
  apollo: {
    getUsers: {
      query: getUsersQuery,
      // fetchPolicy: 'no-cache',       // キャッシュなし (毎回ネットワーク)
      // fetchPolicy: 'network-only',   // 毎回ネットワークに取得しに行く (毎回ネットワーク)
      fetchPolicy: 'cache-and-network', // まずはキャッシュを表示し、その後キャッシュの有無に関わらずネットワークへ取得しに行く (キャッシュandネットワーク)
      // fetchPolicy: 'cache-first',    // (デフォルト) キャッシュにデータを見に行き、キャッシュがなければネットワークへ取得しにいく(キャッシュorネットワーク)
      // fetchPolicy: 'cache-only',     // キャッシュのみ(キャッシュ)
    },
  },
}
</script>
