<template>
  <div>
    {{ userInfo }}
    <v-btn @click="updateUserInfo(80)">update</v-btn>
    <v-btn @click="createUserInfo(80)">create</v-btn>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  asyncData({ store }) {
    store.dispatch('vuexTest/getUserInfo')
    return {}
  },
  computed: {
    ...mapState('vuexTest', ['userInfo']),
  },
  methods: {
    updateUserInfo(userId) {
      this.$store.dispatch('vuexTest/updateUserInfo', { userId })
    },
    createUserInfo(userId) {
      this.$store.dispatch('vuexTest/createUserInfo', { userId })
    },
  },
}
</script>
